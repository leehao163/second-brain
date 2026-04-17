export interface DocumentMeta {
  title: string
  date: string
  tags: string[]
  category?: string
  description?: string
  status?: string
  author?: string
}

export interface Document {
  path: string
  slug: string
  content: string
  meta: DocumentMeta
  excerpt: string
  modifiedAt: Date
}

export interface SearchResult {
  document: Document
  score: number
  matches: { key: string; value: string[] }[]
}

export type ViewMode = 'list' | 'grid' | 'reading'
