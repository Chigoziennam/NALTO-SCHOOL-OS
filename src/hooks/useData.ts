import { useQuery } from '@tanstack/react-query'
import {
  getChildren, getClassOptions, getClassSummary, getDashboardTotals,
  getGuardian, getInvoice, getOwingStudents, getParentHistory, getRecentPayments,
} from '../lib/api'

export const useDashboardTotals = () =>
  useQuery({ queryKey: ['dashboard-totals'], queryFn: getDashboardTotals })

export const useClassSummary = () =>
  useQuery({ queryKey: ['class-summary'], queryFn: getClassSummary })

export const useGuardian = () =>
  useQuery({ queryKey: ['guardian'], queryFn: getGuardian })

export const useChildren = () =>
  useQuery({ queryKey: ['children'], queryFn: getChildren })

export const useInvoice = (invoiceId: string) =>
  useQuery({ queryKey: ['invoice', invoiceId], queryFn: () => getInvoice(invoiceId) })

export const useParentHistory = () =>
  useQuery({ queryKey: ['parent-history'], queryFn: getParentHistory })

/** Live feed — refetches every 30s so new payments flash in. */
export const useRecentPayments = () =>
  useQuery({ queryKey: ['recent-payments'], queryFn: getRecentPayments, refetchInterval: 30_000 })

export const useOwingStudents = () =>
  useQuery({ queryKey: ['owing-students'], queryFn: getOwingStudents })

export const useClassOptions = () =>
  useQuery({ queryKey: ['class-options'], queryFn: getClassOptions })
