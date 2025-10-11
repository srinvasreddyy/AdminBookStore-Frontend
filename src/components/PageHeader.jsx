import React from 'react'

const PageHeader = ({ title, subtitle, actions, icon: Icon }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </div>
  )
}

export default PageHeader
