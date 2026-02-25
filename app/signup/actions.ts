'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient()

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        data: {
          company_name: formData.get('company_name') as string,
        }
      }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
      let message = error.message
      if (message.includes('is not valid JSON') || message.includes('Unexpected token')) {
        message = 'Supabase configuration error. Please ensure your Supabase URL and Anon Key are correctly set in the secrets panel.'
      }
      return redirect('/signup?error=' + encodeURIComponent(message))
    }

    revalidatePath('/', 'layout')
    return redirect('/dashboard')
  } catch (error) {
    if (isRedirectError(error)) throw error
    console.error('Signup error:', error)
    let message = 'An unexpected error occurred during signup'
    if (error instanceof Error && (error.message.includes('is not valid JSON') || error.message.includes('Unexpected token'))) {
      message = 'Supabase configuration error. Please ensure your Supabase URL and Anon Key are correctly set in the secrets panel.'
    }
    return redirect('/signup?error=' + encodeURIComponent(message))
  }
}
