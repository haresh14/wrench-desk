'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const company_name = formData.get('company_name') as string
    const business_address = formData.get('business_address') as string
    const service_areas = formData.get('service_areas') as string

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('settings')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const payload = {
      company_name,
      business_address,
      service_areas,
      user_id: user.id
    }

    if (existingSettings) {
      const { error } = await supabase
        .from('settings')
        .update(payload)
        .eq('user_id', user.id)
      
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('settings')
        .insert(payload)
      
      if (error) throw error
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (e: any) {
    console.error('Settings update error:', e)
    return { error: e.message || 'Failed to update settings' }
  }
}
