'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
  className?: string
}

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
    })

    const renderDiagram = async () => {
      if (!chart || !containerRef.current) return

      try {
        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        setSvg(renderedSvg)
        setError(null)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Error rendering diagram')
      }
    }

    renderDiagram()
  }, [chart])

  if (error) {
    return (
      <div className={`my-4 p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-sm text-red-600">
          <strong>Error al renderizar diagrama:</strong> {error}
        </p>
        <details className="mt-2">
          <summary className="text-xs text-red-500 cursor-pointer">Ver código</summary>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
            {chart}
          </pre>
        </details>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`my-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
