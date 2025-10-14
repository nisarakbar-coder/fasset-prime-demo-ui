import { NextRequest, NextResponse } from 'next/server'
import { KYCStartRequestSchema } from '@/schemas'
import { mockKYCRecords } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = KYCStartRequestSchema.parse(body)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create new KYC record
    const newKYC = {
      id: Date.now().toString(),
      userId: '1', // In real app, get from auth
      type: validatedData.type,
      status: 'PENDING' as const,
      priority: 'MEDIUM' as const,
      documents: validatedData.documents.map((doc, index) => ({
        type: doc.type,
        url: `/uploads/kyc/${Date.now()}-${index}.pdf`,
        uploadedAt: new Date(),
      })),
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    mockKYCRecords.push(newKYC)
    
    return NextResponse.json({
      success: true,
      data: newKYC,
      message: 'KYC application submitted successfully'
    })
  } catch (error) {
    console.error('KYC start error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to start KYC process' },
      { status: 400 }
    )
  }
}
