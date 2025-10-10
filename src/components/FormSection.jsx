import React from 'react'

const FormSection = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        {Icon && (
          <div className="p-2 bg-neutral-100 rounded-lg">
            <Icon className="w-5 h-5 text-neutral-900" />
          </div>
        )}
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default FormSection
