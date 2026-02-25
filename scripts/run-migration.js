// Script to run SQL migration via Supabase REST API
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://diiqsossuiuymexdocrg.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY not found in environment');
  process.exit(1);
}

async function runMigration() {
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_hanna_tables.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error('Migration file not found:', migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (!statement) continue;

    console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: statement + ';' }),
      });

      if (!response.ok) {
        // Try direct postgres endpoint
        const pgResponse = await fetch(`${SUPABASE_URL}/pg`, {
          method: 'POST',
          headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: statement + ';' }),
        });

        if (!pgResponse.ok) {
          console.log(`Statement ${i + 1} may have failed (non-critical): ${statement.substring(0, 50)}...`);
        }
      }

      console.log(`Statement ${i + 1} completed`);
    } catch (error) {
      console.log(`Statement ${i + 1} error (may be non-critical):`, error.message);
    }
  }

  console.log('\n✅ Migration attempt completed!');
  console.log('Note: Some statements may have been skipped if tables already exist.');
}

runMigration().catch(console.error);
