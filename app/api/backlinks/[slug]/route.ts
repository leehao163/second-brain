import { NextRequest, NextResponse } from 'next/server'
import { getBacklinks, scanDocuments } from '@/src/lib/FileScanner'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  // 获取反向链接的 slug 数组
  const backlinkSlugs = getBacklinks(slug)

  if (backlinkSlugs.length === 0) {
    return NextResponse.json({ backlinks: [] })
  }

  // 获取所有文档，然后筛选出引用了当前 slug 的完整文档信息
  const allDocs = await scanDocuments()
  const backlinks = allDocs
    .filter(doc => backlinkSlugs.includes(doc.slug))
    .map(doc => ({
      slug: doc.slug,
      title: doc.meta.title,
      excerpt: doc.excerpt,
      path: doc.path,
      modifiedAt: doc.modifiedAt,
    }))

  return NextResponse.json({ backlinks })
}
