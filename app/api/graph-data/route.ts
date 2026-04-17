import { NextResponse } from 'next/server'
import { scanDocuments } from '@/src/lib/FileScanner'

export async function GET() {
  const docs = await scanDocuments()

  const nodes = docs.map(doc => ({
    id: doc.slug,
    label: doc.meta.title,
  }))

  const edges: { from: string; to: string }[] = []
  docs.forEach(doc => {
    doc.links.forEach(targetSlug => {
      // 只添加目标文档存在的边
      if (docs.some(d => d.slug === targetSlug)) {
        edges.push({ from: doc.slug, to: targetSlug })
      }
    })
  })

  return NextResponse.json({ nodes, edges })
}
