import Link from 'next/link'
import Image from 'next/image'
import {
  MessageSquare,
  Sparkles,
  Check,
  ArrowRight,
  Mic,
  Clock,
  Target,
  TrendingUp,
  Users,
  Star,
  UserCircle,
  Gift,
  Megaphone,
  PenTool,
  Palette,
  GitBranch,
  Brain,
  BarChart3,
  Bell,
  ChevronRight,
  Zap,
  ShieldCheck,
} from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Chat Inteligente',
    description: 'Respuestas personalizadas para tu negocio, 24/7.',
  },
  {
    icon: Target,
    title: 'Marketing Automático',
    description: 'Crea contenido para redes, emails y más en segundos.',
  },
  {
    icon: Mic,
    title: 'Voz Activada',
    description: 'Habla con Hanna como si fuera tu asistente personal.',
  },
  {
    icon: TrendingUp,
    title: 'Aprende de Ti',
    description: 'Se adapta a tu marca, tono y estilo de comunicación.',
  },
]

const capabilities = [
  {
    icon: UserCircle,
    title: 'Define tu Cliente Ideal',
    subtitle: 'Avatar de Negocio',
    description: 'Hanna te ayuda a descubrir exactamente quién es tu comprador: qué lo frustra, qué desea, cómo decide comprar y qué lenguaje lo activa. Deja de venderle a "todo el mundo" y enfócate en quien realmente paga.',
    result: 'Sabrás exactamente a quién hablarle y cómo',
    color: '#C7517E',
  },
  {
    icon: Gift,
    title: 'Crea tu Oferta Irresistible',
    subtitle: 'Estructura de Venta',
    description: 'Estructura tu producto o servicio para que el valor percibido sea tan alto que el precio parezca ridículo. Hanna usa la ecuación de valor de Hormozi: resultado x probabilidad / tiempo x esfuerzo.',
    result: 'Una oferta que se vende sola',
    color: '#2CB6D7',
  },
  {
    icon: Megaphone,
    title: 'Domina tu Mensaje',
    subtitle: 'Comunicación y Posicionamiento',
    description: 'Define tu mensaje central, tu posicionamiento único y las frases que tu audiencia va a recordar. Hanna te ayuda a encontrar tu voz, tu enemigo común y los hooks que enganchan.',
    result: 'Un mensaje que te diferencia de la competencia',
    color: '#36B3AE',
  },
  {
    icon: PenTool,
    title: 'Estrategia de Contenido',
    subtitle: 'Qué publicar, dónde y cuándo',
    description: 'Planifica qué tipo de contenido crear, en qué plataformas, con qué frecuencia y con qué estructura. Hanna genera ideas, calendarios y textos listos para publicar.',
    result: 'Nunca más te quedarás sin saber qué publicar',
    color: '#C7517E',
  },
  {
    icon: Palette,
    title: 'Identidad de Marca',
    subtitle: 'Branding Visual y Verbal',
    description: 'Define cómo se ve y se siente tu marca: colores, tono, personalidad, arquetipos. Hanna te guía para que todo tu marketing sea reconocible y consistente.',
    result: 'Una marca profesional y memorable',
    color: '#2CB6D7',
  },
  {
    icon: GitBranch,
    title: 'Embudo de Conversión',
    subtitle: 'De desconocido a cliente',
    description: 'Diseña el camino completo: cómo te descubren, cómo los capturas, cómo los nutres y cómo compran. Con diagramas visuales, métricas por etapa y estrategias de retención.',
    result: 'Un sistema de ventas que trabaja por ti 24/7',
    color: '#36B3AE',
  },
]

const proFeatures = [
  {
    icon: Brain,
    title: 'Perfil de Negocio Personalizado',
    description: 'Hanna conoce tu marca, audiencia, productos y tono. Cada respuesta está hecha para TU negocio.',
  },
  {
    icon: BarChart3,
    title: 'Diagramas y Visualizaciones',
    description: 'Genera embudos de venta, customer journeys y estrategias en diagramas profesionales automáticamente.',
  },
  {
    icon: Bell,
    title: 'Recordatorios Inteligentes',
    description: 'Hanna detecta tus tareas con fecha y te envía recordatorios por email para que nada se te pase.',
  },
  {
    icon: Mic,
    title: 'Habla con Hanna',
    description: 'Activa la voz y habla con ella como si fuera tu socia. Sin escribir, solo conversar.',
  },
]

