import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateShortCode, isValidUrl } from '@/lib/utils'

// GET /api/links - List all links
export async function GET(request: NextRequest) {
  try {
    const urls = await prisma.url.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(urls)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/links - Create link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, shortCode: customCode } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    let code = customCode

    if (code) {
      const existing = await prisma.url.findUnique({
        where: { shortCode: code }
      })
      if (existing) {
        return NextResponse.json({ error: 'Code already exists' }, { status: 409 })
      }
    } else {
      let isUnique = false
      while (!isUnique) {
        code = generateShortCode()
        const existing = await prisma.url.findUnique({
            where: { shortCode: code }
        })
        if (!existing) isUnique = true
      }
    }

    const newUrl = await prisma.url.create({
      data: {
        originalUrl: url,
        shortCode: code
      }
    })

    return NextResponse.json({
      originalUrl: newUrl.originalUrl,
      shortCode: newUrl.shortCode,
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/${newUrl.shortCode}`
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

