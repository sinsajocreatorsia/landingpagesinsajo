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
  X,
  HelpCircle,
  ChevronDown,
  Crown,
  Building2,
} from 'lucide-react'

/* ─── DATA ─── */

const painPoints = [
  { before: 'Publicas sin estrategia y sin saber si funciona', after: 'Cada post tiene un propósito y sigue tu estrategia de contenido' },
  { before: 'No sabes cómo hablarle a tu cliente ideal', after: 'Conoces exactamente quién es, qué quiere y qué lenguaje lo activa' },
  { before: 'Tu marketing se siente genérico e improvisado', after: 'Tienes un sistema profesional: embudo, mensajes y branding definidos' },
  { before: 'Pagas $500+ por una consultora que tarda semanas', after: 'Tienes una consultora de marketing disponible 24/7 por $19.99/mes' },
]

const capabilities = [
  {
    icon: UserCircle,
    title: 'Define tu Cliente Ideal',
    subtitle: 'Avatar de Negocio',
    description: 'Descubre exactamente quién es tu comprador: qué lo frustra, qué desea, cómo decide comprar y qué lenguaje lo activa. Deja de venderle a "todo el mundo".',
    result: 'Sabrás exactamente a quién hablarle y cómo',
    color: '#C7517E',
  },
  {
    icon: Gift,
    title: 'Crea tu Oferta Irresistible',
    subtitle: 'Estructura de Venta',
    description: 'Estructura tu producto para que el valor percibido sea tan alto que el precio parezca ridículo. Usa la ecuación de valor: resultado x probabilidad / tiempo x esfuerzo.',
    result: 'Una oferta que se vende sola',
    color: '#2CB6D7',
  },
  {
    icon: Megaphone,
    title: 'Domina tu Mensaje',
    subtitle: 'Comunicación y Posicionamiento',
    description: 'Define tu mensaje central, posicionamiento único y las frases que tu audiencia va a recordar. Encuentra tu voz, tu enemigo común y los hooks que enganchan.',
    result: 'Un mensaje que te diferencia de la competencia',
    color: '#36B3AE',
  },
  {
    icon: PenTool,
    title: 'Estrategia de Contenido',
    subtitle: 'Qué publicar, dónde y cuándo',
    description: 'Planifica qué tipo de contenido crear, en qué plataformas, con qué frecuencia y estructura. Genera ideas, calendarios y textos listos para publicar.',
    result: 'Nunca más te quedarás sin saber qué publicar',
    color: '#C7517E',
  },
  {
    icon: Palette,
    title: 'Identidad de Marca',
    subtitle: 'Branding Visual y Verbal',
    description: 'Define cómo se ve y se siente tu marca: colores, tono, personalidad, arquetipos. Todo tu marketing será reconocible y consistente.',
    result: 'Una marca profesional y memorable',
    color: '#2CB6D7',
  },
  {
    icon: GitBranch,
    title: 'Embudo de Conversión',
    subtitle: 'De desconocido a cliente',
    description: 'Diseña el camino completo: cómo te descubren, cómo los capturas, cómo los nutres y cómo compran. Con diagramas visuales y métricas por etapa.',
    result: 'Un sistema de ventas que trabaja por ti 24/7',
    color: '#36B3AE',
  },
]

const proFeatures = [
  {
    icon: Brain,
    title: 'Perfil de Negocio Personalizado',
    description: 'Hanna conoce tu marca, audiencia, productos y tono. Cada respuesta está hecha para TU negocio específico.',
  },
  {
    icon: BarChart3,
    title: 'Diagramas y Visualizaciones',
    description: 'Genera embudos de venta, customer journeys y estrategias en diagramas profesionales automáticamente.',
  },
  {
    icon: Bell,
    title: 'Recordatorios por Email',
    description: 'Hanna detecta tus tareas con fecha y te envía recordatorios por email para que nada se te pase.',
  },
  {
    icon: Mic,
    title: 'Habla con Hanna',
    description: 'Activa la voz y habla con ella como si fuera tu socia. Sin escribir, solo conversar.',
  },
]

