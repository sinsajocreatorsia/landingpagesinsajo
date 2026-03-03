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

const testimonials = [
  {
    name: 'María González',
    business: 'Boutique de Moda',
    quote: 'Hanna me ahorra 3 horas diarias en responder clientes y crear contenido.',
    avatar: '👩‍💼',
  },
  {
    name: 'Carolina Ruiz',
    business: 'Consultora de Negocios',
    quote: 'Es como tener una asistente que nunca duerme y siempre tiene ideas frescas.',
    avatar: '👩‍💻',
  },
  {
    name: 'Ana Martínez',
    business: 'Tienda Online',
    quote: 'Mis respuestas a clientes son ahora más rápidas y profesionales.',
    avatar: '👩‍🔧',
  },
]

const plans = [
  {
    name: 'Gratis',
    price: '0',
    period: 'siempre',
    description: 'Perfecto para probar Hanna',
    features: [
      '5 mensajes por día',
      'Historial de 7 días',
      'Chat básico con IA',
    ],
    cta: 'Comenzar Gratis',
    ctaLink: '/hanna/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: '19',
    period: 'mes',
    description: 'Para empresarias serias',
    features: [
      'Mensajes ilimitados',
      'Historial completo',
      'Perfil de negocio personalizado',
      'Voz (hablar con Hanna)',
      'Respuestas adaptadas a tu marca',
    ],
    cta: 'Comenzar con Pro',
    ctaLink: '/hanna/signup?plan=pro',
    popular: true,
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
            <a href="#pricing" className="text-white/70 hover:text-white transition-colors">
              Precios
            </a>
            <a href="#testimonials" className="text-white/70 hover:text-white transition-colors">
              Testimonios
            </a>
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Lo que dicen nuestras clientas
            </h2>
            <p className="text-white/60 text-lg">
              Empresarias reales, resultados reales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C7517E] to-[#200F5D] flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-white/50 text-sm">{testimonial.business}</p>
                  </div>
                </div>
                <p className="text-white/80 italic">"{testimonial.quote}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Planes simples, sin sorpresas
            </h2>
            <p className="text-white/60 text-lg">
              Comienza gratis y actualiza cuando estés lista.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[#C7517E]/20 to-[#200F5D]/20 border-2 border-[#C7517E]'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#C7517E] to-[#b8456f] text-white text-sm font-medium rounded-full">
                    Más Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-white text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-white/60">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/60">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-white/80">
                      <Check className="w-5 h-5 text-[#2CB6D7]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3 px-4 text-center font-semibold rounded-xl transition-all ${
                    plan.popular
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
