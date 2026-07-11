import type { SupplyType } from '@/apps/gst-calculator/lib/gst'

export interface BusinessProfile {
  name: string
  address: string
  gstin: string
  stateCode: string
  phone: string
  email: string
  upiId: string
  upiName: string
}

export interface InvoiceClient {
  name: string
  address: string
  gstin: string
  stateCode: string
  phone: string // with country code for wa.me, e.g. 919876543210
  email: string
}

export interface InvoiceLine {
  description: string
  hsn: string
  quantity: number
  unitRate: number
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid'

export interface Invoice {
  id: string
  /** Document heading override, e.g. "Quotation". Defaults to (Tax) Invoice. */
  heading?: string
  number: string
  date: string // ISO yyyy-mm-dd
  dueDate: string
  gstMode: boolean
  gstRatePercent: number
  supplyType: SupplyType
  business: BusinessProfile
  client: InvoiceClient
  lines: InvoiceLine[]
  notes: string
  status: InvoiceStatus
  paidOn?: string
}

export const EMPTY_BUSINESS: BusinessProfile = {
  name: '',
  address: '',
  gstin: '',
  stateCode: '29',
  phone: '',
  email: '',
  upiId: '',
  upiName: '',
}

export const EMPTY_CLIENT: InvoiceClient = {
  name: '',
  address: '',
  gstin: '',
  stateCode: '29',
  phone: '',
  email: '',
}

export function newInvoiceId() {
  return `inv_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function addDaysISO(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function formatINR(n: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(n)
}
