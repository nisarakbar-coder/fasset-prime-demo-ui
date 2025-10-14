import { useEffect, useState } from 'react'

export interface Permissions {
  canCreatePaymentLinks: boolean
  canViewPaymentLinks: boolean
  canEditPaymentLinks: boolean
  canDeletePaymentLinks: boolean
}

// Mock permissions hook - in a real app, this would check user roles/permissions
export function usePermissions(): Permissions {
  const [permissions, setPermissions] = useState<Permissions>({
    canCreatePaymentLinks: false,
    canViewPaymentLinks: false,
    canEditPaymentLinks: false,
    canDeletePaymentLinks: false,
  })

  useEffect(() => {
    // Check for stored user and determine permissions
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('fasset-user')
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          
          // For now, assume all developers have all permissions
          // In a real app, this would check specific permissions from the user object
          if (user.role === 'DEVELOPER') {
            setPermissions({
              canCreatePaymentLinks: true,
              canViewPaymentLinks: true,
              canEditPaymentLinks: true,
              canDeletePaymentLinks: true,
            })
          } else if (user.role === 'ADMIN') {
            setPermissions({
              canCreatePaymentLinks: true,
              canViewPaymentLinks: true,
              canEditPaymentLinks: true,
              canDeletePaymentLinks: true,
            })
          } else if (user.role === 'INVESTOR') {
            setPermissions({
              canCreatePaymentLinks: false,
              canViewPaymentLinks: false,
              canEditPaymentLinks: false,
              canDeletePaymentLinks: false,
            })
          }
        } catch (error) {
          console.error('Failed to parse user permissions:', error)
          setPermissions({
            canCreatePaymentLinks: false,
            canViewPaymentLinks: false,
            canEditPaymentLinks: false,
            canDeletePaymentLinks: false,
          })
        }
      }
    }
  }, [])

  return permissions
}

// Helper function to check if user has specific permission
export function hasPermission(permissions: Permissions, permission: keyof Permissions): boolean {
  return permissions[permission]
}

// Helper function to check if user can perform action on payment links
export function canPerformPaymentLinkAction(
  permissions: Permissions, 
  action: 'create' | 'view' | 'edit' | 'delete'
): boolean {
  switch (action) {
    case 'create':
      return permissions.canCreatePaymentLinks
    case 'view':
      return permissions.canViewPaymentLinks
    case 'edit':
      return permissions.canEditPaymentLinks
    case 'delete':
      return permissions.canDeletePaymentLinks
    default:
      return false
  }
}
