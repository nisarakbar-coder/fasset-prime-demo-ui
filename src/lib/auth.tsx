'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole, LoginRequest, RegisterRequest } from '@/schemas'

interface AuthContextType {
  user: User | null
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'investor@example.com',
    name: 'John Investor',
    role: 'INVESTOR',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: '2',
    email: 'developer@example.com',
    name: 'Jane Developer',
    role: 'DEVELOPER',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('fasset-user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Convert date strings back to Date objects
        parsedUser.createdAt = new Date(parsedUser.createdAt)
        parsedUser.updatedAt = new Date(parsedUser.updatedAt)
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('fasset-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = mockUsers.find(u => u.email === credentials.email)
    
    if (foundUser && credentials.password === 'password123') {
      setUser(foundUser)
      localStorage.setItem('fasset-user', JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const register = async (data: RegisterRequest): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === data.email)
    if (existingUser) {
      setIsLoading(false)
      return false
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }
    
    mockUsers.push(newUser)
    setUser(newUser)
    localStorage.setItem('fasset-user', JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fasset-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useUser() {
  const { user } = useAuth()
  return user
}

export function useRole() {
  const { user } = useAuth()
  return user?.role
}

// Role-based access control
export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false
  
  const roleHierarchy: Record<UserRole, number> = {
    INVESTOR: 1,
    DEVELOPER: 2,
    ADMIN: 3,
  }
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}

export function requireRole(user: User | null, requiredRole: UserRole): boolean {
  if (!hasRole(user, requiredRole)) {
    throw new Error(`Access denied. Required role: ${requiredRole}`)
  }
  return true
}
