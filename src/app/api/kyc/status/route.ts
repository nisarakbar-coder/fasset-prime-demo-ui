import { NextResponse } from 'next/server'

// GET /api/kyc/status - Get current user's KYC status
export async function GET() {
  try {
    // Mock KYC status - in a real app, this would check the user's actual KYC status
    // For demo purposes, we'll return different statuses based on some logic
    
    // Simulate different KYC statuses for testing
    const statuses = ['KYC_PASS', 'KYC_REVIEW', 'KYC_FAIL', 'KYC_NONE'] as const
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    
    // For consistent testing, let's use KYC_PASS for now
    const response = {
      status: 'KYC_PASS' as const
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('KYC status fetch error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch KYC status', code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}
