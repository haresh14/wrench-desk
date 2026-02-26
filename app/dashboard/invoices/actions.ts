'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInvoice(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const customer_id = formData.get('customer_id') as string
    const amount = parseFloat(formData.get('amount') as string)
    const status = formData.get('status') as string
    const due_date = formData.get('due_date') as string
    const invoice_number = formData.get('invoice_number') as string

    if (!customer_id || isNaN(amount)) {
      return { error: 'Customer and Amount are required' }
    }

    const payload = {
      customer_id,
      amount,
      status: status || 'Pending',
      due_date: due_date || null,
      invoice_number: invoice_number || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      user_id: user.id
    }

    const { error } = await supabase.from('invoices').insert(payload)

    if (error) {
      console.error('Supabase Insert Error:', error)
      return { error: error.message || 'Database insertion failed' }
    }

    revalidatePath('/dashboard/invoices')
    return { success: true }
  } catch (e: any) {
    console.error('Server action error:', e)
    return { error: e.message || 'An unexpected error occurred' }
  }
}

export async function updateInvoice(id: string, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const customer_id = formData.get('customer_id') as string
    const amount = parseFloat(formData.get('amount') as string)
    const status = formData.get('status') as string
    const due_date = formData.get('due_date') as string
    const invoice_number = formData.get('invoice_number') as string

    const payload = { 
      customer_id, 
      amount, 
      status, 
      due_date: due_date || null, 
      invoice_number 
    }

    const { error } = await supabase
      .from('invoices')
      .update(payload)
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Supabase Update Error:', error)
      return { error: error.message || 'Database update failed' }
    }

    revalidatePath('/dashboard/invoices')
    return { success: true }
  } catch (e: any) {
    console.error('Server action error:', e)
    return { error: e.message || 'An unexpected error occurred' }
  }
}

export async function deleteInvoice(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Supabase error:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard/invoices')
    return { success: true }
  } catch (e) {
    console.error('Server action error:', e)
    return { error: 'An unexpected error occurred' }
  }
}
