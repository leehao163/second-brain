import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { scanDocuments } from '@/src/lib/FileScanner'

const DOCS_DIR = path.join(process.cwd(), 'docs')

export async function POST(request: NextRequest) {
  try {
    const { slug, title, content } = await request.json()

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const filePath = path.join(DOCS_DIR, `${slug}.md`)
    const frontmatter = `---\ntitle: ${title}\ndate: ${new Date().toISOString().split('T')[0]}\nstatus: daily\n---\n\n`
    const fullContent = frontmatter + (content || '')

    await writeFile(filePath, fullContent, 'utf-8')

    // 重新扫描以更新缓存
    await scanDocuments()

    return NextResponse.json({ 
      success: true, 
      message: 'Daily log saved',
      path: filePath,
    })
  } catch (error) {
    console.error('Failed to save daily log:', error)
    return NextResponse.json(
      { error: 'Failed to save daily log' },
      { status: 500 }
    )
  }
}
