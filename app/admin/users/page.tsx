'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Plus,
  Search,
  Shield,
  ShieldOff,
  Key,
  Trash2,
  Edit,
  Crown,
  Copy,
  Check,
  X,
  Loader2,
  RefreshCw,
  ChevronDown,
} from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string | null
  plan: 'free' | 'pro' | 'business'
  subscription_status: string | null
  is_admin: boolean
  messages_today: number
  created_at: string
  avatar_url: string | null
}

interface UsersResponse {
  success: boolean
  users: User[]
  total: number
  page: number
  perPage: number
  error?: string
}

function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
  let result = ''
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length]
  }
  return result
}

function UserInitials({ name, email }: { name: string | null; email: string }) {
  const display = name || email
  const initials = display
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || '')
    .join('')

  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
      {initials}
    </div>
  )
}

function PlanBadge({ plan }: { plan: 'free' | 'pro' | 'business' }) {
  if (plan === 'business') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
        <Crown className="w-3 h-3" />
        Business
      </span>
    )
  }
  if (plan === 'pro') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <Crown className="w-3 h-3" />
        Pro
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      Free
    </span>
  )
}

function ActionsDropdown({
  user,
  onEditPlan,
  onResetPassword,
  onToggleAdmin,
  onDelete,
}: {
  user: User
  onEditPlan: () => void
  onResetPassword: () => void
  onToggleAdmin: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 text-sm"
      >
        Acciones
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-48">
            <button
              onClick={() => { onEditPlan(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar Plan
            </button>
            <button
              onClick={() => { onResetPassword(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Key className="w-4 h-4" />
              Reset Password
            </button>
            <button
              onClick={() => { onToggleAdmin(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {user.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
              {user.is_admin ? 'Quitar Admin' : 'Hacer Admin'}
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={() => { onDelete(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Usuario
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'pro'>('all')
  const [page, setPage] = useState(1)
  const perPage = 20

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editPlanUser, setEditPlanUser] = useState<User | null>(null)
  const [resetPwUser, setResetPwUser] = useState<User | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'toggle_admin'
    user: User
  } | null>(null)

  // Action loading
  const [actionLoading, setActionLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: String(page),
        perPage: String(perPage),
      })
      if (search) params.set('search', search)
      if (planFilter !== 'all') params.set('plan', planFilter)

      const res = await fetch(`/api/admin/users?${params}`)
      const data: UsersResponse = await res.json()

      if (data.success) {
        setUsers(data.users)
        setTotal(data.total)
      } else {
        setError(data.error || 'Error al cargar usuarios')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [page, search, planFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 4000)
      return () => clearTimeout(t)
    }
  }, [successMsg])

  function showSuccess(msg: string) {
    setSuccessMsg(msg)
  }

  const totalPages = Math.ceil(total / perPage)

  // ── Create User Modal ──
  function CreateUserModal() {
    const [form, setForm] = useState({
      email: '',
      full_name: '',
      password: generatePassword(),
      plan: 'free' as 'free' | 'pro' | 'business',
    })
    const [saving, setSaving] = useState(false)
    const [err, setErr] = useState<string | null>(null)

    async function handleCreate(e: React.FormEvent) {
      e.preventDefault()
      setErr(null)
      setSaving(true)
      try {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          showSuccess(`Usuario ${form.email} creado exitosamente`)
          setShowCreateModal(false)
          fetchUsers()
        } else {
          setErr(data.error || 'Error al crear usuario')
        }
      } catch {
        setErr('Error de conexion')
      } finally {
        setSaving(false)
      }
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Crear Usuario</h3>
            <button onClick={() => setShowCreateModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {err && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {err}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="usuario@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, password: generatePassword() })}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Generar password"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, plan: 'free' })}
                  className={`p-3 border-2 rounded-lg transition-all text-center ${
                    form.plan === 'free'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium">Free</p>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, plan: 'pro' })}
                  className={`p-3 border-2 rounded-lg transition-all text-center ${
                    form.plan === 'pro'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium flex items-center justify-center gap-1">
                    <Crown className="w-4 h-4" /> Pro
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, plan: 'business' })}
                  className={`p-3 border-2 rounded-lg transition-all text-center ${
                    form.plan === 'business'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium flex items-center justify-center gap-1">
                    <Crown className="w-4 h-4" /> Business
                  </p>
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creando...</>
                ) : (
                  <><Check className="w-4 h-4" /> Crear Usuario</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ── Edit Plan Modal ──
  function EditPlanModal() {
    const user = editPlanUser!
    const [plan, setPlan] = useState<'free' | 'pro' | 'business'>(user.plan)
    const [saving, setSaving] = useState(false)

    async function handleSave() {
      setSaving(true)
      try {
        const res = await fetch(`/api/admin/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          showSuccess(`Plan de ${user.email} actualizado a ${plan}`)
          setEditPlanUser(null)
          fetchUsers()
        }
      } catch {
        // silent
      } finally {
        setSaving(false)
      }
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setEditPlanUser(null)}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-200 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Editar Plan</h3>
            <button onClick={() => setEditPlanUser(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">{user.email}</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setPlan('free')}
              className={`p-3 border-2 rounded-lg transition-all text-center ${
                plan === 'free'
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setPlan('pro')}
              className={`p-3 border-2 rounded-lg transition-all text-center ${
                plan === 'pro'
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center justify-center gap-1">
                <Crown className="w-4 h-4" /> Pro
              </span>
            </button>
            <button
              onClick={() => setPlan('business')}
              className={`p-3 border-2 rounded-lg transition-all text-center ${
                plan === 'business'
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center justify-center gap-1">
                <Crown className="w-4 h-4" /> Business
              </span>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setEditPlanUser(null)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || plan === user.plan}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Guardar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Reset Password Modal ──
  function ResetPasswordModal() {
    const user = resetPwUser!
    const [newPw, setNewPw] = useState(generatePassword())
    const [copied, setCopied] = useState(false)
    const [saving, setSaving] = useState(false)
    const [done, setDone] = useState(false)

    async function handleReset() {
      setSaving(true)
      try {
        const res = await fetch(`/api/admin/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: newPw }),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setDone(true)
          showSuccess(`Password de ${user.email} actualizado`)
        }
      } catch {
        // silent
      } finally {
        setSaving(false)
      }
    }

    function handleCopy() {
      navigator.clipboard.writeText(newPw)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setResetPwUser(null)}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-200 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
            <button onClick={() => setResetPwUser(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">{user.email}</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva password</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={done}
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="Copiar"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
              {!done && (
                <button
                  type="button"
                  onClick={() => setNewPw(generatePassword())}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Generar nueva"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setResetPwUser(null)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {done ? 'Cerrar' : 'Cancelar'}
            </button>
            {!done && (
              <button
                onClick={handleReset}
                disabled={saving || !newPw}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                Aplicar
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Confirmation Dialog ──
  function ConfirmDialog() {
    const { type, user } = confirmAction!
    const title = type === 'delete' ? 'Eliminar Usuario' : user.is_admin ? 'Quitar Admin' : 'Hacer Admin'
    const message = type === 'delete'
      ? `Estas seguro de eliminar a "${user.email}"? Esta accion no se puede deshacer.`
      : user.is_admin
        ? `Quitar permisos de administrador a "${user.email}"?`
        : `Dar permisos de administrador a "${user.email}"?`
    const confirmLabel = type === 'delete' ? 'Eliminar' : 'Confirmar'
    const isDestructive = type === 'delete'

    async function handleConfirm() {
      setActionLoading(true)
      try {
        if (type === 'delete') {
          const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
          const data = await res.json()
          if (res.ok && data.success) {
            showSuccess(`Usuario ${user.email} eliminado`)
            fetchUsers()
          }
        } else {
          const res = await fetch(`/api/admin/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_admin: !user.is_admin }),
          })
          const data = await res.json()
          if (res.ok && data.success) {
            showSuccess(`${user.email} ${user.is_admin ? 'ya no es admin' : 'ahora es admin'}`)
            fetchUsers()
          }
        }
      } catch {
        // silent
      } finally {
        setActionLoading(false)
        setConfirmAction(null)
      }
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setConfirmAction(null)}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-gray-200 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmAction(null)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={actionLoading}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                isDestructive
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main Render ──
  return (
    <div className="space-y-6">
      {/* Success / Error Messages */}
      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-green-500 hover:text-green-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion de Usuarios</h2>
          <p className="text-gray-600 mt-1">Administra usuarios de Hanna SaaS</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Crear Usuario
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por email o nombre..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => { setPlanFilter(e.target.value as 'all' | 'free' | 'pro'); setPage(1) }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
        >
          <option value="all">Todos los planes</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
        <button
          onClick={fetchUsers}
          className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Actualizar"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Cargando usuarios...</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No se encontraron usuarios</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Mensajes Hoy</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <UserInitials name={user.full_name} email={user.email} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.full_name || 'Sin nombre'}
                            </p>
                            {user.is_admin && (
                              <span className="inline-flex items-center gap-1 text-xs text-purple-600">
                                <Shield className="w-3 h-3" /> Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3"><PlanBadge plan={user.plan} /></td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${
                          user.subscription_status === 'active'
                            ? 'text-green-600'
                            : user.subscription_status === 'canceled'
                              ? 'text-red-500'
                              : 'text-gray-500'
                        }`}>
                          {user.subscription_status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 tabular-nums">{user.messages_today}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ActionsDropdown
                          user={user}
                          onEditPlan={() => setEditPlanUser(user)}
                          onResetPassword={() => setResetPwUser(user)}
                          onToggleAdmin={() => setConfirmAction({ type: 'toggle_admin', user })}
                          onDelete={() => setConfirmAction({ type: 'delete', user })}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Mostrando {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} de {total} usuarios
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 transition-colors"
                >
                  Anterior
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showCreateModal && <CreateUserModal />}
      {editPlanUser && <EditPlanModal />}
      {resetPwUser && <ResetPasswordModal />}
      {confirmAction && <ConfirmDialog />}
    </div>
  )
}
