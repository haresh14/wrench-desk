'use client'

import { useState } from 'react'
import { Search, MoreHorizontal, Mail, Phone, Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CustomerDialog } from './customer-dialog'
import { deleteCustomer } from '@/app/dashboard/customers/actions'

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  status: string
}

interface CustomerListProps {
  initialCustomers: Customer[]
}

export function CustomerList({ initialCustomers }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const filteredCustomers = initialCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  )

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
    setActiveMenu(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id)
      } catch (error) {
        console.error('Error deleting customer:', error)
        alert('Failed to delete customer.')
      }
    }
    setActiveMenu(null)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Customers</h1>
          <p className="text-zinc-600 mt-1">Manage your customer database and service history.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedCustomer(null)
            setIsDialogOpen(true)
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          Add Customer
        </button>
      </div>

      <Card>
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search customers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900">{customer.name}</div>
                        <div className="text-xs text-zinc-500 truncate max-w-[150px]">ID: {customer.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {customer.email && (
                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 max-w-xs truncate">
                        {customer.address}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                          customer.status === 'Lead' ? 'bg-blue-100 text-blue-800' :
                          'bg-zinc-100 text-zinc-800'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === customer.id ? null : customer.id)}
                          className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        
                        {activeMenu === customer.id && (
                          <div className="absolute right-6 top-12 z-10 w-32 bg-white rounded-lg shadow-lg border border-zinc-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <button 
                              onClick={() => handleEdit(customer)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 text-left"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(customer.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <CustomerDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        customer={selectedCustomer}
      />
    </>
  )
}
