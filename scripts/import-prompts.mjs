// Import prompts from awesome-nano-banana-pro-prompts GitHub repo
// Usage: node scripts/import-prompts.mjs [--limit=50] [--dry-run]
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://diiqsossuiuymexdocrg.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY. Set it as env var or edit this file.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const README_URL = 'https://raw.githubusercontent.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts/main/README.md'

// Parse CLI args
const args = process.argv.slice(2)
const limitArg = args.find(a => a.startsWith('--limit='))
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1]) : 0
const DRY_RUN = args.includes('--dry-run')

function parsePrompts(markdown) {
  const prompts = []
  // Split by prompt headers: ### No. X: Title
  const sections = markdown.split(/^### No\. (\d+):/m)

  // sections[0] = intro text before first prompt
  // sections[1] = "1", sections[2] = " Title...\n...content...", etc.
  for (let i = 1; i < sections.length; i += 2) {
    const num = sections[i]
    const body = sections[i + 1]
    if (!body) continue

    const prompt = parsePromptSection(num, body)
    if (prompt) prompts.push(prompt)
  }

  return prompts
}

function parsePromptSection(num, body) {
  const lines = body.split('\n')

  // Title: first line (rest of the ### heading)
  const title = lines[0].trim()
  if (!title) return null

  // Badges -> extract language and featured
  const languageBadge = body.match(/Language-(\w+)/i)
  const language = languageBadge ? languageBadge[1].toLowerCase() : 'en'
  const isFeatured = /Featured/i.test(body)

  // Description: between "#### 📖 Description" and next "####"
  const descMatch = body.match(/####\s*📖\s*Description\s*\n([\s\S]*?)(?=####|$)/)
  const description = descMatch ? descMatch[1].trim() : null

  // Prompt content: code block after "#### 📝 Prompt"
  const promptMatch = body.match(/####\s*📝\s*Prompt\s*\n[\s\S]*?```[^\n]*\n([\s\S]*?)```/)
  const content = promptMatch ? promptMatch[1].trim() : null
  if (!content) return null

  // Images: extract from <img src="URL" ... >
  const images = []
  const imgRegex = /<img\s+src="([^"]+)"[^>]*(?:width="(\d+)")?[^>]*(?:alt="([^"]*)")?[^>]*>/gi
  let imgMatch
  while ((imgMatch = imgRegex.exec(body)) !== null) {
    images.push({
      url: imgMatch[1],
      width: imgMatch[2] ? parseInt(imgMatch[2]) : undefined,
      alt: imgMatch[3] || title,
    })
  }

  // Author
  const authorMatch = body.match(/\*\*Author:\*\*\s*\[([^\]]+)\]\(([^)]+)\)/)
  const author = authorMatch ? authorMatch[1] : null

  // Source link
  const sourceMatch = body.match(/\*\*Source:\*\*\s*\[([^\]]+)\]\(([^)]+)\)/)
  const sourceLink = sourceMatch ? sourceMatch[2] : null

  // Categories: try to extract from badges or content keywords
  const categories = extractCategories(title, description, content)

  return {
    source_external_id: `nbp-${num}`,
    title: title.substring(0, 200),
    description,
    content,
    language,
    author,
    source_link: sourceLink,
    is_featured: isFeatured,
    media: images,
    use_cases: categories.use_cases,
    styles: categories.styles,
    subjects: categories.subjects,
  }
}

function extractCategories(title, description, content) {
  const text = `${title} ${description || ''} ${content}`.toLowerCase()

  const use_cases = []
  const styles = []
  const subjects = []

  // Use cases
  const useCaseMap = {
    'quote card': 'quote-card',
    'social media': 'social-media',
    'wallpaper': 'wallpaper',
    'poster': 'poster',
    'logo': 'logo',
    'icon': 'icon',
    'avatar': 'avatar',
    'banner': 'banner',
    'book cover': 'book-cover',
    'album cover': 'album-cover',
    'product photo': 'product-photo',
    'fashion': 'fashion',
    'food': 'food-photography',
    'architecture': 'architecture',
    'landscape': 'landscape',
    'portrait': 'portrait',
    'illustration': 'illustration',
    'sticker': 'sticker',
    'pattern': 'pattern',
    'texture': 'texture',
    'mockup': 'mockup',
    'ui design': 'ui-design',
    'web design': 'web-design',
    'infographic': 'infographic',
  }
  for (const [keyword, slug] of Object.entries(useCaseMap)) {
    if (text.includes(keyword)) use_cases.push(slug)
  }

  // Styles
  const styleMap = {
    'photorealistic': 'photorealistic',
    'realistic': 'realistic',
    'anime': 'anime',
    'cartoon': 'cartoon',
    '3d': '3d-render',
    'pixel art': 'pixel-art',
    'watercolor': 'watercolor',
    'oil painting': 'oil-painting',
    'sketch': 'sketch',
    'line art': 'line-art',
    'minimalist': 'minimalist',
    'vintage': 'vintage',
    'retro': 'retro',
    'cyberpunk': 'cyberpunk',
    'fantasy': 'fantasy',
    'surreal': 'surreal',
    'abstract': 'abstract',
    'pop art': 'pop-art',
    'flat design': 'flat-design',
    'isometric': 'isometric',
    'cinematic': 'cinematic',
    'noir': 'noir',
    'pastel': 'pastel',
    'neon': 'neon',
    'gothic': 'gothic',
    'steampunk': 'steampunk',
    'vaporwave': 'vaporwave',
    'low poly': 'low-poly',
    'claymation': 'claymation',
    'studio ghibli': 'studio-ghibli',
  }
  for (const [keyword, slug] of Object.entries(styleMap)) {
    if (text.includes(keyword)) styles.push(slug)
  }

  // Subjects
  const subjectMap = {
    'person': 'people',
    'people': 'people',
    'woman': 'people',
    'man': 'people',
    'child': 'people',
    'animal': 'animals',
    'cat': 'animals',
    'dog': 'animals',
    'bird': 'animals',
    'nature': 'nature',
    'flower': 'nature',
    'tree': 'nature',
    'mountain': 'nature',
    'ocean': 'nature',
    'city': 'urban',
    'building': 'urban',
    'street': 'urban',
    'car': 'vehicles',
    'vehicle': 'vehicles',
    'robot': 'sci-fi',
    'space': 'sci-fi',
    'dragon': 'fantasy-creatures',
    'monster': 'fantasy-creatures',
    'food': 'food',
    'fruit': 'food',
    'interior': 'interior-design',
    'room': 'interior-design',
    'fashion': 'fashion',
    'clothing': 'fashion',
    'jewelry': 'accessories',
  }
  for (const [keyword, slug] of Object.entries(subjectMap)) {
    if (text.includes(keyword)) subjects.push(slug)
  }

  return {
    use_cases: [...new Set(use_cases)],
    styles: [...new Set(styles)],
    subjects: [...new Set(subjects)],
  }
}

