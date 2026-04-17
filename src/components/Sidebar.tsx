'use client'

import { FolderOpen, Book, Hash, Calendar, Link2 } from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-muted/50 p-4 hidden md:block">
      <div className="space-y-6">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
            <FolderOpen className="w-4 h-4" />
            文档库
          </h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-accent">全部文档</Link>
            </li>
            <li>📝 笔记</li>
            <li>📖 参考</li>
            <li>📁 项目</li>
          </ul>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Hash className="w-4 h-4" />
            标签
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">#ai</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">#design</span>
            <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">#dev</span>
          </div>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Calendar className="w-4 h-4" />
            最近
          </h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              <Link href="/daily" className="hover:text-accent">📅 每日日志</Link>
            </li>
            <li>最近 7 天</li>
            <li>本月</li>
          </ul>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Link2 className="w-4 h-4" />
            关系
          </h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              <Link href="/graph" className="hover:text-accent">🔗 关系图</Link>
            </li>
            <li>反向链接</li>
          </ul>
        </div>
      </div>
    </aside>
  )
}
