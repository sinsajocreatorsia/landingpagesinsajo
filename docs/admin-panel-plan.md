# Plan: Panel de Admin + Stripe + Métricas - Hanna SaaS

## 🎯 Objetivo

Crear un sistema completo de administración para Hanna SaaS que permita:
1. **Panel Admin** - Gestión de códigos de descuento y usuarios
2. **Stripe Integration** - Checkout y suscripciones
3. **Analytics Dashboard** - Métricas de uso y costos en tiempo real

---

## 📋 Fase 1: Panel de Admin

### 1.1 Estructura de Rutas

```
app/
├── admin/
│   ├── layout.tsx           # Layout con auth check
│   ├── page.tsx              # Dashboard principal
│   ├── users/
│   │   └── page.tsx          # Lista de usuarios
│   ├── coupons/
│   │   ├── page.tsx          # Lista de cupones
│   │   └── new/
│   │       └── page.tsx      # Crear cupón
│   ├── analytics/
│   │   └── page.tsx          # Métricas de uso
│   └── settings/
│       └── page.tsx          # Configuración general
```

### 1.2 Control de Acceso

**Tabla en Supabase: `admin_users`**
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'support')),
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Emails de admins permitidos
CREATE TABLE admin_emails (
  email TEXT PRIMARY KEY,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'support')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Middleware de protección:**
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger rutas /admin
  if (pathname.startsWith('/admin')) {
    const supabase = createMiddlewareClient(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login?next=/admin', request.url))
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
```

### 1.3 Sistema de Cupones

**Tabla en Supabase: `discount_coupons`**
```sql
CREATE TABLE discount_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER DEFAULT NULL, -- NULL = unlimited
  times_used INTEGER DEFAULT 0,
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP DEFAULT NULL, -- NULL = no expiry
  is_active BOOLEAN DEFAULT TRUE,
  applicable_plans TEXT[] DEFAULT ARRAY['pro'], -- ['pro', 'enterprise']
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tracking de uso de cupones
CREATE TABLE coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES discount_coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id TEXT, -- Stripe subscription ID
  discount_amount DECIMAL(10,2) NOT NULL,
  redeemed_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_coupons_code ON discount_coupons(code);
CREATE INDEX idx_coupons_active ON discount_coupons(is_active, valid_until);
CREATE INDEX idx_redemptions_user ON coupon_redemptions(user_id);
```

**API Endpoints:**
```typescript
// app/api/admin/coupons/route.ts

// GET - List all coupons
// POST - Create new coupon
{
  code: "LAUNCH50",
  discount_type: "percentage",
  discount_value: 50,
  max_uses: 100,
  valid_until: "2026-03-31T23:59:59Z",
  applicable_plans: ["pro"]
}

// app/api/admin/coupons/[id]/route.ts
// PATCH - Update coupon
// DELETE - Deactivate coupon

// app/api/coupons/validate/route.ts (público)
// POST - Validate coupon code
{
  code: "LAUNCH50",
  plan: "pro"
}
// Response:
{
  valid: true,
  discount_type: "percentage",
  discount_value: 50,
  final_price: 9.99 // Si precio original es $19.99
}
```

---

## 📋 Fase 2: Integración de Stripe

### 2.1 Productos y Precios en Stripe

**Crear en Stripe Dashboard:**

```bash
# Plan Pro - Mensual
stripe products create \
  --name "Hanna Pro - Monthly" \
  --description "Mensajes ilimitados, voz, Claude 3.5 Sonnet"

stripe prices create \
  --product prod_XXXXX \
  --unit-amount 1999 \
  --currency usd \
  --recurring interval=month
```

**O via código:**
```typescript
// scripts/setup-stripe-products.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

async function setupProducts() {
  // Crear producto Pro
  const proPlanProduct = await stripe.products.create({
    name: 'Hanna Pro',
    description: 'Consultoría estratégica ilimitada con IA',
    metadata: {
      plan: 'pro',
      features: JSON.stringify([
        'Mensajes ilimitados',
        'Claude 3.5 Sonnet',
        'Respuestas 2.5x más largas',
        'Modo audio (TTS/STT)',
        'Business Profile personalizado',
        'Diagramas Mermaid avanzados'
      ])
    }
  })

  // Precio mensual
  const monthlyPrice = await stripe.prices.create({
    product: proPlanProduct.id,
    unit_amount: 1999, // $19.99
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7 // 7 días de prueba gratis
    },
    metadata: {
      plan: 'pro',
      billing_period: 'monthly'
    }
  })

  // Precio anual (descuento del 20%)
  const yearlyPrice = await stripe.prices.create({
    product: proPlanProduct.id,
    unit_amount: 19188, // $191.88 (ahorro de $47.88)
    currency: 'usd',
    recurring: {
      interval: 'year'
    },
    metadata: {
      plan: 'pro',
      billing_period: 'yearly',
      discount_percentage: '20'
    }
  })

  console.log('Productos creados:')
  console.log('Monthly Price ID:', monthlyPrice.id)
  console.log('Yearly Price ID:', yearlyPrice.id)
}

setupProducts()
```

### 2.2 Checkout Flow

**Tabla en Supabase: `subscriptions`**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT NOT NULL,
  plan TEXT CHECK (plan IN ('free', 'pro')) NOT NULL,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMP,
  coupon_code TEXT,
  discount_percentage DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
```

**API Checkout:**
```typescript
// app/api/checkout/create-session/route.ts
import Stripe from 'stripe'

export async function POST(request: Request) {
  const { priceId, userId, couponCode } = await request.json()

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  // Validar cupón si existe
  let coupon = null
  if (couponCode) {
    const { data: validCoupon } = await supabase
      .from('discount_coupons')
      .select('*')
      .eq('code', couponCode)
      .eq('is_active', true)
      .single()

    if (validCoupon && isValidCoupon(validCoupon)) {
      // Crear cupón en Stripe
      coupon = await stripe.coupons.create({
        percent_off: validCoupon.discount_value,
        duration: 'once', // o 'repeating' si quieres que aplique múltiples meses
        name: `Cupón ${couponCode}`
      })
    }
  }

  // Crear/obtener customer
  let customerId = await getStripeCustomerId(userId)
  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { userId }
    })
    customerId = customer.id
    await saveStripeCustomerId(userId, customerId)
  }

  // Crear sesión de checkout
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    discounts: coupon ? [{ coupon: coupon.id }] : [],
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        userId,
        couponCode: couponCode || '',
      }
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/hanna/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/hanna/upgrade?canceled=true`,
    metadata: {
      userId,
      couponCode: couponCode || '',
    }
  })

  return NextResponse.json({ sessionId: session.id, url: session.url })
}
```

### 2.3 Webhooks de Stripe

**Endpoint: `/api/webhooks/stripe`**

Eventos importantes a manejar:
```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object)
      break

    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object)
      break

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object)
      break

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object)
      break

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object)
      break
  }

  return NextResponse.json({ received: true })
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  const couponCode = subscription.metadata.couponCode

  // Actualizar profile a Pro
  await supabase
    .from('profiles')
    .update({ plan: 'pro' })
    .eq('id', userId)

  // Guardar suscripción
  await supabase.from('subscriptions').insert({
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items.data[0].price.id,
    plan: 'pro',
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    coupon_code: couponCode || null,
  })

  // Track uso de cupón
  if (couponCode) {
    const { data: coupon } = await supabase
      .from('discount_coupons')
      .select('*')
      .eq('code', couponCode)
      .single()

    if (coupon) {
      await supabase.from('coupon_redemptions').insert({
        coupon_id: coupon.id,
        user_id: userId,
        subscription_id: subscription.id,
        discount_amount: calculateDiscount(subscription, coupon),
      })

      // Incrementar contador
      await supabase
        .from('discount_coupons')
        .update({ times_used: coupon.times_used + 1 })
        .eq('id', coupon.id)
    }
  }
}
```

---

## 📋 Fase 3: Métricas de Uso

### 3.1 Tracking de Costos de API

**Tabla en Supabase: `api_usage_logs`**
```sql
CREATE TABLE api_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID,
  model TEXT NOT NULL, -- 'gpt-4o-mini', 'claude-3.5-sonnet'
  client_type TEXT CHECK (client_type IN ('workshop', 'saas')) NOT NULL,
  user_plan TEXT CHECK (user_plan IN ('free', 'pro')) NOT NULL,

  -- Token usage
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,

  -- Cost calculation (en USD)
  input_cost DECIMAL(10,6) NOT NULL,
  output_cost DECIMAL(10,6) NOT NULL,
  total_cost DECIMAL(10,6) NOT NULL,

  -- Response metadata
  response_time_ms INTEGER,
  was_successful BOOLEAN DEFAULT TRUE,
  error_message TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_logs_user ON api_usage_logs(user_id, created_at);
CREATE INDEX idx_usage_logs_date ON api_usage_logs(created_at);
CREATE INDEX idx_usage_logs_plan ON api_usage_logs(user_plan, created_at);
```

**Actualizar route.ts para logging:**
```typescript
// app/api/hanna/chat/route.ts

// Después de recibir respuesta de OpenRouter
const responseText = completion.choices[0]?.message?.content || ''
const tokensUsed = completion.usage?.total_tokens || 0
const inputTokens = completion.usage?.prompt_tokens || 0
const outputTokens = completion.usage?.completion_tokens || 0

// Calcular costos basados en modelo
const costs = calculateCosts(selectedModel, inputTokens, outputTokens)

// Log usage to database
if (userId) {
  await supabaseAdmin.from('api_usage_logs').insert({
    user_id: userId,
    session_id: sessionId,
    model: selectedModel,
    client_type: clientType,
    user_plan: messageLimit.plan,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    total_tokens: tokensUsed,
    input_cost: costs.inputCost,
    output_cost: costs.outputCost,
    total_cost: costs.totalCost,
    was_successful: true,
  })
}

function calculateCosts(model: string, inputTokens: number, outputTokens: number) {
  const pricing = {
    'openai/gpt-4o-mini': {
      input: 0.15 / 1_000_000,  // $0.15 per 1M tokens
      output: 0.60 / 1_000_000,  // $0.60 per 1M tokens
    },
    'anthropic/claude-3.5-sonnet': {
      input: 3.00 / 1_000_000,   // $3 per 1M tokens
      output: 15.00 / 1_000_000, // $15 per 1M tokens
    }
  }

  const modelPricing = pricing[model] || pricing['openai/gpt-4o-mini']

  return {
    inputCost: inputTokens * modelPricing.input,
    outputCost: outputTokens * modelPricing.output,
    totalCost: (inputTokens * modelPricing.input) + (outputTokens * modelPricing.output)
  }
}
```

### 3.2 Dashboard de Analytics

**SQL Views para métricas:**
```sql
-- Vista: Costos por día
CREATE VIEW daily_costs AS
SELECT
  DATE(created_at) as date,
  user_plan,
  client_type,
  model,
  COUNT(*) as total_requests,
  SUM(total_tokens) as total_tokens,
  SUM(total_cost) as total_cost,
  AVG(response_time_ms) as avg_response_time
