'use client'

import { useEffect, useState } from 'react'
import { Document } from '@/lib/types'
import { DocumentCard } from './DocumentCard'

export function FileList() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDocuments() {
      try {
        const res = await fetch('/api/documents')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setDocuments(data)
      } catch (error) {
        console.error('Failed to load documents:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDocuments()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        加载中...
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        暂无文档，在 docs/ 目录下添加 .md 文件
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map(doc => (
        <DocumentCard key={doc.path} document={doc} />
      ))}
    </div>
  )
}
