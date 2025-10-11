import React from 'react'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'

const FilterBar = ({ filters, setFilters, onApplyFilters, onClearFilters }) => {
  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
      <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
        {/* Search Bar */}
        <div className="flex-1 min-w-[200px] sm:min-w-[250px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 text-sm"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="relative w-full sm:w-auto min-w-[140px]">
          <select
            className="appearance-none w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 cursor-pointer bg-white text-sm"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="science">Science</option>
            <option value="technology">Technology</option>
            <option value="biography">Biography</option>
            <option value="history">History</option>
            <option value="self-help">Self-Help</option>
            <option value="business">Business</option>
            <option value="children">Children</option>
            <option value="romance">Romance</option>
            <option value="mystery">Mystery</option>
            <option value="fantasy">Fantasy</option>
          </select>
          <Filter className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative w-full sm:w-auto min-w-[120px]">
          <select
            className="appearance-none w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 cursor-pointer bg-white text-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <SlidersHorizontal className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="number"
            placeholder="Min"
            className="w-20 sm:w-24 px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 text-sm"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <span className="text-gray-500 text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-20 sm:w-24 px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 text-sm"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onApplyFilters}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors text-xs sm:text-sm font-semibold"
          >
            Apply
          </button>
          <button
            onClick={onClearFilters}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm font-semibold"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
