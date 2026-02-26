import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.includes('placeholder') || url.includes('YOUR_SUPABASE_URL')) {
    // Return a client that will fail gracefully or throw if used
    // In browser, we might just return the client and let it fail, 
    // but throwing is more explicit.
    console.warn('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  return createBrowserClient(
    url || 'https://placeholder.supabase.co',
    key || 'placeholder',
    {
      cookieOptions: {
        sameSite: 'none',
        secure: true,
      },
    }
  )
}
