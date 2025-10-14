'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FolderOpen, Plus, Settings } from 'lucide-react'

export default function DeveloperProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your token sale projects"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>
            Your current token sale projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">TechCorp Token Sale</h3>
                <p className="text-sm text-muted-foreground">
                  TECH • 1,000,000 tokens • $0.10 per token
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="default">ACTIVE</Badge>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
