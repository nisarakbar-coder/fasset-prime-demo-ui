import { NextRequest, NextResponse } from 'next/server'
import { getDeveloperSettlementAccounts } from '@/lib/mock-data'

// GET /api/settlement-accounts - Get settlement accounts (with optional type filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    let accounts = getDeveloperSettlementAccounts()
    
    // If type is specified, filter by it
    if (type) {
      accounts = accounts.filter(account => account.type === type)
    }
    
    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Settlement accounts fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settlement accounts' },
      { status: 500 }
    )
  }
}
