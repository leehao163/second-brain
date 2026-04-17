import { NextResponse } from 'next/server'
import { scanDocuments } from '@/lib/FileScanner'

export async function GET() {
  try {
    const documents = await scanDocuments()
    return NextResponse.json(documents)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}
