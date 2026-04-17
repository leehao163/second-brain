'use client'

import { Document } from '@/lib/types'
import { FileText, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

interface DocumentCardProps {
  document: Document
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { meta, excerpt, path, slug } = document

  return (
    <Link
      href={`/doc/${slug}`}
      className="group block p-4 rounded-lg border border-border bg-card hover:border-accent hover:shadow-soft transition-all"
    >
      <div className="flex items-start gap-3">
        <FileText className="w-5 h-5 mt-0.5 text-accent shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate group-hover:text-accent transition-colors">
            {meta.title}
          </h3>
          {meta.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {meta.description}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {excerpt}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {meta.date}
            </span>
            {meta.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {meta.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-muted rounded text-[10px]"
                  >
                    {tag}
                  </span>
                ))}
                {meta.tags.length > 2 && (
                  <span className="text-[10px]">+{meta.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