const comparison = [
  {
    aspect: 'Disponibilidad',
    alone: 'Cuando tienes tiempo',
    consultant: 'Horario de oficina',
    hanna: '24/7, siempre lista',
  },
  {
    aspect: 'Costo mensual',
    alone: 'Tu tiempo (el más caro)',
    consultant: '$500 - $2,000+',
    hanna: 'Desde $0',
  },
  {
    aspect: 'Velocidad',
    alone: 'Semanas de prueba y error',
    consultant: 'Días o semanas',
    hanna: 'Respuestas en segundos',
  },
  {
    aspect: 'Personalización',
    alone: 'Genérica / improvisada',
    consultant: 'Buena pero limitada',
    hanna: 'Aprende tu negocio, tono y audiencia',
  },
  {
    aspect: 'Estrategia completa',
    alone: 'Fragmentada',
    consultant: 'Depende del consultor',
    hanna: '6 pilares de marketing integrados',
  },
]

const plans = [
  {
    id: 'free',
    name: 'Gratis',
    price: '0',
    period: 'siempre',
    description: 'Empieza a construir tu estrategia hoy',
    features: [
      'Mensajes ilimitados',
      'Arquitectura de marketing completa',
      'Historial de 7 días',
      'Modelo IA rápido (Gemini Flash)',
    ],
    cta: 'Comenzar Gratis',
    ctaLink: '/hanna/signup',
    popular: false,
    color: '#36B3AE',
    icon: MessageSquare,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '19.99',
    period: 'mes',
    description: 'Tu consultora personalizada 24/7',
    features: [
      'Mensajes ilimitados',
      'Historial completo (para siempre)',
      'Perfil de negocio personalizado',
      'Diagramas y gráficos Mermaid',
      'Recordatorios inteligentes + email',
      'Voz activada',
      'Te conoce por nombre y género',
      'Soporte por email',
    ],
    cta: 'Comenzar con Pro',
    ctaLink: '/hanna/signup?plan=pro',
    popular: false,
    color: '#C7517E',
    icon: Crown,
  },
  {
    id: 'business',
    name: 'Business',
    price: '49',
    period: 'mes',
    description: 'El máximo poder de IA para tu negocio',
    features: [
      'Todo lo de Pro',
      'Gemini 2.5 Pro (estrategia avanzada)',
      'Claude Sonnet 4 (contenido creativo)',
      'Respuestas más profundas y detalladas',
      'Exportar conversaciones',
      'Soporte prioritario',
      'Acceso anticipado a nuevas funciones',
    ],
    cta: 'Comenzar con Business',
    ctaLink: '/hanna/signup?plan=business',
    popular: true,
    color: '#2CB6D7',
    icon: Building2,
  },
]

const faqs = [
  {
    question: '¿Hanna realmente entiende mi negocio?',
    answer: 'Sí. En los planes Pro y Business, Hanna guarda tu perfil de negocio: tu marca, audiencia, productos, tono de voz y propuesta de valor. Cada respuesta está personalizada para tu situación específica, no son respuestas genéricas.',
  },
  {
    question: '¿Qué diferencia hay entre Hanna y ChatGPT?',
    answer: 'ChatGPT es un asistente general. Hanna es una consultora de marketing especializada con frameworks probados (Hormozi, embudos, posicionamiento). Conoce tu negocio, te reta cuando vas mal, te sugiere recordatorios, genera diagramas de estrategia y habla con el tono que tú elijas.',
  },
  {
    question: '¿Puedo probar antes de pagar?',
    answer: 'El plan Gratis tiene mensajes ilimitados y acceso a toda la arquitectura de marketing. No necesitas tarjeta de crédito. Prueba Hanna el tiempo que quieras y actualiza cuando sientas la diferencia.',
  },
  {
    question: '¿Qué pasa si cancelo mi suscripción?',
    answer: 'Vuelves al plan Gratis automáticamente. No pierdes tu cuenta ni tus datos. Puedes volver a Pro o Business cuando quieras.',
  },
  {
    question: '¿Funciona para cualquier tipo de negocio?',
    answer: 'Sí. Hanna trabaja con servicios, productos digitales, e-commerce, consultorías, SaaS, coaching, freelancers y más. La arquitectura de marketing se adapta a cualquier industria porque los principios de negocio son universales.',
  },
  {
    question: '¿Cómo son los recordatorios por email?',
    answer: 'Cuando hablas con Hanna y mencionas una tarea con fecha ("tengo que entregar la propuesta el viernes"), ella detecta automáticamente la tarea, te sugiere un recordatorio, y cuando llega la fecha te envía un email con contexto estratégico y pasos de acción.',
  },
]

