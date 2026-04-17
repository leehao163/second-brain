import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { Document } from './types'

const DOCS_DIR = path.join(process.cwd(), 'docs')

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

  for (const filePath of files) {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const { data, content: markdown } = matter(content)
      
      const stat = await fs.stat(filePath)
      const excerpt = extractExcerpt(markdown)

      documents.push({
        path: `/docs/${path.basename(filePath)}`,
        slug: path.basename(filePath, '.md'),
        content: markdown,
        meta: {
          title: data.title || path.basename(filePath, '.md'),
          date: data.date || formatDate(stat.mtime),
          tags: data.tags || [],
          category: data.category,
          description: data.description,
          status: data.status,
          author: data.author,
        },
        excerpt,
        modifiedAt: stat.mtime,
      })
    } catch (error) {
      console.error(`Failed to process ${filePath}:`, error)
    }
  }

  documents.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
  return documents
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
