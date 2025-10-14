import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chain = searchParams.get('chain') || 'ETHEREUM'
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Generate mock deposit address based on chain
    const addresses = {
      ETHEREUM: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      POLYGON: '0x8ba1f109551bD432803012645Hac136c',
      ARBITRUM: '0x1234567890123456789012345678901234567890'
    }
    
    const depositAddress = addresses[chain as keyof typeof addresses] || addresses.ETHEREUM
    
    return NextResponse.json({
      success: true,
      data: {
        address: depositAddress,
        chain,
        minConfirmations: 12,
        quoteExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        networkFee: '0.001',
        currency: 'USDT'
      }
    })
  } catch (error) {
    console.error('Deposit address error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate deposit address' },
      { status: 500 }
    )
  }
}
