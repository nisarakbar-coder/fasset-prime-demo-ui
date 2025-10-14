'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { WebhookConfigSchema, WebhookConfig } from '@/schemas'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Webhook, 
  Plus, 
  Play, 
  Trash2, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { mockWebhookEvents } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function WebhooksPage() {
  const [webhookEvents, setWebhookEvents] = useState(mockWebhookEvents)
  const [isTesting, setIsTesting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WebhookConfig>({
    resolver: zodResolver(WebhookConfigSchema),
    defaultValues: {
      url: 'https://api.example.com/webhooks/fasset',
      secret: 'your-webhook-secret-key',
      events: ['KYC_PASS', 'FUNDS_AVAILABLE'],
    },
  })

  const watchedEvents = watch('events')

  const toggleEvent = (event: string) => {
    const currentEvents = watchedEvents || []
    if (currentEvents.includes(event as any)) {
      setValue('events', currentEvents.filter(e => e !== event))
    } else {
      setValue('events', [...currentEvents, event as any])
    }
  }

  const testWebhook = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: 'https://api.example.com/webhooks/fasset',
          eventType: 'KYC_PASS',
          payload: { userId: '1', kycId: '1' }
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setWebhookEvents(prev => [data.data, ...prev])
        toast.success('Webhook test sent successfully')
      } else {
        toast.error('Webhook test failed')
      }
    } catch (error) {
      toast.error('Error testing webhook')
    } finally {
      setIsTesting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Webhooks"
        description="Configure webhooks to receive real-time notifications"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Configure Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configure Webhook</DialogTitle>
                <DialogDescription>
                  Set up webhook endpoints to receive real-time notifications
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Webhook URL</Label>
                  <Input
                    id="url"
                    placeholder="https://api.example.com/webhooks/fasset"
                    {...register('url')}
                  />
                  {errors.url && (
                    <p className="text-sm text-destructive">{errors.url.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret">Webhook Secret</Label>
                  <Input
                    id="secret"
                    type="password"
                    placeholder="your-webhook-secret-key"
                    {...register('secret')}
                  />
                  {errors.secret && (
                    <p className="text-sm text-destructive">{errors.secret.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Events to Subscribe</Label>
                  <div className="space-y-2">
                    {['KYC_PASS', 'FUNDS_AVAILABLE', 'PAYOUT_SENT'].map((event) => (
                      <div key={event} className="flex items-center space-x-2">
                        <Checkbox
                          id={event}
                          checked={watchedEvents?.includes(event as any) || false}
                          onCheckedChange={() => toggleEvent(event)}
                        />
                        <Label htmlFor={event} className="text-sm">
                          {event.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button type="submit">Save Configuration</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>
            Your active webhook settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Production Webhook</h3>
                <p className="text-sm text-muted-foreground">
                  https://api.example.com/webhooks/fasset
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="default">Active</Badge>
                <Button variant="outline" size="sm" onClick={testWebhook} disabled={isTesting}>
                  <Play className="h-4 w-4 mr-2" />
                  {isTesting ? 'Testing...' : 'Test'}
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Logs</CardTitle>
          <CardDescription>
            Recent webhook delivery attempts and responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {webhookEvents.map((event) => (
              <div key={event.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(event.status)}
                    <span className="font-medium">{event.eventType}</span>
                    <Badge variant={
                      event.status === 'DELIVERED' ? 'default' :
                      event.status === 'FAILED' ? 'destructive' :
                      'secondary'
                    }>
                      {event.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {event.createdAt.toLocaleString()}
                  </span>
                </div>
                
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">URL:</span>
                    <p className="font-mono text-xs">{event.url}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Response:</span>
                    <p>{event.responseCode || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Retries:</span>
                    <p>{event.retryCount}</p>
                  </div>
                </div>
                
                {event.responseBody && (
                  <div className="mt-2">
                    <span className="text-sm text-muted-foreground">Response Body:</span>
                    <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                      {event.responseBody}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhook Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Documentation</CardTitle>
          <CardDescription>
            Learn about webhook events and payload formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">KYC_PASS Event</h4>
              <div className="p-3 bg-muted rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`{
  "event": "KYC_PASS",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "userId": "123",
    "kycId": "kyc_456",
    "status": "PASS"
  }
}`}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">FUNDS_AVAILABLE Event</h4>
              <div className="p-3 bg-muted rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`{
  "event": "FUNDS_AVAILABLE",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "transactionId": "tx_789",
    "amount": 10000,
    "currency": "USDT"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