FROM api_usage_logs
WHERE was_successful = TRUE
GROUP BY DATE(created_at), user_plan, client_type, model
ORDER BY date DESC;

-- Vista: Costos por usuario (Top spenders)
CREATE VIEW user_costs AS
SELECT
  u.id as user_id,
  u.email,
  p.plan,
  COUNT(l.id) as total_requests,
  SUM(l.total_cost) as total_cost,
  SUM(l.total_tokens) as total_tokens,
  AVG(l.response_time_ms) as avg_response_time,
  MAX(l.created_at) as last_used
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN api_usage_logs l ON l.user_id = u.id
WHERE l.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.email, p.plan
ORDER BY total_cost DESC;

-- Vista: Métricas generales
CREATE VIEW general_metrics AS
SELECT
  COUNT(DISTINCT user_id) as total_active_users,
  COUNT(*) as total_requests,
  SUM(total_cost) as total_cost,
  AVG(total_cost) as avg_cost_per_request,
  SUM(CASE WHEN user_plan = 'pro' THEN total_cost ELSE 0 END) as pro_costs,
  SUM(CASE WHEN user_plan = 'free' THEN total_cost ELSE 0 END) as free_costs
FROM api_usage_logs
WHERE created_at >= NOW() - INTERVAL '30 days';
```

**API para Analytics:**
```typescript
// app/api/admin/analytics/overview/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || '30' // días

  const { data: metrics } = await supabase
    .from('general_metrics')
    .select('*')
    .single()

  const { data: dailyCosts } = await supabase
    .from('daily_costs')
    .select('*')
    .order('date', { ascending: false })
    .limit(parseInt(period))

  const { data: topUsers } = await supabase
    .from('user_costs')
    .select('*')
    .order('total_cost', { ascending: false })
    .limit(10)

  return NextResponse.json({
    overview: metrics,
    daily_costs: dailyCosts,
    top_users: topUsers,
  })
}
```

---

## 🎨 UI Componentes del Admin Panel

### Dashboard Principal (`/admin`)
```typescript
// Métricas resumen:
- Total usuarios activos (últimos 30 días)
- Ingresos mensuales (MRR)
- Costos de API mensuales
- Margen de ganancia
- Gráfica de costos por día
- Top 5 usuarios por uso
- Conversiones Free → Pro (últimos 30 días)
```

### Gestión de Cupones (`/admin/coupons`)
```typescript
// Tabla de cupones:
- Código
- Tipo (% o fijo)
- Descuento
- Usos (X/Max)
- Válido hasta
- Estado (Activo/Inactivo)
- Acciones (Editar, Desactivar)

