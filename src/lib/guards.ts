import { PaymentLinkDetails, KycStatus, WalletWhitelistStatus } from './schemas/paymentConsumption'

// Check if payment link is expired
export function isPaymentLinkExpired(paymentLink: PaymentLinkDetails): boolean {
  const now = new Date()
  const expiresAt = new Date(paymentLink.expiresAt)
  return now > expiresAt
}

// Check if payment link is active
export function isPaymentLinkActive(paymentLink: PaymentLinkDetails): boolean {
  return paymentLink.status === 'ACTIVE' && !isPaymentLinkExpired(paymentLink)
}

// Check if KYC is required and passed
export function isKycRequiredAndPassed(
  paymentLink: PaymentLinkDetails,
  kycStatus: KycStatus
): boolean {
  if (!paymentLink.requireKyc) {
    return true // KYC not required
  }
  
  return kycStatus.status === 'KYC_PASS'
}

// Check if wallet whitelist is required and satisfied
export function isWalletWhitelistRequiredAndSatisfied(
  paymentLink: PaymentLinkDetails,
  walletStatus: WalletWhitelistStatus
): boolean {
  if (!paymentLink.requireWalletWhitelist) {
    return true // Wallet whitelist not required
  }
  
  return walletStatus.whitelisted === true
}

// Check if user can proceed to transfer step
export function canProceedToTransfer(
  paymentLink: PaymentLinkDetails,
  kycStatus: KycStatus,
  walletStatus: WalletWhitelistStatus
): boolean {
  return (
    isPaymentLinkActive(paymentLink) &&
    isKycRequiredAndPassed(paymentLink, kycStatus) &&
    isWalletWhitelistRequiredAndSatisfied(paymentLink, walletStatus)
  )
}

// Check if buyer matches the logged-in user
export function doesBuyerMatch(
  paymentLink: PaymentLinkDetails,
  userEmail?: string,
  userExternalId?: string
): boolean {
  if (!paymentLink.buyer) {
    return true // No buyer restriction
  }

  if (paymentLink.buyer.type === 'email' && paymentLink.buyer.email) {
    return userEmail === paymentLink.buyer.email
  }

  if (paymentLink.buyer.type === 'externalId' && paymentLink.buyer.externalId) {
    return userExternalId === paymentLink.buyer.externalId
  }

  return false
}

// Get step status for the payment stepper
export function getStepStatus(
  step: 'kyc' | 'wallet' | 'transfer' | 'done',
  paymentLink: PaymentLinkDetails,
  kycStatus: KycStatus,
  walletStatus: WalletWhitelistStatus,
  transactionStatus?: string
): 'completed' | 'current' | 'upcoming' | 'disabled' {
  switch (step) {
    case 'kyc':
      if (!paymentLink.requireKyc) {
        return 'completed'
      }
      if (kycStatus.status === 'KYC_PASS') {
        return 'completed'
      }
      if (kycStatus.status === 'KYC_REVIEW') {
        return 'current'
      }
      return 'current'

    case 'wallet':
      if (!paymentLink.requireWalletWhitelist || paymentLink.paymentMethod === 'AED_BANK_TRANSFER') {
        return 'completed'
      }
      if (isKycRequiredAndPassed(paymentLink, kycStatus)) {
        if (walletStatus.whitelisted) {
          return 'completed'
        }
        return 'current'
      }
      return 'disabled'

    case 'transfer':
      if (canProceedToTransfer(paymentLink, kycStatus, walletStatus)) {
        if (transactionStatus === 'SETTLED') {
          return 'completed'
        }
        return 'current'
      }
      return 'disabled'

    case 'done':
      if (transactionStatus === 'SETTLED') {
        return 'completed'
      }
      return 'upcoming'

    default:
      return 'upcoming'
  }
}
