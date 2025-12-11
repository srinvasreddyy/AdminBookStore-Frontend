import React, { useState, useEffect, useMemo } from 'react'
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

// --- Recursive Tree Component (Moved Outside) ---
const CategoryNode = ({ category, level = 1, expandedCategories, toggleExpansion, onOpenModal, onTogglePin, onDelete }) => {
  const hasChildren = category.children && category.children.length > 0
  const isExpanded = expandedCategories.has(category._id)
  const isPinned = category.isPinned

  return (
    <div className="relative select-none">
      {/* Hierarchical Connecting Line for Children */}
      {level > 1 && (
         <div className="absolute -left-4 top-0 bottom-1/2 w-4 border-l-2 border-b-2 border-gray-200 rounded-bl-lg -translate-y-3" />
      )}

      <div 
        className={`group flex items-center justify-between p-3 my-1 rounded-lg transition-all border 
          ${isPinned 
            ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
            : 'bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-200'
          }`}
      >
        {/* LEFT SIDE: Icon & Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Expand/Collapse Toggle */}
          <button 
            onClick={() => toggleExpansion(category._id)}
            className={`p-1 rounded-md transition-colors ${
              hasChildren 
                ? 'hover:bg-gray-200 text-gray-500' 
                : 'text-gray-300 cursor-default'
            }`}
          >
            {isExpanded && hasChildren ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {/* Folder Icon */}
          <div className={`p-2 rounded-lg ${isPinned ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
            {isExpanded ? <FolderOpen size={20} /> : <Folder size={20} />}
          </div>

          {/* Name & Desc */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-sm ${isPinned ? 'text-indigo-900' : 'text-gray-800'}`}>
                {category.name}
              </span>
              {/* Visual Pin Indicator */}
              {isPinned && <Pin size={12} className="text-indigo-500 fill-current" />}
              {/* Level Badge (Optional, debug helper) */}
              {/* <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                Lvl {level}
              </span> */}
            </div>
            {category.description && (
              <p className="text-xs text-gray-400 truncate max-w-[200px]">{category.description}</p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Actions (Edit, Delete, Add Child, Pin) */}
        <div className="flex items-center gap-1">
          {/* 1. Add Subcategory (Only if level < 4) */}
          {level < 4 && (
            <button 
              onClick={() => onOpenModal(null, category)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Add Subcategory"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}

          {/* 2. Pin (Only for Root Categories) */}
          {level === 1 && (
            <button 
              onClick={() => onTogglePin(category)}
              className={`p-1.5 rounded-md transition-colors ${
                isPinned 
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
              title={isPinned ? "Unpin Category" : "Pin to Top"}
            >
              <Pin size={16} className={isPinned ? 'fill-current' : ''} />
            </button>
          )}

          <div className="w-px h-4 bg-gray-200 mx-1"></div>

          {/* 3. Edit */}
          <button 
            onClick={() => onOpenModal(category)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Edit Category"
          >
            <Edit size={16} />
          </button>
          
          {/* 4. Delete */}
          <button 
            onClick={() => onDelete(category._id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Category"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Children Container (Recursive) */}
      {isExpanded && hasChildren && (
        <div className="pl-6 md:pl-8 border-l-2 border-gray-100 ml-4 space-y-1">
          {category.children.map(child => (
            <CategoryNode 
              key={child._id} 
              category={child} 
              level={level + 1}
              expandedCategories={expandedCategories}
              toggleExpansion={toggleExpansion}
              onOpenModal={onOpenModal}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]) // Tree structure
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState(new Set())

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
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getAllCategories()
      setCategories(response.data || [])
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

  const handleTogglePin = async (category) => {
    // Only Root categories can be pinned (Level 1 in UI, parent is null in DB)
    // Note: If you just created a subcategory but it appears as root due to a bug, 
    // this check might pass in UI but fail in Backend.
    if (category.level !== 1) {
      toast.error("Only root categories can be pinned")
      return
    }

    try {
      const newStatus = !category.isPinned
      await updateCategory(category._id, { isPinned: newStatus })
      toast.success(newStatus ? 'Category pinned' : 'Category unpinned')
      fetchData() // Refresh tree
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to update pin status')
    }
  }

  // --- Handlers ---
  const handleOpenModal = (categoryToEdit = null, parent = null) => {
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit)
      setFormData({
        name: categoryToEdit.name,
        description: categoryToEdit.description || ''
      })
      setCategoryImage(null) 
      setParentCategory(null)
    } else {
      // Adding new
      setEditingCategory(null)
      setFormData({ name: '', description: '' })
      setCategoryImage(null)
      // Explicitly set parent. If parent is null, it's a root category.
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
        // Ensure parentId is sent if parentCategory exists
        if (parentCategory && parentCategory._id) {
          payload.parentId = parentCategory._id
        }
        
        await createCategory(payload, categoryImage)
        toast.success(parentCategory ? 'Subcategory created' : 'Root Category created')
        
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
        toast.error('Failed to delete. Ensure no books are attached.')
      }
    }
  }

  // Sorting: Pinned roots first, then alphabetical
  const sortedRootCategories = useMemo(() => {
    if (!categories.length) return []
    const pinned = []
    const unpinned = []
    
    categories.forEach(cat => {
      if (cat.isPinned) pinned.push(cat)
      else unpinned.push(cat)
    })
    
    return [...pinned, ...unpinned]
  }, [categories])

  return (
    <div className="p-6 min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Category Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your book catalog hierarchy. Max depth: 4 levels.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal(null, null)}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 hover:shadow-xl active:scale-95"
        >
          <Plus size={20} />
          <span className="font-medium">New Root Category</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="text-sm text-gray-500">Loading hierarchy...</p>
          </div>
        ) : sortedRootCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <FolderOpen className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No categories found</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Your catalog is empty. Create your first category to start organizing books.
            </p>
            <button
              onClick={() => handleOpenModal(null, null)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Create Category
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {sortedRootCategories.map(cat => (
              <CategoryNode 
                key={cat._id} 
                category={cat} 
                level={1}
                expandedCategories={expandedCategories}
                toggleExpansion={toggleExpansion}
                onOpenModal={handleOpenModal}
                onTogglePin={handleTogglePin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingCategory ? 'Edit Category' : parentCategory ? 'Add Subcategory' : 'Add Root Category'}
                </h3>
                {parentCategory && !editingCategory && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                    <CornerDownRight size={12} />
                    <span>Parent: <span className="font-semibold">{parentCategory.name}</span></span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Trash2 size={0} className="hidden" /> {/* Dummy to keep imports valid if unused */}
                <span className="text-2xl font-light">&times;</span>
              </button>
            </div>
            
            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <FormInput
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Science Fiction"
                required
                autoFocus
              />
              
              <FormInput
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description about this category..."
                rows={3}
              />

              {/* Only show image upload for root categories */}
              {(!parentCategory || (editingCategory && editingCategory.level === 1)) && (
                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                  <ImageUpload
                    label="Cover Image (Root Only)"
                    onImageSelect={setCategoryImage}
                    existingImageUrl={editingCategory?.backgroundImage}
                  />
                  <p className="text-[10px] text-gray-400 mt-2 text-center">
                    Recommended: 500x300px JPG/PNG
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 text-sm font-medium shadow-md transition-colors"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
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