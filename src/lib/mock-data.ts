import { 
  User, 
  Investor, 
  DeveloperClient, 
  KYCRecord, 
  Wallet, 
  Transaction, 
  Payout, 
  WebhookEvent, 
  ApiKey, 
  Project, 
  ReportRequest,
  TransactionStatus 
} from '@/schemas'
import { 
  PaymentLink, 
  Project as PaymentLinkProject, 
  SettlementAccount 
} from './schemas/paymentLink'

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'investor@example.com',
    name: 'John Investor',
    role: 'INVESTOR',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: '2',
    email: 'developer@example.com',
    name: 'Jane Developer',
    role: 'DEVELOPER',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
]

// Mock Investors
export const mockInvestors: Investor[] = [
  {
    id: '1',
    userId: '1',
    kycStatus: 'PASS',
    walletWhitelisted: true,
    totalInvested: 50000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
]

// Mock Developer Clients
export const mockDeveloperClients: DeveloperClient[] = [
  {
    id: '1',
    userId: '2',
    companyName: 'TechCorp Solutions',
    kybStatus: 'PASS',
    apiUsage: 1500,
    webhookErrorRate: 2.5,
    uptimeSLO: 99.8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
]

// Mock KYC Records
export const mockKYCRecords: KYCRecord[] = [
  {
    id: '1',
    userId: '1',
    type: 'INDIVIDUAL',
    status: 'PASS',
    priority: 'MEDIUM',
    owner: 'admin@example.com',
    documents: [
      {
        type: 'PASSPORT',
        url: '/mock-documents/passport.pdf',
        uploadedAt: new Date('2024-01-02'),
      },
      {
        type: 'BANK_STATEMENT',
        url: '/mock-documents/bank-statement.pdf',
        uploadedAt: new Date('2024-01-02'),
      },
    ],
    submittedAt: new Date('2024-01-02'),
    reviewedAt: new Date('2024-01-03'),
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '2',
    userId: '4',
    type: 'CORPORATE',
    status: 'PENDING',
    priority: 'HIGH',
    documents: [
      {
        type: 'CERTIFICATE_OF_INCORPORATION',
        url: '/mock-documents/coi.pdf',
        uploadedAt: new Date('2024-01-10'),
      },
    ],
    submittedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
]

// Mock Wallets
export const mockWallets: Wallet[] = [
  {
    id: '1',
    userId: '1',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    chain: 'ETHEREUM',
    isWhitelisted: true,
    ownershipProof: {
      videoUrl: '/mock-videos/ownership-proof.mp4',
      testTxHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
]

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    developerId: '1',
    amount: 10000,
    currency: 'USDT',
    status: 'SETTLED',
    chain: 'ETHEREUM',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    depositAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    riskFlag: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '2',
    userId: '1',
    developerId: '1',
    amount: 25000,
    currency: 'USDT',
    status: 'PAYOUT_SENT',
    chain: 'POLYGON',
    txHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    depositAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    riskFlag: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    userId: '5',
    developerId: '1',
    amount: 5000,
    currency: 'USDT',
    status: 'KYC_PENDING',
    chain: 'ARBITRUM',
    riskFlag: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
]

// Mock Payouts
export const mockPayouts: Payout[] = [
  {
    id: '1',
    transactionId: '1',
    amount: 10000,
    currency: 'AED',
    bankReference: 'PAY-2024-001',
    status: 'SETTLED',
    sentAt: new Date('2024-01-11'),
    settledAt: new Date('2024-01-12'),
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '2',
    transactionId: '2',
    amount: 25000,
    currency: 'AED',
    bankReference: 'PAY-2024-002',
    status: 'SENT',
    sentAt: new Date('2024-01-16'),
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
]

// Mock Webhook Events
export const mockWebhookEvents: WebhookEvent[] = [
  {
    id: '1',
    developerId: '1',
    eventType: 'KYC_PASS',
    payload: { userId: '1', kycId: '1' },
    url: 'https://api.techcorp.com/webhooks/kyc',
    status: 'DELIVERED',
    responseCode: 200,
    responseBody: '{"status": "success"}',
    retryCount: 0,
    deliveredAt: new Date('2024-01-03T10:30:00Z'),
    createdAt: new Date('2024-01-03T10:30:00Z'),
    updatedAt: new Date('2024-01-03T10:30:00Z'),
  },
  {
    id: '2',
    developerId: '1',
    eventType: 'FUNDS_AVAILABLE',
    payload: { transactionId: '1', amount: 10000 },
    url: 'https://api.techcorp.com/webhooks/funds',
    status: 'FAILED',
    responseCode: 500,
    responseBody: 'Internal Server Error',
    retryCount: 3,
    createdAt: new Date('2024-01-10T14:20:00Z'),
    updatedAt: new Date('2024-01-10T16:45:00Z'),
  },
]

// Mock API Keys
export const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    developerId: '1',
    name: 'Production API Key',
    key: 'fasset_live_sk_1234567890abcdef',
    permissions: ['kyc:read', 'kyc:write', 'transactions:read', 'payouts:read'],
    isActive: true,
    lastUsed: new Date('2024-01-16T09:15:00Z'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '2',
    developerId: '1',
    name: 'Test API Key',
    key: 'fasset_test_sk_abcdef1234567890',
    permissions: ['kyc:read', 'transactions:read'],
    isActive: true,
    lastUsed: new Date('2024-01-15T16:30:00Z'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
]

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'proj_1',
    developerId: '1',
    name: 'Sunset Villas',
    description: 'Luxury residential development project',
    tokenSymbol: 'SV',
    totalSupply: 500000,
    pricePerToken: 2.0,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '1',
    developerId: '1',
    name: 'TechCorp Token Sale',
    description: 'Initial token offering for TechCorp ecosystem',
    tokenSymbol: 'TECH',
    totalSupply: 1000000,
    pricePerToken: 0.1,
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
]

// Mock Payment Link Projects (for dropdown)
export const mockPaymentLinkProjects: PaymentLinkProject[] = [
  {
    id: 'proj_1',
    name: 'Sunset Villas',
    code: 'SV-01',
    status: 'ACTIVE',
  },
  {
    id: 'proj_2',
    name: 'TechCorp Token Sale',
    code: 'TECH-01',
    status: 'ACTIVE',
  },
  {
    id: 'proj_3',
    name: 'Marina Heights',
    code: 'MH-02',
    status: 'ACTIVE',
  },
  {
    id: 'proj_4',
    name: 'Downtown Plaza',
    code: 'DP-03',
    status: 'PAUSED',
  },
]

// Mock Settlement Accounts
export const mockSettlementAccounts: SettlementAccount[] = [
  {
    id: 'settle_1',
    alias: 'Brix AED (Whizmo)',
    maskedIban: 'PK** **** 1234',
    type: 'developer',
  },
  {
    id: 'settle_2',
    alias: 'TechCorp USD (Wise)',
    maskedIban: 'US** **** 5678',
    type: 'developer',
  },
  {
    id: 'settle_3',
    alias: 'Main AED Account',
    maskedIban: 'AE** **** 9012',
    type: 'developer',
  },
]

// Mock Payment Links
export const mockPaymentLinks: PaymentLink[] = [
  {
    id: 'plink_705enabs3',
    url: 'https://fasset-prime-demo-ui.vercel.app/payment/plink_705enabs3',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-20T10:30:00Z'),
    updatedAt: new Date('2024-01-20T10:30:00Z'),
    projectId: 'proj_1',
    buyer: { type: 'email', email: 'investor@example.com' },
    amount: 1000.00,
    currency: 'AED',
    paymentMethod: 'USDT_TO_AED',
    settlementAccountId: 'settle_1',
    expiresAt: new Date('2025-12-31T23:59:59Z'),
    webhookUrl: 'https://api.example.com/webhooks/payment',
    successUrl: 'https://example.com/success',
    cancelUrl: 'https://example.com/cancel',
    metadata: { orderId: 'ORD-705', customerType: 'VIP' },
    requireKyc: true,
    requireWalletWhitelist: true,
    notes: 'Test payment link for development',
  },
  {
    id: 'plink_1',
    url: 'https://fasset-prime-demo-ui.vercel.app/payment/plink_1',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-20T10:30:00Z'),
    updatedAt: new Date('2024-01-20T10:30:00Z'),
    projectId: 'proj_1',
    buyer: { type: 'email', email: 'buyer1@example.com' },
    amount: 1000.00,
    currency: 'AED',
    paymentMethod: 'USDT_TO_AED',
    settlementAccountId: 'settle_1',
    expiresAt: new Date('2024-01-21T10:30:00Z'),
    webhookUrl: 'https://api.example.com/webhooks/payment',
    successUrl: 'https://example.com/success',
    cancelUrl: 'https://example.com/cancel',
    metadata: { orderId: 'ORD-001', customerType: 'VIP' },
    requireKyc: true,
    requireWalletWhitelist: true,
    notes: 'VIP customer - priority processing',
  },
  {
    id: 'plink_2',
    url: 'https://fasset-prime-demo-ui.vercel.app/payment/plink_2',
    status: 'PAID',
    createdAt: new Date('2024-01-19T14:15:00Z'),
    updatedAt: new Date('2024-01-19T16:45:00Z'),
    projectId: 'proj_2',
    buyer: { type: 'externalId', externalId: 'CUST-12345' },
    amount: 2500.00,
    currency: 'USDT',
    paymentMethod: 'USDT_TO_AED',
    settlementAccountId: 'settle_2',
    expiresAt: new Date('2024-01-20T14:15:00Z'),
    requireKyc: true,
    requireWalletWhitelist: true,
  },
  {
    id: 'plink_3',
    url: 'https://fasset-prime-demo-ui.vercel.app/payment/plink_3',
    status: 'EXPIRED',
    createdAt: new Date('2024-01-18T09:00:00Z'),
    updatedAt: new Date('2024-01-18T09:00:00Z'),
    projectId: 'proj_3',
    buyer: { type: 'email', email: 'buyer3@example.com' },
    amount: 500.00,
    currency: 'AED',
    paymentMethod: 'AED_BANK_TRANSFER',
    settlementAccountId: 'settle_3',
    expiresAt: new Date('2024-01-19T09:00:00Z'),
    requireKyc: false,
    requireWalletWhitelist: false,
    notes: 'Test payment link',
  },
  {
    id: 'plink_4',
    url: 'https://fasset-prime-demo-ui.vercel.app/payment/plink_4',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-21T08:30:00Z'),
    updatedAt: new Date('2024-01-21T08:30:00Z'),
    projectId: 'proj_1',
    buyer: { type: 'externalId', externalId: 'CUST-67890' },
    amount: 5000.00,
    currency: 'AED',
    paymentMethod: 'USDT_TO_AED',
    settlementAccountId: 'settle_1',
    expiresAt: new Date('2024-01-22T08:30:00Z'),
    successUrl: 'https://example.com/success',
    cancelUrl: 'https://example.com/cancel',
    requireKyc: true,
    requireWalletWhitelist: true,
  },
]

// Mock Report Requests
export const mockReportRequests: ReportRequest[] = [
  {
    id: '1',
    developerId: '1',
    type: 'RECONCILIATION',
    dateRange: {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-31'),
    },
    status: 'READY',
    downloadUrl: '/reports/reconciliation-2024-01.pdf',
    createdAt: new Date('2024-01-31'),
    updatedAt: new Date('2024-01-31'),
  },
  {
    id: '2',
    developerId: '1',
    type: 'TRANSACTIONS',
    dateRange: {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-31'),
    },
    status: 'GENERATING',
    createdAt: new Date('2024-01-31'),
    updatedAt: new Date('2024-01-31'),
  },
]

// Helper functions for data manipulation
export function getTransactionsByStatus(status: TransactionStatus): Transaction[] {
  return mockTransactions.filter(tx => tx.status === status)
}

export function getTransactionsByUser(userId: string): Transaction[] {
  return mockTransactions.filter(tx => tx.userId === userId)
}

export function getTransactionsByDeveloper(developerId: string): Transaction[] {
  return mockTransactions.filter(tx => tx.developerId === developerId)
}

export function getKYCRecordsByStatus(status: string): KYCRecord[] {
  return mockKYCRecords.filter(kyc => kyc.status === status)
}

export function getWebhookEventsByStatus(status: string): WebhookEvent[] {
  return mockWebhookEvents.filter(event => event.status === status)
}

export function getApiKeysByDeveloper(developerId: string): ApiKey[] {
  return mockApiKeys.filter(key => key.developerId === developerId)
}

// Statistics helpers
export function getTotalTransactionVolume(): number {
  return mockTransactions.reduce((sum, tx) => sum + tx.amount, 0)
}

export function getSuccessRate(): number {
  const successful = mockTransactions.filter(tx => tx.status === 'SETTLED').length
  return (successful / mockTransactions.length) * 100
}

export function getAverageSettlementTime(): number {
  const settledTransactions = mockTransactions.filter(tx => tx.status === 'SETTLED')
  if (settledTransactions.length === 0) return 0
  
  const totalTime = settledTransactions.reduce((sum, tx) => {
    const createdAt = tx.createdAt.getTime()
    const updatedAt = tx.updatedAt.getTime()
    return sum + (updatedAt - createdAt)
  }, 0)
  
  return totalTime / settledTransactions.length / (1000 * 60 * 60) // Convert to hours
}

// Payment Links helper functions
export function getPaymentLinksByStatus(status: string): PaymentLink[] {
  return mockPaymentLinks.filter(link => link.status === status)
}

export function getPaymentLinksByProject(projectId: string): PaymentLink[] {
  return mockPaymentLinks.filter(link => link.projectId === projectId)
}

export function getActiveProjects(): PaymentLinkProject[] {
  return mockPaymentLinkProjects.filter(project => project.status === 'ACTIVE')
}

export function getDeveloperSettlementAccounts(): SettlementAccount[] {
  return mockSettlementAccounts.filter(account => account.type === 'developer')
}

export function generatePaymentLinkId(): string {
  return `plink_${Math.random().toString(36).substr(2, 9)}`
}

export function generatePaymentLinkUrl(id: string): string {
  return `https://fasset-prime-demo-ui.vercel.app/payment/${id}`
}
