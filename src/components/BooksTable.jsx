import React from 'react'
import { Edit, Trash2, Eye, Star, AlertCircle } from 'lucide-react'

const BooksTable = ({ books, onEdit, onDelete, onView }) => {
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' }
    if (stock <= 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Book</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Author</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Price</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Stock</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {books.map((book) => {
              const stockStatus = getStockStatus(book.stock)
              return (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {book.image ? (
                          <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">📚</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{book.title}</p>
                        <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {book.featured && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                              <Star className="w-3 h-3" fill="currentColor" />
                              Featured
                            </span>
                          )}
                          {book.bestseller && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                              Bestseller
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-700">{book.author}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {book.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      {book.salePrice ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-indigo-600">${book.salePrice}</span>
                          <span className="text-xs text-gray-400 line-through">${book.price}</span>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-800">${book.price}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-800">{book.stock}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 ${stockStatus.color} text-xs font-semibold rounded-full inline-flex items-center gap-1`}>
                      {book.stock === 0 && <AlertCircle className="w-3 h-3" />}
                      {stockStatus.label}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(book)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(book)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Book"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(book)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">1-{books.length}</span> of <span className="font-semibold">{books.length}</span> books
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default BooksTable
