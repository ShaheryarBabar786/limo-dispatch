const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[SUPABASE] ❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('[SUPABASE] 🔧 Config:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
  key: supabaseKey ? `${supabaseKey.substring(0, 10)}...` : 'missing'
});

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// Enhanced connection test
(async () => {
  try {
    console.log('[SUPABASE] 🔄 Testing connection...');
    
    // Test 1: Simple query
    const { data, error } = await supabase.from('admin_users').select('count').limit(1);
    
    if (error) {
      console.error('[SUPABASE] ❌ Connection test failed:', error.message);
      console.error('[SUPABASE] 💡 Error details:', {
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    } else {
      console.log('[SUPABASE] ✅ Connected successfully');
    }

    // Test 2: Check if table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .ilike('table_name', 'admin_users');

    if (!tablesError && tables) {
      console.log('[SUPABASE] 📊 Tables found:', tables);
    }

  } catch (err) {
    console.error('[SUPABASE] ❌ Unexpected error:', err.message);
  }
})();

module.exports = supabase;