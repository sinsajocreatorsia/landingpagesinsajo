/**
 * E2E Test: Workshop Survey Flow
 *
 * Tests the complete flow:
 * 1. Submit survey → get universal coupon code (CHICASPRO2026)
 * 2. Verify duplicate email rejection
 * 3. Verify Google redirect logic (5 stars vs 4 stars)
 * 4. Verify field validation
 * 5. Verify admin endpoint requires auth
 *
 * Usage:
 *   node scripts/test-survey-e2e.mjs
 *   (requires dev server running on localhost:3000-3006)
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

let passed = 0
let failed = 0

function log(status, test, detail) {
  const icon = status === 'PASS' ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m'
  console.log(`  [${icon}] ${test}`)
  if (detail) console.log(`         ${detail}`)
  if (status === 'PASS') passed++
  else failed++
}

async function testSurveySubmission() {
  console.log('\n--- Test 1: Survey Submission (5 stars Google) ---')

  const testEmail = `test-survey-${Date.now()}@example.com`
  const body = {
    overallRating: 5,
    likedMost: ['content', 'methodology'],
    improvements: ['more_practice'],
    suggestions: 'Test suggestion from e2e',
    futureTopics: ['ai_marketing', 'ai_automation'],
    futureTopicsOther: '',
    continuingInterest: 4,
    npsScore: 9,
    communityInterest: 'yes',
    communityValues: ['live_sessions', 'templates'],
    preferredPlatform: 'whatsapp',
    email: testEmail,
    fullName: 'Test User E2E',
    googleRating: 5,
  }

  try {
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (res.status === 200 && data.success) {
      log('PASS', 'Survey submitted successfully')
    } else {
      log('FAIL', 'Survey submission failed', `Status: ${res.status}, Error: ${data.error}`)
      return null
    }

    // Verify universal coupon code
    if (data.couponCode === 'CHICASPRO2026') {
      log('PASS', `Coupon code returned: ${data.couponCode}`)
    } else {
      log('FAIL', 'Expected CHICASPRO2026', `Got: ${data.couponCode}`)
    }

    // Verify Google redirect (5 stars = should redirect)
    if (data.shouldRedirectToGoogle === true) {
      log('PASS', 'Google redirect: true (5 stars)')
    } else {
      log('FAIL', 'Google redirect should be true for 5 stars', `Got: ${data.shouldRedirectToGoogle}`)
    }

    return { email: testEmail, couponCode: data.couponCode }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
    return null
  }
}

async function testDuplicateEmail(email) {
  console.log('\n--- Test 2: Duplicate Email Rejection ---')

  if (!email) {
    log('FAIL', 'Skipped (no email from test 1)')
    return
  }

  const body = {
    overallRating: 3,
    likedMost: [],
    improvements: [],
    suggestions: '',
    futureTopics: [],
    futureTopicsOther: '',
    continuingInterest: 3,
    npsScore: 5,
    communityInterest: 'no',
    communityValues: [],
    preferredPlatform: '',
    email,
    fullName: 'Duplicate Test',
    googleRating: 3,
  }

  try {
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 409) {
      log('PASS', 'Duplicate email correctly rejected (409)')
    } else {
      const data = await res.json()
      log('FAIL', 'Should have returned 409', `Status: ${res.status}, Body: ${JSON.stringify(data)}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }
}

async function testLowGoogleRating() {
  console.log('\n--- Test 3: Low Google Rating (4 stars - no redirect) ---')

  const body = {
    overallRating: 4,
    likedMost: ['speaker'],
    improvements: ['duration'],
    suggestions: '',
    futureTopics: ['ai_branding'],
    futureTopicsOther: '',
    continuingInterest: 3,
    npsScore: 7,
    communityInterest: 'maybe',
    communityValues: ['mentoring'],
    preferredPlatform: 'telegram',
    email: `test-low-${Date.now()}@example.com`,
    fullName: 'Low Rating User',
    googleRating: 4,
  }

  try {
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (res.status === 200 && data.success) {
      log('PASS', 'Survey with 4-star Google submitted')
    } else {
      log('FAIL', 'Survey submission failed', `Error: ${data.error}`)
    }

    if (data.shouldRedirectToGoogle === false) {
      log('PASS', 'Google redirect: false (4 stars)')
    } else {
      log('FAIL', 'Google redirect should be false for 4 stars', `Got: ${data.shouldRedirectToGoogle}`)
    }

    if (data.googleReviewUrl === null || data.googleReviewUrl === undefined) {
      log('PASS', 'Google review URL: null (correct)')
    } else {
      log('FAIL', 'Google review URL should be null', `Got: ${data.googleReviewUrl}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }
}

async function testValidation() {
  console.log('\n--- Test 4: Validation (missing required fields) ---')

  // Missing email
  try {
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        overallRating: 5,
        continuingInterest: 3,
        npsScore: 8,
        communityInterest: 'yes',
        email: '',
        fullName: 'Test',
        googleRating: 5,
      }),
    })

    if (res.status === 400) {
      log('PASS', 'Missing email rejected (400)')
    } else {
      log('FAIL', 'Should reject missing email', `Status: ${res.status}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }

  // Missing rating
  try {
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        overallRating: 0,
        continuingInterest: 3,
        npsScore: 8,
        communityInterest: 'yes',
        email: 'valid@example.com',
        fullName: 'Test',
        googleRating: 5,
      }),
    })

    if (res.status === 400) {
      log('PASS', 'Zero rating rejected (400)')
    } else {
      log('FAIL', 'Should reject zero rating', `Status: ${res.status}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }

  // Invalid NPS
  try {
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        overallRating: 5,
        continuingInterest: 3,
        npsScore: 11,
        communityInterest: 'yes',
        email: 'valid2@example.com',
        fullName: 'Test',
        googleRating: 5,
      }),
    })

    if (res.status === 400) {
      log('PASS', 'Invalid NPS (11) rejected (400)')
    } else {
      log('FAIL', 'Should reject NPS > 10', `Status: ${res.status}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }
}

async function testAdminEndpoint() {
  console.log('\n--- Test 5: Admin Surveys API ---')

  try {
    // Without auth should fail
    const res = await fetch(`${BASE_URL}/api/admin/surveys`)

    if (res.status === 401 || res.status === 403) {
      log('PASS', 'Admin endpoint requires auth (401/403)')
    } else {
      log('FAIL', 'Admin endpoint should require auth', `Status: ${res.status}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }
}

async function main() {
  console.log('===========================================')
  console.log('  Workshop Survey E2E Tests')
  console.log(`  Server: ${BASE_URL}`)
  console.log('===========================================')

  // Check if server is running
  try {
    await fetch(`${BASE_URL}/api/workshop/survey`, { method: 'OPTIONS' })
  } catch {
    console.error(`\n  ERROR: Server not reachable at ${BASE_URL}`)
    console.error('  Start dev server first: npm run dev\n')
    process.exit(1)
  }

  const result1 = await testSurveySubmission()
  await testDuplicateEmail(result1?.email)
  await testLowGoogleRating()
  await testValidation()
  await testAdminEndpoint()

  console.log('\n===========================================')
  console.log(`  Results: ${passed} passed, ${failed} failed`)
  console.log('===========================================\n')

  process.exit(failed > 0 ? 1 : 0)
}

main()
