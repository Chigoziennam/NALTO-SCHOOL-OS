/**
 * White-label school configuration.
 * NALTO SchoolOS is multi-tenant: to onboard another school, add a row to the
 * `schools` table and swap this config (or load it from Supabase by short_code).
 */
export interface SchoolConfig {
  shortCode: string
  name: string
  motto: string
  address: string
  phonePrimary: string
  phoneSecondary: string
  email: string
  /** Remote crest with local fallback (see <CrestImg />). */
  logoUrl: string
  logoFallback: string
  websiteUrl: string
  currentSession: string
  currentTerm: string
  /** Campus imagery — remote first, graceful gradient fallback. */
  campusPhotos: { src: string; caption: string }[]
  aboutPhoto: string
  ctaPhoto: string
}

export const SCHOOL: SchoolConfig = {
  shortCode: 'ARCH',
  name: "Archangels' Schools",
  motto: 'Dedicated to Excellence',
  address: '1 Mission Street, Satellite Town, Lagos',
  phonePrimary: '+234 906 705 5706',
  phoneSecondary: '+234 806 470 9091',
  email: 'info@archangelschools.org.ng',
  logoUrl: 'https://www.archangelschools.org.ng/images/logo.png',
  logoFallback: '/assets/logo.svg',
  websiteUrl: 'https://www.archangelschools.org.ng',
  currentSession: '2025/2026',
  currentTerm: 'Third Term',
  /* Sourced from archangelschools.org.ng (home + facilities + college gallery).
     Add more entries by pasting img URLs from /college/gallery.php. */
  campusPhotos: [
    { src: 'https://www.archangelschools.org.ng/pictures/home/14602837641576341703.jpg', caption: 'College Assembly' },
    { src: 'https://www.archangelschools.org.ng/pictures/home/11812905191576340434.jpg', caption: 'Cultural Fiesta' },
    { src: 'https://www.archangelschools.org.ng/pictures/facilities/5162847261587556657.jpg', caption: 'ICT Room' },
    { src: 'https://www.archangelschools.org.ng/pictures/facilities/11454929711588600766.jpg', caption: 'School Hall' },
    { src: 'https://www.archangelschools.org.ng/pictures/facilities/6088929451587556615.jpg', caption: 'Play Lawn' },
    { src: 'https://www.archangelschools.org.ng/pictures/facilities/14386600131587557366.jpg', caption: 'School Library' },
    { src: 'https://www.archangelschools.org.ng/pictures/facilities/3435339091587557256.jpg', caption: 'Play Ground' },
    { src: 'https://www.archangelschools.org.ng/pictures/home/17613630811576340556.jpg', caption: 'School Grounds' },
  ],
  aboutPhoto: 'https://www.archangelschools.org.ng/pictures/home/11812905191576340434.jpg',
  ctaPhoto: 'https://www.archangelschools.org.ng/pictures/home/17613630811576340556.jpg',
}
