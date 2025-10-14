'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { CreatePaymentLinkSchema, CreatePaymentLinkRequest } from '@/lib/schemas/paymentLink'
import { Project, SettlementAccount } from '@/lib/schemas/paymentLink'

interface CreatePaymentLinkFormProps {
  onSubmit: (data: CreatePaymentLinkRequest) => Promise<void>
  isLoading?: boolean
  projects: Project[]
  settlementAccounts: SettlementAccount[]
}

export function CreatePaymentLinkForm({
  onSubmit,
  isLoading = false,
  projects,
  settlementAccounts,
}: CreatePaymentLinkFormProps) {
  const [buyerType, setBuyerType] = useState<'email' | 'externalId'>('email')
  const [expiryDate, setExpiryDate] = useState<Date>()
  const [expiryTime, setExpiryTime] = useState('')
  const [isExpiryOpen, setIsExpiryOpen] = useState(false)

  const form = useForm<CreatePaymentLinkRequest>({
    resolver: zodResolver(CreatePaymentLinkSchema),
    defaultValues: {
      projectId: '',
      buyer: { type: 'email' as const, email: '' },
      amount: 0,
      currency: 'AED' as const,
      paymentMethod: 'USDT_TO_AED' as const,
      settlementAccountId: '',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      webhookUrl: '',
      successUrl: '',
      cancelUrl: '',
      metadata: '',
      requireKyc: true,
      requireWalletWhitelist: true,
      notes: '',
    },
  })

  const { watch, setValue, formState: { errors } } = form
  const currency = watch('currency')

  // Update buyer type when switching tabs
  useEffect(() => {
    if (buyerType === 'email') {
      setValue('buyer', { type: 'email', email: '' })
    } else {
      setValue('buyer', { type: 'externalId', externalId: '' })
    }
  }, [buyerType, setValue])

  // Payment method is fixed to USDT_TO_AED, wallet whitelist is always required

  // Set default expiry date only once on mount
  useEffect(() => {
    const defaultDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    setExpiryDate(defaultDate)
    setValue('expiresAt', defaultDate)
    setExpiryTime(format(defaultDate, 'HH:mm'))
  }, []) // Empty dependency array - only run once

  // Update expiresAt when date or time changes
  useEffect(() => {
    if (expiryDate && expiryTime) {
      const [hours, minutes] = expiryTime.split(':').map(Number)
      const newDate = new Date(expiryDate)
      newDate.setHours(hours, minutes, 0, 0)
      setValue('expiresAt', newDate)
    }
  }, [expiryDate, expiryTime, setValue])

  // Live preview removed as requested

  const handleSubmit = async (data: CreatePaymentLinkRequest) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Link Configuration</CardTitle>
        <CardDescription>
          Configure your payment link settings and requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="projectId">Project *</Label>
            <Select
              value={form.watch('projectId')}
              onValueChange={(value) => setValue('projectId', value)}
              {...form.register('projectId')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({project.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectId && (
              <p className="text-sm text-red-500">{errors.projectId.message}</p>
            )}
          </div>

          {/* Buyer Identifier */}
          <div className="space-y-2">
            <Label>Buyer Identifier *</Label>
            <Tabs value={buyerType} onValueChange={(value) => setBuyerType(value as 'email' | 'externalId')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="externalId">External ID</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="space-y-2">
                <Input
                  placeholder="buyer@example.com"
                  {...form.register('buyer.email')}
                  onChange={(e) => {
                    form.setValue('buyer', { type: 'email', email: e.target.value })
                  }}
                />
                {errors.buyer?.email && (
                  <p className="text-sm text-red-500">{errors.buyer.email.message}</p>
                )}
              </TabsContent>
              <TabsContent value="externalId" className="space-y-2">
                <Input
                  placeholder="CUST-12345"
                  {...form.register('buyer.externalId')}
                  onChange={(e) => {
                    form.setValue('buyer', { type: 'externalId', externalId: e.target.value })
                  }}
                />
                {errors.buyer?.externalId && (
                  <p className="text-sm text-red-500">{errors.buyer.externalId.message}</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="1000.00"
                {...form.register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={form.watch('currency')}
                onValueChange={(value) => setValue('currency', value as 'AED' | 'USDT')}
                {...form.register('currency')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AED">AED</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method - Fixed to USDT to AED */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
                <div>
                  <p className="font-medium">USDT to AED</p>
                  <p className="text-sm text-muted-foreground">
                    Buyer pays USDT; auto-convert to AED and settle to developer via Whizmo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Settlement Account */}
          <div className="space-y-2">
            <Label htmlFor="settlementAccountId">Settlement Account *</Label>
            <Select
              value={form.watch('settlementAccountId')}
              onValueChange={(value) => setValue('settlementAccountId', value)}
              {...form.register('settlementAccountId')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select settlement account" />
              </SelectTrigger>
              <SelectContent>
                {settlementAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.alias} - {account.maskedIban}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.settlementAccountId && (
              <p className="text-sm text-red-500">{errors.settlementAccountId.message}</p>
            )}
          </div>

          {/* Link Expiry */}
          <div className="space-y-2">
            <Label>Link Expiry *</Label>
            <div className="grid grid-cols-2 gap-4">
              <Popover open={isExpiryOpen} onOpenChange={setIsExpiryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={(date) => {
                      setExpiryDate(date)
                      setIsExpiryOpen(false)
                    }}
                    disabled={(date) => {
                      const now = new Date()
                      const minDate = new Date(now.getTime() + 10 * 60 * 1000) // 10 minutes
                      const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
                      return date < minDate || date > maxDate
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
              />
            </div>
            {errors.expiresAt && (
              <p className="text-sm text-red-500">{errors.expiresAt.message}</p>
            )}
          </div>

          {/* URLs - Optional */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://api.example.com/webhooks/payment"
                {...form.register('webhookUrl')}
              />
              {errors.webhookUrl && (
                <p className="text-sm text-red-500">{errors.webhookUrl.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="successUrl">Success URL (Optional)</Label>
                <Input
                  id="successUrl"
                  type="url"
                  placeholder="https://example.com/success"
                  {...form.register('successUrl')}
                />
                {errors.successUrl && (
                  <p className="text-sm text-red-500">{errors.successUrl.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cancelUrl">Cancel URL (Optional)</Label>
                <Input
                  id="cancelUrl"
                  type="url"
                  placeholder="https://example.com/cancel"
                  {...form.register('cancelUrl')}
                />
                {errors.cancelUrl && (
                  <p className="text-sm text-red-500">{errors.cancelUrl.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Metadata - Optional */}
          <div className="space-y-2">
            <Label htmlFor="metadata">Metadata (JSON) - Optional</Label>
            <Textarea
              id="metadata"
              placeholder='{"orderId": "ORD-123", "customerType": "VIP"}'
              rows={3}
              {...form.register('metadata')}
            />
            {errors.metadata && (
              <p className="text-sm text-red-500">{errors.metadata.message}</p>
            )}
          </div>

          {/* Compliance Notice */}
          <div className="space-y-2">
            <Label>Compliance</Label>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium text-blue-800">KYC & Wallet Whitelist Required</p>
                  <p className="text-sm text-blue-700">
                    All buyers must complete KYC verification and wallet whitelisting before payment can be processed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes - Optional */}
          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any internal notes about this payment link..."
              rows={3}
              {...form.register('notes')}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
