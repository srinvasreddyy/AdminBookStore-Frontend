import React, { useState, useEffect } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import OrderStatsCards from '../components/OrderStatsCards'
import OrderFilters from '../components/OrderFilters'
import OrdersTable from '../components/OrdersTable'
import OrderDetailsModal from '../components/OrderDetailsModal'
import { apiGet, apiDelete, apiPatch } from '../lib/api'

const Orders = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  })

  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      // Client-side search implemented, so we don't send search to backend
      // if (filters.search) queryParams.append('search', filters.search)
      
      if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status)
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo)

      const response = await apiGet(`/orders/admin?${queryParams.toString()}`)
      setOrders(response.data.orders)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch order statistics
  const fetchStats = async () => {
    try {
      const response = await apiGet('/orders/admin/stats')
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [])

  const handleSearch = () => {
    fetchOrders()
  }

  const handleView = async (order) => {
    try {
      const response = await apiGet(`/orders/admin/${order._id || order.id}`)
      setSelectedOrder(response.data)
    } catch (err) {
      console.error('Error fetching order details:', err)
    }
  }

  const handleEdit = async (order) => {
    // For now, just open the modal for editing
    await handleView(order)
  }

  const handleDelete = async (order) => {
    if (window.confirm(`Are you sure you want to delete order #${order._id || order.id}?`)) {
      try {
        await apiDelete(`/orders/admin/${order._id || order.id}`)
        fetchOrders()
        fetchStats()
      } catch (err) {
        console.error('Error deleting order:', err)
        alert('Failed to delete order')
      }
    }
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting orders...')
  }

  const handleRefresh = () => {
    fetchOrders()
    fetchStats()
  }

  const handleUpdateOrder = async (orderId, updateData) => {
    try {
      await apiPatch(`/orders/admin/${orderId}`, updateData)
      fetchOrders()
      fetchStats()
      // Refresh the selected order details if it's open
      if (selectedOrder && selectedOrder._id === orderId) {
        const response = await apiGet(`/orders/admin/${orderId}`)
        setSelectedOrder(response.data)
      }
    } catch (err) {
      console.error('Error updating order:', err)
      throw err
    }
  }

  // Client-side filtering logic
  const filteredOrders = orders.filter(order => {
    if (!filters.search) return true;
    const searchTerm = filters.search.toLowerCase().trim();
    if (!searchTerm) return true;

    // Search by ID (checking both _id and id fields)
    const id = (order._id || order.id || '').toString().toLowerCase();
    
    // Search by Customer Name
    const customerName = (order.shippingAddress?.fullName || '').toLowerCase();

    return id.includes(searchTerm) || customerName.includes(searchTerm);
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 max-lg:z-10 max-lg:top-11 border-b border-gray-200 px-4 sm:px-6 md:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-800">
              Orders Management
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Track and manage all customer orders
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="w-full overflow-x-auto">
          <OrderStatsCards stats={stats} />
        </div>

        {/* Filters */}
        <div className="w-full overflow-x-auto">
          <OrderFilters
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />
        </div>

        {/* Orders Table */}
        <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading orders...</span>
            </div>
          ) : (
            <OrdersTable
              orders={filteredOrders}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleUpdateOrder}
        />
      )}
    </div>
  )
}

export default Orders