const plans = [
  {
    name: 'Gratis',
    price: '0',
    period: 'siempre',
    description: 'Perfecto para probar Hanna',
    features: [
      'Mensajes ilimitados',
      'Historial de 7 días',
      'Chat básico con IA',
    ],
    cta: 'Comenzar Gratis',
    ctaLink: '/hanna/signup',
    popular: false,
    color: '#36B3AE',
  },
  {
    name: 'Pro',
    price: '19.99',
    period: 'mes',
    description: 'Para empresarias serias',
    features: [
      'Mensajes ilimitados',
      'Historial completo',
      'Perfil de negocio personalizado',
      'Voz activada',
      'Modelos IA Flash (rápidos)',
      'Soporte por email',
    ],
    cta: 'Comenzar con Pro',
    ctaLink: '/hanna/signup?plan=pro',
    popular: false,
    color: '#C7517E',
  },
  {
    name: 'Business',
    price: '49',
    period: 'mes',
    description: 'Para negocios en crecimiento',
    features: [
      'Todo lo de Pro',
      'Modelos IA Premium (Gemini Pro + Claude)',
      'Análisis de negocio avanzado',
      'Estrategia de marketing IA',
      'Memoria de negocio extendida',
      'Soporte prioritario',
      'Exportar conversaciones',
    ],
    cta: 'Comenzar con Business',
    ctaLink: '/hanna/signup?plan=business',
    popular: true,
    color: '#2CB6D7',
  },
]

