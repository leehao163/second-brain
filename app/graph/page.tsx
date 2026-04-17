import { GraphView } from '@/components/GraphView'
import { Link } from 'next/link'
import { ArrowLeft, Network } from 'lucide-react'

export default async function GraphPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/graph-data`, {
    next: { revalidate: 3600 },
  })
  const { nodes, edges } = await res.json()

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
        >
          <ArrowLeft className="w-4 h-4" />
          返回文档列表
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Network className="w-6 h-6" />
          文档关系图
        </h1>
      </div>

      <div className="h-[800px]">
        <GraphView data={{ nodes, edges }} />
      </div>

      <div className="text-sm text-muted-foreground">
        <p>节点: {nodes.length} | 链接: {edges.length}</p>
      </div>
    </div>
  )
}
