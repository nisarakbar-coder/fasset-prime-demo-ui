import { NextRequest, NextResponse } from 'next/server'
import { mockPayouts } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const transactionId = searchParams.get('transactionId')
    
    let filteredPayouts = [...mockPayouts]
    
    // Apply filters
    if (status) {
      filteredPayouts = filteredPayouts.filter(payout => payout.status === status)
    }
    if (transactionId) {
      filteredPayouts = filteredPayouts.filter(payout => payout.transactionId === transactionId)
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPayouts = filteredPayouts.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      data: paginatedPayouts,
      pagination: {
        page,
        limit,
        total: filteredPayouts.length,
        totalPages: Math.ceil(filteredPayouts.length / limit)
      }
    })
  } catch (error) {
    console.error('Payouts fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payouts' },
      { status: 500 }
    )
  }
}
