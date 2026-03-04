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
      padding: 15,
      useMaxWidth: true,
      wrappingWidth: 180,
      nodeSpacing: 30,
      rankSpacing: 40,
    },
  })
  mermaidInitialized = true
}

/**
 * Sanitize Mermaid code to fix common syntax errors from AI-generated diagrams.
 * - Wraps node labels containing special chars in quotes
 * - Fixes parentheses inside square brackets (Mermaid interprets () as round nodes)
 * - Handles Spanish characters (¿, ñ, accents)
 */
function sanitizeMermaidCode(raw: string): string {
  let code = raw
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '    ')
    .trim()

  // Fix node labels in square brackets [] that contain parentheses
  // e.g., A[Descartar contacto (por ahora)] → A["Descartar contacto (por ahora)"]
  code = code.replace(/\[([^\]]*\([^\]]*\)[^\]]*)\]/g, '["$1"]')

  // Fix decision nodes in curly braces {} that contain special chars like ¿
  // e.g., C{¿Respuesta?} → C{"¿Respuesta?"}
  code = code.replace(/\{([^}]*[¿¡áéíóúñÁÉÍÓÚÑ][^}]*)\}/g, '{"$1"}')

  // Fix edge labels with special chars: -->|Sí| → -->|"Sí"|
  // Only quote if not already quoted and contains special chars
  code = code.replace(/-->\|([^|]*[¿¡áéíóúñÁÉÍÓÚÑ][^|]*)\|/g, (match, label) => {
    if (label.startsWith('"')) return match
    return `-->|"${label}"|`
  })

  // Avoid double-quoting: ["["text"]"] → ["text"]
  code = code.replace(/\[""/g, '["').replace(/""\]/g, '"]')
  code = code.replace(/\{""/g, '{"').replace(/""\}/g, '"}')

  // Break long labels into multiple lines using <br/> for better readability
  // Applies to labels inside [] and {} that are longer than 25 chars
  code = code.replace(/\["([^"]{26,})"\]/g, (match, label) => {
    return `["${wrapText(label, 25)}"]`
  })
  code = code.replace(/\[([^\]"]{26,})\]/g, (match, label) => {
    return `["${wrapText(label, 25)}"]`
  })
  code = code.replace(/\{"([^"]{26,})"\}/g, (match, label) => {
    return `{"${wrapText(label, 25)}"}`
  })
  code = code.replace(/\{([^}"]{26,})\}/g, (match, label) => {
    return `{"${wrapText(label, 25)}"}`
  })

  return code
}

/**
 * Wrap text at word boundaries using <br/> for Mermaid HTML labels.
 */
function wrapText(text: string, maxWidth: number): string {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if (currentLine.length + word.length + 1 > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = currentLine ? `${currentLine} ${word}` : word
    }
  }
  if (currentLine) lines.push(currentLine)

  return lines.join('<br/>')
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
      const cleanChart = sanitizeMermaidCode(chart)

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

  // Error state - show as formatted code block instead of ugly error
  if (error) {
    return (
      <div className={`my-3 rounded-xl overflow-hidden border border-white/10 ${className}`}>
        <div className="px-3 py-1.5 bg-white/5 flex items-center justify-between border-b border-white/5">
          <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Diagrama</span>
          <button
            onClick={renderDiagram}
            className="p-1 text-white/30 hover:text-white/60 transition-colors"
            title="Reintentar renderizado"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
        <pre className="p-4 bg-black/20 overflow-x-auto">
          <code className="text-xs font-mono text-white/60 leading-relaxed whitespace-pre-wrap">{chart}</code>
        </pre>
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
          className="p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 overflow-x-auto [&_svg]:mx-auto [&_svg]:max-w-full [&_svg]:h-auto [&_.nodeLabel]:whitespace-normal [&_.nodeLabel]:text-xs [&_.nodeLabel]:leading-tight"
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
