import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const TransactionQuerySchema = z.object({
  plinkId: z.string().min(1, 'Payment link ID is required'),
})

// GET /api/transactions?plinkId=... - Get transaction status for payment link
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = {
      plinkId: searchParams.get('plinkId'),
    }
    
    const validatedQuery = TransactionQuerySchema.parse(queryParams)

    // Mock transaction status - in a real app, this would check the actual transaction status
    // For demo purposes, we'll simulate different states
    const statuses = ['PENDING', 'ONCHAIN_CONFIRMED', 'CONVERTING', 'SETTLED'] as const
    
    // For consistent testing, let's start with PENDING
    const response = {
      status: 'PENDING' as const,
      txHash: null,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Transaction status fetch error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch transaction status', code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}