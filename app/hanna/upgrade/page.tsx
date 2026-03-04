"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Crown,
  Check,
  ArrowLeft,
  Gift,
  Loader2,
  Sparkles,
  Zap,
  Building2,
  Heart,
  Timer,
} from "lucide-react";

type PlanType = "pro" | "business";

interface LaunchData {
  active: boolean;
  remaining: number;
  total: number;
}

const LAUNCH_PRICES: Record<PlanType, number> = {
  pro: 9.99,
  business: 19.99,
};

function UpgradeContent() {
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled");

  const [selectedPlan, setSelectedPlan] = useState<PlanType>("pro");
  const [couponCode, setCouponCode] = useState("");
  const [couponValid, setCouponValid] = useState<boolean | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [launch, setLaunch] = useState<LaunchData | null>(null);

  // Fetch launch spots on mount
  useEffect(() => {
    fetch("/api/hanna/launch/spots")
      .then((r) => r.json())
      .then((data: LaunchData) => {
        if (data.active) {
          setLaunch(data);
          setCouponCode("HANNAPRO");
          setCouponValid(true);
          setCouponMessage(
            "50% de descuento en tu primer mes"
          );
        }
      })
      .catch(() => {});
  }, []);

  // Update coupon message when plan changes during launch
  useEffect(() => {
    if (launch?.active && couponCode.toUpperCase() === "HANNAPRO") {
      setCouponValid(true);
      setCouponMessage(
        "50% de descuento en tu primer mes"
      );
    }
  }, [selectedPlan, launch, couponCode]);

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const response = await fetch("/api/hanna/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          plan: selectedPlan,
        }),
      });
      const data = await response.json();
      if (data.valid) {
        setCouponValid(true);
        setCouponMessage(data.message);
      } else {
        setCouponValid(false);
        setCouponMessage(data.error || "Cupón no válido");
      }
    } catch {
      setCouponValid(false);
      setCouponMessage("Error al validar cupón");
    }
  };

  const handleUpgrade = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/hanna/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          couponCode: couponValid ? couponCode.toUpperCase() : undefined,
        }),
      });
      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Error al procesar el pago");
      }
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const isLaunchActive = launch?.active ?? false;

  const plans = [
    {
      id: "pro" as PlanType,
      name: "Pro",
      price: 19.99,
      launchPrice: isLaunchActive ? LAUNCH_PRICES.pro : null,
      icon: Crown,
      color: "#C7517E",
      description: "Para empresarias serias",
      features: [
        "Mensajes ilimitados",
        "Historial completo",
        "Perfil de negocio personalizado",
        "Voz activada",
        "Modelos IA Flash (rápidos)",
        "Soporte por email",
      ],
    },
    {
      id: "business" as PlanType,
      name: "Business",
      price: 49,
      launchPrice: isLaunchActive ? LAUNCH_PRICES.business : null,
      icon: Building2,
      color: "#2CB6D7",
      description: "Para negocios en crecimiento",
      popular: true,
      features: [
        "Todo lo de Pro",
        "Modelos IA Premium (Gemini Pro + Claude)",
        "Análisis de negocio avanzado",
        "Estrategia de marketing IA",
        "Memoria de negocio extendida",
        "Soporte prioritario",
        "Exportar conversaciones",
        "Acceso anticipado a nuevas funciones",
      ],
    },
  ];

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)!;
  const displayPrice = selectedPlanData.launchPrice ?? selectedPlanData.price;

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href="/hanna/dashboard"
        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al chat
      </Link>

      {cancelled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 px-4 py-3 rounded-xl mb-6"
        >
          Pago cancelado. Puedes intentarlo de nuevo cuando quieras.
        </motion.div>
      )}

      {/* March Promo Banner */}
      {isLaunchActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 border border-pink-400/30 rounded-2xl p-5 mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="text-pink-300 font-bold text-lg uppercase tracking-wide">
              Oferta Especial de Marzo
            </span>
            <Heart className="w-5 h-5 text-pink-400" />
          </div>
          <p className="text-white/90 text-sm mb-3">
            Celebramos el <span className="text-pink-300 font-semibold">Dia Internacional de la Mujer</span>.
            {" "}Las mujeres emprendedoras con codigo de descuento obtienen{" "}
            <span className="text-pink-300 font-bold">50% OFF</span> en su primer mes.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-pink-400/30 rounded-full">
            <Timer className="w-4 h-4 text-pink-300" />
            <span className="text-white/90 text-sm">
              Cupos con descuento disponibles:{" "}
              <span className="text-pink-300 font-bold text-base">
                {launch?.remaining}
              </span>
              <span className="text-white/50"> / {launch?.total}</span>
            </span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
          <Sparkles className="w-5 h-5 text-[#2CB6D7]" />
          <span className="text-white font-medium">Actualiza tu plan</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Elige el plan perfecto para tu negocio
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Desbloquea todo el poder de Hanna con modelos IA premium y funciones
          avanzadas.
        </p>
      </motion.div>

      {/* Plan Selector */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative rounded-2xl p-6 cursor-pointer transition-all border-2 ${
              selectedPlan === plan.id
                ? plan.id === "business"
                  ? "border-[#2CB6D7] bg-[#2CB6D7]/10"
                  : "border-[#C7517E] bg-[#C7517E]/10"
                : "border-white/10 bg-white/5 hover:border-white/30"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] text-white text-xs font-bold rounded-full">
                MÁS POPULAR
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${plan.color}20` }}
                >
                  <plan.icon
                    className="w-5 h-5"
                    style={{ color: plan.color }}
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                  <p className="text-white/50 text-sm">{plan.description}</p>
                </div>
              </div>
              <div className="text-right">
                {plan.launchPrice ? (
                  <>
                    <span className="text-white/40 text-lg line-through mr-2">
                      ${plan.price}
                    </span>
                    <span
                      className="text-3xl font-bold"
                      style={{ color: plan.color }}
                    >
                      ${plan.launchPrice}
                    </span>
                    <span className="text-white/50 text-sm">/mes</span>
                    <p className="text-white/40 text-xs mt-1">
                      Promo marzo, luego ${plan.price}/mes
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-white/50 text-sm">/mes</span>
                  </>
                )}
              </div>
            </div>

            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-white/70 text-sm"
                >
                  <Check
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: plan.color }}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            {selectedPlan === plan.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: plan.color }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Checkout Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-bold text-lg">
              Plan {selectedPlanData.name}
            </h3>
            <p className="text-white/50 text-sm">Cancela cuando quieras</p>
          </div>
          <div className="text-right">
            {selectedPlanData.launchPrice ? (
              <>
                <span className="text-white/40 text-lg line-through mr-1">
                  ${selectedPlanData.price}
                </span>
                <span className="text-3xl font-bold text-green-400">
                  ${displayPrice}
                </span>
                <span className="text-white/50">/mes</span>
                <p className="text-pink-400/70 text-xs mt-1">
                  Promo marzo - primer mes
                </p>
              </>
            ) : (
              <>
                <span className="text-3xl font-bold text-white">
                  ${displayPrice}
                </span>
                <span className="text-white/50">/mes</span>
              </>
            )}
          </div>
        </div>

        {/* Coupon */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            <Gift className="inline w-4 h-4 mr-1" />
            {isLaunchActive ? "Cupon de marzo aplicado" : "¿Tienes un cupon?"}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setCouponValid(null);
                setCouponMessage(null);
              }}
              placeholder="INGRESA TU CÓDIGO"
              readOnly={isLaunchActive && couponCode.toUpperCase() === "HANNAPRO"}
              className={`flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#2CB6D7] uppercase text-sm ${
                isLaunchActive && couponCode.toUpperCase() === "HANNAPRO"
                  ? "border-green-500/30 bg-green-500/10"
                  : ""
              }`}
            />
            {!(isLaunchActive && couponCode.toUpperCase() === "HANNAPRO") && (
              <button
                onClick={validateCoupon}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white/80 hover:bg-white/20 transition-all text-sm"
              >
                Validar
              </button>
            )}
          </div>
          {couponMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-2 text-sm flex items-center gap-1 ${
                couponValid ? "text-green-400" : "text-red-400"
              }`}
            >
              {couponValid && <Check className="w-4 h-4" />}
              {couponMessage}
            </motion.p>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm mb-4"
          >
            {error}
          </motion.div>
        )}

        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="w-full py-4 px-4 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background:
              selectedPlan === "business"
                ? "linear-gradient(to right, #2CB6D7, #36B3AE)"
                : "linear-gradient(to right, #C7517E, #b8456f)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              {selectedPlan === "business" ? (
                <Zap className="w-5 h-5" />
              ) : (
                <Crown className="w-5 h-5" />
              )}
              {isLaunchActive
                ? `Aprovechar Promo ${selectedPlanData.name}`
                : couponValid
                  ? "Continuar con cupon"
                  : `Actualizar a ${selectedPlanData.name}`}
            </>
          )}
        </button>

        <p className="text-center text-white/40 text-xs mt-4">
          Pago seguro con Stripe. Cancela cuando quieras.
        </p>
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16"
      >
        <h2 className="text-white font-bold text-xl mb-6 text-center">
          Comparación de planes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/60 font-medium">
                  Característica
                </th>
                <th className="text-center py-3 px-4 text-white/60 font-medium">
                  Gratis
                </th>
                <th className="text-center py-3 px-4 text-[#C7517E] font-medium">
                  Pro
                </th>
                <th className="text-center py-3 px-4 text-[#2CB6D7] font-medium">
                  Business
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Mensajes/día", "5", "∞", "∞"],
                ["Historial", "7 días", "Completo", "Completo"],
                ["Perfil de negocio", "—", "✓", "✓"],
                ["Voz activada", "—", "✓", "✓"],
                ["Modelo IA", "Flash", "Flash Pro", "Gemini Pro + Claude"],
                ["Memoria de negocio", "—", "Básica", "Avanzada"],
                ["Soporte", "—", "Email", "Prioritario"],
                ["Exportar datos", "—", "—", "✓"],
              ].map(([feature, free, pro, business]) => (
                <tr key={feature} className="border-b border-white/5">
                  <td className="py-3 px-4 text-white/70 text-sm">{feature}</td>
                  <td className="py-3 px-4 text-center text-white/40 text-sm">
                    {free}
                  </td>
                  <td className="py-3 px-4 text-center text-white/80 text-sm">
                    {pro}
                  </td>
                  <td className="py-3 px-4 text-center text-white/80 text-sm">
                    {business}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function UpgradeSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="h-6 w-32 bg-white/20 rounded mb-8" />
      <div className="text-center mb-12">
        <div className="h-10 w-32 mx-auto bg-white/20 rounded-full mb-6" />
        <div className="h-10 w-96 mx-auto bg-white/20 rounded mb-4" />
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="h-64 bg-white/10 rounded-2xl" />
        <div className="h-64 bg-white/10 rounded-2xl" />
      </div>
    </div>
  );
}

export default function HannaUpgradePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] via-[#0a2e47] to-[#200F5D] py-12 px-4">
      <Suspense fallback={<UpgradeSkeleton />}>
        <UpgradeContent />
      </Suspense>
    </main>
  );
}
