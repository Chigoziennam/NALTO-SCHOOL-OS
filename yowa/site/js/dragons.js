// YOWA dragons: one real 3D dragon per seam, flying across the screen, head first, then round again.
// The model is "Flying Dragon" by peaznchips (CC0, opengameart.org/node/126178), re-skinned purple.
// Every seam on the page (.dragon) is a lane; the dragon flies through the lane while it is on screen.
import * as THREE from './three/three.module.min.js';
import { GLTFLoader } from './three/GLTFLoader.js';
import { RoomEnvironment } from './three/RoomEnvironment.js';
import * as SkeletonUtils from './three/SkeletonUtils.js';

export async function start({ lanes, reduced, isHeld, isCovered = () => false }) {
  const canvas = document.createElement('canvas');
  canvas.className = 'dragon-sky'; canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); }
  catch (e) { canvas.remove(); return null; }
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  scene.add(new THREE.HemisphereLight(0xD9C2FF, 0x12051F, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(300, 600, 800); scene.add(key);
  const rim = new THREE.DirectionalLight(0xA65BFF, 3.2); rim.position.set(-500, -200, -400); scene.add(rim);
  const cam = new THREE.PerspectiveCamera(35, 1, 1, 6000);

  // The model ships inside a script (js/dragon-model.js), so it loads anywhere scripts load, no separate download to block
  const b64 = (await import('./dragon-model.js')).default, raw = atob(b64), buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  const gltf = await new GLTFLoader().parseAsync(buf.buffer, '');
  const base = gltf.scene;
  // a touch of inner glow on the purple skin
  base.traverse(o => { if (o.isMesh) { o.frustumCulled = false; const m = o.material; if (m && m.emissive) { m.emissive = new THREE.Color(0x3A0E86); m.emissiveIntensity = .35; } } });
  const restBox = new THREE.Box3().setFromObject(base), restLen = restBox.getSize(new THREE.Vector3()).x;   // nose to tail, lying straight
  const restMid = restBox.getCenter(new THREE.Vector3());   // the model's origin is at its tail, so we steer by its middle

  let W = 0, H = 0;
  function size() {
    W = innerWidth; H = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75)); renderer.setSize(W, H, false);
    cam.aspect = W / H; cam.position.set(0, 0, H / 2 / Math.tan(THREE.MathUtils.degToRad(17.5))); cam.updateProjectionMatrix();   // 1 unit = 1 px at z = 0
  }
  size(); addEventListener('resize', size);

  // One dragon per lane, made when the lane first comes near the screen
  const flyers = lanes.map((el, i) => ({ el, i, dir: i % 2 ? -1 : 1, obj: null, bones: [], rest: [], legs: [], jaw: null, t: 1.4 + i * 1.7, on: false }));
  function make(f) {
    const obj = SkeletonUtils.clone(base); scene.add(obj);
    obj.traverse(o => { if (o.isBone) { f.bones.push(o); f.rest.push(o.quaternion.clone()); } });
    f.spine = f.bones.filter(b => /^(Tail|Body)/.test(b.name));
    f.legs = f.bones.filter(b => /^Leg/.test(b.name));
    f.jaw = f.bones.find(b => b.name === 'JawBottom');
    f.obj = obj;
  }
  const q = new THREE.Quaternion(), ax = new THREE.Vector3(), Z = new THREE.Vector3(0, 0, 1), Y = new THREE.Vector3(0, 1, 0), X = new THREE.Vector3(1, 0, 0);
  function pose(f, t, thrash) {
    f.bones.forEach((b, i) => b.quaternion.copy(f.rest[i]));
    // a wave runs down the spine from the head to the tail; the mean is taken out so the head stays on course
    const n = f.spine.length, A = .085 * (1 + thrash * .6), angs = [];
    for (let i = 0; i < n; i++) angs.push(A * Math.sin(i * .42 + t * 3.4));
    const mean = angs.reduce((s, a) => s + a, 0) / n;
    f.spine.forEach((b, i) => {
      b.quaternion.multiply(q.setFromAxisAngle(Z, angs[i] - mean));
      b.quaternion.multiply(q.setFromAxisAngle(Y, .05 * Math.sin(i * .3 + t * 2.1)));
    });
    // legs paddle, the jaw opens now and then
    f.legs.forEach((b, i) => b.quaternion.multiply(q.setFromAxisAngle(Z, .35 * Math.sin(t * 5 + i * 1.7))));
    if (f.jaw) f.jaw.quaternion.multiply(q.setFromAxisAngle(Z, -.28 * Math.max(0, Math.sin(t * .9)) ** 3));
  }

  const io = new IntersectionObserver(es => es.forEach(e => { const f = flyers.find(x => x.el === e.target); if (f) { f.on = e.isIntersecting; if (f.on && !f.obj) make(f); } }), { rootMargin: '300px 0px' });
  flyers.forEach(f => io.observe(f.el));

  let last = 0, sy = scrollY, speed = 0, raf = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (isCovered()) { last = 0; return; }   // something is open over the page: the dragons wait
    const dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now;
    const y = scrollY; speed += (Math.abs(y - sy) / Math.max(dt, .001) / 1000 - speed) * .1; sy = y;
    const thrash = Math.min(2, speed);
    let any = false;
    for (const f of flyers) {
      if (!f.obj) continue;
      const r = f.el.getBoundingClientRect(), vis = f.on && r.bottom > -100 && r.top < H + 100 && !(f.i === 0 && isHeld());
      f.obj.visible = vis; if (!vis) continue; any = true;
      const L = W < 700 ? Math.max(W * 1.75, 620) : Math.min(W * 1.15, 1700), s = L / restLen;   // big: the head and body fill the lane, the tail trails off screen
      f.obj.scale.setScalar(s);
      let x;
      if (reduced()) { x = 0; pose(f, 1.2, 0); }
      else {
        f.t += dt * (1 + thrash * .8);
        const travel = W + L * 1.1, sp = Math.max(190, W * .42) * (1 + thrash * .5);
        const p = ((f.t * sp) % travel) / travel;            // 0 → 1: the head comes in on one side, the tail leaves the other
        x = (-W / 2 - L * .55) + p * travel;                 // centre of the body
        pose(f, f.t, thrash);
      }
      const cy = H / 2 - (r.top + r.height / 2);
      f.obj.position.set(f.dir * x - f.dir * restMid.x * s, cy + Math.sin(f.t * 1.3) * 10 - restMid.y * s, -restMid.z * s);
      // rest pose faces +x; the ones flying left turn round; a slight three-quarter turn shows its body
      f.obj.rotation.set(.18, f.dir > 0 ? -.3 : Math.PI + .3, 0);
    }
    if (any) renderer.render(scene, cam); else renderer.clear();
  }
  raf = requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else if (!raf) { last = 0; raf = requestAnimationFrame(frame); } });
  return { canvas };
}
