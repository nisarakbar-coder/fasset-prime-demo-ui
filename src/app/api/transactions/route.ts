import { NextRequest, NextResponse } from 'next/server'
import { mockTransactions } from '@/lib/mock-data'
import { PaginationSchema } from '@/schemas'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const chain = searchParams.get('chain')
    const userId = searchParams.get('userId')
    const developerId = searchParams.get('developerId')
    
    let filteredTransactions = [...mockTransactions]
    
    // Apply filters
    if (status) {
      filteredTransactions = filteredTransactions.filter(tx => tx.status === status)
    }
    if (chain) {
      filteredTransactions = filteredTransactions.filter(tx => tx.chain === chain)
    }
    if (userId) {
      filteredTransactions = filteredTransactions.filter(tx => tx.userId === userId)
    }
    if (developerId) {
      filteredTransactions = filteredTransactions.filter(tx => tx.developerId === developerId)
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limit)
      }
    })
  } catch (error) {
    console.error('Transactions fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}
