'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import mermaid from 'mermaid'

let mermaidInitialized = false

function initMermaid() {
  if (mermaidInitialized) return
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#2CB6D7',
      primaryTextColor: '#ffffff',
      primaryBorderColor: '#36B3AE',
      secondaryColor: '#C7517E',
      secondaryTextColor: '#ffffff',
      secondaryBorderColor: '#b8456f',
      tertiaryColor: '#200F5D',
      tertiaryTextColor: '#ffffff',
      lineColor: '#36B3AE',
      textColor: '#e2e8f0',
      mainBkg: '#1e293b',
      nodeBorder: '#2CB6D7',
      clusterBkg: '#0f172a',
      clusterBorder: '#334155',
      titleColor: '#f1f5f9',
      edgeLabelBackground: '#1e293b',
      nodeTextColor: '#f1f5f9',
    },
    fontFamily: 'Inter, system-ui, sans-serif',
    securityLevel: 'strict',
    flowchart: {
      htmlLabels: true,
      curve: 'basis',
      padding: 12,
    },
  })
  mermaidInitialized = true
}

interface MermaidDiagramProps {
  chart: string
  className?: string
}

export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRendering, setIsRendering] = useState(true)

  const renderDiagram = useCallback(async () => {
    if (!chart.trim()) return

    setIsRendering(true)
    setError(null)
    initMermaid()

    try {
      // Clean up chart code - normalize whitespace and remove problematic characters
      const cleanChart = chart
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, '    ')
        .trim()

      const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const { svg: renderedSvg } = await mermaid.render(id, cleanChart)
      setSvg(renderedSvg)
    } catch (err) {
      console.error('Mermaid rendering error:', err)
      setError(err instanceof Error ? err.message : 'Error al renderizar diagrama')
    } finally {
      setIsRendering(false)
    }
  }, [chart])

  useEffect(() => {
    renderDiagram()
  }, [renderDiagram])

  // Loading state
  if (isRendering && !svg) {
    return (
      <div className={`my-3 p-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <div className="w-4 h-4 border-2 border-white/20 border-t-[#2CB6D7] rounded-full animate-spin" />
          Generando diagrama...
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`my-3 rounded-xl overflow-hidden border border-red-500/20 ${className}`}>
        <div className="px-4 py-3 bg-red-500/10 flex items-center justify-between">
          <p className="text-sm text-red-300">Error al renderizar diagrama</p>
          <button
            onClick={renderDiagram}
            className="p-1 text-red-300 hover:text-red-200 transition-colors"
            title="Reintentar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        <details className="px-4 py-2 bg-black/20">
          <summary className="text-xs text-white/30 cursor-pointer hover:text-white/50">Ver código fuente</summary>
          <pre className="mt-2 text-xs text-white/50 font-mono overflow-x-auto whitespace-pre-wrap">{chart}</pre>
        </details>
      </div>
    )
  }

  if (!svg) return null

  return (
    <>
      {/* Inline diagram */}
      <div className={`my-3 rounded-xl overflow-hidden border border-white/10 group ${className}`}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
          <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Diagrama</span>
          <button
            onClick={() => setIsExpanded(true)}
            className="p-1 text-white/30 hover:text-white/60 transition-colors"
            title="Expandir diagrama"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SVG container */}
        <div
          ref={containerRef}
          className="p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Fullscreen overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900 rounded-2xl border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fullscreen toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
              <span className="text-sm text-white/60 font-medium">Diagrama expandido</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Cerrar"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Fullscreen SVG */}
            <div
              className="p-8 overflow-auto max-h-[calc(90vh-56px)] [&_svg]:mx-auto [&_svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      )}
    </>
  )
}
