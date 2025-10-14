import { NextRequest, NextResponse } from 'next/server'
import { getActiveProjects } from '@/lib/mock-data'

// GET /api/projects - Get projects (with optional status filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let projects = getActiveProjects()
    
    // If status is specified, filter by it
    if (status) {
      projects = projects.filter(project => project.status === status.toUpperCase())
    }
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
