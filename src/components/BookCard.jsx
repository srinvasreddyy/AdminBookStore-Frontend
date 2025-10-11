import React from 'react'
import { Edit, Trash2, Eye, Star, AlertCircle } from 'lucide-react'

const BookCard = ({ book, onEdit, onDelete, onView }) => {
  const getStockStatus = () => {
    if (book.stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' }
    if (book.stock <= 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' }
  }

  const stockStatus = getStockStatus()

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Book Cover */}
      <div className="relative h-64 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">📚</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {book.featured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" fill="white" />
              Featured
            </span>
          )}
          {book.bestseller && (
            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
              Bestseller
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 ${stockStatus.color} text-xs font-semibold rounded-full flex items-center gap-1`}>
            {book.stock === 0 && <AlertCircle className="w-3 h-3" />}
            {stockStatus.label}
          </span>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onView(book)}
            className="p-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEdit(book)}
            className="p-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            title="Edit Book"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(book)}
            className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete Book"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{book.author}</p>

        <div className="flex items-center justify-between mb-3">
          <div>
            {book.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-indigo-600">${book.salePrice}</span>
                <span className="text-sm text-gray-400 line-through">${book.price}</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-gray-800">${book.price}</span>
            )}
          </div>
          <span className="text-sm text-gray-500">Stock: {book.stock}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded-full">{book.category}</span>
          <span>ISBN: {book.isbn}</span>
        </div>
      </div>
    </div>
  )
}

export default BookCard
