import { createClient } from '@/lib/supabase/server'
import { InvoicesView } from '@/components/invoices-view'

import { PageTransition } from '@/components/page-transition'

export default async function InvoicesPage() {
  const supabase = await createClient()

  // Parallelize data fetching
  const [
    { data: invoices, error: invoicesError },
    { data: customers, error: customersError }
  ] = await Promise.all([
    supabase
      .from('invoices')
      .select(`
        *,
        customers (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false }),
    supabase
      .from('customers')
      .select('id, name')
      .order('name', { ascending: true })
  ])

  if (invoicesError) console.error('Error fetching invoices:', invoicesError)
  if (customersError) console.error('Error fetching customers:', customersError)

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <InvoicesView 
          initialInvoices={invoices || []} 
          customers={customers || []} 
        />
      </div>
    </PageTransition>
  )
}
