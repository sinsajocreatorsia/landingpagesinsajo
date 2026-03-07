/**
 * E2E Test: Workshop Survey Flow v2
 *
 * Tests the complete flow:
 * 1. Submit survey with all v2 fields -> get universal coupon code (CHICASPRO2026)
 * 2. Verify duplicate email rejection
 * 3. Verify Google redirect logic (5 stars vs 4 stars)
 * 4. Verify field validation (including new required fields)
 * 5. Verify new topic options (ai_software, ai_video)
 * 6. Verify admin endpoint requires auth
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

function makeFullSurvey(overrides = {}) {
  return {
    overallRating: 5,
    likedMost: ['content', 'methodology'],
    improvements: ['more_practice'],
    suggestions: 'Test suggestion from e2e',
    learnedSkills: ['prompting', 'content_with_ai'],
    knowledgeBefore: 2,
    knowledgeAfter: 4,
    firstImplementation: 'social_media_content',
    implementationBarriers: ['lack_of_time'],
    expectationsMet: 5,
    durationFeedback: 'just_right',
    scheduleFeedback: 'perfect',
    preferredFormat: 'hybrid',
    futureTopics: ['ai_marketing', 'ai_automation', 'ai_software', 'ai_video'],
    futureTopicsOther: '',
    continuingInterest: 4,
    willingnessToPay: 'up_to_100',
    npsScore: 9,
    communityInterest: 'yes',
    communityValues: ['live_sessions', 'templates'],
    preferredPlatform: 'whatsapp',
    email: `test-survey-${Date.now()}@example.com`,
    fullName: 'Test User E2E',
    googleRating: 5,
    ...overrides,
  }
}

async function testSurveySubmission() {
  console.log('\n--- Test 1: Full Survey v2 Submission (5 stars Google) ---')

  const body = makeFullSurvey()

  try {
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (res.status === 200 && data.success) {
      log('PASS', 'Survey v2 submitted successfully')
    } else {
      log('FAIL', 'Survey submission failed', `Status: ${res.status}, Error: ${data.error}`)
      return null
    }

    if (data.couponCode === 'CHICASPRO2026') {
      log('PASS', `Coupon code returned: ${data.couponCode}`)
    } else {
      log('FAIL', 'Expected CHICASPRO2026', `Got: ${data.couponCode}`)
    }

    if (data.shouldRedirectToGoogle === true) {
      log('PASS', 'Google redirect: true (5 stars)')
    } else {
      log('FAIL', 'Google redirect should be true for 5 stars', `Got: ${data.shouldRedirectToGoogle}`)
    }

    return { email: body.email, couponCode: data.couponCode }
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

  const body = makeFullSurvey({ email, overallRating: 3, npsScore: 5, googleRating: 3 })

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

  const body = makeFullSurvey({
    email: `test-low-${Date.now()}@example.com`,
    fullName: 'Low Rating User',
    overallRating: 4,
    googleRating: 4,
    npsScore: 7,
    communityInterest: 'maybe',
  })

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
    const body = makeFullSurvey({ email: '' })
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
    const body = makeFullSurvey({ overallRating: 0 })
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
    const body = makeFullSurvey({ npsScore: 11 })
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 400) {
      log('PASS', 'Invalid NPS (11) rejected (400)')
    } else {
      log('FAIL', 'Should reject NPS > 10', `Status: ${res.status}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }

  // Missing knowledgeBefore (NEW v2 required field)
  try {
    const body = makeFullSurvey({ knowledgeBefore: 0 })
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 400) {
      log('PASS', 'Missing knowledgeBefore rejected (400)')
    } else {
      log('FAIL', 'Should reject missing knowledgeBefore', `Status: ${res.status}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }

  // Missing knowledgeAfter (NEW v2 required field)
  try {
    const body = makeFullSurvey({ knowledgeAfter: 0 })
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 400) {
      log('PASS', 'Missing knowledgeAfter rejected (400)')
    } else {
      log('FAIL', 'Should reject missing knowledgeAfter', `Status: ${res.status}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }

  // Missing expectationsMet (NEW v2 required field)
  try {
    const body = makeFullSurvey({ expectationsMet: 0 })
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 400) {
      log('PASS', 'Missing expectationsMet rejected (400)')
    } else {
      log('FAIL', 'Should reject missing expectationsMet', `Status: ${res.status}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }

  // Missing durationFeedback (NEW v2 required field)
  try {
    const body = makeFullSurvey({ durationFeedback: '' })
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.status === 400) {
      log('PASS', 'Missing durationFeedback rejected (400)')
    } else {
      log('FAIL', 'Should reject missing durationFeedback', `Status: ${res.status}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }
}

async function testNewTopicOptions() {
  console.log('\n--- Test 5: New Topic Options (ai_software, ai_video) ---')

  const body = makeFullSurvey({
    email: `test-topics-${Date.now()}@example.com`,
    futureTopics: ['ai_software', 'ai_video'],
  })

  try {
    const res = await fetch(`${BASE_URL}/api/workshop/survey`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (res.status === 200 && data.success) {
      log('PASS', 'Survey with ai_software + ai_video topics accepted')
    } else {
      log('FAIL', 'Survey with new topics failed', `Error: ${data.error}`)
    }
  } catch (err) {
    log('FAIL', 'Request error', err.message)
  }
}

async function testAdminEndpoint() {
  console.log('\n--- Test 6: Admin Surveys API ---')

  try {
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
  console.log('  Workshop Survey E2E Tests v2')
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
  await testNewTopicOptions()
  await testAdminEndpoint()

  console.log('\n===========================================')
  console.log(`  Results: ${passed} passed, ${failed} failed`)
  console.log('===========================================\n')

  process.exit(failed > 0 ? 1 : 0)
}

main()
