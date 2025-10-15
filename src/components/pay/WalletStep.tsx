'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PaymentLinkDetails, WalletWhitelistStatus, WhitelistWalletRequest } from '@/lib/schemas/paymentConsumption'
import { formatWalletAddress, formatChainName } from '@/lib/utils/format'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Plus, Wallet, AlertCircle, Video, Upload, Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

// Wallet Whitelist Form Schema
const WalletWhitelistSchema = z.object({
  address: z.string().min(1, 'Wallet address is required'),
  chain: z.enum(['erc20', 'trc20']),
})

type WalletWhitelistForm = z.infer<typeof WalletWhitelistSchema>

interface WalletStepProps {
  paymentLink: PaymentLinkDetails
  walletStatus: WalletWhitelistStatus
  onStatusChange: (status: WalletWhitelistStatus) => void
}

export function WalletStep({ paymentLink, walletStatus, onStatusChange }: WalletStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [verificationStep, setVerificationStep] = useState<'address' | 'video' | 'test-transaction' | 'complete'>('address')
  const [testTransactionAmount, setTestTransactionAmount] = useState('')
  const [testTransactionHash, setTestTransactionHash] = useState('')
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  
  const form = useForm<WalletWhitelistForm>({
    resolver: zodResolver(WalletWhitelistSchema),
    defaultValues: {
      chain: 'erc20',
      address: '',
    }
  })

  const handleSubmitWallet = async (data: WalletWhitelistForm) => {
    try {
      setIsLoading(true)
      console.log('Wallet whitelist data:', data)
      
      // Simulate API call to submit wallet for whitelisting
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Wallet address submitted for whitelisting!')
      setVerificationStep('video')
      
    } catch (error) {
      console.error('Failed to submit wallet:', error)
      toast.error('Failed to submit wallet address. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVideoUpload = (file: File) => {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (MP4, WebM, OGG, AVI, or MOV)')
      return
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      toast.error('Video file size must be less than 50MB')
      return
    }

    setUploadedVideo(file)
    toast.success(`${file.name} uploaded successfully!`)
  }

  const handleVideoInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleVideoUpload(file)
    }
  }

  const handleVideoUploadClick = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click()
    }
  }

  const handleVideoVerification = async () => {
    if (!uploadedVideo) {
      toast.error('Please upload a verification video first')
      return
    }

    try {
      setIsLoading(true)
      
      // Simulate video verification process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Video verification completed!')
      setVerificationStep('test-transaction')
      
    } catch (error) {
      console.error('Failed video verification:', error)
      toast.error('Video verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestTransaction = async () => {
    if (!testTransactionAmount || !testTransactionHash) {
      toast.error('Please provide both amount and transaction hash')
      return
    }

    try {
      setIsLoading(true)
      
      // Simulate test transaction verification
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Test transaction verified! Wallet whitelisted successfully!')
      setVerificationStep('complete')
      
      // Update wallet status
      onStatusChange({
        whitelisted: true,
        address: form.getValues('address'),
        chain: form.getValues('chain'),
      })
      
    } catch (error) {
      console.error('Failed test transaction verification:', error)
      toast.error('Test transaction verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!paymentLink.requireWalletWhitelist || paymentLink.paymentMethod === 'AED_BANK_TRANSFER') {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">Wallet Whitelist Not Required</h3>
          <p className="text-muted-foreground">
            This payment link does not require wallet whitelisting.
          </p>
        </div>
      </div>
    )
  }

  // Show status if wallet is already whitelisted
  if (walletStatus.whitelisted && walletStatus.address) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">Wallet Whitelisted</h3>
            <p className="text-muted-foreground">
              Your wallet has been successfully whitelisted for payments.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Whitelisted Wallet Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Wallet Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={formatWalletAddress(walletStatus.address)}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(walletStatus.address!)
                      toast.success('Address copied to clipboard!')
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Network</Label>
                <div className="mt-1">
                  <Badge variant="secondary">
                    {formatChainName(walletStatus.chain!)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your wallet is approved and ready for USDT payments. You can now proceed to the transfer step.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Wallet className="h-12 w-12 text-blue-600 mx-auto" />
            <div>
              <h1 className="text-3xl font-bold">Wallet Whitelisting</h1>
              <p className="text-lg text-muted-foreground">
                Please whitelist your USDT wallet to proceed with the payment.
              </p>
            </div>
          </div>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Whitelisting Process</CardTitle>
          <CardDescription>
            Follow these steps to whitelist your USDT wallet for payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Submit Wallet Address */}
          {verificationStep === 'address' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <h4 className="font-medium">Submit Wallet Address</h4>
              </div>
              
              <form onSubmit={form.handleSubmit(handleSubmitWallet)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chain">Network Chain *</Label>
                    <Select
                      value={form.watch('chain')}
                      onValueChange={(value) => form.setValue('chain', value as 'erc20' | 'trc20')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a chain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="erc20">Ethereum (ERC20)</SelectItem>
                        <SelectItem value="trc20">Tron (TRC20)</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.chain && (
                      <p className="text-sm text-red-600">{form.formState.errors.chain.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">USDT Wallet Address *</Label>
                    <Input
                      id="address"
                      {...form.register('address')}
                      placeholder="Enter your USDT wallet address"
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-red-600">{form.formState.errors.address.message}</p>
                    )}
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Make sure you have control over this wallet address. You will need to perform a small test transaction to verify ownership.
                  </AlertDescription>
                </Alert>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Submitting...' : 'Submit Wallet Address'}
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: Video Verification */}
          {verificationStep === 'video' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <h4 className="font-medium">Video Verification</h4>
              </div>
              
              <div className="space-y-4">
                <Alert>
                  <Video className="h-4 w-4" />
                  <AlertDescription>
                    Please record a short video showing yourself and stating the wallet address you submitted.
                    The video should be clear and show your face for identity verification.
                  </AlertDescription>
                </Alert>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  {uploadedVideo ? (
                    <div className="space-y-2">
                      <p className="text-green-600 font-medium">✓ {uploadedVideo.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-gray-600 mb-4">Upload your verification video</p>
                      <Button 
                        variant="outline" 
                        className="mb-2"
                        onClick={handleVideoUploadClick}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Video File
                      </Button>
                      <p className="text-sm text-gray-500">Max file size: 50MB</p>
                    </div>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoInputChange}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Video Requirements:</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Show your face clearly</li>
                    <li>• State your full name</li>
                    <li>• Read out the wallet address: <code className="bg-blue-100 px-1 rounded">{form.getValues('address')}</code></li>
                    <li>• Video should be at least 10 seconds long</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleVideoVerification} 
                  disabled={isLoading || !uploadedVideo} 
                  className="w-full"
                >
                  {isLoading ? 'Processing Video...' : 
                   !uploadedVideo ? 'Upload Video First' : 
                   'Submit Video for Verification'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Test Transaction */}
          {verificationStep === 'test-transaction' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <h4 className="font-medium">Test Transaction Verification</h4>
              </div>
              
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please send a small test transaction (minimum 1 USDT) to the address below to verify wallet ownership.
                    This transaction will be refunded after verification.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Send Test Transaction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Destination Address</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value="0xTestAddressForVerification123456789"
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText('0xTestAddressForVerification123456789')
                            toast.success('Address copied to clipboard!')
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Amount (USDT)</Label>
                      <Input
                        value="1.00"
                        readOnly
                        className="font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Network</Label>
                      <Badge variant="secondary">
                        {formatChainName(form.getValues('chain'))}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="testAmount">Amount Sent (USDT) *</Label>
                      <Input
                        id="testAmount"
                        value={testTransactionAmount}
                        onChange={(e) => setTestTransactionAmount(e.target.value)}
                        placeholder="e.g., 1.00"
                        type="number"
                        step="0.01"
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="txHash">Transaction Hash *</Label>
                      <Input
                        id="txHash"
                        value={testTransactionHash}
                        onChange={(e) => setTestTransactionHash(e.target.value)}
                        placeholder="Enter transaction hash"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>

                  <Button onClick={handleTestTransaction} disabled={isLoading} className="w-full">
                    {isLoading ? 'Verifying Transaction...' : 'Verify Test Transaction'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {verificationStep === 'complete' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <h4 className="font-medium">Wallet Whitelisted Successfully!</h4>
              </div>
              
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your wallet has been successfully whitelisted. You can now proceed to the payment transfer step.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Whitelisted Wallet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Wallet Address</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={formatWalletAddress(form.getValues('address'))}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(form.getValues('address'))
                            toast.success('Address copied to clipboard!')
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Network</Label>
                      <div className="mt-1">
                        <Badge variant="secondary">
                          {formatChainName(form.getValues('chain'))}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
}
