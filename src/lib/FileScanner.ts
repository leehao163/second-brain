import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { Document } from './types'

const DOCS_DIR = path.join(process.cwd(), 'docs')

// WikiLink 正则: [[slug]]
const WIKILINK_REGEX = /\[\[([^\[\]]+?)\]\]/g

export async function scanDocuments(): Promise<Document[]> {
  const files: string[] = []
  
  try {
    const entries = await fs.readdir(DOCS_DIR, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(path.join(DOCS_DIR, entry.name))
      }
    }
  } catch (error) {
    console.error('Failed to read docs directory:', error)
    return []
  }

  const documents: Document[] = []
  const backlinksIndex = new Map<string, Set<string>>()

  for (const filePath of files) {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const { data, content: markdown } = matter(content)
      
      const stat = await fs.stat(filePath)
      const excerpt = extractExcerpt(markdown)
      
      // 提取本文档引用的所有 WikiLink
      const links: string[] = []
      let match
      while ((match = WIKILINK_REGEX.exec(markdown)) !== null) {
        const slug = match[1]
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
          .trim()
        if (slug && !links.includes(slug)) {
          links.push(slug)
        }
      }
      // 重置正则 lastIndex
      WIKILINK_REGEX.lastIndex = 0

      const slug = path.basename(filePath, '.md')
      const doc: Document = {
        path: `/docs/${slug}.md`,
        slug,
        content: markdown,
        meta: {
          title: data.title || slug,
          date: data.date || formatDate(stat.mtime),
          tags: data.tags || [],
          category: data.category,
          description: data.description,
          status: data.status,
          author: data.author,
        },
        excerpt,
        modifiedAt: stat.mtime,
        links,
      }

      documents.push(doc)

      // 建立反向索引：每个被引用的 slug -> 本 slug
      for (const linkedSlug of links) {
        if (!backlinksIndex.has(linkedSlug)) {
          backlinksIndex.set(linkedSlug, new Set())
        }
        backlinksIndex.get(linkedSlug)!.add(slug)
      }
    } catch (error) {
      console.error(`Failed to process ${filePath}:`, error)
    }
  }

  documents.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
  
  // 将 Map 转换为普通对象以便序列化传递（可选，暂存在 module 级作用域供后续使用）
  ;(global as any).__BACKLINKS_INDEX = backlinksIndex
  
  return documents
}

// 筛选日志文档（根据 frontmatter 中 status: 'daily' 或文件名匹配 daily-log 模式）
export async function getDailyLogs(): Promise<Document[]> {
  const docs = await scanDocuments()
  return docs.filter(doc => 
    doc.meta.status === 'daily' || 
    doc.slug.match(/^\d{4}-\d{2}-\d{2}/) // 以日期开头的文件名
  )
}

// 获取或创建今天的日志条目
export async function getOrCreateDailyLog(
  title?: string,
  content?: string
): Promise<{ doc: Document; created: boolean }> {
  const today = new Date().toISOString().split('T')[0]
  const defaultSlug = `${today}-daily`
  
  // 检查是否存在
  const existing = await getDocumentBySlug(defaultSlug)
  if (existing) {
    return { doc: existing, created: false }
  }

  // 创建新日志文件
  const logContent = `---\ntitle: ${title || 'Daily Log ' + today}\ndate: ${today}\nstatus: daily\n---\n\n${content || ''}`
  
  // 写入文件
  const filePath = path.join(DOCS_DIR, `${defaultSlug}.md`)
  await fs.writeFile(filePath, logContent, 'utf-8')
  
  // 重建文档列表并返回
  const doc: Document = {
    path: `/docs/${defaultSlug}.md`,
    slug: defaultSlug,
    content,
    meta: {
      title: title || `Daily Log ${today}`,
      date: today,
      status: 'daily',
    },
    excerpt: extractExcerpt(content || ''),
    modifiedAt: new Date(),
    links: [],
  }
  
  return { doc, created: true }
}

// 获取引用指定 slug 的所有文档（反向链接）
export function getBacklinks(slug: string): string[] {
  const backlinksIndex = (global as any).__BACKLINKS_INDEX as Map<string, Set<string>> | undefined
  if (!backlinksIndex || !backlinksIndex.has(slug)) {
    return []
  }
  return Array.from(backlinksIndex.get(slug)!)
}

// 获取文档关系图数据（节点和边）
export function getGraphData() {
  const docs = scanDocumentsSync() // 需同步获取，但这里暂时用上次缓存
  const nodes: { id: string; label: string }[] = []
  const edges: { from: string; to: string }[] = []

  docs.forEach(doc => {
    nodes.push({ id: doc.slug, label: doc.meta.title })
    doc.links.forEach(targetSlug => {
      edges.push({ from: doc.slug, to: targetSlug })
    })
  })

  return { nodes, edges }
}

// 同步扫描（用于 getGraphData 等需要快速获取的场景）
// 注意：这只是简化版本，实际生产环境可能需要更好缓存
function scanDocumentsSync(): Document[] {
  // 这里只是占位，实际上我们只使用 scanDocuments 异步方法
  // 关系图数据从 scanDocuments 的结果中提取即可
  return []
}

export async function getDocumentBySlug(slug: string): Promise<Document | null> {
  const docs = await scanDocuments()
  return docs.find(d => d.slug === slug) || null
}

export async function getAllSlugs(): Promise<{ slug: string }[]> {
  const docs = await scanDocuments()
  return docs.map(doc => ({ slug: doc.slug }))
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function extractExcerpt(content: string, maxLength = 200): string {
  const text = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*|__/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .substring(0, maxLength)
  return text.trim() + (content.length > maxLength ? '...' : '')
}