async function importPrompts() {
  console.log('Fetching README from GitHub...')
  const response = await fetch(README_URL)
  if (!response.ok) {
    console.error(`Failed to fetch README: ${response.status}`)
    process.exit(1)
  }

  const markdown = await response.text()
  console.log(`README size: ${(markdown.length / 1024).toFixed(0)} KB`)

  console.log('Parsing prompts...')
  let prompts = parsePrompts(markdown)
  console.log(`Parsed ${prompts.length} prompts`)

  if (LIMIT > 0) {
    prompts = prompts.slice(0, LIMIT)
    console.log(`Limited to ${prompts.length} prompts`)
  }

  if (prompts.length === 0) {
    console.error('No prompts found. Check the README format.')
    process.exit(1)
  }

  // Show sample
  console.log('\nSample prompt:')
  console.log(JSON.stringify(prompts[0], null, 2))

  if (DRY_RUN) {
    console.log(`\n[DRY RUN] Would import ${prompts.length} prompts`)
    console.log(`Categories found:`)
    const allUseCases = new Set()
    const allStyles = new Set()
    const allSubjects = new Set()
    for (const p of prompts) {
      p.use_cases.forEach(c => allUseCases.add(c))
      p.styles.forEach(c => allStyles.add(c))
      p.subjects.forEach(c => allSubjects.add(c))
    }
    console.log(`  Use cases (${allUseCases.size}): ${[...allUseCases].join(', ')}`)
    console.log(`  Styles (${allStyles.size}): ${[...allStyles].join(', ')}`)
    console.log(`  Subjects (${allSubjects.size}): ${[...allSubjects].join(', ')}`)
    return
  }

  // Test DB connection
  const { error: testError } = await supabase.from('profiles').select('id').limit(1)
  if (testError) {
    console.error('DB connection failed:', testError.message)
    process.exit(1)
  }
  console.log('DB connection OK')

  // Extract and insert categories
  console.log('\nInserting categories...')
  const categoryMap = new Map()
  for (const p of prompts) {
    for (const slug of p.use_cases) categoryMap.set(`use_case:${slug}`, { type: 'use_case', slug, label: slug.replace(/-/g, ' ') })
    for (const slug of p.styles) categoryMap.set(`style:${slug}`, { type: 'style', slug, label: slug.replace(/-/g, ' ') })
    for (const slug of p.subjects) categoryMap.set(`subject:${slug}`, { type: 'subject', slug, label: slug.replace(/-/g, ' ') })
  }

  const categories = [...categoryMap.values()]
  if (categories.length > 0) {
    const { error: catError } = await supabase
      .from('hanna_prompt_categories')
      .upsert(categories, { onConflict: 'type,slug', ignoreDuplicates: true })
    if (catError) console.error('Category insert error:', catError.message)
    else console.log(`Inserted ${categories.length} categories`)
  }

  // Batch insert prompts
  console.log('\nInserting prompts...')
  const BATCH_SIZE = 100
  let inserted = 0
  let errors = 0

  for (let i = 0; i < prompts.length; i += BATCH_SIZE) {
    const batch = prompts.slice(i, i + BATCH_SIZE)
    const { error } = await supabase
      .from('hanna_prompt_library')
      .upsert(batch, { onConflict: 'source_external_id', ignoreDuplicates: true })

    if (error) {
      console.error(`Batch ${i / BATCH_SIZE + 1} error:`, error.message)
      errors++
    } else {
      inserted += batch.length
      process.stdout.write(`  ${inserted}/${prompts.length}\r`)
    }
  }

  console.log(`\nDone! Inserted: ${inserted}, Errors: ${errors}`)

  // Update category counts
  console.log('Updating category counts...')
  for (const cat of categories) {
    const { count } = await supabase
      .from('hanna_prompt_library')
      .select('id', { count: 'exact', head: true })
      .contains(cat.type === 'use_case' ? 'use_cases' : cat.type === 'style' ? 'styles' : 'subjects', [cat.slug])

    await supabase
      .from('hanna_prompt_categories')
      .update({ prompt_count: count || 0 })
      .eq('type', cat.type)
      .eq('slug', cat.slug)
  }
  console.log('Category counts updated')
}

importPrompts().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
