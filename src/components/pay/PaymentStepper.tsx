'use client'

import { useState, useEffect } from 'react'
import { PaymentLinkDetails, KycStatus, WalletWhitelistStatus, TransactionStatus } from '@/lib/schemas/paymentConsumption'
import { getStepStatus } from '@/lib/guards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react'
import { KycStep } from './KycStep'
import { WalletStep } from './WalletStep'
import { TransferStep } from './TransferStep'
import { DoneStep } from './DoneStep'

interface PaymentStepperProps {
  paymentLink: PaymentLinkDetails
  kycStatus: KycStatus
  walletStatus: WalletWhitelistStatus
  initialTransactionStatus?: TransactionStatus
  userEmail?: string
  userExternalId?: string
}

export function PaymentStepper({ 
  paymentLink, 
  kycStatus, 
  walletStatus, 
  initialTransactionStatus,
  userEmail, 
  userExternalId 
}: PaymentStepperProps) {
  const [currentStep, setCurrentStep] = useState<'kyc' | 'wallet' | 'transfer' | 'done'>('kyc')
  const [transactionStatus, setTransactionStatus] = useState<string>(
    initialTransactionStatus?.status || 'PENDING'
  )
  const [currentKycStatus, setCurrentKycStatus] = useState<KycStatus>(kycStatus)
  const [currentWalletStatus, setCurrentWalletStatus] = useState<WalletWhitelistStatus>(walletStatus)
  const [isLoading, setIsLoading] = useState(false)

  // Determine current step based on status and auto-progress
  useEffect(() => {
    if (transactionStatus === 'SETTLED') {
      setCurrentStep('done')
      return
    }

    const kycStepStatus = getStepStatus('kyc', paymentLink, currentKycStatus, currentWalletStatus, transactionStatus)
    const walletStepStatus = getStepStatus('wallet', paymentLink, currentKycStatus, currentWalletStatus, transactionStatus)
    const transferStepStatus = getStepStatus('transfer', paymentLink, currentKycStatus, currentWalletStatus, transactionStatus)

    // Auto-progress through steps
    if (kycStepStatus === 'completed' && walletStepStatus === 'upcoming') {
      setCurrentStep('wallet')
    } else if (walletStepStatus === 'completed' && transferStepStatus === 'upcoming') {
      setCurrentStep('transfer')
    } else if (kycStepStatus === 'current' || kycStepStatus === 'upcoming') {
      setCurrentStep('kyc')
    } else if (walletStepStatus === 'current' || walletStepStatus === 'upcoming') {
      setCurrentStep('wallet')
    } else if (transferStepStatus === 'current' || transferStepStatus === 'upcoming') {
      setCurrentStep('transfer')
    } else {
      setCurrentStep('done')
    }
  }, [paymentLink, currentKycStatus, currentWalletStatus, transactionStatus])

  const steps = [
    {
      id: 'kyc' as const,
      title: 'KYC Verification',
      description: 'Complete identity verification',
      status: getStepStatus('kyc', paymentLink, currentKycStatus, currentWalletStatus, transactionStatus),
    },
    {
      id: 'wallet' as const,
      title: 'Wallet Setup',
      description: 'Configure payment wallet',
      status: getStepStatus('wallet', paymentLink, currentKycStatus, currentWalletStatus, transactionStatus),
    },
    {
      id: 'transfer' as const,
      title: 'Payment Transfer',
      description: 'Complete payment',
      status: getStepStatus('transfer', paymentLink, currentKycStatus, currentWalletStatus, transactionStatus),
    },
    {
      id: 'done' as const,
      title: 'Complete',
      description: 'Payment settled',
      status: getStepStatus('done', paymentLink, currentKycStatus, currentWalletStatus, transactionStatus),
    },
  ]

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'current':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'disabled':
        return <AlertCircle className="h-5 w-5 text-gray-400" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStepBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case 'current':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Current</Badge>
      case 'disabled':
        return <Badge variant="secondary">Disabled</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Stepper */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  {getStepIcon(step.status)}
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {step.description}
                </div>
                {getStepBadge(step.status)}
                {index < steps.length - 1 && (
                  <div className="w-full h-px bg-border mt-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps.find(s => s.id === currentStep)?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 'kyc' && (
            <KycStep
              paymentLink={paymentLink}
              kycStatus={currentKycStatus}
              onStatusChange={(status) => {
                setCurrentKycStatus({ status: status as string })
              }}
            />
          )}
          
          {currentStep === 'wallet' && (
            <WalletStep
              paymentLink={paymentLink}
              walletStatus={currentWalletStatus}
              onStatusChange={(status) => {
                setCurrentWalletStatus(status)
              }}
            />
          )}
          
          {currentStep === 'transfer' && (
            <TransferStep
              paymentLink={paymentLink}
              transactionStatus={transactionStatus}
              onStatusChange={(status) => {
                setTransactionStatus(status)
              }}
            />
          )}
          
          {currentStep === 'done' && (
            <DoneStep
              paymentLink={paymentLink}
              transactionStatus={transactionStatus}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