// Botón: "Crear Nuevo Cupón"
// Form:
- Código (auto-generar o manual)
- Tipo de descuento
- Valor
- Máximo de usos
- Fecha de expiración
- Planes aplicables
```

### Analytics (`/admin/analytics`)
```typescript
// Filtros:
- Período (7d, 30d, 90d, Todo)
- Plan (All, Free, Pro)
- Modelo (All, GPT-4o-mini, Claude 3.5 Sonnet)

// Métricas:
- Gráfica de costos por día
- Distribución de costos por modelo
- Usuarios activos por plan
- Promedio de mensajes por usuario
- Cost per user (CPUs)
- Tabla de top usuarios con más uso
```

---

## 💡 Opciones de Mejora

### Opción A: Sistema Básico (Recomendado MVP)
**Incluye:**
- ✅ Panel admin con auth básica
- ✅ CRUD de cupones
- ✅ Stripe checkout + webhooks
- ✅ Tracking de costos básico
- ✅ Dashboard de métricas simple

**Tiempo estimado:** 15-20 horas
**Costo dev:** ~$0 (solo tiempo)

---

### Opción B: Sistema Avanzado
**Incluye todo de A +:**
- ✅ Multi-admin con roles (super_admin, admin, support)
- ✅ Notificaciones email automáticas (nuevas suscripciones, cancelaciones)
- ✅ Exportar reportes a CSV/PDF
- ✅ Alertas cuando costos superan umbral
- ✅ A/B testing de precios
- ✅ Retargeting de usuarios que cancelaron

**Tiempo estimado:** 30-40 horas

---

### Opción C: Enterprise (Máximo)
**Incluye todo de B +:**
- ✅ Analytics en tiempo real con WebSockets
- ✅ Predicción de costos con ML
- ✅ Integración con Slack para alertas
- ✅ Segmentación avanzada de usuarios
- ✅ Customer success dashboard
- ✅ Automated refunds y créditos

**Tiempo estimado:** 50-60 horas

---

## 🚀 Recomendación

**Empezar con Opción A (MVP)** porque:
1. Cubre todas las necesidades inmediatas
2. Rápido de implementar (2-3 semanas)
3. Puedes iterar basado en datos reales
4. Bajo riesgo de over-engineering

**Luego evolucionar a B cuando:**
- Tengas >100 usuarios Pro activos
- Los costos de API superen $500/mes
- Necesites optimizar conversiones

---

## 📊 Priorización de Tareas

### Sprint 1 (Semana 1-2): Fundamentos
1. ✅ Setup de tablas en Supabase
2. ✅ Middleware de admin auth
3. ✅ CRUD de cupones (backend + UI)
4. ✅ Tracking de costos en API

### Sprint 2 (Semana 3-4): Stripe Integration
5. ✅ Setup productos en Stripe
6. ✅ Checkout flow completo
7. ✅ Webhooks de suscripciones
8. ✅ Página de /upgrade mejorada

### Sprint 3 (Semana 5-6): Analytics
9. ✅ Dashboard de admin
10. ✅ Vistas de SQL optimizadas
11. ✅ Gráficas de costos
12. ✅ Testing end-to-end

---

## 💰 Estimación de Costos Operacionales

Con el sistema de tracking implementado:

**Costos actuales estimados:**
- 100 usuarios Pro × $2.61/mes = **$261/mes**
- 500 usuarios Free × $0.05/mes = **$25/mes**
- **Total:** ~$286/mes en API

**Ingresos proyectados:**
- 100 usuarios Pro × $19.99/mes = **$1,999/mes**
- **Margen bruto:** $1,713/mes (86%)

**Con el dashboard podrás:**
- Ver costos en tiempo real
- Identificar usuarios que abusan del sistema
- Optimizar modelos por plan
- Pronosticar costos futuros

---

¿Quieres que empiece con la **Opción A (MVP)** o prefieres alguna modificación al plan?
