import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { PLAN_LIMITS } from '@/types/hanna'

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'text/plain', 'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'text/csv': 'csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
}

export async function POST(request: Request) {
  try {
    // Authenticate user
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Get user plan
    const { data: profile } = await (supabaseAdmin
      .from('profiles') as ReturnType<typeof supabaseAdmin.from>)
      .select('plan')
      .eq('id', user.id)
      .single()

    const profileData = profile as { plan: string } | null
    const plan = (profileData?.plan || 'free') as keyof typeof PLAN_LIMITS
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free

    if (!limits.file_upload) {
      return NextResponse.json(
        { error: 'Tu plan no incluye subida de archivos. Actualiza a Pro para desbloquear esta función.' },
        { status: 403 }
      )
    }

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const sessionId = formData.get('sessionId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de archivo no soportado: ${file.type}. Formatos permitidos: imágenes, PDF, TXT, CSV, DOCX, XLSX.` },
        { status: 400 }
      )
    }

    // Validate file size
    const maxSizeBytes = limits.file_max_size_mb * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: `Archivo muy grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: ${limits.file_max_size_mb}MB.` },
        { status: 400 }
      )
    }

    // Check daily upload count
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabaseAdmin
      .from('hanna_file_uploads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00Z`)

    if ((count || 0) >= limits.file_limit) {
      return NextResponse.json(
        { error: `Has alcanzado tu límite diario de ${limits.file_limit} archivos.` },
        { status: 429 }
      )
    }

    // Upload to Supabase Storage
    const ext = MIME_TO_EXT[file.type] || 'bin'
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('hanna-uploads')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('hanna-uploads')
      .getPublicUrl(fileName)

    // Record upload in database
    await (supabaseAdmin.from('hanna_file_uploads') as ReturnType<typeof supabaseAdmin.from>).insert({
      user_id: user.id,
      session_id: sessionId,
      file_name: file.name,
      file_path: fileName,
      file_url: urlData.publicUrl,
      mime_type: file.type,
      file_size: file.size,
    })

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        url: urlData.publicUrl,
        mimeType: file.type,
        size: file.size,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Error al procesar el archivo' }, { status: 500 })
  }
}
