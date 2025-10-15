import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { mockPaymentLinks, mockProjects } from '@/lib/mock-data'

const PlinkIdSchema = z.string().min(1)

// GET /api/payment-links/[plinkId] - Get payment link details
export async function GET(
  request: NextRequest,
  { params }: { params: { plinkId: string } }
) {
  try {
    const { plinkId } = params
    const validatedPlinkId = PlinkIdSchema.parse(plinkId)

    // Find the payment link
    const paymentLink = mockPaymentLinks.find(link => link.id === validatedPlinkId)
    
    if (!paymentLink) {
      return NextResponse.json(
        { error: 'Payment link not found', code: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    // Find the associated project
    const project = mockProjects.find(p => p.id === paymentLink.projectId)
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found', code: 'PROJECT_NOT_FOUND' },
        { status: 404 }
      )
    }

    // Check if link is expired
    const now = new Date()
    const isExpired = now > paymentLink.expiresAt

    // Return payment link details with project info
    const response = {
      id: paymentLink.id,
      project: {
        id: project.id,
        name: project.name,
        code: project.code,
      },
      buyer: paymentLink.buyer,
      amount: paymentLink.amount.toFixed(2),
      currency: paymentLink.currency,
      paymentMethod: paymentLink.paymentMethod,
      requireKyc: paymentLink.requireKyc,
      requireWalletWhitelist: paymentLink.requireWalletWhitelist,
      status: isExpired ? 'EXPIRED' : paymentLink.status,
      expiresAt: paymentLink.expiresAt.toISOString(),
      createdAt: paymentLink.createdAt.toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Payment link fetch error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid payment link ID', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch payment link', code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}
