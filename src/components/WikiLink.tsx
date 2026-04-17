'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface WikiLinkProps {
  slug: string
  children: React.ReactNode
  className?: string
}

export function WikiLink({ slug, children, className = '' }: WikiLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    // 未来可以实现内页跳转，现在只是占位
  }

  return (
    <Link
      href={`/doc/${slug}`}
      onClick={handleClick}
      className={`wikilink ${className}`}
    >
      {children}
    </Link>
  )
}
