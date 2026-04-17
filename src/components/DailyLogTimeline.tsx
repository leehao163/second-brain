'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import type { Document } from '@/src/types'

interface DailyLogTimelineProps {
  logs: Document[]
}

export default function DailyLogTimeline({ logs }: DailyLogTimelineProps) {
  if (logs.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic border-l-2 border-border pl-4">
        暂无历史日志
      </div>
    )
  }

  return (
    <div className="border-l-2 border-border pl-6 space-y-6 relative">
      {logs.map((log, index) => {
        const date = new Date(log.meta.date)
        const dateStr = new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        }).format(date)
        
        return (
          <div key={log.slug} className="relative">
            {/* 时间点 */}
            <div className="absolute -left-[31px] top-2 w-3 h-3 bg-accent rounded-full border-2 border-background" />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime={log.meta.date}>
                  {dateStr}
                </time>
              </div>
              
              <Link
                href={`/doc/${log.slug}`}
                className="text-lg font-medium text-accent hover:underline"
              >
                {log.meta.title}
              </Link>
              
              {log.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {log.excerpt}
                </p>
              )}
              
              {log.meta.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {log.meta.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
