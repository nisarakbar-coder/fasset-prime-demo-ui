import { NextRequest, NextResponse } from 'next/server'
import { WalletWhitelistRequestSchema } from '@/schemas'
import { mockWallets } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = WalletWhitelistRequestSchema.parse(body)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if wallet already exists
    const existingWallet = mockWallets.find(
      w => w.address.toLowerCase() === validatedData.address.toLowerCase()
    )
    
    if (existingWallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet already whitelisted' },
        { status: 400 }
      )
    }
    
    // Create new wallet
    const newWallet = {
      id: Date.now().toString(),
      userId: '1', // In real app, get from auth
      address: validatedData.address,
      chain: validatedData.chain,
      isWhitelisted: false, // Will be set to true after verification
      ownershipProof: validatedData.ownershipProof,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    mockWallets.push(newWallet)
    
    return NextResponse.json({
      success: true,
      data: newWallet,
      message: 'Wallet submitted for whitelisting'
    })
  } catch (error) {
    console.error('Wallet whitelist error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit wallet for whitelisting' },
      { status: 400 }
    )
  }
}
