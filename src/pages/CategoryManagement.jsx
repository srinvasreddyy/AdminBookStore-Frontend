import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  MoveUp, 
  MoveDown, 
  Tag,
  Edit2,
  Check
} from 'lucide-react'
import { apiGet,apiPost, apiDelete, apiPatch } from '../lib/api'
import toast from 'react-hot-toast'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [editingDescription, setEditingDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stats, setStats] = useState({
    totalCategories: 0,
    activeBooks: 0,
    mostPopular: 'N/A'
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await apiGet('/categories/selectable')
      // Filter out deleted categories
      const activeCategories = response.data.filter(cat => !cat.deleted)
      setCategories(activeCategories)
      setStats({
        totalCategories: activeCategories.length,
        activeBooks: 248, // This would come from another API endpoint
        mostPopular: activeCategories[0]?.name || 'N/A'
      })
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await apiPost('/categories', {
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined
      })
      
      setCategories(prev => [...prev, response.data])
      setStats(prev => ({
        ...prev,
        totalCategories: prev.totalCategories + 1
      }))
      setNewCategoryName('')
      setNewCategoryDescription('')
      toast.success('Category created successfully!')
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error(error.message || 'Failed to create category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      await apiDelete(`/categories/${id}`)
      
      setCategories(prev => prev.filter(cat => cat._id !== id))
      setStats(prev => ({
        ...prev,
        totalCategories: prev.totalCategories - 1
      }))
      toast.success('Category deleted successfully!')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error(error.message || 'Failed to delete category')
    }
  }

  const startEditing = (category) => {
    setEditingId(category._id)
    setEditingName(category.name)
    setEditingDescription(category.description || '')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
    setEditingDescription('')
  }

  const saveEdit = async (id) => {
    if (!editingName.trim()) {
      toast.error('Category name cannot be empty')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await apiPatch(`/categories/${id}`, {
        name: editingName.trim(),
        description: editingDescription.trim() || undefined
      })
      
      setCategories(prev => prev.map(cat => 
        cat._id === id ? response.data : cat
      ))
      setEditingId(null)
      setEditingName('')
      setEditingDescription('')
      toast.success('Category updated successfully!')
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error(error.message || 'Failed to update category')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 max-lg:z-10 max-lg:top-11 border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Category Management</h1>
            <p className="text-gray-500 text-xs">Add, edit, and delete book categories</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 max-md:p-4">
        <div className="max-w-4xl mx-auto">
          {/* Stats Card */}
          <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-xl p-6 mb-8 max-md:p-4">
            <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Tag className="w-5 h-5" />
                  </div>
                  <span className="text-sm opacity-90">Total Categories</span>
                </div>
                <p className="text-3xl font-bold">{loading ? '...' : stats.totalCategories}</p>
              </div>
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">📚</span>
                  </div>
                  <span className="text-sm opacity-90">Active Books</span>
                </div>
                <p className="text-3xl font-bold">{stats.activeBooks}</p>
              </div>
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">⭐</span>
                  </div>
                  <span className="text-sm opacity-90">Most Popular</span>
                </div>
                <p className="text-xl font-bold">{stats.mostPopular}</p>
              </div>
            </div>
          </div>

          {/* Add New Category */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Category
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3 max-sm:flex-col">
                <input
                  type="text"
                  placeholder="Enter category name (e.g., Mystery, Romance)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Enter category description (optional)"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                />
                <button
                  onClick={addCategory}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              All Categories ({loading ? '...' : categories.length})
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No categories yet</p>
                <p className="text-gray-400 text-sm">Add your first category above</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div
                    key={category._id}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    {/* Order Number */}
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-bold text-gray-600">
                      {index + 1}
                    </div>

                    {/* Category Info */}
                    {editingId === category._id ? (
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveEdit(category._id)
                            if (e.key === 'Escape') cancelEditing()
                          }}
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
                          placeholder="Category name"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={editingDescription}
                          onChange={(e) => setEditingDescription(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveEdit(category._id)
                            if (e.key === 'Escape') cancelEditing()
                          }}
                          className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
                          placeholder="Category description (optional)"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="font-medium text-gray-800">{category.name}</span>
                          {category.description && (
                            <p className="text-sm text-gray-500">{category.description}</p>
                          )}
                          <div className="flex gap-2 mt-1">
                            {category.owner && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Custom
                              </span>
                            )}
                            {category.access && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                category.access === 'public' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {category.access}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === category._id ? (
                        <>
                          <button
                            onClick={() => saveEdit(category._id)}
                            disabled={isSubmitting}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCategory(category._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <span>💡</span> Tips for Managing Categories
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use clear, descriptive names for categories</li>
              <li>• Add descriptions to help users understand category content</li>
              <li>• Keep category names concise (1-2 words when possible)</li>
              <li>• Categories with books cannot be deleted</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryManagement