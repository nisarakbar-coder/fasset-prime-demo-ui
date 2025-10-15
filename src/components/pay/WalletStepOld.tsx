'use client'

import { useState } from 'react'
import { PaymentLinkDetails, WalletWhitelistStatus, WhitelistWalletRequest } from '@/lib/schemas/paymentConsumption'
import { formatWalletAddress, formatChainName } from '@/lib/utils/format'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Plus, Wallet, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface WalletStepProps {
  paymentLink: PaymentLinkDetails
  walletStatus: WalletWhitelistStatus
  onStatusChange: (status: WalletWhitelistStatus) => void
}

export function WalletStep({ paymentLink, walletStatus, onStatusChange }: WalletStepProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newWallet, setNewWallet] = useState<WhitelistWalletRequest>({
    chain: 'erc20',
    address: '',
  })

  const handleAddWallet = async () => {
    if (!newWallet.address.trim()) {
      toast.error('Please enter a wallet address')
      return
    }

    try {
      setIsLoading(true)
      const response = await apiClient.addWalletToWhitelist(newWallet)
      
      if (response.whitelisted) {
        toast.success('Wallet added to whitelist successfully!')
        setIsDialogOpen(false)
        setNewWallet({ chain: 'erc20', address: '' })
        
        // Update wallet status
        onStatusChange({
          whitelisted: true,
          address: newWallet.address,
          chain: newWallet.chain,
        })
      }
    } catch (error) {
      console.error('Failed to add wallet:', error)
      toast.error('Failed to add wallet to whitelist. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!paymentLink.requireWalletWhitelist || paymentLink.paymentMethod === 'AED_BANK_TRANSFER') {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">Wallet Setup Not Required</h3>
          <p className="text-muted-foreground">
            This payment method does not require wallet whitelisting.
          </p>
        </div>
        <Badge variant="default" className="bg-green-100 text-green-800">
          Skipped
        </Badge>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Wallet Status */}
      <div className="text-center space-y-4">
        <Wallet className="h-12 w-12 text-blue-600 mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">Wallet Configuration</h3>
          <p className="text-muted-foreground">
            Configure your wallet for USDT payments
          </p>
        </div>
      </div>

      {/* Current Wallet Display */}
      {walletStatus.whitelisted && walletStatus.address ? (
        <div className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your wallet is whitelisted and ready for payments.
            </AlertDescription>
          </Alert>
          
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Wallet Address</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Whitelisted
              </Badge>
            </div>
            <div className="font-mono text-sm">
              {formatWalletAddress(walletStatus.address)}
            </div>
            {walletStatus.chain && (
              <div className="text-xs text-muted-foreground">
                Network: {formatChainName(walletStatus.chain)}
              </div>
            )}
          </div>

          <div className="text-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Change Wallet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chain">Network</Label>
                    <Select
                      value={newWallet.chain}
                      onValueChange={(value: 'erc20' | 'trc20') => 
                        setNewWallet(prev => ({ ...prev, chain: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="erc20">Ethereum (ERC-20)</SelectItem>
                        <SelectItem value="trc20">Tron (TRC-20)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Wallet Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter wallet address"
                      value={newWallet.address}
                      onChange={(e) => setNewWallet(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAddWallet} 
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Adding...' : 'Add Wallet'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to add a wallet address to your whitelist before proceeding with the payment.
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Wallet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Wallet to Whitelist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chain">Network</Label>
                    <Select
                      value={newWallet.chain}
                      onValueChange={(value: 'erc20' | 'trc20') => 
                        setNewWallet(prev => ({ ...prev, chain: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="erc20">Ethereum (ERC-20)</SelectItem>
                        <SelectItem value="trc20">Tron (TRC-20)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Wallet Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter wallet address"
                      value={newWallet.address}
                      onChange={(e) => setNewWallet(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAddWallet} 
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Adding...' : 'Add Wallet'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Information */}
      <div className="text-sm text-muted-foreground text-center">
        <p>
          Wallet whitelisting ensures that only approved addresses can receive payments, 
          providing an additional layer of security for your transactions.
        </p>
      </div>
    </div>
  )
}
