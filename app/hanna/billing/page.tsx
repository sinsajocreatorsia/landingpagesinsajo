'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Crown,
  CreditCard,
  Calendar,
  Receipt,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Download,
  Sparkles,
} from 'lucide-react'

interface PaymentMethod {
  brand: string
  last4: string
  exp_month: number
  exp_year: number
}

interface Invoice {
  id: string
  amount_paid: number
  currency: string
  status: string | null
  created: string
  invoice_pdf: string | null
  hosted_invoice_url: string | null
}

interface SubscriptionData {
  plan: string
  subscription_status: string
  plan_started_at: string | null
  plan_expires_at: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  payment_method: PaymentMethod | null
  invoices: Invoice[]
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

function capitalizeCardBrand(brand: string): string {
  return brand.charAt(0).toUpperCase() + brand.slice(1)
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-500/20 text-green-300 border-green-500/30',
    trialing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    past_due: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
    canceled: 'bg-red-500/20 text-red-300 border-red-500/30',
    none: 'bg-white/10 text-white/60 border-white/20',
  }

  const labels: Record<string, string> = {
    active: 'Activo',
    trialing: 'Periodo de prueba',
    past_due: 'Pago pendiente',
    cancelled: 'Cancelado',
    canceled: 'Cancelado',
    none: 'Sin suscripcion',
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.none}`}>
      {labels[status] || status}
    </span>
  )
}

export default function BillingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SubscriptionData | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadSubscription()
  }, [])

  async function loadSubscription() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/hanna/login')
        return
      }

      const res = await fetch('/api/hanna/stripe/subscription', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })

      if (!res.ok) {
        throw new Error('Error al cargar datos de suscripcion')
      }

      const subscriptionData = await res.json()
      setData(subscriptionData)
    } catch (err) {
      console.error('Error loading subscription:', err)
      setError('No se pudo cargar la informacion de facturacion')
    } finally {
      setLoading(false)
    }
  }

  async function openCustomerPortal() {
    setPortalLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch('/api/hanna/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await res.json()

      if (result.url) {
        window.location.href = result.url
      } else {
        setError(result.error || 'Error al abrir portal de facturacion')
      }
    } catch (err) {
      console.error('Portal error:', err)
      setError('Error al acceder al portal de facturacion')
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2CB6D7] animate-spin" />
      </div>
    )
  }

  const isPro = data?.plan === 'pro'
  const isCancelling = data?.cancel_at_period_end === true

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] to-[#200F5D] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/hanna/dashboard"
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Facturacion</h1>
            <p className="text-white/60 text-sm">Gestiona tu suscripcion y pagos</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-200 rounded-xl text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
        >
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#C7517E]" />
            Plan Actual
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-white">
                  {isPro ? 'Hanna Pro' : 'Hanna Free'}
                </span>
                <StatusBadge status={data?.subscription_status || 'none'} />
              </div>
              {isPro && (
                <p className="text-white/60 text-sm">
                  $19/mes
                  {data?.plan_started_at && ` - Miembro desde ${formatDate(data.plan_started_at)}`}
                </p>
              )}
              {!isPro && (
                <p className="text-white/60 text-sm">5 mensajes por dia</p>
              )}
            </div>
          </div>

          {/* Cancellation notice */}
          {isCancelling && data?.current_period_end && (
            <div className="mt-4 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-yellow-300 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  Tu suscripcion se cancelara el {formatDate(data.current_period_end)}.
                  Seguiras teniendo acceso Pro hasta esa fecha.
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Subscription Details (Pro only) */}
        {isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
          >
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#2CB6D7]" />
              Detalles de Suscripcion
            </h2>

            <div className="space-y-4">
              {/* Next billing date */}
              {data?.current_period_end && !isCancelling && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Proximo cobro</span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {formatDate(data.current_period_end)}
                  </span>
                </div>
              )}

              {/* Payment method */}
              {data?.payment_method && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/70">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Metodo de pago</span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {capitalizeCardBrand(data.payment_method.brand)} **** {data.payment_method.last4}
                    <span className="text-white/50 ml-2">
                      {String(data.payment_method.exp_month).padStart(2, '0')}/{data.payment_method.exp_year}
                    </span>
                  </span>
                </div>
              )}

              {/* Plan expiry for coupon users */}
              {data?.plan_expires_at && !data?.current_period_end && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Acceso Pro hasta</span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {formatDate(data.plan_expires_at)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <button
              onClick={openCustomerPortal}
              disabled={portalLoading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {portalLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ExternalLink className="w-5 h-5" />
              )}
              Gestionar Suscripcion
            </button>
          </motion.div>
        )}

        {/* Upgrade CTA (Free only) */}
        {!isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-[#C7517E]/20 to-[#200F5D]/20 border border-[#C7517E]/30 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-[#C7517E]" />
              <h3 className="text-white font-bold text-lg">Actualiza a Hanna Pro</h3>
            </div>
            <p className="text-white/60 mb-4">
              Mensajes ilimitados, voz, perfil de negocio personalizado y mas por solo $19/mes.
            </p>
            <Link
              href="/hanna/upgrade"
              className="inline-flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
            >
              <Crown className="w-5 h-5" />
              Actualizar a Pro - $19/mes
            </Link>
          </motion.div>
        )}

        {/* Invoice History (Pro only) */}
        {isPro && data?.invoices && data.invoices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#2CB6D7]" />
              Historial de Facturas
            </h2>

            <div className="space-y-3">
              {data.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {formatAmount(invoice.amount_paid, invoice.currency)}
                      </p>
                      <p className="text-white/50 text-xs">
                        {formatDate(invoice.created)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={invoice.status === 'paid' ? 'active' : (invoice.status || 'none')} />
                    {invoice.invoice_pdf && (
                      <a
                        href={invoice.invoice_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Descargar PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
