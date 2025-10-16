'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PaymentLinkDetails, KycStatus } from '@/lib/schemas/paymentConsumption'
import { formatKycStatus } from '@/lib/utils/format'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Clock, XCircle, Upload, AlertCircle, FileText, User, Building, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

// KYC Form Schemas
const IndividualKycSchema = z.object({
  // Personal Information
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  
  // Documents
  passportCopy: z.string().min(1, 'Passport copy is required'),
  emiratesIdFront: z.string().optional(),
  emiratesIdBack: z.string().optional(),
  proofOfAddress: z.string().min(1, 'Proof of address is required'),
  bankStatement: z.string().min(1, '3-month bank statement is required'),
  
  // Employment
  employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'retired']),
  salaryCertificate: z.string().optional(),
  tradeLicense: z.string().optional(),
  companyAccountStatement: z.string().optional(),
  
  // Additional Info
  usdtAddress: z.string().min(1, 'USDT address is required'),
  expectedMonthlyVolume: z.string().min(1, 'Expected monthly volume is required'),
})

const CorporateKycSchema = z.object({
  // Entity Information
  entityName: z.string().min(1, 'Entity name is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  
  // Entity Documents
  certificateOfIncorporation: z.string().min(1, 'Certificate of Incorporation is required'),
  tradeLicense: z.string().min(1, 'Trade License is required'),
  memorandumOfAssociation: z.string().min(1, 'MoA/AoA is required'),
  entityProofOfAddress: z.string().min(1, 'Entity proof of address is required'),
  bankerLetter: z.string().min(1, 'Banker letter/IBAN certificate is required'),
  
  // Financial Information
  bankStatements: z.string().min(1, '6-month bank statements are required'),
  financialStatements: z.string().optional(),
  invoices: z.string().optional(),
  expectedMonthlyVolume: z.string().min(1, 'Expected monthly volume is required'),
  walletAddress: z.string().optional(),
  
  // Directors & UBOs
  directors: z.array(z.object({
    name: z.string().min(1, 'Director name is required'),
    passport: z.string().min(1, 'Passport is required'),
    emiratesId: z.string().optional(),
    proofOfAddress: z.string().min(1, 'Proof of address is required'),
    ownershipPercentage: z.string().min(1, 'Ownership percentage is required'),
  })).min(1, 'At least one director is required'),
})

type IndividualKycForm = z.infer<typeof IndividualKycSchema>
type CorporateKycForm = z.infer<typeof CorporateKycSchema>

interface KycStepProps {
  paymentLink: PaymentLinkDetails
  kycStatus: KycStatus
  onStatusChange: (status: string) => void
}

export function KycStep({ paymentLink, kycStatus, onStatusChange }: KycStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [kycType, setKycType] = useState<'individual' | 'corporate'>('individual')
  
  const individualForm = useForm<IndividualKycForm>({
    resolver: zodResolver(IndividualKycSchema),
    defaultValues: {
      employmentStatus: 'employed',
    }
  })
  
  const corporateForm = useForm<CorporateKycForm>({
    resolver: zodResolver(CorporateKycSchema),
    defaultValues: {
      directors: [{ name: '', passport: '', proofOfAddress: '', ownershipPercentage: '' }]
    }
  })

  const handleIndividualSubmit = async (data: IndividualKycForm) => {
    try {
      setIsLoading(true)
      console.log('Individual KYC data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('KYC documents submitted successfully!')
      onStatusChange('KYC_REVIEW')
      
    } catch (error) {
      console.error('Failed to submit KYC:', error)
      toast.error('Failed to submit KYC documents. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCorporateSubmit = async (data: CorporateKycForm) => {
    try {
      setIsLoading(true)
      console.log('Corporate KYC data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Corporate KYC documents submitted successfully!')
      onStatusChange('KYC_REVIEW')
      
    } catch (error) {
      console.error('Failed to submit KYC:', error)
      toast.error('Failed to submit KYC documents. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  if (!paymentLink.requireKyc) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">KYC Not Required</h3>
          <p className="text-muted-foreground">
            This payment link does not require KYC verification.
          </p>
        </div>
        <Badge variant="default" className="bg-green-100 text-green-800">
          Skipped
        </Badge>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (kycStatus.status) {
      case 'KYC_PASS':
        return <CheckCircle className="h-12 w-12 text-green-600" />
      case 'KYC_REVIEW':
        return <Clock className="h-12 w-12 text-amber-600" />
      case 'KYC_FAIL':
        return <XCircle className="h-12 w-12 text-red-600" />
      default:
        return <AlertCircle className="h-12 w-12 text-gray-600" />
    }
  }

  const getStatusMessage = () => {
    switch (kycStatus.status) {
      case 'KYC_PASS':
        return {
          title: 'KYC Verified',
          description: 'Your identity has been successfully verified.',
          variant: 'default' as const,
        }
      case 'KYC_REVIEW':
        return {
          title: 'KYC Under Review',
          description: 'Your identity verification is being reviewed. This may take a few minutes to several hours.',
          variant: 'default' as const,
        }
      case 'KYC_FAIL':
        return {
          title: 'KYC Failed',
          description: 'Your identity verification failed. Please contact support for assistance.',
          variant: 'destructive' as const,
        }
      default:
        return {
          title: 'KYC Required',
          description: 'You need to complete identity verification before proceeding with the payment.',
          variant: 'default' as const,
        }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="space-y-6">
      {/* Status Display */}
      <div className="text-center space-y-4">
        {getStatusIcon()}
        <div>
          <h3 className="text-lg font-semibold">{statusInfo.title}</h3>
          <p className="text-muted-foreground">{statusInfo.description}</p>
        </div>
        <Badge variant={statusInfo.variant}>
          {formatKycStatus(kycStatus.status)}
        </Badge>
      </div>

      {/* Action Buttons */}
      {kycStatus.status === 'KYC_NONE' && (
        <div className="text-center">
          <Button onClick={handleStartKyc} disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Starting KYC...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Start KYC Verification
              </>
            )}
          </Button>
        </div>
      )}

      {kycStatus.status === 'KYC_FAIL' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your KYC verification failed. Please contact our support team for assistance 
            or try starting the verification process again.
          </AlertDescription>
        </Alert>
      )}

      {kycStatus.status === 'KYC_REVIEW' && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Your KYC verification is under review. You&apos;ll be notified once the review is complete.
            This process typically takes a few minutes to several hours.
          </AlertDescription>
        </Alert>
      )}

      {kycStatus.status === 'KYC_PASS' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Great! Your identity has been verified. You can now proceed to the next step.
          </AlertDescription>
        </Alert>
      )}

      {/* Information */}
      <div className="text-sm text-muted-foreground text-center">
        <p>
          KYC (Know Your Customer) verification helps us comply with regulatory requirements 
          and ensure secure transactions.
        </p>
      </div>
    </div>
  )
}
