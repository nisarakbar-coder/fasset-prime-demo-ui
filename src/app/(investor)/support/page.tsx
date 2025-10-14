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
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'

const supportSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.enum(['KYC', 'WALLET', 'DEPOSIT', 'WITHDRAWAL', 'GENERAL', 'TECHNICAL']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  attachments: z.array(z.instanceof(File)).optional(),
})

type SupportFormData = z.infer<typeof supportSchema>

const categories = [
  { value: 'KYC', label: 'KYC Verification', icon: '🆔' },
  { value: 'WALLET', label: 'Wallet Issues', icon: '💼' },
  { value: 'DEPOSIT', label: 'Deposits', icon: '💰' },
  { value: 'WITHDRAWAL', label: 'Withdrawals', icon: '💸' },
  { value: 'GENERAL', label: 'General Inquiry', icon: '❓' },
  { value: 'TECHNICAL', label: 'Technical Support', icon: '🔧' },
]

const priorities = [
  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800' },
]

const faqs = [
  {
    question: 'How long does KYC verification take?',
    answer: 'KYC verification typically takes 1-2 business days. You will receive an email notification once your verification is complete.',
    category: 'KYC'
  },
  {
    question: 'What documents are required for KYC?',
    answer: 'You need a valid government-issued ID, proof of address (utility bill or bank statement), and a recent bank statement.',
    category: 'KYC'
  },
  {
    question: 'How do I whitelist my wallet?',
    answer: 'Go to the Wallet Whitelist page, enter your wallet address, select the correct network, and submit for verification.',
    category: 'WALLET'
  },
  {
    question: 'What networks are supported?',
    answer: 'We support Ethereum, Polygon, and Arbitrum networks for USDT deposits and withdrawals.',
    category: 'DEPOSIT'
  },
  {
    question: 'How long do deposits take to process?',
    answer: 'Deposits are processed automatically after the required number of blockchain confirmations (usually 12-15 minutes).',
    category: 'DEPOSIT'
  },
  {
    question: 'What is the minimum deposit amount?',
    answer: 'The minimum deposit amount is 100 USDT. There is no maximum limit.',
    category: 'DEPOSIT'
  }
]

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      priority: 'MEDIUM',
    },
  })

  const watchedCategory = watch('category')

  const onSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const ticket = {
        id: `TICKET-${Date.now()}`,
        ...data,
        status: 'OPEN',
        createdAt: new Date(),
      }
      
      setSubmittedTicket(ticket)
      toast.success('Support ticket created successfully!')
    } catch (error) {
      toast.error('Failed to create support ticket')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredFAQs = selectedCategory 
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        description="Get help with your account and investments"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>
                Describe your issue and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submittedTicket ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-semibold mb-2">Ticket Created Successfully!</h3>
                  <p className="text-muted-foreground mb-4">
                    Your support ticket <strong>{submittedTicket.id}</strong> has been created.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    We'll review your request and respond within 24 hours.
                  </p>
                  <Button onClick={() => setSubmittedTicket(null)}>
                    Create Another Ticket
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={watchedCategory}
                        onValueChange={(value) => setValue('category', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center space-x-2">
                                <span>{category.icon}</span>
                                <span>{category.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-destructive">{errors.category.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        onValueChange={(value) => setValue('priority', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              <div className="flex items-center space-x-2">
                                <Badge className={priority.color}>
                                  {priority.label}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      {...register('subject')}
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide detailed information about your issue..."
                      rows={6}
                      {...register('description')}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Ticket...' : 'Create Support Ticket'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={selectedCategory === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('')}
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={selectedCategory === category.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      {category.icon} {category.label}
                    </Button>
                  ))}
                </div>

                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@fasset.ae</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                    <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">+971 4 123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                    <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Sun-Thu: 9AM-6PM GST</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Times */}
          <Card>
            <CardHeader>
              <CardTitle>Response Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Urgent</span>
                  <Badge variant="destructive">2 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">High</span>
                  <Badge variant="default">4 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Medium</span>
                  <Badge variant="secondary">12 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Low</span>
                  <Badge variant="outline">24 hours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>My Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">KYC Verification</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                  <Badge variant="default">Open</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Wallet Issue</p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                  <Badge variant="secondary">Resolved</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                View All Tickets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
