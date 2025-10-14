'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Calendar,
  Activity,
  AlertTriangle
} from 'lucide-react'
import { mockApiKeys } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('API key copied to clipboard')
    } catch (err) {
      toast.error('Failed to copy API key')
    }
  }

  const createNewKey = async () => {
    if (!newKeyName.trim()) return

    setIsCreating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newKey = {
        id: Date.now().toString(),
        developerId: '1',
        name: newKeyName,
        key: `fasset_live_sk_${Math.random().toString(36).substring(2, 15)}`,
        permissions: ['kyc:read', 'kyc:write', 'transactions:read', 'payouts:read'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      setApiKeys(prev => [newKey, ...prev])
      setNewKeyName('')
      toast.success('API key created successfully')
    } catch (error) {
      toast.error('Failed to create API key')
    } finally {
      setIsCreating(false)
    }
  }

  const revokeKey = async (keyId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, isActive: false } : key
      ))
      toast.success('API key revoked')
    } catch (error) {
      toast.error('Failed to revoke API key')
    }
  }

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '...' + key.substring(key.length - 4)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        description="Manage your API keys for secure access to Fasset Prime APIs"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Create a new API key for your application. Keep it secure and never share it publicly.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="Production API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You will only be able to see the full API key once. Make sure to copy and store it securely.
                  </AlertDescription>
                </Alert>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setNewKeyName('')}>
                    Cancel
                  </Button>
                  <Button onClick={createNewKey} disabled={isCreating || !newKeyName.trim()}>
                    {isCreating ? 'Creating...' : 'Create Key'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{apiKey.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Created {apiKey.createdAt.toLocaleDateString()}</span>
                      {apiKey.lastUsed && (
                        <span>Last used {apiKey.lastUsed.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                    {apiKey.isActive ? 'Active' : 'Revoked'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {apiKey.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono">
                    {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  {!showKeys[apiKey.id] && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      Show
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {apiKey.permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
          <CardDescription>
            Example code snippets for using your API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Node.js Example */}
            <div>
              <h4 className="font-medium mb-2">Node.js / TypeScript</h4>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.fasset.ae',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

// Start KYC process
const startKYC = async (data) => {
  const response = await client.post('/kyc/start', {
    type: 'INDIVIDUAL',
    documents: data.documents
  });
  return response.data;
};`}
                </pre>
              </div>
            </div>

            {/* cURL Example */}
            <div>
              <h4 className="font-medium mb-2">cURL</h4>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`curl -X POST https://api.fasset.ae/kyc/start \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "INDIVIDUAL",
    "documents": [
      {
        "type": "PASSPORT",
        "file": "base64_encoded_file"
      }
    ]
  }'`}
                </pre>
              </div>
            </div>

            {/* Python Example */}
            <div>
              <h4 className="font-medium mb-2">Python</h4>
              <div className="p-4 bg-muted rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# Start KYC process
response = requests.post(
    'https://api.fasset.ae/kyc/start',
    headers=headers,
    json={
        'type': 'INDIVIDUAL',
        'documents': [
            {
                'type': 'PASSPORT',
                'file': 'base64_encoded_file'
            }
        ]
    }
)

print(response.json())`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Learn more about our API endpoints and authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Authentication</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Learn how to authenticate your API requests
              </p>
              <Button variant="outline" size="sm">
                View Docs
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Endpoints</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Explore all available API endpoints
              </p>
              <Button variant="outline" size="sm">
                View Docs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
