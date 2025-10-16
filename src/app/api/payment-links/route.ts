import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { 
  mockPaymentLinks, 
  generatePaymentLinkId, 
  generatePaymentLinkUrl,
  getPaymentLinksByStatus,
  getPaymentLinksByProject 
} from '@/lib/mock-data'
import { 
  CreatePaymentLinkSchema, 
  ListPaymentLinksQuerySchema,
  PaymentLinkSchema,
  PaymentLink
} from '@/lib/schemas/paymentLink'

// In-memory storage for created payment links
// In a real app, this would be a database
const createdPaymentLinks: PaymentLink[] = []

// GET /api/payment-links - List payment links with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate query parameters
    const queryParams = {
      query: searchParams.get('query') || undefined,
      status: searchParams.get('status') || undefined,
      projectId: searchParams.get('projectId') || undefined,
      cursor: searchParams.get('cursor') || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
    }

    const validatedQuery = ListPaymentLinksQuerySchema.parse(queryParams)
    
    // Combine mock data with created payment links
    let filteredLinks = [...mockPaymentLinks, ...createdPaymentLinks]
    
    // Apply filters
    if (validatedQuery.status) {
      filteredLinks = filteredLinks.filter(link => link.status === validatedQuery.status)
    }
    
    if (validatedQuery.projectId) {
      filteredLinks = filteredLinks.filter(link => link.projectId === validatedQuery.projectId)
    }
    
    if (validatedQuery.query) {
      const query = validatedQuery.query.toLowerCase()
      filteredLinks = filteredLinks.filter(link => 
        link.id.toLowerCase().includes(query) ||
        (link.buyer.type === 'email' && link.buyer.email.toLowerCase().includes(query)) ||
        (link.buyer.type === 'externalId' && link.buyer.externalId.toLowerCase().includes(query))
      )
    }
    
    // Sort by creation date (newest first)
    filteredLinks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    // Simple cursor-based pagination
    const startIndex = validatedQuery.cursor ? 
      filteredLinks.findIndex(link => link.id === validatedQuery.cursor) + 1 : 0
    const endIndex = startIndex + validatedQuery.limit
    const paginatedLinks = filteredLinks.slice(startIndex, endIndex)
    
    const hasMore = endIndex < filteredLinks.length
    const nextCursor = hasMore ? paginatedLinks[paginatedLinks.length - 1]?.id : undefined
    
    // Ensure dates are properly serialized
    const serializedLinks = paginatedLinks.map(link => ({
      ...link,
      createdAt: link.createdAt.toISOString(),
      updatedAt: link.updatedAt.toISOString(),
      expiresAt: link.expiresAt.toISOString(),
    }))

    return NextResponse.json({
      data: serializedLinks,
      pagination: {
        cursor: nextCursor,
        hasMore,
        total: filteredLinks.length,
      },
    })
  } catch (error) {
    console.error('Payment links fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment links', code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}

// POST /api/payment-links - Create a new payment link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Convert expiresAt string to Date object if needed
    if (body.expiresAt && typeof body.expiresAt === 'string') {
      body.expiresAt = new Date(body.expiresAt)
    }
    
    // Validate the request body
    const validatedData = CreatePaymentLinkSchema.parse(body)
    
    // Generate new payment link
    const id = generatePaymentLinkId()
    const url = generatePaymentLinkUrl(id)
    const now = new Date()
    
    const newPaymentLink = {
      id,
      url,
      status: 'ACTIVE' as const,
      createdAt: now,
      updatedAt: now,
      ...validatedData,
      // Parse metadata if it's a string
      metadata: typeof validatedData.metadata === 'string' && validatedData.metadata.trim() 
        ? JSON.parse(validatedData.metadata) 
        : validatedData.metadata,
    }
    
    // Store the created payment link in memory
    // In a real implementation, you would save this to a database
    createdPaymentLinks.push(newPaymentLink)
    
    const response = {
      id: newPaymentLink.id,
      url: newPaymentLink.url,
      status: newPaymentLink.status,
      createdAt: newPaymentLink.createdAt.toISOString(),
    }
    
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Payment link creation error:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          code: 'VALIDATION_ERROR', 
          details: error.message,
          issues: error.issues
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment link', code: 'CREATION_ERROR' },
      { status: 500 }
    )
  }
}
