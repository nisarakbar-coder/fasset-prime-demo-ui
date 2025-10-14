// Simple test file for payment link validation
// This file tests the core validation logic without complex setup

import { CreatePaymentLinkSchema } from '../lib/schemas/paymentLink'

// Test expiry date validation
function testExpiryDateValidation() {
  console.log('Testing expiry date validation...')
  
  const baseData = {
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

  // Test valid expiry (10 minutes from now)
  const validData = {
    ...baseData,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  }
  
  const result = CreatePaymentLinkSchema.safeParse(validData)
  if (result.success) {
    console.log('✅ Valid expiry date (10 minutes) - PASSED')
  } else {
    console.log('❌ Valid expiry date (10 minutes) - FAILED:', result.error.issues[0]?.message)
  }

  // Test invalid expiry (5 minutes from now - too soon)
  const invalidData = {
    ...baseData,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  }
  
  const invalidResult = CreatePaymentLinkSchema.safeParse(invalidData)
  if (!invalidResult.success) {
    console.log('✅ Invalid expiry date (5 minutes) - PASSED - correctly rejected')
  } else {
    console.log('❌ Invalid expiry date (5 minutes) - FAILED - should have been rejected')
  }
}

// Test metadata JSON parsing
function testMetadataValidation() {
  console.log('Testing metadata validation...')
  
  const baseData = {
    projectId: 'proj_123',
    buyer: { type: 'email' as const, email: 'test@example.com' },
    amount: 1000,
    currency: 'AED' as const,
    paymentMethod: 'USDT_TO_AED' as const,
    settlementAccountId: 'settle_789',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    requireKyc: true,
    requireWalletWhitelist: true,
  }

  // Test valid JSON
  const validJsonData = {
    ...baseData,
    metadata: '{"orderId": "ORD-123", "customerType": "VIP"}',
  }
  
  const result = CreatePaymentLinkSchema.safeParse(validJsonData)
  if (result.success) {
    console.log('✅ Valid JSON metadata - PASSED')
  } else {
    console.log('❌ Valid JSON metadata - FAILED:', result.error.issues[0]?.message)
  }

  // Test invalid JSON
  const invalidJsonData = {
    ...baseData,
    metadata: '{"orderId": "ORD-123", "customerType": "VIP"', // Missing closing brace
  }
  
  const invalidResult = CreatePaymentLinkSchema.safeParse(invalidJsonData)
  if (!invalidResult.success) {
    console.log('✅ Invalid JSON metadata - PASSED - correctly rejected')
  } else {
    console.log('❌ Invalid JSON metadata - FAILED - should have been rejected')
  }
}

// Run tests
console.log('Running Payment Link Validation Tests...')
console.log('=====================================')

testExpiryDateValidation()
console.log('')
testMetadataValidation()

console.log('')
console.log('=====================================')
console.log('Tests completed!')
