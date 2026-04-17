'use client'

import { useEffect, useRef, useState } from 'react'

interface GraphData {
  nodes: { id: string; label: string }[]
  edges: { from: string; to: string }[]
}

interface GraphViewProps {
  data: GraphData
}

// 简单的 Mermaid 图渲染
export function GraphView({ data }: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!data.nodes.length) {
      setError('没有可显示的关系数据')
      return
    }

    try {
      // 动态加载 mermaid
      const initMermaid = async () => {
        if (!(window as any).mermaid) {
          const mermaid = await import('mermaid')
          await mermaid.default.init()
        }
        renderGraph()
      }

      const renderGraph = () => {
        if (!containerRef.current) return

        const { nodes, edges } = data
        const nodeMap = new Map(nodes.map(n => [n.id, n.label]))

        let mermaidCode = 'graph TD\n'
        nodes.forEach(node => {
          mermaidCode += `  ${node.id}[${node.label}]\n`
        })
        edges.forEach(edge => {
          mermaidCode += `  ${edge.from} --> ${edge.to}\n`
        })

        containerRef.current!.innerHTML = ''
        const el = document.createElement('div')
        el.className = 'mermaid'
        el.textContent = mermaidCode
        containerRef.current!.appendChild(el)

        // 渲染 mermaid
        ;(window as any).mermaid.init(undefined, el)
      }

      initMermaid().catch(err => {
        setError('Failed to render graph: ' + err.message)
      })
    } catch (err) {
      setError('无法加载图表')
    }
  }, [data])

  if (error) {
    return <div className="p-4 bg-muted/30 rounded border border-border text-sm text-destructive">{error}</div>
  }

  return <div ref={containerRef} className="mermaid-graph overflow-auto p-4 bg-muted/20 rounded-lg border border-border" />
}
