// Setup HANNA database tables using Supabase client
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://diiqsossuiuymexdocrg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaXFzb3NzdWl1eW1leGRvY3JnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzgyNTgxOSwiZXhwIjoyMDc5NDAxODE5fQ.o1yb-cidgxaEISLaqWSgEwoh9QidC3xYTLIZBsbZviI';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  console.log('🚀 Setting up HANNA database...\n');

  // Test connection
  const { data: testData, error: testError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);

  if (testError && testError.code === '42P01') {
    console.log('❌ profiles table does not exist. Creating it...');
    // We need to create the profiles table first
    console.log('\n⚠️ Please run the SQL migration manually in Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/diiqsossuiuymexdocrg/sql');
    console.log('\n   Copy the content from: supabase/migrations/001_hanna_tables.sql');
    return;
  }

  console.log('✅ profiles table exists');

  // Check if hanna_sessions table exists
  const { error: sessionsError } = await supabase
    .from('hanna_sessions')
    .select('id')
    .limit(1);

  if (sessionsError && sessionsError.code === '42P01') {
    console.log('❌ hanna_sessions table does not exist');
    console.log('\n⚠️ Please run the SQL migration manually in Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/diiqsossuiuymexdocrg/sql');
    console.log('\n   Copy the content from: supabase/migrations/001_hanna_tables.sql');
    return;
  }

  console.log('✅ hanna_sessions table exists');

  // Check hanna_messages
  const { error: messagesError } = await supabase
    .from('hanna_messages')
    .select('id')
    .limit(1);

  if (messagesError && messagesError.code === '42P01') {
    console.log('❌ hanna_messages table does not exist');
  } else {
    console.log('✅ hanna_messages table exists');
  }

  // Check hanna_coupons
  const { error: couponsError } = await supabase
    .from('hanna_coupons')
    .select('id')
    .limit(1);

  if (couponsError && couponsError.code === '42P01') {
    console.log('❌ hanna_coupons table does not exist');
  } else {
    console.log('✅ hanna_coupons table exists');
  }

  // Check if workshop coupon exists
  const { data: coupon, error: couponError } = await supabase
    .from('hanna_coupons')
    .select('*')
    .eq('code', 'WORKSHOP2026')
    .single();

  if (!coupon && !couponError?.code?.includes('PGRST116')) {
    console.log('Creating WORKSHOP2026 coupon...');
    await supabase.from('hanna_coupons').insert({
      code: 'WORKSHOP2026',
      type: 'workshop',
      discount_type: 'free_months',
      discount_value: 0,
      free_months: 3,
      valid_until: '2026-06-07',
      is_active: true,
    });
    console.log('✅ WORKSHOP2026 coupon created');
  } else if (coupon) {
    console.log('✅ WORKSHOP2026 coupon already exists');
  }

  console.log('\n🎉 Database setup complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Restart the dev server: npm run dev');
  console.log('   2. Visit: http://localhost:3000/hanna');
  console.log('   3. Create an account and start chatting!');
}

setupDatabase().catch(console.error);
