import { describe, it, expect, beforeEach } from 'vitest'
import { CreatePaymentLinkSchema } from '@/lib/schemas/paymentLink'

describe('PaymentLinkSchema', () => {
  const baseValidData = {
    projectId: 'proj_123',
    buyer: { type: 'email' as const, email: 'test@example.com' },
    amount: 1000,
    currency: 'AED' as const,
    paymentMethod: 'USDT_TO_AED' as const,
    settlementAccountId: 'settle_789',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    requireKyc: true,
    requireWalletWhitelist: true,
  }

  beforeEach(() => {
    // Reset any global state if needed
  })

  describe('expiry date validation', () => {
    it('should accept expiry date 10 minutes from now', () => {
      const data = {
        ...baseValidData,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept expiry date 30 days from now', () => {
      const data = {
        ...baseValidData,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject expiry date less than 10 minutes from now', () => {
      const data = {
        ...baseValidData,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10 minutes')
      }
    })

    it('should reject expiry date more than 30 days from now', () => {
      const data = {
        ...baseValidData,
        expiresAt: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000), // 31 days
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('30 days')
      }
    })

    it('should reject expiry date in the past', () => {
      const data = {
        ...baseValidData,
        expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('10 minutes')
      }
    })
  })

  describe('metadata JSON parsing', () => {
    it('should accept valid JSON string', () => {
      const data = {
        ...baseValidData,
        metadata: '{"orderId": "ORD-123", "customerType": "VIP"}',
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept empty string for metadata', () => {
      const data = {
        ...baseValidData,
        metadata: '',
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept undefined metadata', () => {
      const data = {
        ...baseValidData,
        metadata: undefined,
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid JSON string', () => {
      const data = {
        ...baseValidData,
        metadata: '{"orderId": "ORD-123", "customerType": "VIP"', // Missing closing brace
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid JSON object')
      }
    })

    it('should reject JSON string that is not an object', () => {
      const data = {
        ...baseValidData,
        metadata: '"just a string"',
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid JSON object')
      }
    })

    it('should reject JSON string that is null', () => {
      const data = {
        ...baseValidData,
        metadata: 'null',
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid JSON object')
      }
    })
  })

  describe('buyer validation', () => {
    it('should accept email buyer', () => {
      const data = {
        ...baseValidData,
        buyer: { type: 'email' as const, email: 'test@example.com' },
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept external ID buyer', () => {
      const data = {
        ...baseValidData,
        buyer: { type: 'externalId' as const, externalId: 'CUST-12345' },
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const data = {
        ...baseValidData,
        buyer: { type: 'email' as const, email: 'invalid-email' },
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email address')
      }
    })

    it('should reject external ID shorter than 3 characters', () => {
      const data = {
        ...baseValidData,
        buyer: { type: 'externalId' as const, externalId: 'AB' },
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 3 characters')
      }
    })
  })

  describe('amount validation', () => {
    it('should accept positive amount', () => {
      const data = {
        ...baseValidData,
        amount: 1000.50,
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject zero amount', () => {
      const data = {
        ...baseValidData,
        amount: 0,
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('greater than 0')
      }
    })

    it('should reject negative amount', () => {
      const data = {
        ...baseValidData,
        amount: -100,
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('greater than 0')
      }
    })
  })

  describe('URL validation', () => {
    it('should accept valid webhook URL', () => {
      const data = {
        ...baseValidData,
        webhookUrl: 'https://api.example.com/webhooks/payment',
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid webhook URL', () => {
      const data = {
        ...baseValidData,
        webhookUrl: 'not-a-url',
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid webhook URL')
      }
    })

    it('should accept empty webhook URL', () => {
      const data = {
        ...baseValidData,
        webhookUrl: '',
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('notes validation', () => {
    it('should accept notes under 1000 characters', () => {
      const data = {
        ...baseValidData,
        notes: 'A'.repeat(999),
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject notes over 1000 characters', () => {
      const data = {
        ...baseValidData,
        notes: 'A'.repeat(1001),
      }
      
      const result = CreatePaymentLinkSchema.safeParse(data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 1000 characters')
      }
    })
  })
})
