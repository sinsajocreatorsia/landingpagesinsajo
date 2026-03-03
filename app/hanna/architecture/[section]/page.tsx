'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import {
  ArrowLeft, Save, Loader2, Plus, X, Sparkles, CheckCircle2,
} from 'lucide-react'
import { SECTION_LABELS, SECTION_ORDER, type ArchitectureSection } from '@/types/marketing-architecture'
import { SECTION_FIELDS, type FieldConfig } from '@/lib/hanna/architecture-fields'

export default function SectionEditorPage() {
  const router = useRouter()
  const params = useParams()
  const section = params.section as ArchitectureSection

  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [activeGroup, setActiveGroup] = useState<string>('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fieldConfig = SECTION_FIELDS[section]

  useEffect(() => {
    if (!fieldConfig) {
      router.push('/hanna/architecture')
      return
    }
    setActiveGroup(fieldConfig.groups[0]?.id || '')

    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/hanna/login'); return }

      try {
        const res = await fetch('/api/hanna/architecture')
        const data = await res.json()
        if (data.success && data.architecture?.[section]) {
          setFormData(data.architecture[section])
        }
      } catch (error) {
        console.error('Error loading section:', error)
      }
      setLoading(false)
    }
    loadData()
  }, [section, supabase, router, fieldConfig])

  // Get nested value from formData using dot notation
  const getValue = useCallback((key: string): unknown => {
    const parts = key.split('.')
    let current: unknown = formData
    for (const part of parts) {
      if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[part]
      } else {
        return undefined
      }
    }
    return current
  }, [formData])

  // Set nested value in formData using dot notation
  const setValue = useCallback((key: string, value: unknown) => {
    setFormData(prev => {
      const parts = key.split('.')
      const newData = JSON.parse(JSON.stringify(prev))

      if (parts.length === 1) {
        newData[parts[0]] = value
      } else {
        if (!newData[parts[0]]) newData[parts[0]] = {}
        newData[parts[0]][parts[1]] = value
      }
      return newData
    })
    setSaveStatus('idle')
  }, [])

  // Save section data
  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/hanna/architecture', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: formData }),
      })
      const data = await res.json()
      if (data.success) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch {
      setSaveStatus('error')
    }
    setSaving(false)
  }, [section, formData])

  if (!fieldConfig) return null

  // Navigation
  const currentIndex = SECTION_ORDER.indexOf(section)
  const prevSection = currentIndex > 0 ? SECTION_ORDER[currentIndex - 1] : null
  const nextSection = currentIndex < SECTION_ORDER.length - 1 ? SECTION_ORDER[currentIndex + 1] : null

  const activeFields = fieldConfig.fields.filter(f => f.group === activeGroup)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0118] to-[#1a0a2e] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/60 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] to-[#1a0a2e]">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/hanna/architecture" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">{fieldConfig.title}</h1>
            <p className="text-xs text-white/50 truncate">{fieldConfig.description}</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              saveStatus === 'saved'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : saveStatus === 'error'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-[#C7517E] text-white hover:bg-[#d4608d]'
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> :
             saveStatus === 'saved' ? <CheckCircle2 className="w-4 h-4" /> :
             <Save className="w-4 h-4" />}
            {saving ? 'Guardando...' : saveStatus === 'saved' ? 'Guardado' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Group tabs */}
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {fieldConfig.groups.map(group => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeGroup === group.id
                  ? 'bg-[#C7517E]/20 text-[#C7517E] border border-[#C7517E]/30'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 border border-transparent'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="max-w-3xl mx-auto px-4 pb-8 space-y-4">
        {activeFields.map(field => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={getValue(field.key)}
            onChange={(val) => setValue(field.key, val)}
          />
        ))}

        {activeFields.length === 0 && (
          <div className="text-center py-12 text-white/40">
            No hay campos en esta seccion.
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="border-t border-white/10 bg-white/5 backdrop-blur-md sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          {prevSection ? (
            <Link
              href={`/hanna/architecture/${prevSection}`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {SECTION_LABELS[prevSection]}
            </Link>
          ) : <div />}
          {nextSection ? (
            <Link
              href={`/hanna/architecture/${nextSection}`}
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              {SECTION_LABELS[nextSection]}
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          ) : (
            <Link
              href="/hanna/architecture"
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#C7517E] text-white rounded-lg hover:bg-[#d4608d] transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalizar
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Field Renderers ----

function FieldRenderer({ field, value, onChange }: {
  field: FieldConfig
  value: unknown
  onChange: (val: unknown) => void
}) {
  if (field.type === 'text') {
    return <TextFieldRenderer field={field} value={value as string} onChange={onChange} />
  }
  if (field.type === 'textarea') {
    return <TextAreaFieldRenderer field={field} value={value as string} onChange={onChange} />
  }
  if (field.type === 'list') {
    return <ListFieldRenderer field={field} value={value as string[]} onChange={onChange} />
  }
  if (field.type === 'object-list') {
    return <ObjectListFieldRenderer field={field} value={value as Record<string, string>[]} onChange={onChange} />
  }
  return null
}

function TextFieldRenderer({ field, value, onChange }: {
  field: FieldConfig; value: string | undefined; onChange: (val: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-white/80">{field.label}</label>
      {field.hint && <p className="text-xs text-white/40">{field.hint}</p>}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#C7517E]/50 focus:ring-1 focus:ring-[#C7517E]/30"
      />
    </div>
  )
}

function TextAreaFieldRenderer({ field, value, onChange }: {
  field: FieldConfig; value: string | undefined; onChange: (val: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-white/80">{field.label}</label>
      {field.hint && <p className="text-xs text-white/40">{field.hint}</p>}
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#C7517E]/50 focus:ring-1 focus:ring-[#C7517E]/30 resize-none"
      />
    </div>
  )
}

function ListFieldRenderer({ field, value, onChange }: {
  field: FieldConfig; value: string[] | undefined; onChange: (val: string[]) => void
}) {
  const items = value || []
  const [inputVal, setInputVal] = useState('')

  const addItem = () => {
    if (!inputVal.trim()) return
    onChange([...items, inputVal.trim()])
    setInputVal('')
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-white/80">{field.label}</label>
      {field.hint && <p className="text-xs text-white/40">{field.hint}</p>}

      {/* Existing items */}
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-sm text-white">
            {item}
            <button onClick={() => removeItem(i)} className="p-0.5 hover:bg-white/20 rounded-full">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Add new */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem() } }}
          placeholder={field.placeholder}
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#C7517E]/50 text-sm"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white/60 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function ObjectListFieldRenderer({ field, value, onChange }: {
  field: FieldConfig
  value: Record<string, string>[] | undefined
  onChange: (val: Record<string, string>[]) => void
}) {
  const items = value || []
  const objFields = field.objectFields || []

  const addItem = () => {
    const empty: Record<string, string> = {}
    objFields.forEach(f => { empty[f.key] = '' })
    onChange([...items, empty])
  }

  const updateItem = (index: number, key: string, val: string) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [key]: val }
    onChange(updated)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-white/80">{field.label}</label>
      {field.hint && <p className="text-xs text-white/40">{field.hint}</p>}

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2 relative">
            <button
              onClick={() => removeItem(i)}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded text-white/30 hover:text-white/60"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {objFields.map(of => (
              <input
                key={of.key}
                type="text"
                value={item[of.key] || ''}
                onChange={(e) => updateItem(i, of.key, e.target.value)}
                placeholder={`${of.label}: ${of.placeholder}`}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C7517E]/50"
              />
            ))}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-lg text-sm text-white/50 hover:text-white/70 transition-colors w-full justify-center"
      >
        <Plus className="w-4 h-4" />
        Agregar
      </button>
    </div>
  )
}
