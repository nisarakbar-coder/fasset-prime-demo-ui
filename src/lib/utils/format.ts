import { format, formatDistanceToNow } from 'date-fns'

// Format currency amount
export function formatCurrency(amount: string | number, currency: string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  // Handle USDT as a special case since it's not a valid ISO currency code
  if (currency === 'USDT') {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount) + ' USDT'
  }
  
  // For valid ISO currency codes, use Intl.NumberFormat
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)
}

// Format payment method for display
export function formatPaymentMethod(method: string): string {
  switch (method) {
    case 'USDT_TO_AED':
      return 'USDT to AED'
    case 'AED_BANK_TRANSFER':
      return 'AED Bank Transfer'
    default:
      return method
  }
}

// Format expiry time
export function formatExpiry(expiresAt: string | Date): string {
  const expiryDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  const now = new Date()
  
  if (expiryDate <= now) {
    return 'Expired'
  }
  
  return formatDistanceToNow(expiryDate, { addSuffix: true })
}

// Format transaction status
export function formatTransactionStatus(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'ONCHAIN_CONFIRMED':
      return 'Confirmed'
    case 'CONVERTING':
      return 'Converting'
    case 'SETTLED':
      return 'Settled'
    default:
      return status
  }
}

// Format KYC status
export function formatKycStatus(status: string): string {
  switch (status) {
    case 'KYC_PASS':
      return 'Verified'
    case 'KYC_REVIEW':
      return 'Under Review'
    case 'KYC_FAIL':
      return 'Failed'
    case 'KYC_NONE':
      return 'Not Started'
    default:
      return status
  }
}

// Format wallet address (truncate for display)
export function formatWalletAddress(address: string, startChars = 6, endChars = 4): string {
  if (address.length <= startChars + endChars) {
    return address
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

// Format chain name
export function formatChainName(chain: string): string {
  switch (chain) {
    case 'erc20':
      return 'Ethereum (ERC-20)'
    case 'trc20':
      return 'Tron (TRC-20)'
    default:
      return chain.toUpperCase()
  }
}

// Format date and time
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'MMM dd, yyyy HH:mm')
}

// Format date only
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'MMM dd, yyyy')
}
