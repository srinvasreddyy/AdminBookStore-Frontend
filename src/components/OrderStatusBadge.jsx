import React from 'react'

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      label: 'Pending'
    },
    processing: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      label: 'Processing'
    },
    shipped: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      label: 'Shipped'
    },
    delivered: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Delivered'
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Cancelled'
    }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-semibold`}>
      {config.label}
    </span>
  )
}

export default OrderStatusBadge
