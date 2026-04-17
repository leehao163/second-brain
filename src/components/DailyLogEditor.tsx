'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'

interface DailyLogEditorProps {
  initialSlug: string
  initialTitle: string
  initialContent: string
}

export default function DailyLogEditor({ initialSlug, initialTitle, initialContent }: DailyLogEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/daily-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: initialSlug,
          title,
          content,
        }),
      })

      if (res.ok) {
        setMessage('保存成功！')
        setTimeout(() => setMessage(null), 3000)
        router.refresh()
      } else {
        throw new Error('保存失败')
      }
    } catch (err) {
      setMessage('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full p-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        placeholder="日志标题"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={12}
        className="w-full p-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
        placeholder="开始记录今天..."
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          支持 WikiLink [[文档名]]
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
      {message && (
        <div className={`text-sm ${message.includes('成功') ? 'text-green-600' : 'text-destructive'}`}>
          {message}
        </div>
      )}
    </div>
  )
}
