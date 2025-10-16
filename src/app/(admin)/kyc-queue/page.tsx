'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  AlertTriangle,
  FileText,
  Calendar
} from 'lucide-react'
import { mockKYCRecords } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function KYCQueuePage() {
  const [kycRecords, setKycRecords] = useState(mockKYCRecords)
  const [selectedRecord, setSelectedRecord] = useState<typeof mockKYCRecords[0] | null>(null)
  const [filter, setFilter] = useState('ALL')
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredRecords = kycRecords.filter(record => {
    if (filter === 'ALL') return true
    return record.status === filter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'destructive'
      case 'HIGH': return 'default'
      case 'MEDIUM': return 'secondary'
      case 'LOW': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'FAIL':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'REVIEW':
        return <Eye className="h-4 w-4 text-blue-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const approveKYC = async (recordId: string) => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setKycRecords(prev => prev.map(record => 
        record.id === recordId 
          ? { ...record, status: 'PASS', reviewedAt: new Date() }
          : record
      ))
      toast.success('KYC approved successfully')
    } catch (error) {
      toast.error('Failed to approve KYC')
    } finally {
      setIsProcessing(false)
    }
  }

  const rejectKYC = async (recordId: string, reason: string) => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setKycRecords(prev => prev.map(record => 
        record.id === recordId 
          ? { ...record, status: 'FAIL', reviewedAt: new Date() }
          : record
      ))
      toast.success('KYC rejected')
    } catch (error) {
      toast.error('Failed to reject KYC')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="KYC Queue"
        description="Review and process KYC applications"
        actions={
          <div className="flex items-center space-x-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Records</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEW">Under Review</SelectItem>
                <SelectItem value="PASS">Approved</SelectItem>
                <SelectItem value="FAIL">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* KYC Records List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>KYC Applications</CardTitle>
              <CardDescription>
                {filteredRecords.length} records found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRecord?.id === record.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedRecord(record)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(record.status)}
                        <div>
                          <h3 className="font-medium">
                            {record.type === 'INDIVIDUAL' ? 'Individual' : 'Corporate'} Application
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Submitted {record.submittedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getPriorityColor(record.priority)}>
                          {record.priority}
                        </Badge>
                        <Badge variant={
                          record.status === 'PASS' ? 'default' :
                          record.status === 'FAIL' ? 'destructive' :
                          record.status === 'REVIEW' ? 'secondary' :
                          'outline'
                        }>
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Panel */}
        <div>
          {selectedRecord ? (
            <Card>
              <CardHeader>
                <CardTitle>Review Application</CardTitle>
                <CardDescription>
                  Application ID: {selectedRecord.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <p className="text-sm font-medium">
                    {selectedRecord.type === 'INDIVIDUAL' ? 'Individual' : 'Corporate'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Badge variant={getPriorityColor(selectedRecord.priority)}>
                    {selectedRecord.priority}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedRecord.status)}
                    <span className="text-sm font-medium">{selectedRecord.status}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Submitted</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecord.submittedAt.toLocaleString()}
                  </p>
                </div>

                {selectedRecord.owner && (
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRecord.owner}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Documents</Label>
                  <div className="space-y-2">
                    {selectedRecord.documents.map((doc: { type: string; url: string; uploadedAt: Date }, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{doc.type}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRecord.status === 'PENDING' && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => approveKYC(selectedRecord.id)}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="flex-1">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject KYC Application</DialogTitle>
                            <DialogDescription>
                              Provide a reason for rejection
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="reason">Rejection Reason</Label>
                              <Textarea
                                id="reason"
                                placeholder="Please specify the reason for rejection..."
                                rows={4}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline">Cancel</Button>
                              <Button
                                variant="destructive"
                                onClick={() => rejectKYC(selectedRecord.id, 'Document quality insufficient')}
                                disabled={isProcessing}
                              >
                                Reject Application
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}

                {selectedRecord.reviewedAt && (
                  <div className="space-y-2 pt-4 border-t">
                    <Label>Reviewed</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRecord.reviewedAt.toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <UserCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Select a KYC Record</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a record from the list to review
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {kycRecords.filter(r => r.status === 'PENDING').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {kycRecords.filter(r => r.status === 'REVIEW').length}
                </p>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {kycRecords.filter(r => r.status === 'PASS').length}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {kycRecords.filter(r => r.status === 'FAIL').length}
                </p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
