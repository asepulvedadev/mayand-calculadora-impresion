import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
}

// Legacy singleton client - kept for backward compatibility with storage.ts and client components.
// For new code, prefer:
//   - src/lib/supabase/client.ts (browser)
//   - src/lib/supabase/server.ts (server components / API routes)
//   - src/lib/supabase/admin.ts  (service-role, API routes only)
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
