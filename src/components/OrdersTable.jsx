import React from 'react'
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react'
import OrderStatusBadge from './OrderStatusBadge'

const OrdersTable = ({ orders, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Order ID</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Books</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Total</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id || order.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <span className="font-semibold text-neutral-800">#{order._id || order.id}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-neutral-400 to-neutral-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {(order.shippingAddress?.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{order.shippingAddress?.fullName || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{order.email || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium">{(order.books || []).length} items</span>
                    <span className="text-xs text-gray-500">{order.books?.[0]?.title || 'No items'}...</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-600">{order.date}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="font-bold text-gray-800">&#8377;{(order.total || 0).toFixed(2)}</span>
                </td>
                <td className="py-4 px-6">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(order)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Order"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(order)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">1-{orders.length}</span> of <span className="font-semibold">{orders.length}</span> orders
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-neutral-700 to-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrdersTable
