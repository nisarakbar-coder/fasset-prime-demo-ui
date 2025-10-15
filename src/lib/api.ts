import { 
  CreatePaymentLinkRequest,
  CreatePaymentLinkResponse,
  ListPaymentLinksQuery,
  ListPaymentLinksResponse,
  PaymentLink,
  Project,
  SettlementAccount,
} from './schemas/paymentLink'
import {
  PaymentLinkDetails,
  KycStatus,
  KycStartResponse,
  WalletWhitelistStatus,
  WhitelistWalletRequest,
  WhitelistWalletResponse,
  DepositAddress,
  TransactionStatus,
  ReassignResponse,
} from './schemas/paymentConsumption'

// API Base URL - can be configured via environment variable
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api'

// Generic API client with error handling
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // Payment Links API
  async createPaymentLink(data: CreatePaymentLinkRequest): Promise<CreatePaymentLinkResponse> {
    const response = await this.request<CreatePaymentLinkResponse>('/payment-links', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    // Parse date back to Date object
    return {
      ...response,
      createdAt: new Date(response.createdAt),
    }
  }

  async listPaymentLinks(query: ListPaymentLinksQuery = {}): Promise<ListPaymentLinksResponse> {
    const params = new URLSearchParams()
    
    if (query.query) params.append('query', query.query)
    if (query.status) params.append('status', query.status)
    if (query.projectId) params.append('projectId', query.projectId)
    if (query.cursor) params.append('cursor', query.cursor)
    if (query.limit) params.append('limit', query.limit.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/payment-links?${queryString}` : '/payment-links'
    
    const response = await this.request<ListPaymentLinksResponse>(endpoint)
    
    // Parse dates back to Date objects
    return {
      ...response,
      data: response.data.map(link => ({
        ...link,
        createdAt: new Date(link.createdAt),
        updatedAt: new Date(link.updatedAt),
        expiresAt: new Date(link.expiresAt),
      }))
    }
  }

  async getPaymentLink(id: string): Promise<PaymentLink> {
    return this.request<PaymentLink>(`/payment-links/${id}`)
  }

  // Projects API
  async getProjects(status?: string): Promise<Project[]> {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    
    const queryString = params.toString()
    const endpoint = queryString ? `/projects?${queryString}` : '/projects'
    
    return this.request<Project[]>(endpoint)
  }

  // Settlement Accounts API
  async getSettlementAccounts(type?: string): Promise<SettlementAccount[]> {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    
    const queryString = params.toString()
    const endpoint = queryString ? `/settlement-accounts?${queryString}` : '/settlement-accounts'
    
    return this.request<SettlementAccount[]>(endpoint)
  }

  // Payment Link Consumption API
  async getPaymentLinkDetails(plinkId: string): Promise<PaymentLinkDetails> {
    return this.request<PaymentLinkDetails>(`/payment-links/${plinkId}`)
  }

  async getKycStatus(): Promise<KycStatus> {
    return this.request<KycStatus>('/kyc/status')
  }

  async startKyc(): Promise<KycStartResponse> {
    return this.request<KycStartResponse>('/kyc/start', {
      method: 'POST',
    })
  }

  async getWalletWhitelistStatus(chain: 'erc20' | 'trc20'): Promise<WalletWhitelistStatus> {
    const params = new URLSearchParams({ chain })
    return this.request<WalletWhitelistStatus>(`/wallets/whitelist?${params}`)
  }

  async addWalletToWhitelist(data: WhitelistWalletRequest): Promise<WhitelistWalletResponse> {
    return this.request<WhitelistWalletResponse>('/wallets/whitelist', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getDepositAddress(plinkId: string, chain?: 'erc20' | 'trc20'): Promise<DepositAddress> {
    const params = new URLSearchParams({ plinkId })
    if (chain) params.append('chain', chain)
    return this.request<DepositAddress>(`/deposits/address?${params}`)
  }

  async getTransactionStatus(plinkId: string): Promise<TransactionStatus> {
    const params = new URLSearchParams({ plinkId })
    return this.request<TransactionStatus>(`/transactions?${params}`)
  }

  async requestPaymentLinkReassign(plinkId: string): Promise<ReassignResponse> {
    return this.request<ReassignResponse>(`/payment-links/${plinkId}/request-reassign`, {
      method: 'POST',
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types for convenience
export type {
  CreatePaymentLinkRequest,
  CreatePaymentLinkResponse,
  ListPaymentLinksQuery,
  ListPaymentLinksResponse,
  PaymentLink,
  Project,
  SettlementAccount,
  PaymentLinkDetails,
  KycStatus,
  KycStartResponse,
  WalletWhitelistStatus,
  WhitelistWalletRequest,
  WhitelistWalletResponse,
  DepositAddress,
  TransactionStatus,
  ReassignResponse,
}
