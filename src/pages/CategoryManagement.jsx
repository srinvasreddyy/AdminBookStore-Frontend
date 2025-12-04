import React, { useState, useEffect } from 'react'
import { 
  Plus, Search, Edit2, Trash2, ChevronRight, 
  ChevronDown, FolderTree, Image as ImageIcon,
  Pin, PinOff
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { fetchCategories, createCategory, updateCategory, deleteCategory, pinCategory } from '../lib/api'
import toast from 'react-hot-toast'
import FormInput from '../components/FormInput'
import ImageUpload from '../components/ImageUpload'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    image: null
  })
  
  // Tree State
  const [expandedCategories, setExpandedCategories] = useState({})

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await fetchCategories()
      setCategories(data)
    } catch (error) {
      toast.error('Failed to load categories')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // --- Handlers ---

  const handleTogglePin = async (e, category) => {
    e.stopPropagation(); // Prevent toggling accordion if clicked on row
    try {
      const updatedCat = await pinCategory(category._id);
      
      // Update local state to reflect change immediately
      setCategories(prev => prev.map(c => 
        c._id === category._id ? { ...c, isPinned: updatedCat.isPinned, pinnedAt: updatedCat.pinnedAt } : c
      ));

      toast.success(updatedCat.isPinned ? "Category pinned" : "Category unpinned");
    } catch (error) {
      toast.error("Failed to update pin status");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (file) => {
    setFormData(prev => ({ ...prev, image: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      if (formData.parentId) data.append('parentId', formData.parentId)
      if (formData.image) data.append('backgroundImage', formData.image)

      if (editingCategory) {
        await updateCategory(editingCategory._id, data)
        toast.success('Category updated successfully')
      } else {
        await createCategory(data)
        toast.success('Category created successfully')
      }
      
      setIsModalOpen(false)
      resetForm()
      loadCategories()
    } catch (error) {
      toast.error(error.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? Sub-categories must be deleted first.')) return
    try {
      await deleteCategory(id)
      toast.success('Category deleted')
      loadCategories()
    } catch (error) {
      toast.error(error.message || 'Failed to delete')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', parentId: '', image: null })
    setEditingCategory(null)
  }

  const toggleExpand = (id) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // --- Sort Logic ---
  const sortCategories = (list) => {
    return [...list].sort((a, b) => {
       // 1. Pinned comes first
       if (a.isPinned !== b.isPinned) {
           return a.isPinned ? -1 : 1;
       }
       // 2. If both pinned, chronological (oldest pin first)
       if (a.isPinned) {
           return new Date(a.pinnedAt) - new Date(b.pinnedAt);
       }
       // 3. If neither pinned, maintain existing order (createdAt desc from backend usually)
       return 0;
    });
  };

  // --- Recursive Tree Rendering ---
  const renderCategoryTree = (parentId = null, level = 0) => {
    // 1. Filter items for this level
    const filtered = categories.filter(c => 
      (parentId ? c.parent?._id === parentId || c.parent === parentId : !c.parent)
    )

    // 2. Apply Sorting (Pinned Top)
    const sortedFiltered = sortCategories(filtered);

    // 3. Handle Search Mode
    if (searchQuery) {
       // Flatten and Search
       const searchResults = categories.filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
       );
       // Sort search results too
       const sortedSearchResults = sortCategories(searchResults);

       return sortedSearchResults.map(category => (
        <CategoryRow 
          key={category._id} 
          category={category} 
          level={0} 
          isSearchResult={true} 
        />
      ));
    }

    return sortedFiltered.map(category => (
      <React.Fragment key={category._id}>
        <CategoryRow 
          category={category} 
          level={level} 
          hasChildren={categories.some(c => c.parent?._id === category._id || c.parent === category._id)}
          isExpanded={expandedCategories[category._id]}
          onToggle={() => toggleExpand(category._id)}
        />
        {expandedCategories[category._id] && renderCategoryTree(category._id, level + 1)}
      </React.Fragment>
    ))
  }

  const CategoryRow = ({ category, level, hasChildren, isExpanded, onToggle, isSearchResult }) => (
    <div 
      className={`group flex items-center justify-between p-3 border-b border-gray-100 transition-all duration-300
        ${category.isPinned 
          ? 'bg-amber-50/40 hover:bg-amber-50/80 border-l-4 border-l-amber-400' 
          : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
      style={{ paddingLeft: isSearchResult ? '1rem' : `${level * 1.5 + 1}rem` }}
    >
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        {hasChildren && !isSearchResult ? (
          <button onClick={onToggle} className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <div className="w-6 flex-shrink-0" /> // spacer
        )}
        
        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
          {category.backgroundImage ? (
            <img src={category.backgroundImage} alt={category.name} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={18} className="text-gray-400" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className={`font-medium flex items-center gap-2 ${category.isPinned ? 'text-amber-900' : 'text-gray-800'}`}>
            <span className="truncate">{category.name}</span>
            {category.isPinned && (
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                <Pin size={10} className="fill-current" />
                Pinned
              </span>
            )}
          </span>
          {category.description && (
            <span className="text-xs text-gray-500 truncate">{category.description}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-4">
        {/* Pin Button */}
        <button
          onClick={(e) => handleTogglePin(e, category)}
          className={`p-2 rounded-md transition-colors ${
            category.isPinned 
              ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' 
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
          title={category.isPinned ? "Unpin Category" : "Pin Category"}
        >
          {category.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
        </button>

        <button
          onClick={() => {
            setEditingCategory(category)
            setFormData({
              name: category.name,
              description: category.description || '',
              parentId: category.parent?._id || category.parent || '',
              image: null
            })
            setIsModalOpen(true)
          }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => handleDelete(category._id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Category Management" 
        subtitle="Manage book categories and hierarchy"
        action={{
          label: 'Add Category',
          icon: Plus,
          onClick: () => {
            resetForm()
            setIsModalOpen(true)
          }
        }}
      />

      {/* Main Category List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

        {/* Tree Content */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No categories found. Create one to get started.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {renderCategoryTree()}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-5 h-5" transform="rotate(45)" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Parent Category (Optional)</label>
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all"
                >
                  <option value="">None (Root Category)</option>
                  {categories
                    .filter(c => c._id !== editingCategory?._id) // Prevent self-parenting
                    .map(c => (
                    <option key={c._id} value={c._id}>
                      {c.name} (Level {c.level})
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                textarea
              />

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Cover Image</label>
                <ImageUpload 
                  onImageSelect={handleImageChange}
                  preview={editingCategory?.backgroundImage}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 font-medium"
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