import { NextRequest, NextResponse } from 'next/server'
import { mockKYCRecords } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const owner = searchParams.get('owner')
    
    let filteredRecords = [...mockKYCRecords]
    
    // Apply filters
    if (status) {
      filteredRecords = filteredRecords.filter(record => record.status === status)
    }
    if (priority) {
      filteredRecords = filteredRecords.filter(record => record.priority === priority)
    }
    if (owner) {
      filteredRecords = filteredRecords.filter(record => record.owner === owner)
    }
    
    // Sort by priority and creation date
    filteredRecords.sort((a, b) => {
      const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      data: paginatedRecords,
      pagination: {
        page,
        limit,
        total: filteredRecords.length,
        totalPages: Math.ceil(filteredRecords.length / limit)
      }
    })
  } catch (error) {
    console.error('Admin KYC fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch KYC records' },
      { status: 500 }
    )
  }
}
