'use client'

import { MermaidDiagram } from './MermaidDiagram'

interface MessageContentProps {
  content: string
  className?: string
}

export function MessageContent({ content, className = '' }: MessageContentProps) {
  // Regular expression to detect mermaid code blocks
  const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/g

  // Split content by mermaid blocks
  const parts: Array<{ type: 'text' | 'mermaid'; content: string }> = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = mermaidRegex.exec(content)) !== null) {
    // Add text before the mermaid block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index),
      })
    }

    // Add the mermaid block
    parts.push({
      type: 'mermaid',
      content: match[1], // The captured group (mermaid code)
    })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text after last mermaid block
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex),
    })
  }

  // If no mermaid blocks found, return plain text
  if (parts.length === 0) {
    return (
      <p className={`text-sm whitespace-pre-wrap leading-relaxed ${className}`}>
        {content}
      </p>
    )
  }

  // Render parts with mermaid diagrams
  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <p
              key={index}
              className="text-sm whitespace-pre-wrap leading-relaxed"
            >
              {part.content}
            </p>
          )
        }

        // Render mermaid diagram
        return (
          <MermaidDiagram
            key={index}
            chart={part.content}
            className="my-3"
          />
        )
      })}
    </div>
  )
}
