'use client'

import React, { useMemo } from 'react'
import { MermaidDiagram } from './MermaidDiagram'

interface MessageContentProps {
  content: string
  className?: string
}

type ContentPart =
  | { type: 'text'; content: string }
  | { type: 'mermaid'; content: string }
  | { type: 'code'; language: string; content: string }

/**
 * Splits raw message text into typed parts: plain text, mermaid diagrams, and code blocks.
 */
function parseContent(raw: string): ContentPart[] {
  // Match both mermaid and generic fenced code blocks
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g
  const parts: ContentPart[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: raw.substring(lastIndex, match.index) })
    }

    const language = match[1].toLowerCase()
    const code = match[2]

    if (language === 'mermaid') {
      parts.push({ type: 'mermaid', content: code })
    } else {
      parts.push({ type: 'code', language: language || 'text', content: code })
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < raw.length) {
    parts.push({ type: 'text', content: raw.substring(lastIndex) })
  }

  if (parts.length === 0) {
    parts.push({ type: 'text', content: raw })
  }

  return parts
}

/**
 * Renders inline markdown: bold, italic, inline code, links.
 */
function renderInlineMarkdown(text: string): (string | React.JSX.Element)[] {
  const elements: (string | React.JSX.Element)[] = []
  // Match: **bold**, *italic*, `code`, [text](url)
  const inlineRegex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g
  let lastIdx = 0
  let m: RegExpExecArray | null
  let keyIdx = 0

  while ((m = inlineRegex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      elements.push(text.substring(lastIdx, m.index))
    }

    if (m[1]) {
      // **bold**
      elements.push(<strong key={`b${keyIdx++}`} className="font-semibold">{m[2]}</strong>)
    } else if (m[3]) {
      // *italic*
      elements.push(<em key={`i${keyIdx++}`}>{m[4]}</em>)
    } else if (m[5]) {
      // `code`
      elements.push(
        <code key={`c${keyIdx++}`} className="px-1.5 py-0.5 bg-white/10 rounded text-[#2CB6D7] text-xs font-mono">
          {m[6]}
        </code>
      )
    } else if (m[7]) {
      // [text](url)
      elements.push(
        <a key={`a${keyIdx++}`} href={m[9]} target="_blank" rel="noopener noreferrer" className="text-[#2CB6D7] underline hover:text-[#36B3AE] transition-colors">
          {m[8]}
        </a>
      )
    }

    lastIdx = m.index + m[0].length
  }

  if (lastIdx < text.length) {
    elements.push(text.substring(lastIdx))
  }

  return elements.length > 0 ? elements : [text]
}

/**
 * Renders a block of plain text with markdown formatting (headings, lists, paragraphs).
 */
function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n')
  const elements: React.JSX.Element[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) {
      i++
      continue
    }

    // Headings: ### Heading
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const content = headingMatch[2]
      const sizes: Record<number, string> = {
        1: 'text-lg font-bold mt-3 mb-1',
        2: 'text-base font-bold mt-2.5 mb-1',
        3: 'text-sm font-semibold mt-2 mb-0.5',
        4: 'text-sm font-medium mt-1.5 mb-0.5',
      }
      elements.push(
        <p key={i} className={sizes[level] || sizes[3]}>
          {renderInlineMarkdown(content)}
        </p>
      )
      i++
      continue
    }

    // Unordered list items: - item or * item
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems: { indent: number; content: string }[] = []
      while (i < lines.length) {
        const li = lines[i]
        const liMatch = li.match(/^(\s*)([-*])\s+(.+)$/)
        if (!liMatch) break
        listItems.push({ indent: liMatch[1].length, content: liMatch[3] })
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-1 space-y-0.5">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed" style={{ paddingLeft: `${Math.min(item.indent / 2, 3) * 12}px` }}>
              <span className="text-[#2CB6D7] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-current" />
              <span>{renderInlineMarkdown(item.content)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Ordered list items: 1. item
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const listItems: { num: string; content: string }[] = []
      while (i < lines.length) {
        const li = lines[i].trim()
        const liMatch = li.match(/^(\d+)[.)]\s+(.+)$/)
        if (!liMatch) break
        listItems.push({ num: liMatch[1], content: liMatch[2] })
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-1 space-y-0.5">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className="text-[#2CB6D7] font-semibold flex-shrink-0 min-w-[1.25rem] text-right">{item.num}.</span>
              <span>{renderInlineMarkdown(item.content)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Horizontal rule: ---
    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      elements.push(<hr key={i} className="my-3 border-white/10" />)
      i++
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-sm leading-relaxed my-0.5">
        {renderInlineMarkdown(trimmed)}
      </p>
    )
    i++
  }

  return <>{elements}</>
}

export function MessageContent({ content, className = '' }: MessageContentProps) {
  const parts = useMemo(() => parseContent(content), [content])

  return (
    <div className={`space-y-1 ${className}`}>
      {parts.map((part, index) => {
        if (part.type === 'mermaid') {
          return <MermaidDiagram key={index} chart={part.content} className="my-3" />
        }

        if (part.type === 'code') {
          return (
            <div key={index} className="my-2 rounded-lg overflow-hidden border border-white/10">
              {part.language !== 'text' && (
                <div className="px-3 py-1 bg-white/5 text-[10px] text-white/40 font-mono uppercase tracking-wider">
                  {part.language}
                </div>
              )}
              <pre className="p-3 bg-black/20 overflow-x-auto">
                <code className="text-xs font-mono text-white/80 leading-relaxed">
                  {part.content}
                </code>
              </pre>
            </div>
          )
        }

        return <MarkdownText key={index} text={part.content} />
      })}
    </div>
  )
}
