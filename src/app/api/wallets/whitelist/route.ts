import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const WhitelistRequestSchema = z.object({
  chain: z.enum(['erc20', 'trc20']),
  address: z.string().min(1, 'Address is required'),
})

// GET /api/wallets/whitelist?chain=erc20|trc20 - Get whitelist status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chain = searchParams.get('chain')
    
    if (!chain || !['erc20', 'trc20'].includes(chain)) {
      return NextResponse.json(
        { error: 'Invalid or missing chain parameter', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Mock whitelist status - in a real app, this would check the user's actual whitelist status
    const response = {
      whitelisted: true,
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      chain: chain as 'erc20' | 'trc20'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Whitelist status fetch error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch whitelist status', code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}

// POST /api/wallets/whitelist - Add wallet to whitelist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = WhitelistRequestSchema.parse(body)

    // Mock whitelist addition - in a real app, this would add the wallet to whitelist
    const response = {
      whitelisted: true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Whitelist addition error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to add wallet to whitelist', code: 'ADD_ERROR' },
      { status: 500 }
    )
  }
}