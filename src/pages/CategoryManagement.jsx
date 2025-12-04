import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Folder, FolderOpen, Pin, CornerDownRight } from 'lucide-react'
import FormInput from '../components/FormInput'
import ImageUpload from '../components/ImageUpload'
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../lib/api'
import toast from 'react-hot-toast'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]) // Tree structure
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [pinnedCategoryIds, setPinnedCategoryIds] = useState([])

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [parentCategory, setParentCategory] = useState(null)

  // Form
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [categoryImage, setCategoryImage] = useState(null)

  useEffect(() => {
    fetchData()
    const storedPins = localStorage.getItem('adminPinnedCategories')
    if (storedPins) {
      setPinnedCategoryIds(JSON.parse(storedPins))
    }
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getAllCategories()
      setCategories(response.data)
    } catch (err) {
      toast.error('Failed to fetch categories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // --- State Helpers ---
  const toggleExpansion = (id) => {
    const newSet = new Set(expandedCategories)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setExpandedCategories(newSet)
  }

  const togglePin = (id) => {
    let newPins
    if (pinnedCategoryIds.includes(id)) {
      newPins = pinnedCategoryIds.filter(pid => pid !== id)
    } else {
      newPins = [...pinnedCategoryIds, id]
    }
    setPinnedCategoryIds(newPins)
    localStorage.setItem('adminPinnedCategories', JSON.stringify(newPins))
  }

  // --- Handlers ---
  const handleOpenModal = (categoryToEdit = null, parent = null) => {
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit)
      setFormData({
        name: categoryToEdit.name,
        description: categoryToEdit.description || ''
      })
      setCategoryImage(null) // Only update image if new one selected
      setParentCategory(null)
    } else {
      // Adding new
      setEditingCategory(null)
      setFormData({ name: '', description: '' })
      setCategoryImage(null)
      setParentCategory(parent)
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData, categoryImage)
        toast.success('Category updated')
      } else {
        const payload = { ...formData }
        if (parentCategory) payload.parentId = parentCategory._id
        await createCategory(payload, categoryImage)
        toast.success('Category created')
        // Auto expand parent to show new child
        if (parentCategory) {
          setExpandedCategories(prev => new Set(prev).add(parentCategory._id))
        }
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category and ALL its subcategories? This cannot be undone.')) {
      try {
        await deleteCategory(id)
        toast.success('Deleted successfully')
        fetchData()
      } catch (err) {
        toast.error('Failed to delete')
      }
    }
  }

  // --- Recursive Tree Component ---
  const CategoryNode = ({ category, level = 1 }) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category._id)
    const isPinned = pinnedCategoryIds.includes(category._id)

    return (
      <div className="select-none">
        <div 
          className={`flex items-center justify-between p-3 my-1 rounded-lg transition-colors border border-transparent ${
            isPinned ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-gray-50 border-gray-100'
          }`}
          style={{ marginLeft: `${(level - 1) * 1.5}rem` }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Expand/Collapse */}
            <button 
              onClick={() => toggleExpansion(category._id)}
              className={`p-1 rounded hover:bg-gray-200 text-gray-500 ${hasChildren ? 'visible' : 'invisible'}`}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Icon */}
            <div className={`p-1.5 rounded ${isPinned ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
              {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium truncate ${isPinned ? 'text-indigo-900' : 'text-gray-700'}`}>
                  {category.name}
                </span>
                {isPinned && <Pin size={12} className="text-indigo-500 fill-current" />}
              </div>
              {category.description && (
                <p className="text-xs text-gray-400 truncate">{category.description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            {/* Only allow adding children if depth < 4 */}
            {level < 4 && (
              <button 
                onClick={() => handleOpenModal(null, category)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                title="Add Subcategory"
              >
                <Plus size={16} />
              </button>
            )}
            
            <button 
              onClick={() => togglePin(category._id)}
              className={`p-1.5 rounded hover:bg-gray-100 ${isPinned ? 'text-indigo-600' : 'text-gray-400'}`}
              title={isPinned ? "Unpin" : "Pin"}
            >
              <Pin size={16} className={isPinned ? 'fill-current' : ''} />
            </button>

            <button 
              onClick={() => handleOpenModal(category)}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            
            <button 
              onClick={() => handleDelete(category._id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Render Children Recursively */}
        {isExpanded && hasChildren && (
          <div className="border-l border-gray-100 ml-[1.15rem]">
            {category.children.map(child => (
              <CategoryNode key={child._id} category={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Sorting for Root Categories: Pinned first
  const sortedRootCategories = React.useMemo(() => {
    if (!categories.length) return []
    const pinned = []
    const unpinned = []
    categories.forEach(cat => {
      if (pinnedCategoryIds.includes(cat._id)) pinned.push(cat)
      else unpinned.push(cat)
    })
    // Preserve pinned order
    pinned.sort((a, b) => pinnedCategoryIds.indexOf(a._id) - pinnedCategoryIds.indexOf(b._id))
    return [...pinned, ...unpinned]
  }, [categories, pinnedCategoryIds])

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your books into up to 4 levels of hierarchy.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add Root Category</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : sortedRootCategories.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No categories yet</h3>
            <p className="text-gray-500 mb-6">Start by creating your first main category.</p>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              Create Category
            </button>
          </div>
        ) : (
          <div className="p-4 group/list">
            {sortedRootCategories.map(cat => (
              <div key={cat._id} className="group">
                <CategoryNode category={cat} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                {editingCategory ? 'Edit Category' : parentCategory ? 'Add Subcategory' : 'Add Root Category'}
              </h3>
              {parentCategory && !editingCategory && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Parent: {parentCategory.name}
                </span>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FormInput
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Fiction"
                required
                autoFocus
              />
              
              <FormInput
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description..."
                rows={3}
              />

              {/* Only show image upload for root categories or when editing one that might have an image */}
              {(!parentCategory || editingCategory?.level === 1) && (
                <ImageUpload
                  label="Background Image (Optional)"
                  onImageSelect={setCategoryImage}
                  existingImageUrl={editingCategory?.backgroundImage}
                />
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManagement