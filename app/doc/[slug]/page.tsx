import { notFound } from 'next/navigation'
import { MarkdownViewer } from '@/components/MarkdownViewer'
import { DocumentCard } from '@/components/DocumentCard'
import { getDocumentBySlug, getAllSlugs } from '@/lib/FileScanner'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map(slug => ({ slug }))
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params
  const document = await getDocumentBySlug(slug)

  if (!document) {
    notFound()
  }

  const { meta, content } = document

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
      >
        <ArrowLeft className="w-4 h-4" />
        返回文档列表
      </Link>

      <article>
        <header className="mb-8 pb-6 border-b border-border">
          <h1 className="text-3xl font-bold mb-4">{meta.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {meta.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {meta.date}
              </span>
            )}
            {meta.author && (
              <span>作者: {meta.author}</span>
            )}
            {meta.category && (
              <span className="px-2 py-1 bg-muted rounded text-xs">
                {meta.category}
              </span>
            )}
            {meta.tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {meta.description && (
            <p className="mt-4 text-lg text-muted-foreground">
              {meta.description}
            </p>
          )}
        </header>

        <MarkdownViewer content={content} />
      </article>

      <nav className="pt-6 border-t border-border">
        <Link
          href="/"
          className="text-accent hover:underline text-sm"
        >
          ← 返回列表
        </Link>
      </nav>
    </div>
  )
}
