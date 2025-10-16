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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { StatusPill } from '@/components/shared/StatusPill'
import { Copyable } from '@/components/shared/Copyable'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  Copy, 
  QrCode, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Video
} from 'lucide-react'
import { toast } from 'sonner'

const walletSchema = z.object({
  address: z.string().min(42, 'Invalid wallet address'),
  chain: z.enum(['ETHEREUM', 'POLYGON', 'ARBITRUM']),
  ownershipProof: z.object({
    videoUrl: z.string().url().optional(),
    testTxHash: z.string().min(64, 'Invalid transaction hash').optional(),
  }).optional(),
})

type WalletFormData = z.infer<typeof walletSchema>

const chains = [
  { value: 'ETHEREUM', label: 'Ethereum', icon: '⟠' },
  { value: 'POLYGON', label: 'Polygon', icon: '⬟' },
  { value: 'ARBITRUM', label: 'Arbitrum', icon: '🔷' },
]

export default function WalletWhitelistPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedWallet, setSubmittedWallet] = useState<WalletFormData | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WalletFormData>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      chain: 'ETHEREUM',
    },
  })

  const watchedChain = watch('chain')
  const watchedAddress = watch('address')

  const onSubmit = async (data: WalletFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmittedWallet(data)
      toast.success('Wallet submitted for whitelisting!')
    } catch (error) {
      toast.error('Failed to submit wallet')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateAddress = (address: string, chain: string) => {
    if (!address) return { isValid: false, message: '' }
    
    switch (chain) {
      case 'ETHEREUM':
        return {
          isValid: /^0x[a-fA-F0-9]{40}$/.test(address),
          message: /^0x[a-fA-F0-9]{40}$/.test(address) ? 'Valid Ethereum address' : 'Invalid Ethereum address format'
        }
      case 'POLYGON':
        return {
          isValid: /^0x[a-fA-F0-9]{40}$/.test(address),
          message: /^0x[a-fA-F0-9]{40}$/.test(address) ? 'Valid Polygon address' : 'Invalid Polygon address format'
        }
      case 'ARBITRUM':
        return {
          isValid: /^0x[a-fA-F0-9]{40}$/.test(address),
          message: /^0x[a-fA-F0-9]{40}$/.test(address) ? 'Valid Arbitrum address' : 'Invalid Arbitrum address format'
        }
      default:
        return { isValid: false, message: 'Invalid chain' }
    }
  }

  const addressValidation = validateAddress(watchedAddress || '', watchedChain)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet Whitelist"
        description="Add your blockchain wallet address for secure transactions"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Wallet Address</CardTitle>
              <CardDescription>
                Whitelist your wallet address to enable secure deposits and withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="chain">Blockchain Network</Label>
                  <Select
                    value={watchedChain}
                    onValueChange={(value) => setValue('chain', value as 'ETHEREUM' | 'POLYGON' | 'ARBITRUM')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      {chains.map((chain) => (
                        <SelectItem key={chain.value} value={chain.value}>
                          <div className="flex items-center space-x-2">
                            <span>{chain.icon}</span>
                            <span>{chain.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Wallet Address</Label>
                  <Input
                    id="address"
                    placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                    {...register('address')}
                    className={addressValidation.isValid ? 'border-green-500' : watchedAddress ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                  {watchedAddress && (
                    <p className={`text-sm ${addressValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {addressValidation.message}
                    </p>
                  )}
                </div>

                {/* Ownership Proof Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Ownership Proof (Optional)</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Provide proof that you own this wallet address
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video Recording URL</Label>
                    <Input
                      id="videoUrl"
                      placeholder="https://example.com/ownership-proof.mp4"
                      {...register('ownershipProof.videoUrl')}
                    />
                    <p className="text-xs text-muted-foreground">
                      Record a short video showing you control this wallet
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testTxHash">Test Transaction Hash</Label>
                    <Input
                      id="testTxHash"
                      placeholder="0x1234567890abcdef..."
                      {...register('ownershipProof.testTxHash')}
                    />
                    <p className="text-xs text-muted-foreground">
                      Hash of a small test transaction from this wallet
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting || !addressValidation.isValid}>
                  {isSubmitting ? 'Submitting...' : 'Submit for Whitelisting'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Wallet Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submittedWallet ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <StatusPill status="PENDING" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Network</span>
                      <Badge variant="outline">
                        {chains.find(c => c.value === submittedWallet.chain)?.label}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Address</span>
                      <Copyable 
                        value={submittedWallet.address} 
                        className="text-xs"
                        inputClassName="text-xs h-8"
                        buttonClassName="h-8 w-8"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Wallet className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No wallet submitted yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Supported Networks</p>
                    <p className="text-muted-foreground">Ethereum, Polygon, and Arbitrum</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Address Format</p>
                    <p className="text-muted-foreground">Must be a valid 0x address</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium">Verification</p>
                    <p className="text-muted-foreground">May take 1-2 business days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Watch Tutorial
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
