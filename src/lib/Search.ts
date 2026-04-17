import Fuse from 'fuse.js'
import { Document } from './types'

export class DocumentSearch {
  private fuse: Fuse<Document>

  constructor(documents: Document[]) {
    this.fuse = new Fuse(documents, {
      keys: [
        { name: 'meta.title', weight: 0.4 },
        { name: 'content', weight: 0.3 },
        { name: 'meta.tags', weight: 0.2 },
        { name: 'meta.description', weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
      ignoreLocation: true,
    })
  }

  search(query: string, limit = 20) {
    if (!query.trim()) return []
    const results = this.fuse.search(query, { limit })
    return results.map(r => ({
      document: r.item,
      score: r.score ?? 1,
      matches: r.matches,
    }))
  }
}
