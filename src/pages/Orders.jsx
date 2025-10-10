import React, { useState } from 'react'
import { Download, Plus, RefreshCw } from 'lucide-react'
import OrderStatsCards from '../components/OrderStatsCards'
import OrderFilters from '../components/OrderFilters'
import OrdersTable from '../components/OrdersTable'
import OrderDetailsModal from '../components/OrderDetailsModal'

const Orders = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  })

  const [selectedOrder, setSelectedOrder] = useState(null)

  // Sample data - replace with actual API call
  const [orders] = useState([
    {
      id: '2025001',
      customer: 'John Doe',
      email: 'john.doe@example.com',
      books: [
        { title: 'The Great Gatsby', quantity: 1, price: 15.99 },
        { title: 'To Kill a Mockingbird', quantity: 2, price: 12.99 }
      ],
      date: '2025-10-08',
      total: 41.97,
      status: 'delivered'
    },
    {
      id: '2025002',
      customer: 'Jane Smith',
      email: 'jane.smith@example.com',
      books: [
        { title: '1984', quantity: 1, price: 14.99 }
      ],
      date: '2025-10-09',
      total: 14.99,
      status: 'shipped'
    },
    {
      id: '2025003',
      customer: 'Mike Johnson',
      email: 'mike.j@example.com',
      books: [
        { title: 'Pride and Prejudice', quantity: 1, price: 13.99 },
        { title: 'The Catcher in the Rye', quantity: 1, price: 16.99 }
      ],
      date: '2025-10-09',
      total: 30.98,
      status: 'processing'
    },
    {
      id: '2025004',
      customer: 'Sarah Williams',
      email: 'sarah.w@example.com',
      books: [
        { title: 'Brave New World', quantity: 3, price: 11.99 }
      ],
      date: '2025-10-10',
      total: 35.97,
      status: 'pending'
    },
    {
      id: '2025005',
      customer: 'David Brown',
      email: 'david.b@example.com',
      books: [
        { title: 'The Hobbit', quantity: 1, price: 18.99 },
        { title: 'Lord of the Flies', quantity: 1, price: 10.99 }
      ],
      date: '2025-10-10',
      total: 29.98,
      status: 'shipped'
    },
    {
      id: '2025006',
      customer: 'Emily Davis',
      email: 'emily.d@example.com',
      books: [
        { title: 'Animal Farm', quantity: 2, price: 9.99 }
      ],
      date: '2025-10-05',
      total: 19.98,
      status: 'cancelled'
    }
  ])

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  }

  const handleSearch = () => {
    console.log('Searching with filters:', filters)
    // Implement search logic here
  }

  const handleView = (order) => {
    setSelectedOrder(order)
  }

  const handleEdit = (order) => {
    console.log('Editing order:', order)
    // Implement edit logic here
  }

  const handleDelete = (order) => {
    if (window.confirm(`Are you sure you want to delete order #${order.id}?`)) {
      console.log('Deleting order:', order)
      // Implement delete logic here
    }
  }

  const handleExport = () => {
    console.log('Exporting orders...')
    // Implement export logic here
  }

  const handleRefresh = () => {
    console.log('Refreshing orders...')
    // Implement refresh logic here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 border-b border-gray-200 px-8 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Orders Management</h1>
            <p className="text-gray-500 text-sm max-lg:text-xs mt-0">Track and manage all customer orders</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
           
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <OrderStatsCards stats={stats} />

        {/* Filters */}
        <OrderFilters 
          filters={filters} 
          setFilters={setFilters} 
          onSearch={handleSearch}
        />

        {/* Orders Table */}
        <OrdersTable 
          orders={orders}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

export default Orders