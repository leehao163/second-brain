'use client'

import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DocumentSearch } from '@/lib/Search'
import { DocumentCard } from './DocumentCard'
import { Document } from '@/lib/types'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Document[]>([])
  const [allDocs, setAllDocs] = useState<Document[]>([])
  const [searchEngine, setSearchEngine] = useState<DocumentSearch | null>(null)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(data => {
        setAllDocs(data)
        setSearchEngine(new DocumentSearch(data))
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!searchEngine) return
    if (query.trim().length < 1) {
      setResults([])
      setShowResults(false)
      return
    }
    const searchResults = searchEngine.search(query)
    setResults(searchResults.map(r => r.document))
    setShowResults(true)
  }, [query, searchEngine])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        type="text"
        placeholder="搜索文档..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      />
      
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.slice(0, 10).map(doc => (
            <a
              key={doc.path}
              href={`/doc/${doc.slug}`}
              className="block p-3 hover:bg-muted border-b border-border last:border-b-0"
            >
              <div className="font-medium">{doc.meta.title}</div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {doc.excerpt}
              </div>
            </a>
          ))}
        </div>
      )}

      {showResults && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 p-4 text-sm text-muted-foreground">
          未找到匹配结果
        </div>
      )}
    </div>
  )
}
