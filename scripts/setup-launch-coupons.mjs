import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

if (!STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY not found in environment.')
  console.error('Run with: STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-launch-coupons.mjs')
  process.exit(1)
}

const stripe = new Stripe(STRIPE_SECRET_KEY)

const LAUNCH_COUPONS = [
  {
    id: 'FUNDADOR-PRO-50',
    name: 'FUNDADOR-PRO-50',
    percent_off: 50,
    duration: 'once',
    max_redemptions: 30,
    metadata: { campaign: 'launch-2026', plan: 'pro' },
  },
  {
    id: 'FUNDADOR-BIZ-59',
    name: 'FUNDADOR-BIZ-59',
    percent_off: 59,
    duration: 'once',
    max_redemptions: 20,
    metadata: { campaign: 'launch-2026', plan: 'business' },
  },
]

async function setup() {
  console.log('Setting up Hanna launch coupons in Stripe...\n')

  for (const coupon of LAUNCH_COUPONS) {
    console.log(`--- ${coupon.name} ---`)

    // Check if coupon already exists
    try {
      const existing = await stripe.coupons.retrieve(coupon.id)
      if (existing) {
        console.log(`Coupon already exists: ${existing.id} (${existing.percent_off}% off)`)
        console.log('')
        continue
      }
    } catch {
      // Coupon doesn't exist, create it
    }

    const created = await stripe.coupons.create({
      id: coupon.id,
      name: coupon.name,
      percent_off: coupon.percent_off,
      duration: coupon.duration,
      max_redemptions: coupon.max_redemptions,
      metadata: coupon.metadata,
    })

    console.log(`Coupon created: ${created.id} (${created.percent_off}% off, max ${created.max_redemptions} uses)`)
    console.log('')
  }

  console.log('========================================')
  console.log('Launch coupons ready!')
  console.log('========================================')
  console.log('')
  console.log('Coupons created:')
  console.log('  FUNDADOR-PRO-50: 50% off first month for Pro ($19.99 -> $9.99)')
  console.log('  FUNDADOR-BIZ-59: 59% off first month for Business ($49 -> ~$19.99)')
  console.log('')
  console.log('User-facing coupon code: FUNDADOR')
  console.log('The backend routes the correct Stripe coupon based on selected plan.')
  console.log('')
  console.log('Next steps:')
  console.log('1. Run the Supabase migration: 015_launch_coupons.sql')
  console.log('2. Deploy the updated checkout and webhook routes')
  console.log('3. Verify on /hanna/upgrade that launch pricing shows')
}

setup().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
