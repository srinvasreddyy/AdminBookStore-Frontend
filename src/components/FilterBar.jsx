import React from 'react'
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react'

const FilterBar = ({ filters, setFilters, onApplyFilters, onClearFilters, categories = [] }) => {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 sticky top-0 z-10 mb-6">
      <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
        
        {/* Search Bar */}
        <div className="flex-1 min-w-[200px] sm:min-w-[250px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, ISBN..."
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 text-sm transition-all"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
            />
          </div>
        </div>

        {/* Category Dropdown (Root Levels) */}
        <div className="relative w-full sm:w-auto min-w-[160px]">
          <select
            className="appearance-none w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 cursor-pointer bg-white text-sm"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Filter className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative w-full sm:w-auto min-w-[140px]">
          <select
            className="appearance-none w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 cursor-pointer bg-white text-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Availability</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
          </select>
          <SlidersHorizontal className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Price Inputs */}
        <div className="flex items-center gap-2 w-full sm:w-auto bg-gray-50 p-1 rounded-lg border border-gray-200">
          <input
            type="number"
            placeholder="Min ₹"
            className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded shadow-sm text-sm focus:outline-none text-center"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <span className="text-gray-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max ₹"
            className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded shadow-sm text-sm focus:outline-none text-center"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onApplyFilters}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-semibold shadow-sm"
          >
            Apply
          </button>
          
          {(filters.search || filters.minPrice || filters.maxPrice || filters.status || filters.category) && (
             <button
              onClick={onClearFilters}
              className="px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-red-100"
              title="Clear Filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterBar