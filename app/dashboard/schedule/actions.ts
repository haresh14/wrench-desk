'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAppointment(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const customer_id = formData.get('customer_id') as string
    const scheduled_time = formData.get('scheduled_time') as string
    const duration = formData.get('duration') as string
    const job_type = formData.get('job_type') as string
    const technician_name = formData.get('technician_name') as string
    const status = formData.get('status') as string

    if (!customer_id || !scheduled_time) {
      return { error: 'Customer and Scheduled Time are required' }
    }

    // Validate date
    const date = new Date(scheduled_time)
    if (isNaN(date.getTime())) {
      return { error: 'Invalid date format' }
    }

    const payload = {
      customer_id,
      scheduled_time: date.toISOString(),
      duration: duration || '1 hour',
      job_type,
      technician_name,
      status,
      user_id: user.id
    }

    const { error } = await supabase.from('appointments').insert(payload)

    if (error) {
      console.error('Supabase Insert Error:', error)
      return { error: error.message || 'Database insertion failed' }
    }

    revalidatePath('/dashboard/schedule')
    return { success: true }
  } catch (e: any) {
    console.error('Server action error:', e)
    return { error: e.message || 'An unexpected error occurred' }
  }
}

export async function updateAppointment(id: string, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const customer_id = formData.get('customer_id') as string
    const scheduled_time = formData.get('scheduled_time') as string
    const duration = formData.get('duration') as string
    const job_type = formData.get('job_type') as string
    const technician_name = formData.get('technician_name') as string
    const status = formData.get('status') as string

    // Validate date
    const date = new Date(scheduled_time)
    if (isNaN(date.getTime())) {
      return { error: 'Invalid date format' }
    }

    const payload = { 
      customer_id, 
      scheduled_time: date.toISOString(), 
      duration: duration || '1 hour', 
      job_type, 
      technician_name, 
      status 
    }

    const { error } = await supabase
      .from('appointments')
      .update(payload)
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Supabase Update Error:', error)
      return { error: error.message || 'Database update failed' }
    }

    revalidatePath('/dashboard/schedule')
    return { success: true }
  } catch (e: any) {
    console.error('Server action error:', e)
    return { error: e.message || 'An unexpected error occurred' }
  }
}

export async function deleteAppointment(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Supabase error:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard/schedule')
    return { success: true }
  } catch (e) {
    console.error('Server action error:', e)
    return { error: 'An unexpected error occurred' }
  }
}
