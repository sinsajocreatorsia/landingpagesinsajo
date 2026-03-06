import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

if (!STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY not found in environment.')
  console.error('Run with: STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-launch-coupons.mjs')
  process.exit(1)
}

const stripe = new Stripe(STRIPE_SECRET_KEY)

// These coupons should already exist in Stripe dashboard
// This script verifies they are properly configured
const EXPECTED_COUPONS = [
  {
    id: 'HannaPro',
    description: '50% off first month - any plan',
    expectedPercentOff: 50,
  },
  {
    id: 'CHICASPRO2026',
    description: '100% off first month - workshop participants',
    expectedPercentOff: 100,
  },
]

async function verify() {
  console.log('Verifying Hanna coupons in Stripe...\n')

  let allGood = true

  for (const expected of EXPECTED_COUPONS) {
    console.log(`--- ${expected.id} ---`)
    console.log(`  Expected: ${expected.description}`)

    try {
      const coupon = await stripe.coupons.retrieve(expected.id)
      console.log(`  Status: EXISTS`)
      console.log(`  Percent off: ${coupon.percent_off}%`)
      console.log(`  Duration: ${coupon.duration}`)
      console.log(`  Redemptions: ${coupon.times_redeemed}/${coupon.max_redemptions || 'unlimited'}`)

      if (coupon.percent_off !== expected.expectedPercentOff) {
        console.log(`  WARNING: Expected ${expected.expectedPercentOff}% but got ${coupon.percent_off}%`)
        allGood = false
      }
    } catch {
      console.log(`  Status: NOT FOUND - needs to be created in Stripe dashboard`)
      allGood = false
    }
    console.log('')
  }

  console.log('========================================')
  if (allGood) {
    console.log('All coupons verified!')
  } else {
    console.log('Some coupons need attention - see above')
  }
  console.log('========================================')
  console.log('')
  console.log('Coupon mapping:')
  console.log('  HannaPro       -> 50% off first month (promo general)')
  console.log('  CHICASPRO2026  -> 100% off first month (workshop survey reward)')
  console.log('')
  console.log('DB coupon codes must match Stripe coupon IDs exactly.')
}

verify().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
