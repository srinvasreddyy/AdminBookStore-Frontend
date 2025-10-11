import React, { useState } from 'react'
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

const BookManagement = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    minPrice: '',
    maxPrice: ''
  })

  // Sample book data
  const [books] = useState([
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      category: 'Fiction',
      price: 15.99,
      salePrice: null,
      stock: 45,
      featured: true,
      bestseller: false,
      image: null
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      category: 'Fiction',
      price: 14.99,
      salePrice: 12.99,
      stock: 8,
      featured: false,
      bestseller: true,
      image: null
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0-452-28423-4',
      category: 'Fiction',
      price: 16.99,
      salePrice: null,
      stock: 32,
      featured: true,
      bestseller: true,
      image: null
    },
    {
      id: 4,
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      isbn: '978-0-06-231609-7',
      category: 'Non-Fiction',
      price: 24.99,
      salePrice: 19.99,
      stock: 15,
      featured: false,
      bestseller: false,
      image: null
    },
    {
      id: 5,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '978-0-547-92822-7',
      category: 'Fantasy',
      price: 18.99,
      salePrice: null,
      stock: 0,
      featured: false,
      bestseller: false,
      image: null
    },
    {
      id: 6,
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '978-0-7352-1129-2',
      category: 'Self-Help',
      price: 27.99,
      salePrice: 22.99,
      stock: 28,
      featured: true,
      bestseller: true,
      image: null
    },
    {
      id: 7,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      isbn: '978-0-85719-839-1',
      category: 'Business',
      price: 23.99,
      salePrice: null,
      stock: 19,
      featured: false,
      bestseller: true,
      image: null
    },
    {
      id: 8,
      title: 'Educated',
      author: 'Tara Westover',
      isbn: '978-0-399-59050-4',
      category: 'Biography',
      price: 21.99,
      salePrice: 17.99,
      stock: 6,
      featured: false,
      bestseller: false,
      image: null
    }
  ])

  // Calculate stats
  const stats = {
    totalBooks: books.length,
    totalValue: books.reduce((sum, book) => sum + (book.price * book.stock), 0),
    lowStock: books.filter(book => book.stock > 0 && book.stock <= 10).length,
    outOfStock: books.filter(book => book.stock === 0).length
  }

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters)
    // Implement filter logic here
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: '',
      minPrice: '',
      maxPrice: ''
    })
  }

  const handleViewBook = (book) => {
    console.log('Viewing book:', book)
    // Implement view book modal or navigation
  }

  const handleEditBook = (book) => {
    console.log('Editing book:', book)
    navigate({ to: '/add-books', search: { id: book.id } })
  }

  const handleDeleteBook = (book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      console.log('Deleting book:', book)
      // Implement delete logic here
    }
  }

  const handleAddBook = () => {
    navigate({ to: '/add-books' })
  }

  const handleExport = () => {
    console.log('Exporting books...')
    // Implement export logic
  }

  const handleImport = () => {
    console.log('Importing books...')
    // Implement import logic
  }

  const handleRefresh = () => {
    console.log('Refreshing books...')
    // Implement refresh logic
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
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
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
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

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6">
        {/* Stats Cards */}
        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-w-[320px]">
            <StatsCard
              title="Total Books"
              value={stats.totalBooks}
              subtitle="In catalog"
              icon={BookOpen}
              color="blue"
              trend={5.2}
            />
            <StatsCard
              title="Total Inventory Value"
              value={`$${stats.totalValue.toFixed(2)}`}
              subtitle="Stock value"
              icon={DollarSign}
              color="green"
              trend={12.5}
            />
            <StatsCard
              title="Low Stock Items"
              value={stats.lowStock}
              subtitle="Need restocking"
              icon={Package}
              color="orange"
              trend={-3.2}
            />
            <StatsCard
              title="Out of Stock"
              value={stats.outOfStock}
              subtitle="Unavailable"
              icon={TrendingUp}
              color="purple"
              trend={-8.1}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="w-full overflow-x-auto">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            All Books ({books.length})
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

        {/* Books Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onView={handleViewBook}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <BooksTable
              books={books}
              onView={handleViewBook}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
            />
          </div>
        )}

        {/* Empty State */}
        {books.length === 0 && (
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