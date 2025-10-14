import { z } from 'zod'

// User and Authentication
export const UserRole = z.enum(['INVESTOR', 'DEVELOPER', 'ADMIN'])
export type UserRole = z.infer<typeof UserRole>

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: UserRole,
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean().default(true),
})
export type User = z.infer<typeof UserSchema>

// Investor specific
export const InvestorSchema = z.object({
  id: z.string(),
  userId: z.string(),
  kycStatus: z.enum(['PENDING', 'PASS', 'FAIL', 'REVIEW']),
  walletWhitelisted: z.boolean().default(false),
  totalInvested: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type Investor = z.infer<typeof InvestorSchema>

// Developer specific
export const DeveloperClientSchema = z.object({
  id: z.string(),
  userId: z.string(),
  companyName: z.string(),
  kybStatus: z.enum(['PENDING', 'PASS', 'FAIL', 'REVIEW']),
  apiUsage: z.number().default(0),
  webhookErrorRate: z.number().default(0),
  uptimeSLO: z.number().default(99.9),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type DeveloperClient = z.infer<typeof DeveloperClientSchema>

// KYC/KYB Records
export const KYCRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['INDIVIDUAL', 'CORPORATE']),
  status: z.enum(['PENDING', 'PASS', 'FAIL', 'REVIEW']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  owner: z.string().optional(),
  documents: z.array(z.object({
    type: z.string(),
    url: z.string(),
    uploadedAt: z.date(),
  })),
  submittedAt: z.date(),
  reviewedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type KYCRecord = z.infer<typeof KYCRecordSchema>

// Wallet
export const WalletSchema = z.object({
  id: z.string(),
  userId: z.string(),
  address: z.string(),
  chain: z.enum(['ETHEREUM', 'POLYGON', 'ARBITRUM']),
  isWhitelisted: z.boolean().default(false),
  ownershipProof: z.object({
    videoUrl: z.string().optional(),
    testTxHash: z.string().optional(),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type Wallet = z.infer<typeof WalletSchema>

// Transaction
export const TransactionStatus = z.enum([
  'PENDING',
  'KYC_PENDING',
  'KYC_PASS',
  'WALLET_PENDING',
  'FUNDS_AVAILABLE',
  'CONVERSION_PENDING',
  'PAYOUT_SENT',
  'SETTLED',
  'FAILED'
])
export type TransactionStatus = z.infer<typeof TransactionStatus>

export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  developerId: z.string().optional(),
  amount: z.number(),
  currency: z.string().default('USDT'),
  status: TransactionStatus,
  chain: z.enum(['ETHEREUM', 'POLYGON', 'ARBITRUM']),
  txHash: z.string().optional(),
  depositAddress: z.string().optional(),
  riskFlag: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type Transaction = z.infer<typeof TransactionSchema>

// Payout
export const PayoutSchema = z.object({
  id: z.string(),
  transactionId: z.string(),
  amount: z.number(),
  currency: z.string(),
  bankReference: z.string(),
  status: z.enum(['PENDING', 'SENT', 'SETTLED', 'FAILED']),
  sentAt: z.date().optional(),
  settledAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type Payout = z.infer<typeof PayoutSchema>

// Webhook Event
export const WebhookEventSchema = z.object({
  id: z.string(),
  developerId: z.string(),
  eventType: z.enum(['KYC_PASS', 'FUNDS_AVAILABLE', 'PAYOUT_SENT']),
  payload: z.record(z.any()),
  url: z.string(),
  status: z.enum(['PENDING', 'DELIVERED', 'FAILED', 'RETRYING']),
  responseCode: z.number().optional(),
  responseBody: z.string().optional(),
  retryCount: z.number().default(0),
  deliveredAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type WebhookEvent = z.infer<typeof WebhookEventSchema>

// API Key
export const ApiKeySchema = z.object({
  id: z.string(),
  developerId: z.string(),
  name: z.string(),
  key: z.string(),
  permissions: z.array(z.string()),
  isActive: z.boolean().default(true),
  lastUsed: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type ApiKey = z.infer<typeof ApiKeySchema>

// Project
export const ProjectSchema = z.object({
  id: z.string(),
  developerId: z.string(),
  name: z.string(),
  description: z.string(),
  tokenSymbol: z.string(),
  totalSupply: z.number(),
  pricePerToken: z.number(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED']),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type Project = z.infer<typeof ProjectSchema>

// Report Request
export const ReportRequestSchema = z.object({
  id: z.string(),
  developerId: z.string(),
  type: z.enum(['RECONCILIATION', 'TRANSACTIONS', 'PAYOUTS']),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  status: z.enum(['PENDING', 'GENERATING', 'READY', 'FAILED']),
  downloadUrl: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
export type ReportRequest = z.infer<typeof ReportRequestSchema>

// API Request/Response schemas
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: UserRole,
})
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

export const KYCStartRequestSchema = z.object({
  type: z.enum(['INDIVIDUAL', 'CORPORATE']),
  documents: z.array(z.object({
    type: z.string(),
    file: z.instanceof(File),
  })),
})
export type KYCStartRequest = z.infer<typeof KYCStartRequestSchema>

export const WalletWhitelistRequestSchema = z.object({
  address: z.string(),
  chain: z.enum(['ETHEREUM', 'POLYGON', 'ARBITRUM']),
  ownershipProof: z.object({
    videoUrl: z.string().optional(),
    testTxHash: z.string().optional(),
  }).optional(),
})
export type WalletWhitelistRequest = z.infer<typeof WalletWhitelistRequestSchema>

export const WebhookConfigSchema = z.object({
  url: z.string().url(),
  secret: z.string().min(16),
  events: z.array(z.enum(['KYC_PASS', 'FUNDS_AVAILABLE', 'PAYOUT_SENT'])),
})
export type WebhookConfig = z.infer<typeof WebhookConfigSchema>

// Pagination
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})
export type Pagination = z.infer<typeof PaginationSchema>

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  })
export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
