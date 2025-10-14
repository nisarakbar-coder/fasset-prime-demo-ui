'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Shield, Settings, Plus } from 'lucide-react'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage admin users and their roles"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
            <CardDescription>
              System administrators and their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Admin User</h3>
                  <p className="text-sm text-muted-foreground">admin@example.com</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">Super Admin</Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">Compliance Officer</h3>
                  <p className="text-sm text-muted-foreground">compliance@example.com</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">Compliance</Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>
              Available roles and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Super Admin</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Full system access, user management, system configuration
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Compliance</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  KYC review, AML monitoring, compliance reporting
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Log</CardTitle>
            <CardDescription>
              Recent admin actions and system changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">KYC Approved</p>
                <p className="text-xs text-muted-foreground">
                  Admin User • 2 hours ago
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Transaction Paused</p>
                <p className="text-xs text-muted-foreground">
                  Compliance Officer • 4 hours ago
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">User Role Updated</p>
                <p className="text-xs text-muted-foreground">
                  Admin User • 1 day ago
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
