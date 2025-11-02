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
  Check,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react'
import { apiGet, apiPostForm, apiDelete, apiPatchForm } from '../lib/api'
import ImageUpload from '../components/ImageUpload'
import toast from 'react-hot-toast'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [newCategoryImage, setNewCategoryImage] = useState(null)
  const [newParentCategory, setNewParentCategory] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [editingDescription, setEditingDescription] = useState('')
  const [editingImage, setEditingImage] = useState(null)
  const [editingParentCategory, setEditingParentCategory] = useState('')
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
      // The API returns a hierarchical tree structure
      const categoryTree = response.data
      
      // Flatten the tree for easier manipulation while keeping hierarchy info
      const flattenCategories = (tree, level = 0, parentPath = []) => {
        let flat = []
        tree.forEach(cat => {
          flat.push({
            ...cat,
            level,
            parentPath,
            displayName: parentPath.length > 0 ? `${parentPath.join(' > ')} > ${cat.name}` : cat.name
          })
          if (cat.children && cat.children.length > 0) {
            flat = flat.concat(flattenCategories(cat.children, level + 1, [...parentPath, cat.name]))
          }
        })
        return flat
      }
      
      const flattenedCategories = flattenCategories(categoryTree)
      setCategories(flattenedCategories)
      
      setStats({
        totalCategories: flattenedCategories.length,
        activeBooks: 248, // This would come from another API endpoint
        mostPopular: flattenedCategories[0]?.name || 'N/A'
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
      const formData = new FormData()
      formData.append('name', newCategoryName.trim())
      formData.append('description', newCategoryDescription.trim() || '')
      if (newParentCategory) {
        formData.append('parentCategory', newParentCategory)
      }
      if (newCategoryImage) {
        formData.append('backgroundImage', newCategoryImage)
      }
      
      const response = await apiPostForm('/categories', formData)
      
      // Refresh categories to get updated hierarchy
      await fetchCategories()
      
      setNewCategoryName('')
      setNewCategoryDescription('')
      setNewCategoryImage(null)
      setNewParentCategory('')
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
      
      // Refresh categories to get updated hierarchy
      await fetchCategories()
      
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
    setEditingImage(null) // Reset image selection
    setEditingParentCategory(category.parentCategory || '')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
    setEditingDescription('')
    setEditingImage(null)
    setEditingParentCategory('')
  }

  const saveEdit = async (id) => {
    if (!editingName.trim()) {
      toast.error('Category name cannot be empty')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', editingName.trim())
      formData.append('description', editingDescription.trim() || '')
      if (editingParentCategory) {
        formData.append('parentCategory', editingParentCategory)
      } else {
        formData.append('parentCategory', 'null') // Explicitly set to null
      }
      if (editingImage) {
        formData.append('backgroundImage', editingImage)
      }
      
      const response = await apiPatchForm(`/categories/${id}`, formData)
      
      // Refresh categories to get updated hierarchy
      await fetchCategories()
      
      setEditingId(null)
      setEditingName('')
      setEditingDescription('')
      setEditingImage(null)
      setEditingParentCategory('')
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
            <p className="text-gray-500 text-xs">Create and manage book categories with images and hierarchical structure</p>
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
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Category
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter category name (e.g., Mystery, Romance)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Category (Optional)
                  </label>
                  <select
                    value={newParentCategory}
                    onChange={(e) => setNewParentCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  >
                    <option value="">Select parent category (leave empty for main category)</option>
                    {categories.filter(cat => !cat.parentCategory).map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Enter category description"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
              
              {/* Right Column - Image Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image (Optional)
                  </label>
                  <ImageUpload
                    label="Upload category image"
                    onImageSelect={setNewCategoryImage}
                    existingImageUrl={null}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: Square images, max 10MB. PNG, JPG, WEBP supported.
                  </p>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={addCategory}
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating Category...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Create Category
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 group"
                    style={{ marginLeft: `${category.level * 16}px` }}
                  >
                    {/* Category Image */}
                    <div className="relative h-32 bg-gray-100">
                      {category.backgroundImage ? (
                        <img
                          src={category.backgroundImage}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Action Buttons Overlay */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => startEditing(category)}
                          className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => deleteCategory(category._id)}
                          className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>

                      {/* Subcategory Indicator */}
                      {category.level > 0 && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                            Sub
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="p-4">
                      {editingId === category._id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 gap-3">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') saveEdit(category._id)
                                if (e.key === 'Escape') cancelEditing()
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 text-sm"
                              placeholder="Category name"
                              autoFocus
                            />
                            <select
                              value={editingParentCategory}
                              onChange={(e) => setEditingParentCategory(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 text-sm"
                            >
                              <option value="">No parent category</option>
                              {categories
                                .filter(cat => cat._id !== category._id && cat.level === 0)
                                .map((parentCat) => (
                                  <option key={parentCat._id} value={parentCat._id}>
                                    {parentCat.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <input
                            type="text"
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') saveEdit(category._id)
                              if (e.key === 'Escape') cancelEditing()
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 text-sm"
                            placeholder="Category description (optional)"
                          />
                          <ImageUpload
                            label="Update Category Image"
                            onImageSelect={setEditingImage}
                            existingImageUrl={category.backgroundImage}
                          />
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => saveEdit(category._id)}
                              disabled={isSubmitting}
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                              {category.name}
                            </h3>
                            {category.owner && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                                Custom
                              </span>
                            )}
                          </div>
                          
                          {category.description && (
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>
                              {category.level > 0 ? 'Subcategory' : 'Main Category'}
                            </span>
                            <span>
                              {category.children ? `${category.children.length} sub` : 'No sub'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span>💡</span> Tips for Managing Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Category Structure</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use clear, descriptive names for categories</li>
                  <li>• Add descriptions to help users understand content</li>
                  <li>• Keep category names concise (1-2 words when possible)</li>
                  <li>• Create subcategories by selecting a parent category</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Images & Display</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Upload high-quality images for better visual appeal</li>
                  <li>• Square images work best (1:1 aspect ratio)</li>
                  <li>• Categories with books cannot be deleted</li>
                  <li>• Subcategories are indented in the grid layout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryManagement