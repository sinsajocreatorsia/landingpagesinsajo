'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ticket,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Calendar,
  Users,
  Percent,
  DollarSign,
} from 'lucide-react'

interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_uses: number | null
  times_used: number
  valid_from: string
  valid_until: string | null
  is_active: boolean
  applicable_plans: string[]
  created_at: string
}

function CouponCard({ coupon, onEdit, onDelete }: { coupon: Coupon; onEdit: () => void; onDelete: () => void }) {
  const isExpired = coupon.valid_until && new Date(coupon.valid_until) < new Date()
  const isMaxedOut = coupon.max_uses && coupon.times_used >= coupon.max_uses

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white rounded-xl border p-6 ${
        !coupon.is_active || isExpired || isMaxedOut ? 'opacity-60 border-gray-300' : 'border-purple-200'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <code className="text-2xl font-bold text-purple-600">{coupon.code}</code>
            {coupon.is_active && !isExpired && !isMaxedOut && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Activo
              </span>
            )}
            {isExpired && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                Expirado
              </span>
            )}
            {isMaxedOut && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                Máximo Alcanzado
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Creado: {new Date(coupon.created_at).toLocaleDateString('es-ES')}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          {coupon.discount_type === 'percentage' ? (
            <Percent className="w-4 h-4 text-purple-600" />
          ) : (
            <DollarSign className="w-4 h-4 text-purple-600" />
          )}
          <div>
            <p className="text-xs text-gray-500">Descuento</p>
            <p className="text-sm font-semibold">
              {coupon.discount_type === 'percentage'
                ? `${coupon.discount_value}%`
                : `$${coupon.discount_value}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-xs text-gray-500">Uso</p>
            <p className="text-sm font-semibold">
              {coupon.times_used} {coupon.max_uses ? `/ ${coupon.max_uses}` : '/ ∞'}
            </p>
          </div>
        </div>

        {coupon.valid_until && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-xs text-gray-500">Expira</p>
              <p className="text-sm font-semibold">
                {new Date(coupon.valid_until).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Planes</p>
            <p className="text-sm font-semibold capitalize">{coupon.applicable_plans.join(', ')}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CouponForm({ coupon, onClose, onSave }: { coupon?: Coupon; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    discount_type: coupon?.discount_type || 'percentage' as 'percentage' | 'fixed',
    discount_value: coupon?.discount_value || 0,
    max_uses: coupon?.max_uses || null as number | null,
    valid_until: coupon?.valid_until
      ? new Date(coupon.valid_until).toISOString().split('T')[0]
      : '',
    applicable_plans: coupon?.applicable_plans || ['pro'],
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const endpoint = coupon ? `/api/admin/coupons/${coupon.id}` : '/api/admin/coupons'
      const method = coupon ? 'PATCH' : 'POST'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          code: formData.code.toUpperCase(),
          valid_until: formData.valid_until || null,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        onSave()
        onClose()
      } else {
        setError(data.error || 'Error al guardar cupón')
      }
    } catch (err) {
      console.error('Error saving coupon:', err)
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {coupon ? 'Editar Cupón' : 'Crear Nuevo Cupón'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código del Cupón
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
              placeholder="DESCUENTO50"
              disabled={!!coupon}
            />
            <p className="mt-1 text-xs text-gray-500">Se convertirá a mayúsculas automáticamente</p>
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Descuento
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, discount_type: 'percentage' })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.discount_type === 'percentage'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Percent className="w-6 h-6 mx-auto mb-2" />
                <p className="font-medium">Porcentaje</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, discount_type: 'fixed' })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.discount_type === 'fixed'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <DollarSign className="w-6 h-6 mx-auto mb-2" />
                <p className="font-medium">Monto Fijo</p>
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor del Descuento
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="0"
                max={formData.discount_type === 'percentage' ? 100 : undefined}
                step="0.01"
                value={formData.discount_value}
                onChange={(e) =>
                  setFormData({ ...formData, discount_value: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={formData.discount_type === 'percentage' ? '50' : '10.00'}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                {formData.discount_type === 'percentage' ? '%' : '$'}
              </span>
            </div>
            {formData.discount_type === 'percentage' && (
              <p className="mt-1 text-xs text-gray-500">Máximo 100%</p>
            )}
          </div>

          {/* Max Uses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usos Máximos (Opcional)
            </label>
            <input
              type="number"
              min="1"
              value={formData.max_uses || ''}
              onChange={(e) =>
                setFormData({ ...formData, max_uses: e.target.value ? parseInt(e.target.value) : null })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ilimitado"
            />
            <p className="mt-1 text-xs text-gray-500">Dejar vacío para uso ilimitado</p>
          </div>

          {/* Valid Until */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Expiración (Opcional)
            </label>
            <input
              type="date"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Dejar vacío para que no expire</p>
          </div>

          {/* Applicable Plans */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Planes Aplicables
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.applicable_plans.includes('free')}
                  onChange={(e) => {
                    const plans = e.target.checked
                      ? [...formData.applicable_plans, 'free']
                      : formData.applicable_plans.filter((p) => p !== 'free')
                    setFormData({ ...formData, applicable_plans: plans })
                  }}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Free</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.applicable_plans.includes('pro')}
                  onChange={(e) => {
                    const plans = e.target.checked
                      ? [...formData.applicable_plans, 'pro']
                      : formData.applicable_plans.filter((p) => p !== 'pro')
                    setFormData({ ...formData, applicable_plans: plans })
                  }}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Pro</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
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
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {coupon ? 'Guardar Cambios' : 'Crear Cupón'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>()

  useEffect(() => {
    loadCoupons()
  }, [filter])

  async function loadCoupons() {
    setLoading(true)
    try {
      const url = filter === 'all' ? '/api/admin/coupons' : `/api/admin/coupons?active=${filter === 'active'}`
      const res = await fetch(url)
      const data = await res.json()

      if (data.success) {
        setCoupons(data.coupons)
      }
    } catch (error) {
      console.error('Error loading coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(coupon: Coupon) {
    if (!confirm(`¿Eliminar el cupón "${coupon.code}"?`)) return

    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        loadCoupons()
      }
    } catch (error) {
      console.error('Error deleting coupon:', error)
    }
  }

  const filteredCoupons = coupons.filter((c) => {
    if (filter === 'active') return c.is_active
    if (filter === 'inactive') return !c.is_active
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Cupones</h2>
          <p className="text-gray-600 mt-1">Crea y administra códigos de descuento para Hanna SaaS</p>
        </div>

        <button
          onClick={() => {
            setEditingCoupon(undefined)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Crear Cupón
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos ({coupons.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'active'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Activos ({coupons.filter((c) => c.is_active).length})
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'inactive'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Inactivos ({coupons.filter((c) => !c.is_active).length})
        </button>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Cargando cupones...</p>
          </div>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay cupones con este filtro</p>
          <button
            onClick={() => {
              setEditingCoupon(undefined)
              setShowForm(true)
            }}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear Primer Cupón
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onEdit={() => {
                  setEditingCoupon(coupon)
                  setShowForm(true)
                }}
                onDelete={() => handleDelete(coupon)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CouponForm
            coupon={editingCoupon}
            onClose={() => {
              setShowForm(false)
              setEditingCoupon(undefined)
            }}
            onSave={loadCoupons}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
