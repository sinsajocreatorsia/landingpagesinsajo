import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

if (!STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY not found in environment.')
  console.error('Run with: STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe-hanna.mjs')
  process.exit(1)
}

const stripe = new Stripe(STRIPE_SECRET_KEY)

const PLANS = [
  {
    name: 'Hanna Pro',
    description: 'Mensajes ilimitados, perfil de negocio, voz y modelos AI rápidos.',
    amount: 1900, // $19/month
    metadata: { app: 'hanna', plan: 'pro' },
    envVar: 'STRIPE_PRICE_HANNA_PRO',
  },
  {
    name: 'Hanna Business',
    description: 'Todo en Pro + modelos AI premium (Claude, Gemini Pro), soporte prioritario y exportación.',
    amount: 4900, // $49/month
    metadata: { app: 'hanna', plan: 'business' },
    envVar: 'STRIPE_PRICE_HANNA_BUSINESS',
  },
]

async function setup() {
  console.log('Setting up Hanna subscription products in Stripe...\n')

  const envVars = []

  for (const plan of PLANS) {
    console.log(`--- ${plan.name} ---`)

    // Check if product already exists
    const existingProducts = await stripe.products.list({ limit: 100 })
    const existing = existingProducts.data.find(
      (p) => p.metadata.app === 'hanna' && p.metadata.plan === plan.metadata.plan && p.active
    )

    let productId

    if (existing) {
      console.log(`Product already exists: ${existing.name} (${existing.id})`)
      productId = existing.id

      // Check for existing price
      const prices = await stripe.prices.list({ product: existing.id, active: true })
      const monthlyPrice = prices.data.find(
        (p) => p.recurring?.interval === 'month' && p.unit_amount === plan.amount
      )

      if (monthlyPrice) {
        console.log(`Monthly price already exists: ${monthlyPrice.id} ($${plan.amount / 100}/month)`)
        envVars.push(`${plan.envVar}="${monthlyPrice.id}"`)
        console.log('')
        continue
      }
    } else {
      // Create new product
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: plan.metadata,
      })
      productId = product.id
      console.log(`Product created: ${product.name} (${product.id})`)
    }

    // Create price
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: plan.amount,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: plan.metadata,
    })

    console.log(`Price created: ${price.id} ($${plan.amount / 100}/month)`)
    envVars.push(`${plan.envVar}="${price.id}"`)
    console.log('')
  }

  console.log('========================================')
  console.log('Add these to your .env.local:')
  console.log('========================================')
  for (const envVar of envVars) {
    console.log(envVar)
  }
  console.log('========================================')
  console.log('\nNext steps:')
  console.log('1. Copy the values above to your .env.local')
  console.log('2. Configure webhook in Stripe Dashboard:')
  console.log('   - URL: https://www.screatorsai.com/api/hanna/stripe/webhook')
  console.log('   - Events: checkout.session.completed, customer.subscription.updated,')
  console.log('     customer.subscription.deleted, invoice.payment_failed, invoice.paid')
  console.log('3. Copy the webhook signing secret to .env.local as STRIPE_WEBHOOK_SECRET_HANNA')
  console.log('4. For local testing: stripe listen --forward-to localhost:3000/api/hanna/stripe/webhook')
}

setup().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