/* ─── PAGE ─── */

export default function HannaLandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#022133] via-[#0a2e47] to-[#200F5D]">
      {/* ─── HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#022133]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/hanna" className="flex items-center gap-3">
            <Image src="/images/sinsajo-logo-1.png" alt="Sinsajo Creators" width={40} height={40} className="object-contain" />
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight">Hanna</span>
              <span className="text-white/60 text-xs">by Sinsajo Creators</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#que-hace" className="text-white/70 hover:text-white transition-colors text-sm">Qué Hace</a>
            <a href="#capacidades" className="text-white/70 hover:text-white transition-colors text-sm">Capacidades</a>
            <a href="#precios" className="text-white/70 hover:text-white transition-colors text-sm">Precios</a>
            <a href="#faq" className="text-white/70 hover:text-white transition-colors text-sm">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/hanna/login" className="hidden sm:block px-4 py-2 text-white/80 hover:text-white transition-colors text-sm">
              Iniciar Sesión
            </Link>
            <Link
              href="/hanna/signup"
              className="px-5 py-2.5 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-medium rounded-lg hover:from-[#d4608d] hover:to-[#C7517E] transition-all text-sm"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-[#2CB6D7]" />
            <span className="text-white/80 text-sm">Consultora de marketing con IA</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
            Deja de improvisar{' '}
            <br className="hidden md:block" />
            tu marketing.
          </h1>

          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-4 leading-relaxed">
            <span className="text-white font-medium">Hanna</span> es la IA que construye contigo una{' '}
            <span className="text-white">estrategia de marketing completa</span> para tu negocio.
            Cliente ideal, oferta, mensajes, contenido, branding y embudo de ventas.
          </p>

          <p className="text-lg text-[#2CB6D7] font-medium mb-10">
            Todo en un solo lugar. Disponible 24/7. Desde $0.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/hanna/signup"
              className="px-8 py-4 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all flex items-center gap-2 shadow-lg shadow-[#C7517E]/30 text-lg"
            >
              Comenzar Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#que-hace"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
            >
              Ver qué puede hacer
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#36B3AE]" />
              <span>Mensajes ilimitados gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#36B3AE]" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#36B3AE]" />
              <span>Cancela cuando quieras</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BEFORE / AFTER ─── */}
      <section id="que-hace" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tu marketing{' '}
              <span className="text-[#C7517E]">antes</span> vs{' '}
              <span className="text-[#2CB6D7]">después</span> de Hanna
            </h2>
            <p className="text-white/50 text-lg">La diferencia entre improvisar y tener un sistema.</p>
          </div>

          <div className="space-y-4">
            {painPoints.map((point, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-[#C7517E]/5 border border-[#C7517E]/20 rounded-xl p-5">
                  <X className="w-5 h-5 text-[#C7517E] flex-shrink-0 mt-0.5" />
                  <p className="text-white/70 text-sm leading-relaxed">{point.before}</p>
                </div>
                <div className="flex items-start gap-3 bg-[#2CB6D7]/5 border border-[#2CB6D7]/20 rounded-xl p-5">
                  <Check className="w-5 h-5 text-[#2CB6D7] flex-shrink-0 mt-0.5" />
                  <p className="text-white/90 text-sm leading-relaxed font-medium">{point.after}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/hanna/signup"
              className="inline-flex items-center gap-2 text-[#2CB6D7] hover:text-white transition-colors font-medium"
            >
              Quiero el "después"
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CHAT DEMO ─── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Demo */}
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4">
                <div className="bg-[#022133] rounded-xl overflow-hidden">
                  <div className="p-3 border-b border-white/10 flex items-center gap-3">
                    <Image src="/images/sinsajo-logo-1.png" alt="Hanna" width={32} height={32} className="object-contain" />
                    <div>
                      <h3 className="text-white font-medium text-sm">Hanna</h3>
                      <p className="text-white/40 text-xs">Consultora de Marketing IA</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400/80 text-xs">En línea</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-[#C7517E] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                        <p className="text-sm">Quiero lanzar mi curso online pero no sé por dónde empezar con el marketing</p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-white/10 text-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                        <p className="text-sm leading-relaxed">
                          Perfecto, vamos a construir tu estrategia desde cero. Primero necesito entender tu negocio:
                          <br /><br />
                          1. ¿Qué enseña tu curso exactamente?
                          <br />
                          2. ¿A quién va dirigido? (no "todo el mundo")
                          <br />
                          3. ¿Qué resultado concreto obtiene tu alumno?
                          <br /><br />
                          Con eso vamos a definir tu <strong>avatar</strong> y tu <strong>oferta irresistible</strong>. Después pasamos a mensajes, contenido y embudo.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-[#C7517E] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                        <p className="text-sm">Es un curso de repostería para mamás que quieren generar ingresos desde casa</p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-white/10 text-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                        <p className="text-sm leading-relaxed">
                          Excelente nicho. Tu avatar es claro: mamás que buscan independencia económica sin salir de casa.
                          <br /><br />
                          Tu <strong>mensaje central</strong> podría ser: "Convierte tu cocina en tu negocio. Aprende a crear y vender postres premium sin invertir en local."
                          <br /><br />
                          ¿Quieres que armemos la oferta completa con precio, garantía y stack de valor?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#2CB6D7]/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#C7517E]/20 rounded-full blur-xl" />
            </div>

            {/* Right: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-6">
                <MessageSquare className="w-4 h-4 text-[#2CB6D7]" />
                <span className="text-white/70 text-xs font-medium">Conversación real con Hanna</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                No te da respuestas genéricas.
                <br />
                <span className="text-[#C7517E]">Te hace las preguntas correctas.</span>
              </h2>

              <p className="text-white/55 leading-relaxed mb-6">
                Hanna funciona como una consultora real: primero entiende tu negocio,
                luego te guía paso a paso. Te reta cuando das respuestas vagas y te
                ayuda a pensar estratégicamente.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Frameworks de marketing probados (Hormozi, SWOT, Porter)',
                  'Te conoce por nombre y adapta su lenguaje a tu género',
                  'Genera diagramas de embudos y estrategias visualmente',
                  'Crea contenido listo para publicar en tus redes',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                    <Check className="w-4 h-4 text-[#2CB6D7] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/hanna/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all"
              >
                Hablar con Hanna
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES (6 PILLARS) ─── */}
      <section id="capacidades" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C7517E]/10 border border-[#C7517E]/30 rounded-full mb-6">
              <Zap className="w-4 h-4 text-[#C7517E]" />
              <span className="text-[#C7517E] text-sm font-medium">Arquitectura de Marketing Completa</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              6 pilares de marketing.
              <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#2CB6D7] to-[#C7517E] bg-clip-text text-transparent">
                {' '}Una sola consultora.
              </span>
            </h2>
            <p className="text-white/50 text-lg max-w-3xl mx-auto">
              Hanna te guía para construir cada pilar de tu estrategia.
              No son plantillas vacías — es una consultora que te hace preguntas,
              te reta y genera tu estrategia personalizada.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
              <p className="text-white/80 text-center text-lg leading-relaxed">
                <span className="text-white/40">Una consultora de marketing cobra $500-$2,000 por hacer esto.</span>
                {' '}Un curso te enseña la teoría pero no la aplica a TU negocio.
                {' '}<span className="text-white font-semibold">Hanna hace ambas cosas, por una fracción del precio.</span>
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/25 transition-all duration-300 hover:bg-white/[0.07]"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
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

          <div className="text-center">
            <p className="text-white/40 text-sm mb-4">Todo esto disponible en el plan gratuito</p>
            <div className="flex items-center justify-center gap-3 text-white/25">
              <div className="w-20 h-px bg-white/15" />
              <ChevronDown className="w-5 h-5 animate-bounce" />
              <div className="w-20 h-px bg-white/15" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRO / BUSINESS UPSELL ─── */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-[#C7517E]/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Con Pro y Business, Hanna se convierte en{' '}
              <span className="text-[#C7517E]">tu socia</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Funciones exclusivas que hacen que Hanna trabaje como si conociera tu negocio de toda la vida.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {proFeatures.map((feat) => (
              <div key={feat.title} className="flex gap-4 bg-white/5 rounded-2xl p-6 border border-white/10">
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

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#2CB6D7]/10 via-[#200F5D]/20 to-[#2CB6D7]/10 border border-[#2CB6D7]/30 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2CB6D7]/20 rounded-full mb-4">
                <ShieldCheck className="w-4 h-4 text-[#2CB6D7]" />
                <span className="text-[#2CB6D7] text-xs font-bold uppercase tracking-wider">Plan Business</span>
              </div>
              <h3 className="text-white font-bold text-xl md:text-2xl mb-3">
                Los cerebros de IA más potentes del mundo, trabajando para tu negocio
              </h3>
              <p className="text-white/55 max-w-2xl mx-auto mb-6">
                Business usa <strong className="text-white">Gemini 2.5 Pro</strong> para estrategia y análisis,
                y <strong className="text-white">Claude Sonnet 4</strong> para contenido creativo.
                Es como pasar de una consultora junior a una consultora senior.
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

      {/* ─── COMPARISON TABLE ─── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Por qué Hanna y no otra opción?
            </h2>
            <p className="text-white/50 text-lg">Compara y decide.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-white/40 text-sm font-medium p-4" />
                  <th className="text-center text-white/50 text-sm font-medium p-4">Hacerlo sola</th>
                  <th className="text-center text-white/50 text-sm font-medium p-4">Consultora</th>
                  <th className="text-center p-4">
                    <span className="text-[#2CB6D7] font-bold text-sm">Hanna</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.aspect} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                    <td className="text-white/70 text-sm font-medium p-4 whitespace-nowrap">{row.aspect}</td>
                    <td className="text-center text-white/40 text-sm p-4">{row.alone}</td>
                    <td className="text-center text-white/40 text-sm p-4">{row.consultant}</td>
                    <td className="text-center text-white font-medium text-sm p-4">{row.hanna}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/hanna/signup"
              className="inline-flex items-center gap-2 text-[#2CB6D7] hover:text-white transition-colors font-medium"
            >
              Elegir Hanna
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="precios" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Invierte menos que un café al día en tu marketing
            </h2>
            <p className="text-white/50 text-lg">
              Empieza gratis. Actualiza cuando veas los resultados.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[#2CB6D7]/10 to-[#200F5D]/20 border-2 border-[#2CB6D7] md:scale-[1.03]'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] text-white text-sm font-bold rounded-full whitespace-nowrap">
                    Mejor Valor
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${plan.color}20` }}
                  >
                    <plan.icon className="w-5 h-5" style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-bold">{plan.name}</h3>
                    <p className="text-white/50 text-xs">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/50">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-white/75 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3.5 px-4 text-center font-semibold rounded-xl transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#2CB6D7] to-[#36B3AE] text-white hover:from-[#36C5E6] hover:to-[#2CB6D7] shadow-lg shadow-[#2CB6D7]/20'
                      : plan.id === 'pro'
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

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-6">
              <HelpCircle className="w-4 h-4 text-white/60" />
              <span className="text-white/60 text-sm">Preguntas Frecuentes</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              ¿Tienes dudas?
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="text-white font-medium text-sm pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-white/40 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-white/55 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#C7517E]/20 via-[#200F5D]/30 to-[#2CB6D7]/10 rounded-3xl p-10 md:p-16 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C7517E]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2CB6D7]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Tu marketing merece
                <br />
                más que improvisación.
              </h2>
              <p className="text-white/55 text-lg mb-3 max-w-2xl mx-auto">
                Mientras sigues pensando, tu competencia ya está usando IA para vender más.
              </p>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto font-medium">
                Crea tu cuenta en 30 segundos. Mensajes ilimitados. Sin tarjeta de crédito.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/hanna/signup"
                  className="px-8 py-4 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white font-semibold rounded-xl hover:from-[#d4608d] hover:to-[#C7517E] transition-all flex items-center gap-2 shadow-lg shadow-[#C7517E]/30 text-lg"
                >
                  Comenzar Gratis Ahora
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/hanna/signup?plan=pro"
                  className="px-8 py-4 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
                >
                  Ir directo a Pro - $19.99/mes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/images/sinsajo-logo-1.png" alt="Sinsajo Creators" width={40} height={40} className="object-contain" />
              <div>
                <span className="text-white font-bold">Hanna</span>
                <p className="text-white/50 text-sm">by Sinsajo Creators</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-white/50 text-sm">
              <Link href="/terms" className="hover:text-white transition-colors">Términos</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="mailto:hanna@screatorsai.com" className="hover:text-white transition-colors">Contacto</Link>
            </div>

            <p className="text-white/30 text-sm">
              © 2026 Sinsajo Creators. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
