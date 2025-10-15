import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const AddressQuerySchema = z.object({
  plinkId: z.string().min(1, 'Payment link ID is required'),
  chain: z.enum(['erc20', 'trc20']).optional(),
})

// GET /api/deposits/address?plinkId=...&chain=... - Get deposit address for payment link
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = {
      plinkId: searchParams.get('plinkId'),
      chain: searchParams.get('chain') as 'erc20' | 'trc20' | null,
    }
    
    const validatedQuery = AddressQuerySchema.parse(queryParams)

    // Mock deposit address - in a real app, this would generate a unique deposit address
    // for the specific payment link and chain
    const mockAddresses = {
      erc20: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      trc20: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
    }

    const chain = validatedQuery.chain || 'erc20'
    
    const response = {
      address: mockAddresses[chain],
      memo: null, // Some chains require memo/tag
      chain,
      minAmount: '1000.00',
      confirmationsRequired: 12
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Deposit address fetch error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch deposit address', code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}