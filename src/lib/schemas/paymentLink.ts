import { z } from 'zod'

// Payment Link Status
export const PaymentLinkStatus = z.enum(['ACTIVE', 'EXPIRED', 'PAID', 'CANCELLED'])
export type PaymentLinkStatus = z.infer<typeof PaymentLinkStatus>

// Payment Method
export const PaymentMethod = z.enum(['USDT_TO_AED', 'AED_BANK_TRANSFER'])
export type PaymentMethod = z.infer<typeof PaymentMethod>

// Currency
export const Currency = z.enum(['AED', 'USDT'])
export type Currency = z.infer<typeof Currency>

// Buyer identifier - either email or external ID
export const BuyerSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('email'),
    email: z.string().email('Invalid email address'),
  }),
  z.object({
    type: z.literal('externalId'),
    externalId: z.string().min(3, 'External ID must be at least 3 characters'),
  }),
])
export type Buyer = z.infer<typeof BuyerSchema>

// Create Payment Link Request Schema
export const CreatePaymentLinkSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  buyer: BuyerSchema,
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  currency: Currency,
  paymentMethod: PaymentMethod,
  settlementAccountId: z.string().min(1, 'Settlement account is required'),
  expiresAt: z.date().refine(
    (date) => {
      const now = new Date()
      const minDate = new Date(now.getTime() + 9 * 60 * 1000) // 9 minutes from now (allow some buffer)
      const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      return date >= minDate && date <= maxDate
    },
    {
      message: 'Expiry date must be between 10 minutes and 30 days from now',
    }
  ),
  webhookUrl: z.string().url('Invalid webhook URL').optional().or(z.literal('')),
  successUrl: z.string().url('Invalid success URL').optional().or(z.literal('')),
  cancelUrl: z.string().url('Invalid cancel URL').optional().or(z.literal('')),
  metadata: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true
        try {
          const parsed = JSON.parse(val)
          return typeof parsed === 'object' && parsed !== null
        } catch {
          return false
        }
      },
      {
        message: 'Metadata must be valid JSON object',
      }
    ),
  requireKyc: z.boolean().default(true),
  requireWalletWhitelist: z.boolean().default(true),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
}).refine(
  (data) => {
    // If payment method is USDT_TO_AED, requireWalletWhitelist should be true by default
    if (data.paymentMethod === 'USDT_TO_AED') {
      return true // This will be handled in the form logic
    }
    return true
  }
)

export type CreatePaymentLinkRequest = z.infer<typeof CreatePaymentLinkSchema>

// Payment Link Response Schema
export const PaymentLinkSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  status: PaymentLinkStatus,
  createdAt: z.union([z.date(), z.string()]).transform((val) => new Date(val)),
  updatedAt: z.union([z.date(), z.string()]).transform((val) => new Date(val)),
  // Include all the creation fields for display
  projectId: z.string(),
  buyer: BuyerSchema,
  amount: z.number(),
  currency: Currency,
  paymentMethod: PaymentMethod,
  settlementAccountId: z.string(),
  expiresAt: z.union([z.date(), z.string()]).transform((val) => new Date(val)),
  webhookUrl: z.string().url().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
  requireKyc: z.boolean(),
  requireWalletWhitelist: z.boolean(),
  notes: z.string().optional(),
})

export type PaymentLink = z.infer<typeof PaymentLinkSchema>

// Project Schema for dropdown
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED']),
})

export type Project = z.infer<typeof ProjectSchema>

// Settlement Account Schema
export const SettlementAccountSchema = z.object({
  id: z.string(),
  alias: z.string(),
  maskedIban: z.string(),
  type: z.enum(['developer', 'investor']),
})

export type SettlementAccount = z.infer<typeof SettlementAccountSchema>

// API Response Schemas
export const CreatePaymentLinkResponseSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  status: PaymentLinkStatus,
  createdAt: z.union([z.date(), z.string()]).transform((val) => new Date(val)),
})

export type CreatePaymentLinkResponse = z.infer<typeof CreatePaymentLinkResponseSchema>

// List Payment Links Query Schema
export const ListPaymentLinksQuerySchema = z.object({
  query: z.string().optional(),
  status: PaymentLinkStatus.optional(),
  projectId: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
})

export type ListPaymentLinksQuery = z.infer<typeof ListPaymentLinksQuerySchema>

// List Payment Links Response Schema
export const ListPaymentLinksResponseSchema = z.object({
  data: z.array(PaymentLinkSchema),
  pagination: z.object({
    cursor: z.string().optional(),
    hasMore: z.boolean(),
    total: z.number(),
  }),
})

export type ListPaymentLinksResponse = z.infer<typeof ListPaymentLinksResponseSchema>
