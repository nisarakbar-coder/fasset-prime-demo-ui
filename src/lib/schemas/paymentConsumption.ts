import { z } from 'zod'

// Payment Link Details (for consumption)
export const PaymentLinkDetailsSchema = z.object({
  id: z.string(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
  }),
  buyer: z.object({
    type: z.enum(['email', 'externalId']),
    email: z.string().email().optional(),
    externalId: z.string().optional(),
  }),
  amount: z.string(),
  currency: z.enum(['AED', 'USDT']),
  paymentMethod: z.enum(['USDT_TO_AED', 'AED_BANK_TRANSFER']),
  requireKyc: z.boolean(),
  requireWalletWhitelist: z.boolean(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'COMPLETED', 'CANCELLED']),
  expiresAt: z.string(),
  createdAt: z.string(),
})

export type PaymentLinkDetails = z.infer<typeof PaymentLinkDetailsSchema>

// KYC Status
export const KycStatusSchema = z.object({
  status: z.enum(['KYC_PASS', 'KYC_REVIEW', 'KYC_FAIL', 'KYC_NONE']),
})

export type KycStatus = z.infer<typeof KycStatusSchema>

// KYC Start Response
export const KycStartResponseSchema = z.object({
  redirectUrl: z.string().url(),
})

export type KycStartResponse = z.infer<typeof KycStartResponseSchema>

// Wallet Whitelist Status
export const WalletWhitelistStatusSchema = z.object({
  whitelisted: z.boolean(),
  address: z.string().optional(),
  chain: z.enum(['erc20', 'trc20']).optional(),
})

export type WalletWhitelistStatus = z.infer<typeof WalletWhitelistStatusSchema>

// Whitelist Wallet Request
export const WhitelistWalletRequestSchema = z.object({
  chain: z.enum(['erc20', 'trc20']),
  address: z.string().min(1, 'Address is required'),
})

export type WhitelistWalletRequest = z.infer<typeof WhitelistWalletRequestSchema>

// Whitelist Wallet Response
export const WhitelistWalletResponseSchema = z.object({
  whitelisted: z.boolean(),
})

export type WhitelistWalletResponse = z.infer<typeof WhitelistWalletResponseSchema>

// Deposit Address
export const DepositAddressSchema = z.object({
  address: z.string(),
  memo: z.string().nullable(),
  chain: z.enum(['erc20', 'trc20']),
  minAmount: z.string(),
  confirmationsRequired: z.number(),
})

export type DepositAddress = z.infer<typeof DepositAddressSchema>

// Transaction Status
export const TransactionStatusSchema = z.object({
  status: z.enum(['PENDING', 'ONCHAIN_CONFIRMED', 'CONVERTING', 'SETTLED']),
  txHash: z.string().nullable(),
  updatedAt: z.string(),
})

export type TransactionStatus = z.infer<typeof TransactionStatusSchema>

// Reassign Response
export const ReassignResponseSchema = z.object({
  ok: z.boolean(),
})

export type ReassignResponse = z.infer<typeof ReassignResponseSchema>
