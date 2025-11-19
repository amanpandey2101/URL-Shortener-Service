import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const url = await prisma.url.findUnique({
      where: { shortCode: code }
    })

    if (!url) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(url)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    // Check if exists first? delete throws if not found usually unless handled.
    // Prisma delete throws if not found.
    
    try {
      await prisma.url.delete({
        where: { shortCode: code }
      })
    } catch {
        // Prisma error for record not found is P2025
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({}, { status: 200 }) 
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

