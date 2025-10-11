import React from 'react'
import { ShoppingCart, Clock, Truck, CheckCircle, XCircle } from 'lucide-react'

const OrderStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Orders',
      value: stats.total || 0,
      icon: ShoppingCart,
      bgColor: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Pending',
      value: stats.pending || 0,
      icon: Clock,
      bgColor: 'from-yellow-500 to-yellow-600',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Shipped',
      value: stats.shipped || 0,
      icon: Truck,
      bgColor: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Delivered',
      value: stats.delivered || 0,
      icon: CheckCircle,
      bgColor: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled || 0,
      icon: XCircle,
      bgColor: 'from-red-500 to-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6 max-lg:mb-0">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.iconBg} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
          </div>
        )
      })}
    </div>
  )
}

export default OrderStatsCards
