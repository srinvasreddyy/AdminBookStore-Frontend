import React from 'react'
import { BookOpen, DollarSign, Package, TrendingUp } from 'lucide-react'

const StatsCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-600'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      text: 'text-orange-600'
    }
  }

  const colors = colorClasses[color] || colorClasses.blue

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}

export default StatsCard
