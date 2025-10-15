'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PaymentLinkDetails, KycStatus } from '@/lib/schemas/paymentConsumption'
import { formatKycStatus } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Clock, XCircle, Upload, AlertCircle, FileText, User, Building } from 'lucide-react'
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
      </div>
    )
  }

  // Show status if KYC is already submitted
  if (kycStatus.status !== 'KYC_NONE') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            {kycStatus.status === 'KYC_PASS' && <CheckCircle className="h-8 w-8 text-green-600" />}
            {kycStatus.status === 'KYC_REVIEW' && <Clock className="h-8 w-8 text-yellow-600" />}
            {kycStatus.status === 'KYC_FAIL' && <XCircle className="h-8 w-8 text-red-600" />}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">
              KYC Status: {formatKycStatus(kycStatus.status)}
            </h3>
            <p className="text-muted-foreground">
              {kycStatus.status === 'KYC_REVIEW' && 'Your KYC documents are under review.'}
              {kycStatus.status === 'KYC_PASS' && 'Your KYC verification is complete.'}
              {kycStatus.status === 'KYC_FAIL' && 'Your KYC verification failed. Please try again.'}
            </p>
          </div>
        </div>

        {kycStatus.status === 'KYC_REVIEW' && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Your KYC documents are currently under review. This process typically takes 1-3 business days. 
              You will be notified once the review is complete.
            </AlertDescription>
          </Alert>
        )}

        {kycStatus.status === 'KYC_FAIL' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Your KYC verification failed. Please ensure all documents are clear and valid, then try again.
            </AlertDescription>
          </Alert>
        )}

        {kycStatus.status === 'KYC_PASS' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your KYC verification is complete. You can now proceed to the next step.
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <AlertCircle className="h-8 w-8 text-blue-600 mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">KYC Verification Required</h3>
          <p className="text-muted-foreground">
            Please complete your KYC verification to proceed with the payment.
          </p>
        </div>
      </div>

      <Tabs value={kycType} onValueChange={(value) => setKycType(value as 'individual' | 'corporate')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Individual
          </TabsTrigger>
          <TabsTrigger value="corporate" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Corporate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual KYC Requirements</CardTitle>
              <CardDescription>
                Please provide the following documents and information for individual verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={individualForm.handleSubmit(handleIndividualSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        {...individualForm.register('fullName')}
                        placeholder="Enter your full name"
                      />
                      {individualForm.formState.errors.fullName && (
                        <p className="text-sm text-red-600">{individualForm.formState.errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...individualForm.register('email')}
                        placeholder="Enter your email"
                      />
                      {individualForm.formState.errors.email && (
                        <p className="text-sm text-red-600">{individualForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        {...individualForm.register('phone')}
                        placeholder="Enter your phone number"
                      />
                      {individualForm.formState.errors.phone && (
                        <p className="text-sm text-red-600">{individualForm.formState.errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Required Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passportCopy">Passport Copy *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="passportCopy"
                          {...individualForm.register('passportCopy')}
                          placeholder="Upload passport copy"
                          readOnly
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {individualForm.formState.errors.passportCopy && (
                        <p className="text-sm text-red-600">{individualForm.formState.errors.passportCopy.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emiratesIdFront">Emirates ID (Front)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="emiratesIdFront"
                          {...individualForm.register('emiratesIdFront')}
                          placeholder="Upload Emirates ID front"
                          readOnly
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emiratesIdBack">Emirates ID (Back)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="emiratesIdBack"
                          {...individualForm.register('emiratesIdBack')}
                          placeholder="Upload Emirates ID back"
                          readOnly
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proofOfAddress">Proof of Address *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="proofOfAddress"
                          {...individualForm.register('proofOfAddress')}
                          placeholder="Upload utility bill or tenancy contract"
                          readOnly
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {individualForm.formState.errors.proofOfAddress && (
                        <p className="text-sm text-red-600">{individualForm.formState.errors.proofOfAddress.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankStatement">3-Month Bank Statement *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="bankStatement"
                          {...individualForm.register('bankStatement')}
                          placeholder="Upload bank statement"
                          readOnly
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {individualForm.formState.errors.bankStatement && (
                        <p className="text-sm text-red-600">{individualForm.formState.errors.bankStatement.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Employment */}
                <div className="space-y-4">
                  <h4 className="font-medium">Employment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employmentStatus">Employment Status *</Label>
                      <Select
                        value={individualForm.watch('employmentStatus')}
                        onValueChange={(value) => individualForm.setValue('employmentStatus', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self-employed">Self-Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {individualForm.watch('employmentStatus') === 'employed' && (
                      <div className="space-y-2">
                        <Label htmlFor="salaryCertificate">Salary Certificate</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="salaryCertificate"
                            {...individualForm.register('salaryCertificate')}
                            placeholder="Upload salary certificate"
                            readOnly
                          />
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {individualForm.watch('employmentStatus') === 'self-employed' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="tradeLicense">Trade License</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="tradeLicense"
                              {...individualForm.register('tradeLicense')}
                              placeholder="Upload trade license"
                              readOnly
                            />
                            <Button type="button" variant="outline" size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyAccountStatement">Company Account Statement</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="companyAccountStatement"
                              {...individualForm.register('companyAccountStatement')}
                              placeholder="Upload company account statement"
                              readOnly
                            />
                            <Button type="button" variant="outline" size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="usdtAddress">USDT Address *</Label>
                      <Input
                        id="usdtAddress"
                        {...individualForm.register('usdtAddress')}
                        placeholder="Enter your USDT wallet address"
                      />
                      {individualForm.formState.errors.usdtAddress && (
                        <p className="text-sm text-red-600">{individualForm.formState.errors.usdtAddress.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedMonthlyVolume">Expected Monthly Volume *</Label>
                      <Input
                        id="expectedMonthlyVolume"
                        {...individualForm.register('expectedMonthlyVolume')}
                        placeholder="e.g., $10,000"
                      />
                      {individualForm.formState.errors.expectedMonthlyVolume && (
                        <p className="text-sm text-red-600">{individualForm.formState.errors.expectedMonthlyVolume.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Submitting...' : 'Submit KYC Documents'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corporate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Corporate KYC Requirements</CardTitle>
              <CardDescription>
                Please provide the following documents and information for corporate verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={corporateForm.handleSubmit(handleCorporateSubmit)} className="space-y-6">
                {/* Entity Information */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Entity Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entityName">Entity Name *</Label>
                      <Input
                        id="entityName"
                        {...corporateForm.register('entityName')}
                        placeholder="Enter entity name"
                      />
                      {corporateForm.formState.errors.entityName && (
                        <p className="text-sm text-red-600">{corporateForm.formState.errors.entityName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration Number *</Label>
                      <Input
                        id="registrationNumber"
                        {...corporateForm.register('registrationNumber')}
                        placeholder="Enter registration number"
                      />
                      {corporateForm.formState.errors.registrationNumber && (
                        <p className="text-sm text-red-600">{corporateForm.formState.errors.registrationNumber.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="corporateEmail">Email *</Label>
                      <Input
                        id="corporateEmail"
                        type="email"
                        {...corporateForm.register('email')}
                        placeholder="Enter entity email"
                      />
                      {corporateForm.formState.errors.email && (
                        <p className="text-sm text-red-600">{corporateForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="corporatePhone">Phone *</Label>
                      <Input
                        id="corporatePhone"
                        {...corporateForm.register('phone')}
                        placeholder="Enter entity phone"
                      />
                      {corporateForm.formState.errors.phone && (
                        <p className="text-sm text-red-600">{corporateForm.formState.errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Entity Documents */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Entity Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="certificateOfIncorporation">Certificate of Incorporation *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="certificateOfIncorporation"
                          {...corporateForm.register('certificateOfIncorporation')}
                          placeholder="Upload certificate"
                          readOnly
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="corporateTradeLicense">Trade License *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="corporateTradeLicense"
                          {...corporateForm.register('tradeLicense')}
                          placeholder="Upload trade license"
                          readOnly
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memorandumOfAssociation">MoA/AoA *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="memorandumOfAssociation"
                          {...corporateForm.register('memorandumOfAssociation')}
                          placeholder="Upload MoA/AoA"
                          readOnly
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entityProofOfAddress">Entity Proof of Address *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="entityProofOfAddress"
                          {...corporateForm.register('entityProofOfAddress')}
                          placeholder="Upload proof of address"
                          readOnly
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankerLetter">Banker Letter/IBAN Certificate *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="bankerLetter"
                          {...corporateForm.register('bankerLetter')}
                          placeholder="Upload banker letter"
                          readOnly
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">Financial Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankStatements">6-Month Bank Statements *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="bankStatements"
                          {...corporateForm.register('bankStatements')}
                          placeholder="Upload bank statements"
                          readOnly
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedMonthlyVolume">Expected Monthly Volume *</Label>
                      <Input
                        id="expectedMonthlyVolume"
                        {...corporateForm.register('expectedMonthlyVolume')}
                        placeholder="e.g., $100,000"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Submitting...' : 'Submit Corporate KYC Documents'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
