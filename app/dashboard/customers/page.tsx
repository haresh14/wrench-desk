import { createClient } from '@/lib/supabase/server'
import { CustomerList } from '@/components/customer-list'

import { PageTransition } from '@/components/page-transition'

export default async function CustomersPage() {
  const supabase = await createClient()
  
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customers:', error)
  }

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <CustomerList initialCustomers={customers || []} />
      </div>
    </PageTransition>
  )
}
