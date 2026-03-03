'use client'

import { useState, useEffect } from 'react'
import {
  Settings,
  Shield,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Server,
  CreditCard,
  Database,
  Globe,
  X,
} from 'lucide-react'

interface AdminEmail {
  id: string
  email: string
  created_at: string
}

interface AdminUser {
  id: string
  user_id: string
  role: string
  email: string
  created_at: string
}

interface SystemHealth {
  totalUsers: number
  stripeConfigured: boolean
  stripeWebhookConfigured: boolean
  supabaseConnected: boolean
  appUrl: string
}

export default function AdminSettingsPage() {
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [system, setSystem] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (res.ok) {
        setAdminEmails(data.adminEmails)
        setAdminUsers(data.adminUsers)
        setSystem(data.system)
      }
    } catch {
      setError('Error al cargar configuración')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSettings() }, [])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const addAdminEmail = async () => {
    if (!newEmail.trim()) return
    setAdding(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_admin_email', email: newEmail }),
      })
      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message)
        setNewEmail('')
        fetchSettings()
      } else {
        setError(data.error)
      }
    } catch {
      setError('Error al agregar email')
    } finally {
      setAdding(false)
    }
  }

  const removeAdminEmail = async (email: string) => {
    if (!confirm(`¿Eliminar ${email} de la lista de admins?`)) return

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove_admin_email', email }),
      })
      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message)
        fetchSettings()
      } else {
        setError(data.error)
      }
    } catch {
      setError('Error al eliminar email')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-purple-500" />
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {error}
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* System Health */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Server className="w-5 h-5" />
          Estado del Sistema
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard
            icon={<Database className="w-5 h-5" />}
            label="Supabase"
            ok={system?.supabaseConnected ?? false}
          />
          <StatusCard
            icon={<CreditCard className="w-5 h-5" />}
            label="Stripe API"
            ok={system?.stripeConfigured ?? false}
          />
          <StatusCard
            icon={<CreditCard className="w-5 h-5" />}
            label="Stripe Webhook"
            ok={system?.stripeWebhookConfigured ?? false}
          />
          <StatusCard
            icon={<Globe className="w-5 h-5" />}
            label="App URL"
            ok={!!system?.appUrl && system.appUrl !== 'Not configured'}
            detail={system?.appUrl}
          />
        </div>
        {system && (
          <p className="mt-4 text-sm text-gray-500">
            Total de usuarios registrados: <span className="font-medium text-gray-900">{system.totalUsers}</span>
          </p>
        )}
      </div>

      {/* Admin Users */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Administradores Activos
        </h2>
        {adminUsers.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay administradores configurados</p>
        ) : (
          <div className="space-y-3">
            {adminUsers.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    admin.role === 'super_admin' ? 'bg-purple-600' : 'bg-gray-500'
                  }`}>
                    {admin.email[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{admin.email}</p>
                    <p className="text-xs text-gray-500">
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'} · Desde {new Date(admin.created_at).toLocaleDateString('es')}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  admin.role === 'super_admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Emails Whitelist */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Lista de Emails Admin
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Los usuarios que se registren con estos emails serán promovidos automáticamente a Super Admin.
        </p>

        {/* Add Email */}
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="nuevo-admin@email.com"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            onKeyDown={(e) => e.key === 'Enter' && addAdminEmail()}
          />
          <button
            onClick={addAdminEmail}
            disabled={adding || !newEmail.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Agregar
          </button>
        </div>

        {/* Email List */}
        {adminEmails.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay emails en la lista</p>
        ) : (
          <div className="space-y-2">
            {adminEmails.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.email}</p>
                  <p className="text-xs text-gray-500">Agregado: {new Date(item.created_at).toLocaleDateString('es')}</p>
                </div>
                <button
                  onClick={() => removeAdminEmail(item.email)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusCard({
  icon,
  label,
  ok,
  detail,
}: {
  icon: React.ReactNode
  label: string
  ok: boolean
  detail?: string
}) {
  return (
    <div className={`p-4 rounded-lg border ${ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={ok ? 'text-green-600' : 'text-red-600'}>{icon}</span>
        <span className="text-sm font-medium text-gray-900">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {ok ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
        <span className={`text-xs ${ok ? 'text-green-600' : 'text-red-600'}`}>
          {ok ? 'Conectado' : 'No configurado'}
        </span>
      </div>
      {detail && <p className="text-xs text-gray-500 mt-1 truncate">{detail}</p>}
    </div>
  )
}