export default function HannaLandingPage() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] via-[#0a2e47] to-[#200F5D]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#022133]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/hanna" className="flex items-center gap-3">
            <Image
              src="/images/sinsajo-logo-1.png"
              alt="Sinsajo Creators"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight">Hanna</span>
              <span className="text-white/60 text-xs">by Sinsajo Creators</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/70 hover:text-white transition-colors">
              Características
            </a>
            <a href="#capabilities" className="text-white/70 hover:text-white transition-colors">
              Qué Hace
            </a>
            <a href="#pricing" className="text-white/70 hover:text-white transition-colors">
              Precios
            </a>
            <Link href="/hanna/login" className="text-white/70 hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/hanna/login"
              className="px-4 py-2 text-white/80 hover:text-white transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/hanna/signup"
              className="px-4 py-2 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-medium rounded-lg hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-[#2CB6D7]" />
              <span className="text-white/80 text-sm">Tu asistente de marketing con IA</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Conoce a{' '}
              <span className="bg-gradient-to-r from-[#2CB6D7] to-[#C7517E] bg-clip-text text-transparent">
                Hanna
              </span>
              <br />
              Tu Asistente de Marketing
            </h1>

            <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-10">
              La IA que entiende tu negocio y te ayuda a crear contenido, responder clientes y vender más.{' '}
              <span className="text-white">Sin complicaciones.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/hanna/signup"
                className="px-8 py-4 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all flex items-center gap-2 shadow-lg shadow-[#C7517E]/30"
              >
                Comenzar Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#demo"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
              >
                Ver Demo
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center justify-center gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>+500 empresarias</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>4.9/5 valoración</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>3h+ ahorradas/día</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 relative">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 max-w-3xl mx-auto">
              <div className="bg-[#022133] rounded-xl overflow-hidden">
                {/* Chat Preview */}
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                  <Image
                    src="/images/sinsajo-logo-1.png"
                    alt="Hanna"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div>
                    <h3 className="text-white font-medium">Hanna</h3>
                    <p className="text-white/50 text-sm">Tu asistente de marketing</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-[#C7517E] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm">Necesito un post para Instagram sobre mi nueva colección de primavera</p>
                    </div>
                  </div>

                  {/* Hanna Response */}
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                      <p className="text-sm">
                        ¡Claro! Aquí tienes un post perfecto para tu colección de primavera:
                        <br /><br />
                        🌸 ¡La primavera llegó a [Tu Boutique]!
                        <br /><br />
                        Colores frescos, telas ligeras y estilos que te harán brillar.
                        <br /><br />
                        ¿Lista para renovar tu armario?
                        <br />
                        👉 Link en bio
                        <br /><br />
                        #ModaPrimavera #NuevaColección #Tendencias2026
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#2CB6D7]/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#C7517E]/20 rounded-full blur-xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Todo lo que necesitas para tu marketing
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Hanna combina inteligencia artificial avanzada con un profundo entendimiento de las necesidades de tu negocio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#2CB6D7]/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2CB6D7]/20 to-[#36B3AE]/20 flex items-center justify-center mb-4 group-hover:from-[#2CB6D7]/30 group-hover:to-[#36B3AE]/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#2CB6D7]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Hanna Does - Sales Section */}
      <section id="capabilities" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C7517E]/10 border border-[#C7517E]/30 rounded-full mb-6">
              <Zap className="w-4 h-4 text-[#C7517E]" />
              <span className="text-[#C7517E] text-sm font-medium">Arquitectura de Marketing Completa</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Hanna no es un chatbot.{' '}
              <span className="bg-gradient-to-r from-[#2CB6D7] to-[#C7517E] bg-clip-text text-transparent">
                Es tu consultora
              </span>
              <br className="hidden md:block" />
              {' '}de marketing completa.
            </h2>
            <p className="text-white/60 text-lg max-w-3xl mx-auto">
              Mientras otros chatbots dan respuestas genéricas, Hanna te guía paso a paso para construir
              una <strong className="text-white">estrategia de marketing real</strong> para tu negocio.
              Usa frameworks probados y se adapta a tu situación específica.
            </p>
          </div>

          {/* Pain Point */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
              <p className="text-white/80 text-center text-lg leading-relaxed">
                <span className="text-white/40">Sin una arquitectura de marketing, tu negocio depende de la improvisación.</span>
                {' '}Publicas sin estrategia, vendes sin sistema, y tu marketing no se siente profesional.
                {' '}<span className="text-white font-semibold">Hanna cambia eso.</span>
              </p>
            </div>
          </div>

          {/* 6 Capabilities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/25 transition-all duration-300 hover:bg-white/[0.07]"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{ backgroundColor: `${cap.color}15` }}
                >
                  <cap.icon className="w-6 h-6" style={{ color: cap.color }} />
                </div>
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: cap.color }}>
                  {cap.subtitle}
                </p>
                <h3 className="text-white font-bold text-lg mb-3">{cap.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-4">{cap.description}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: cap.color }} />
                  <span className="text-white/80 text-sm font-medium">{cap.result}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Transition CTA */}
          <div className="text-center mb-8">
            <p className="text-white/50 text-sm mb-2">Todo esto disponible en el plan gratuito</p>
            <div className="flex items-center justify-center gap-2 text-white/30">
              <div className="w-16 h-px bg-white/20" />
              <span className="text-xs uppercase tracking-wider">Pero hay más</span>
              <div className="w-16 h-px bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Pro/Business Exclusive Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-[#C7517E]/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Con Pro y Business, Hanna se convierte en{' '}
              <span className="text-[#C7517E]">tu socia</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Desbloquea funciones exclusivas que hacen que Hanna trabaje como si conociera tu negocio de toda la vida.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {proFeatures.map((feat) => (
              <div
                key={feat.title}
                className="flex gap-4 bg-white/5 rounded-2xl p-6 border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C7517E]/10 flex items-center justify-center flex-shrink-0">
                  <feat.icon className="w-6 h-6 text-[#C7517E]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{feat.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Business Differentiator */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#2CB6D7]/10 via-[#200F5D]/20 to-[#2CB6D7]/10 border border-[#2CB6D7]/30 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2CB6D7]/20 rounded-full mb-4">
                <ShieldCheck className="w-4 h-4 text-[#2CB6D7]" />
                <span className="text-[#2CB6D7] text-xs font-bold uppercase tracking-wider">Plan Business</span>
              </div>
              <h3 className="text-white font-bold text-xl md:text-2xl mb-3">
                Los cerebros de IA más potentes del mundo, trabajando para tu negocio
              </h3>
              <p className="text-white/60 max-w-2xl mx-auto mb-6">
                El plan Business usa <strong className="text-white">Gemini 2.5 Pro</strong> para estrategia y análisis,
                y <strong className="text-white">Claude Sonnet 4</strong> para contenido creativo.
                Es como pasar de una consultora junior a una consultora senior — la diferencia en calidad de respuestas es enorme.
              </p>
              <Link
                href="/hanna/signup?plan=business"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] text-white font-semibold rounded-xl hover:from-[#36C5E6] hover:to-[#2CB6D7] transition-all"
              >
                Comenzar con Business
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Planes simples, sin sorpresas
            </h2>
            <p className="text-white/60 text-lg">
              Comienza gratis y actualiza cuando estés lista.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[#2CB6D7]/10 to-[#200F5D]/20 border-2 border-[#2CB6D7] scale-[1.02]'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] text-white text-sm font-bold rounded-full">
                    Más Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-white text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-white/60 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/60">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-white/80 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3 px-4 text-center font-semibold rounded-xl transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] text-white hover:from-[#36C5E6] hover:to-[#2CB6D7]'
                      : plan.name === 'Pro'
                        ? 'bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white hover:from-[#d4608d] hover:to-[#C7517E]'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="bg-gradient-to-br from-[#C7517E]/20 to-[#200F5D]/40 rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Lista para conocer a Hanna?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Empieza gratis hoy y descubre cómo la IA puede transformar tu marketing.
            </p>
            <Link
              href="/hanna/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all shadow-lg shadow-[#C7517E]/30"
            >
              Crear mi cuenta gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/sinsajo-logo-1.png"
                alt="Sinsajo Creators"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <span className="text-white font-bold">Hanna</span>
                <p className="text-white/50 text-sm">by Sinsajo Creators</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-white/60 text-sm">
              <Link href="/terms" className="hover:text-white transition-colors">
                Términos
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="mailto:hanna@screatorsai.com" className="hover:text-white transition-colors">
                Contacto
              </Link>
            </div>

            <p className="text-white/40 text-sm">
              © 2026 Sinsajo Creators. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
