'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ClipboardList,
  Loader2,
  RefreshCw,
  User,
  Shield,
  Ticket,
  Settings,
  Trash2,
  Plus,
  Edit,
} from 'lucide-react'

interface AuditLog {
  id: string
  admin_email: string
  action: string
  target_type: string
  target_id: string | null
  details: Record<string, unknown>
  ip_address: string | null
  created_at: string
}

const ACTION_ICONS: Record<string, typeof User> = {
  create_user: Plus,
  update_user: Edit,
  delete_user: Trash2,
  create_coupon: Plus,
  update_coupon: Edit,
  deactivate_coupon: Trash2,
  add_admin_email: Shield,
  remove_admin_email: Trash2,
}

const ACTION_COLORS: Record<string, string> = {
  create_user: 'text-green-600 bg-green-50',
  update_user: 'text-blue-600 bg-blue-50',
  delete_user: 'text-red-600 bg-red-50',
  create_coupon: 'text-purple-600 bg-purple-50',
  update_coupon: 'text-blue-600 bg-blue-50',
  deactivate_coupon: 'text-orange-600 bg-orange-50',
  add_admin_email: 'text-green-600 bg-green-50',
  remove_admin_email: 'text-red-600 bg-red-50',
}

const ACTION_LABELS: Record<string, string> = {
  create_user: 'Crear usuario',
  update_user: 'Actualizar usuario',
  delete_user: 'Eliminar usuario',
  create_coupon: 'Crear cupon',
  update_coupon: 'Actualizar cupon',
  deactivate_coupon: 'Desactivar cupon',
  add_admin_email: 'Agregar email admin',
  remove_admin_email: 'Remover email admin',
}

const TARGET_ICONS: Record<string, typeof User> = {
  user: User,
  coupon: Ticket,
  admin_email: Settings,
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [actionFilter, setActionFilter] = useState('')

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), perPage: '30' })
      if (actionFilter) params.set('action', actionFilter)

      const res = await fetch(`/api/admin/audit?${params}`)
      const data = await res.json()

      if (data.success) {
        setLogs(data.logs)
        setTotalPages(data.pagination.totalPages)
        setTotal(data.pagination.total)
      } else {
        setError(data.error || 'Error al cargar logs')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [page, actionFilter])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Log</h2>
          <p className="text-gray-600 mt-1">Historial de acciones administrativas ({total} registros)</p>
        </div>
        <button
          onClick={fetchLogs}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Actualizar"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
        >
          <option value="">Todas las acciones</option>
          <option value="create_user">Crear usuario</option>
          <option value="update_user">Actualizar usuario</option>
          <option value="delete_user">Eliminar usuario</option>
          <option value="create_coupon">Crear cupon</option>
          <option value="update_coupon">Actualizar cupon</option>
          <option value="deactivate_coupon">Desactivar cupon</option>
          <option value="add_admin_email">Agregar email admin</option>
          <option value="remove_admin_email">Remover email admin</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button onClick={fetchLogs} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Reintentar
          </button>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay registros de auditoría</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Accion</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => {
                    const ActionIcon = ACTION_ICONS[log.action] || ClipboardList
                    const TargetIcon = TARGET_ICONS[log.target_type] || ClipboardList
                    const colorClass = ACTION_COLORS[log.action] || 'text-gray-600 bg-gray-50'

                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{log.admin_email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                            <ActionIcon className="w-3.5 h-3.5" />
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                            <TargetIcon className="w-4 h-4 text-gray-400" />
                            {log.target_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate" title={JSON.stringify(log.details)}>
                          {formatDetails(log)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Pagina {page} de {totalPages} ({total} registros)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-gray-700 transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-gray-700 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function formatDetails(log: AuditLog): string {
  const d = log.details
  if (!d || Object.keys(d).length === 0) return '-'

  if (d.email) return `Email: ${d.email}`
  if (d.deleted_email) return `Email: ${d.deleted_email}`
  if (d.code) return `Codigo: ${d.code}`
  if (d.coupon_code) return `Cupon: ${d.coupon_code}`
  if (d.updated_fields) return `Campos: ${(d.updated_fields as string[]).join(', ')}`
  if (d.plan) return `Plan: ${d.plan}`

  return JSON.stringify(d).slice(0, 80)
}
