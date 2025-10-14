import { NextRequest, NextResponse } from 'next/server'
import { mockWebhookEvents } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, eventType, payload } = body
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate random success/failure
    const isSuccess = Math.random() > 0.3 // 70% success rate
    
    const newEvent = {
      id: Date.now().toString(),
      developerId: '1', // In real app, get from auth
      eventType,
      payload: payload || {},
      url,
      status: isSuccess ? 'DELIVERED' : 'FAILED',
      responseCode: isSuccess ? 200 : 500,
      responseBody: isSuccess ? '{"status": "success"}' : 'Internal Server Error',
      retryCount: 0,
      deliveredAt: isSuccess ? new Date() : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    mockWebhookEvents.push(newEvent)
    
    return NextResponse.json({
      success: true,
      data: newEvent,
      message: isSuccess ? 'Webhook delivered successfully' : 'Webhook delivery failed'
    })
  } catch (error) {
    console.error('Webhook test error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to test webhook' },
      { status: 400 }
    )
  }
}
