'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  MapPin, 
  FileText, 
  Upload, 
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'

const kycSchema = z.object({
  type: z.enum(['INDIVIDUAL', 'CORPORATE']),
  // Individual fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  // Corporate fields
  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),
  incorporationDate: z.string().optional(),
  // Common fields
  address: z.string().min(10),
  city: z.string().min(2),
  country: z.string().min(2),
  postalCode: z.string().min(3),
  phoneNumber: z.string().min(10),
  // Documents
  identityDocument: z.instanceof(File).optional(),
  addressDocument: z.instanceof(File).optional(),
  bankStatement: z.instanceof(File).optional(),
})

type KYCFormData = z.infer<typeof kycSchema>

const steps = [
  { id: 1, title: 'Type Selection', icon: User },
  { id: 2, title: 'Personal Info', icon: User },
  { id: 3, title: 'Address', icon: MapPin },
  { id: 4, title: 'Documents', icon: FileText },
]

export default function KYCPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({})

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      type: 'INDIVIDUAL',
    },
  })

  const watchedType = watch('type')

  const handleFileUpload = (field: string, file: File | null) => {
    setUploadedFiles(prev => ({ ...prev, [field]: file }))
    setValue(field as keyof KYCFormData, file as any)
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: KYCFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('KYC application submitted successfully!')
      // In a real app, redirect to next step or dashboard
    } catch (error) {
      toast.error('Failed to submit KYC application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="space-y-6">
      <PageHeader
        title="KYC Verification"
        description="Complete your identity verification to start investing"
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Progress Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
              <Progress value={progress} className="w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg ${
                      currentStep === step.id
                        ? 'bg-primary/10 text-primary'
                        : currentStep > step.id
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`p-1 rounded-full ${
                      currentStep >= step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Select your account type'}
                {currentStep === 2 && 'Provide your personal information'}
                {currentStep === 3 && 'Enter your address details'}
                {currentStep === 4 && 'Upload required documents'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Type Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <Label>Account Type</Label>
                    <RadioGroup
                      value={watchedType}
                      onValueChange={(value) => setValue('type', value as 'INDIVIDUAL' | 'CORPORATE')}
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="INDIVIDUAL" id="individual" />
                        <Label htmlFor="individual" className="flex-1 cursor-pointer">
                          <div>
                            <div className="font-medium">Individual Account</div>
                            <div className="text-sm text-muted-foreground">
                              For personal investments
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="CORPORATE" id="corporate" />
                        <Label htmlFor="corporate" className="flex-1 cursor-pointer">
                          <div>
                            <div className="font-medium">Corporate Account</div>
                            <div className="text-sm text-muted-foreground">
                              For business investments
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    {watchedType === 'INDIVIDUAL' ? (
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              {...register('firstName')}
                              placeholder="John"
                            />
                            {errors.firstName && (
                              <p className="text-sm text-destructive">{errors.firstName.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              {...register('lastName')}
                              placeholder="Doe"
                            />
                            {errors.lastName && (
                              <p className="text-sm text-destructive">{errors.lastName.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              {...register('dateOfBirth')}
                            />
                            {errors.dateOfBirth && (
                              <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Select onValueChange={(value) => setValue('nationality', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select nationality" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                                <SelectItem value="AE">United Arab Emirates</SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="AU">Australia</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            {...register('companyName')}
                            placeholder="Acme Corporation"
                          />
                          {errors.companyName && (
                            <p className="text-sm text-destructive">{errors.companyName.message}</p>
                          )}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="registrationNumber">Registration Number</Label>
                            <Input
                              id="registrationNumber"
                              {...register('registrationNumber')}
                              placeholder="12345678"
                            />
                            {errors.registrationNumber && (
                              <p className="text-sm text-destructive">{errors.registrationNumber.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="incorporationDate">Incorporation Date</Label>
                            <Input
                              id="incorporationDate"
                              type="date"
                              {...register('incorporationDate')}
                            />
                            {errors.incorporationDate && (
                              <p className="text-sm text-destructive">{errors.incorporationDate.message}</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        {...register('phoneNumber')}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Address */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Textarea
                        id="address"
                        {...register('address')}
                        placeholder="123 Main Street, Apt 4B"
                        rows={3}
                      />
                      {errors.address && (
                        <p className="text-sm text-destructive">{errors.address.message}</p>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          {...register('city')}
                          placeholder="New York"
                        />
                        {errors.city && (
                          <p className="text-sm text-destructive">{errors.city.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select onValueChange={(value) => setValue('country', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="AE">United Arab Emirates</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          {...register('postalCode')}
                          placeholder="10001"
                        />
                        {errors.postalCode && (
                          <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Documents */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Identity Document</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Upload your passport, driver's license, or national ID
                          </p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('identityDocument', e.target.files?.[0] || null)}
                            className="hidden"
                            id="identityDocument"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('identityDocument')?.click()}
                          >
                            Choose File
                          </Button>
                          {uploadedFiles.identityDocument && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ {uploadedFiles.identityDocument.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Address Proof</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Upload utility bill, bank statement, or government letter
                          </p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('addressDocument', e.target.files?.[0] || null)}
                            className="hidden"
                            id="addressDocument"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('addressDocument')?.click()}
                          >
                            Choose File
                          </Button>
                          {uploadedFiles.addressDocument && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ {uploadedFiles.addressDocument.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Bank Statement</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Upload recent bank statement (last 3 months)
                          </p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('bankStatement', e.target.files?.[0] || null)}
                            className="hidden"
                            id="bankStatement"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('bankStatement')?.click()}
                          >
                            Choose File
                          </Button>
                          {uploadedFiles.bankStatement && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ {uploadedFiles.bankStatement.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Document Requirements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• All documents must be clear and readable</li>
                        <li>• Maximum file size: 10MB</li>
                        <li>• Accepted formats: PDF, JPG, PNG</li>
                        <li>• Documents must be in English or with certified translation</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < steps.length ? (
                    <Button type="button" onClick={nextStep}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit KYC'}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
