import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type StatusType = 
  | 'KYC_PENDING' 
  | 'KYC_PASS' 
  | 'KYC_FAIL' 
  | 'REVIEW' 
  | 'FAIL' 
  | 'FUNDS_AVAILABLE' 
  | 'PAYOUT_SENT' 
  | 'SETTLED'
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETRYING'
  | 'ACTIVE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'DRAFT'
  | 'GENERATING'
  | 'READY'
  | 'CONVERSION_PENDING'
  | 'WALLET_PENDING'

interface StatusPillProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<StatusType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  KYC_PENDING: { label: 'KYC Pending', variant: 'secondary' },
  KYC_PASS: { label: 'KYC Passed', variant: 'default' },
  KYC_FAIL: { label: 'KYC Failed', variant: 'destructive' },
  REVIEW: { label: 'Under Review', variant: 'outline' },
  FAIL: { label: 'Failed', variant: 'destructive' },
  FUNDS_AVAILABLE: { label: 'Funds Available', variant: 'default' },
  PAYOUT_SENT: { label: 'Payout Sent', variant: 'default' },
  SETTLED: { label: 'Settled', variant: 'default' },
  PENDING: { label: 'Pending', variant: 'secondary' },
  SENT: { label: 'Sent', variant: 'default' },
  DELIVERED: { label: 'Delivered', variant: 'default' },
  FAILED: { label: 'Failed', variant: 'destructive' },
  RETRYING: { label: 'Retrying', variant: 'outline' },
  ACTIVE: { label: 'Active', variant: 'default' },
  PAUSED: { label: 'Paused', variant: 'secondary' },
  COMPLETED: { label: 'Completed', variant: 'default' },
  DRAFT: { label: 'Draft', variant: 'outline' },
  GENERATING: { label: 'Generating', variant: 'secondary' },
  READY: { label: 'Ready', variant: 'default' },
  CONVERSION_PENDING: { label: 'Converting', variant: 'secondary' },
  WALLET_PENDING: { label: 'Wallet Pending', variant: 'outline' },
}

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status]
  
  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        {status}
      </Badge>
    )
  }

  return (
    <Badge 
      variant={config.variant} 
      className={cn('', className)}
    >
      {config.label}
    </Badge>
  )
}
