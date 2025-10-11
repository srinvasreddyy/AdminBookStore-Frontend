import React, { useState } from 'react'
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

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Fiction', order: 1 },
    { id: 2, name: 'Non-Fiction', order: 2 },
    { id: 3, name: 'Science', order: 3 },
    { id: 4, name: 'Technology', order: 4 },
    { id: 5, name: 'Biography', order: 5 },
    { id: 6, name: 'History', order: 6 },
    { id: 7, name: 'Self-Help', order: 7 },
    { id: 8, name: 'Business', order: 8 }
  ])

  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name')
      return
    }

    const newId = Math.max(...categories.map(cat => cat.id), 0) + 1
    const newCategory = {
      id: newId,
      name: newCategoryName.trim(),
      order: categories.length + 1
    }

    setCategories([...categories, newCategory])
    setNewCategoryName('')
  }

  const deleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categories
        .filter(cat => cat.id !== id)
        .map((cat, index) => ({ ...cat, order: index + 1 }))
      setCategories(updatedCategories)
    }
  }

  const moveCategory = (id, direction) => {
    const index = categories.findIndex(cat => cat.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categories.length - 1)
    ) return

    const newCategories = [...categories]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newCategories[index], newCategories[swapIndex]] = [newCategories[swapIndex], newCategories[index]]
    
    // Update order
    newCategories.forEach((cat, idx) => {
      cat.order = idx + 1
    })
    
    setCategories(newCategories)
  }

  const startEditing = (category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  const saveEdit = (id) => {
    if (!editingName.trim()) {
      alert('Category name cannot be empty')
      return
    }

    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, name: editingName.trim() } : cat
    ))
    setEditingId(null)
    setEditingName('')
  }

  const handleSaveAll = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Saved Categories:', categories)
      alert('Categories saved successfully!')
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 max-lg:z-10 max-lg:top-11 border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Category Management</h1>
            <p className="text-gray-500 text-xs">Add, edit, delete, and prioritize book categories</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSaveAll}
              disabled={isSubmitting}
              className="flex text-xs items-center gap-2 font-bold text-white px-4 py-2 rounded-lg bg-black hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 max-md:p-4">
        <div className="max-w-4xl mx-auto">
          {/* Stats Card */}
          <div className="bg-gradient-to-r from-neutral-700 to-neutral-800 rounded-xl p-6 mb-8 max-md:p-4">
            <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Tag className="w-5 h-5" />
                  </div>
                  <span className="text-sm opacity-90">Total Categories</span>
                </div>
                <p className="text-3xl font-bold">{categories.length}</p>
              </div>
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">📚</span>
                  </div>
                  <span className="text-sm opacity-90">Active Books</span>
                </div>
                <p className="text-3xl font-bold">248</p>
              </div>
              <div className="text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">⭐</span>
                  </div>
                  <span className="text-sm opacity-90">Most Popular</span>
                </div>
                <p className="text-xl font-bold">{categories[0]?.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Add New Category */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Category
            </h2>
            <div className="flex gap-3 max-sm:flex-col">
              <input
                type="text"
                placeholder="Enter category name (e.g., Mystery, Romance)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
              />
              <button
                onClick={addCategory}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold flex items-center gap-2 justify-center"
              >
                <Plus className="w-5 h-5" />
                Add Category
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              All Categories ({categories.length})
            </h2>
            
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No categories yet</p>
                <p className="text-gray-400 text-sm">Add your first category above</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    {/* Order Number */}
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-bold text-gray-600">
                      {category.order}
                    </div>

                    {/* Category Name */}
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveEdit(category.id)
                          if (e.key === 'Escape') cancelEditing()
                        }}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        autoFocus
                      />
                    ) : (
                      <div className="flex-1 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-800">{category.name}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === category.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(category.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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
                            onClick={() => moveCategory(category.id, 'up')}
                            disabled={index === 0}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveCategory(category.id, 'down')}
                            disabled={index === categories.length - 1}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
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
              <li>• Prioritize popular categories at the top for better user experience</li>
              <li>• Keep category names concise (1-2 words when possible)</li>
              <li>• Remember to save your changes after reordering</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default CategoryManagement