import React, { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Plus, 
  Grid3x3, 
  List, 
  Download, 
  Upload, 
  RefreshCw, 
  DollarSign, 
  Package, 
  TrendingUp 
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import FilterBar from '../components/FilterBar'
import BookCard from '../components/BookCard'
import BooksTable from '../components/BooksTable'
import { useNavigate } from '@tanstack/react-router'
// CHANGED: Import getCategoryList instead of getAllCategories
import { apiGet, apiDelete, getCategoryList } from '../lib/api' 
import toast from 'react-hot-toast'

const BookManagement = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    minPrice: '',
    maxPrice: ''
  })

  // API state
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0
  })
  const [loading, setLoading] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    totalDocs: 0
  })

  useEffect(() => {
    fetchCategoriesList()
    fetchBooks()
    fetchStats()
  }, [])

  const fetchCategoriesList = async () => {
    try {
      // CHANGED: Use getCategoryList for flat array
      const response = await getCategoryList()
      setCategories(response.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (filters.search) queryParams.append('search', filters.search)
      if (filters.category) queryParams.append('category', filters.category)
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice)
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice)

      const response = await apiGet(`/books?${queryParams.toString()}`)
      
      setBooks(response.data.docs)
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        totalDocs: response.data.totalDocs
      })
    } catch (error) {
      console.error('Error fetching books:', error)
      toast.error('Failed to load books')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // ... Rest of the file remains the same (fetchStats, handlers, render)
  // I will include the rest for completeness, but the logic is identical
  const fetchStats = async () => {
    try {
      setLoadingStats(true)
      const response = await apiGet('/dashboard/admin/book-stats')
      const statsData = response.data
      setStats({
        totalBooks: statsData.totalBooks,
        totalValue: statsData.inventoryValue,
        lowStock: statsData.lowStockCount,
        outOfStock: statsData.outOfStockCount
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleApplyFilters = () => {
    fetchBooks(1)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      status: '',
      minPrice: '',
      maxPrice: ''
    }
    setFilters(clearedFilters)
    
    const queryParams = new URLSearchParams({
      page: '1',
      limit: pagination.limit.toString(),
    })
    
    setLoading(true)
    apiGet(`/books?${queryParams.toString()}`)
      .then(response => {
        setBooks(response.data.docs)
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
          totalDocs: response.data.totalDocs
        })
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const handleViewBook = (book) => {
    console.log('Viewing book:', book)
  }

  const handleEditBook = (book) => {
    navigate({ to: '/add-books', search: { id: book._id } })
  }

  const handleDeleteBook = async (book) => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      return
    }

    try {
      await apiDelete(`/books/${book._id}`)
      toast.success('Book deleted successfully')
      fetchBooks(pagination.page)
      fetchStats()
    } catch (error) {
      console.error('Error deleting book:', error)
      toast.error(error.message || 'Failed to delete book')
    }
  }

  const handleAddBook = () => {
    navigate({ to: '/add-books' })
  }

  const handleExport = () => {
    console.log('Exporting books...')
  }

  const handleImport = () => {
    console.log('Importing books...')
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchBooks(pagination.page)
    fetchStats()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white sticky top-0 z-50 max-lg:z-10 max-lg:top-11 border-b border-gray-200 px-4 sm:px-6 md:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-800">
              Books Management
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Manage your book inventory, pricing, and availability
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleImport}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleAddBook}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Book</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6">
        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-[320px]">
            <StatsCard
              title="Total Books"
              value={loadingStats ? '...' : stats.totalBooks}
              subtitle="In catalog"
              icon={BookOpen}
              color="blue"
              trend={5.2}
            />
            <StatsCard
              title="Total Inventory Value"
              value={loadingStats ? '...' : `$${stats.totalValue.toFixed(2)}`}
              subtitle="Stock value"
              icon={DollarSign}
              color="green"
              trend={12.5}
            />
            <StatsCard
              title="Low Stock Items"
              value={loadingStats ? '...' : stats.lowStock}
              subtitle="Need restocking"
              icon={Package}
              color="orange"
              trend={-3.2}
            />
            <StatsCard
              title="Out of Stock"
              value={loadingStats ? '...' : stats.outOfStock}
              subtitle="Unavailable"
              icon={TrendingUp}
              color="purple"
              trend={-8.1}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            categories={categories}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            All Books ({loading ? '...' : pagination.totalDocs})
          </h2>
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200 w-fit">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid View"
            >
              <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={{
                  ...book,
                  id: book._id,
                  category: book.category?.name || 'Uncategorized',
                  image: book.coverImages?.[0] || null,
                  featured: book.isFeatured,
                  bestseller: book.isBestSeller
                }}
                onView={handleViewBook}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <BooksTable
              books={books.map(book => ({
                ...book,
                id: book._id,
                category: book.category?.name || 'Uncategorized',
                image: book.coverImages?.[0] || null,
                featured: book.isFeatured,
                bestseller: book.isBestSeller
              }))}
              onView={handleViewBook}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
            />
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => fetchBooks(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchBooks(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center border border-gray-200">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No books found</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
              Get started by adding your first book to the catalog
            </p>
            <button
              onClick={handleAddBook}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-semibold"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Your First Book
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookManagement