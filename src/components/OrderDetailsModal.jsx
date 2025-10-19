import React, { useState } from 'react'
import { X, Package, User, MapPin, CreditCard, Calendar, Edit, Save, X as CloseIcon } from 'lucide-react'
import OrderStatusBadge from './OrderStatusBadge'

const OrderDetailsModal = ({ order, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    status: order?.status || '',
    deliveryBoyName: order?.deliveryBoyName || '',
    deliveryBoyMobile: order?.deliveryBoyMobile || ''
  })
  const [saving, setSaving] = useState(false)

  if (!order) return null

  const handleSave = async () => {
    try {
      setSaving(true)
      await onUpdate(order._id, editData)
      setIsEditing(false)
    } catch (err) {
      alert('Failed to update order')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      status: order.status,
      deliveryBoyName: order.deliveryBoyName || '',
      deliveryBoyMobile: order.deliveryBoyMobile || ''
    })
    setIsEditing(false)
  }

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'FAILED', label: 'Failed' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
            <p className="text-gray-500 text-sm">Order #{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status and Date */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Order Status</p>
                {isEditing ? (
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value.toLowerCase()}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <OrderStatusBadge status={order.status} />
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <CloseIcon className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Order
                  </button>
                )}
              </div>
            </div>

            {/* Delivery Boy Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Delivery Boy Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.deliveryBoyName}
                    onChange={(e) => setEditData({ ...editData, deliveryBoyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter delivery boy name"
                  />
                ) : (
                  <p className="font-semibold text-gray-800">
                    {order.deliveryBoyName || 'Not assigned'}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Delivery Boy Mobile</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.deliveryBoyMobile}
                    onChange={(e) => setEditData({ ...editData, deliveryBoyMobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter mobile number"
                  />
                ) : (
                  <p className="font-semibold text-gray-800">
                    {order.deliveryBoyMobile || 'Not assigned'}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">Order Date</p>
              <div className="flex items-center gap-2 justify-end text-gray-800">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">Total Amount</p>
              <p className="text-2xl font-bold text-indigo-600">${order.finalAmount?.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-gray-800">Customer Information</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="font-semibold text-gray-800">{order.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-gray-700">{order.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-700">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-800">Shipping Address</h3>
              </div>
              <div className="space-y-1 text-gray-700">
                <p>123 Main Street</p>
                <p>Apt 4B</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800">Order Items</h3>
            </div>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{item.book?.title || 'Book Title'}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">${(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">${item.priceAtPurchase?.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-800">Payment Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">${order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">-${order.discountAmount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Handling Fee</span>
                <span className="font-semibold">${order.handlingFee?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span className="font-semibold">${order.deliveryFee?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between text-lg">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-indigo-600">${order.finalAmount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Method</span>
                <span className="font-semibold capitalize">{order.paymentMethod?.toLowerCase().replace('_', ' ') || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Status</span>
                <span className={`font-semibold capitalize ${order.paymentStatus === 'COMPLETED' ? 'text-green-600' : order.paymentStatus === 'FAILED' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus?.toLowerCase() || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Edit Order Details
              </button>
            )}
            <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal
