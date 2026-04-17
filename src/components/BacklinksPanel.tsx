'use client'

import Link from 'next/link'
import type { Backlink } from '@/src/types'

interface BacklinksPanelProps {
  backlinks: Backlink[]
}

export function BacklinksPanel({ backlinks }: BacklinksPanelProps) {
  if (backlinks.length === 0) {
    return (
      <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">反向链接</h3>
        <p className="text-sm text-muted-foreground italic">暂无引用此文档的页面</p>
      </div>
    )
  }

  return (
    <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        反向链接 ({backlinks.length})
      </h3>
      <ul className="space-y-2">
        {backlinks.map(link => (
          <li key={link.slug}>
            <Link
              href={`/doc/${link.slug}`}
              className="text-accent hover:underline text-sm"
            >
              {link.title}
            </Link>
            {link.excerpt && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {link.excerpt}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
