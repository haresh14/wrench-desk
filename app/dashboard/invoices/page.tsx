import { createClient } from '@/lib/supabase/server'
import { InvoicesView } from '@/components/invoices-view'

export default async function InvoicesPage() {
  const supabase = await createClient()

  // Fetch invoices with customer details
  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select(`
      *,
      customers (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  // Fetch customers for the invoice dialog
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('id, name')
    .order('name', { ascending: true })

  if (invoicesError) console.error('Error fetching invoices:', invoicesError)
  if (customersError) console.error('Error fetching customers:', customersError)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <InvoicesView 
        initialInvoices={invoices || []} 
        customers={customers || []} 
      />
    </div>
  )
}
