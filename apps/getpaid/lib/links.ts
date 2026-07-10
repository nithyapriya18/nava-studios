import type { Invoice } from './types'
import { formatINR } from './types'

/**
 * Free-rail integrations: UPI deep links and WhatsApp share links.
 * No BSP, no gateway, no API keys — these work on every Indian phone today.
 */

export function buildUpiLink(args: {
  upiId: string
  payeeName: string
  amount: number
  note?: string
}): string {
  const params = new URLSearchParams({
    pa: args.upiId,
    pn: args.payeeName,
    am: args.amount.toFixed(2),
    cu: 'INR',
  })
  if (args.note) params.set('tn', args.note.slice(0, 80))
  return `upi://pay?${params.toString()}`
}

/** wa.me links need digits only (country code + number, no + or spaces). */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  // Assume Indian numbers when 10 digits are given without a country code.
  return digits.length === 10 ? `91${digits}` : digits
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const target = normalizePhone(phone)
  const text = encodeURIComponent(message)
  return target
    ? `https://wa.me/${target}?text=${text}`
    : `https://wa.me/?text=${text}`
}

export function invoiceMessage(invoice: Invoice, total: number, shareUrl?: string): string {
  const lines = [
    `Hi ${invoice.client.name || 'there'},`,
    ``,
    `Invoice ${invoice.number} from ${invoice.business.name} — ${formatINR(total)}, due ${invoice.dueDate}.`,
  ]
  if (shareUrl) lines.push(``, `View invoice: ${shareUrl}`)
  if (invoice.business.upiId) {
    lines.push(
      ``,
      `Pay by UPI to ${invoice.business.upiId}${invoice.business.upiName ? ` (${invoice.business.upiName})` : ''}.`,
    )
  }
  lines.push(``, `Thank you!`)
  return lines.join('\n')
}

export type ReminderTone = 'friendly' | 'neutral' | 'firm'

export function reminderMessage(args: {
  clientName: string
  businessName: string
  invoiceNumber: string
  amount: number
  dueDate: string
  daysOverdue: number
  tone: ReminderTone
  upiId?: string
}): string {
  const amount = formatINR(args.amount)
  const who = args.clientName || 'there'
  const pay = args.upiId ? ` You can pay by UPI to ${args.upiId}.` : ''

  if (args.daysOverdue < 0) {
    return `Hi ${who}, a gentle heads-up: invoice ${args.invoiceNumber} (${amount}) from ${args.businessName} is due on ${args.dueDate}.${pay} Thank you!`
  }
  switch (args.tone) {
    case 'friendly':
      return `Hi ${who}, hope you're well! Just a friendly nudge — invoice ${args.invoiceNumber} (${amount}) from ${args.businessName} was due on ${args.dueDate}.${pay} Thanks so much!`
    case 'neutral':
      return `Hi ${who}, invoice ${args.invoiceNumber} (${amount}) from ${args.businessName} is now ${args.daysOverdue} day${args.daysOverdue === 1 ? '' : 's'} past due (due ${args.dueDate}). Could you let me know when to expect payment?${pay}`
    case 'firm':
      return `Hi ${who}, this is a payment reminder for invoice ${args.invoiceNumber} (${amount}) from ${args.businessName}, ${args.daysOverdue} days overdue since ${args.dueDate}. Please arrange payment at the earliest or reply with an expected date.${pay}`
  }
}

/** Escalation ladder: which tone applies at how many days overdue. */
export function toneForOverdue(days: number): ReminderTone {
  if (days <= 7) return 'friendly'
  if (days <= 21) return 'neutral'
  return 'firm'
}

export function daysBetween(fromISO: string, toISO: string): number {
  const a = new Date(`${fromISO}T00:00:00`).getTime()
  const b = new Date(`${toISO}T00:00:00`).getTime()
  return Math.round((b - a) / 86_400_000)
}
