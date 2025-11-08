import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react'
import FormInput from '../components/FormInput'
import ImageUpload from '../components/ImageUpload'
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory
} from '../lib/api'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedCategories, setExpandedCategories] = useState(new Set())

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingSubCategory, setEditingSubCategory] = useState(null)
  const [selectedParentCategory, setSelectedParentCategory] = useState('')

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  })
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: '',
    description: '',
    parentCategory: ''
  })
  const [categoryImage, setCategoryImage] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, subCategoriesRes] = await Promise.all([
        getAllCategories(),
        getAllSubCategories()
      ])
      setCategories(categoriesRes.data)
      setSubCategories(subCategoriesRes.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategoryExpansion = (categoryId) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getSubCategoriesForCategory = (categoryId) => {
    return subCategories.filter(sub => sub.parentCategory._id === categoryId)
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, categoryForm, categoryImage)
      } else {
        await createCategory(categoryForm, categoryImage)
      }
      await fetchData()
      closeCategoryModal()
    } catch (err) {
      setFormErrors({ general: err.message })
    }
  }

  const handleSubCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSubCategory) {
        await updateSubCategory(editingSubCategory._id, subCategoryForm)
      } else {
        await createSubCategory(subCategoryForm)
      }
      await fetchData()
      closeSubCategoryModal()
    } catch (err) {
      setFormErrors({ general: err.message })
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This will also delete all its subcategories.')) return
    try {
      await deleteCategory(categoryId)
      await fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteSubCategory = async (subCategoryId) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return
    try {
      await deleteSubCategory(subCategoryId)
      await fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        name: category.name,
        description: category.description || ''
      })
      setCategoryImage(null)
    } else {
      setEditingCategory(null)
      setCategoryForm({ name: '', description: '' })
      setCategoryImage(null)
    }
    setFormErrors({})
    setShowCategoryModal(true)
  }

  const openSubCategoryModal = (subCategory = null, parentCategoryId = '') => {
    if (subCategory) {
      setEditingSubCategory(subCategory)
      setSubCategoryForm({
        name: subCategory.name,
        description: subCategory.description || '',
        parentCategory: subCategory.parentCategory._id
      })
    } else {
      setEditingSubCategory(null)
      setSubCategoryForm({
        name: '',
        description: '',
        parentCategory: parentCategoryId
      })
    }
    setFormErrors({})
    setShowSubCategoryModal(true)
  }

  const closeCategoryModal = () => {
    setShowCategoryModal(false)
    setEditingCategory(null)
    setCategoryForm({ name: '', description: '' })
    setCategoryImage(null)
    setFormErrors({})
  }

  const closeSubCategoryModal = () => {
    setShowSubCategoryModal(false)
    setEditingSubCategory(null)
    setSubCategoryForm({ name: '', description: '', parentCategory: '' })
    setFormErrors({})
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => openCategoryModal()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Categories & Subcategories</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {categories.map((category) => {
            const categorySubs = getSubCategoriesForCategory(category._id)
            const isExpanded = expandedCategories.has(category._id)

            return (
              <div key={category._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleCategoryExpansion(category._id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    <div className="flex items-center gap-3">
                      {category.backgroundImage ? (
                        <img
                          src={category.backgroundImage}
                          alt={category.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Folder className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-gray-500">{category.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openSubCategoryModal(null, category._id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Add Subcategory"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openCategoryModal(category)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isExpanded && categorySubs.length > 0 && (
                  <div className="ml-12 mt-3 space-y-2">
                    {categorySubs.map((sub) => (
                      <div key={sub._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FolderOpen className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="font-medium text-gray-700">{sub.name}</span>
                            {sub.description && (
                              <p className="text-sm text-gray-500">{sub.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openSubCategoryModal(sub)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Subcategory"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubCategory(sub._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isExpanded && categorySubs.length === 0 && (
                  <div className="ml-12 mt-3 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-500 text-sm">No subcategories yet</p>
                    <button
                      onClick={() => openSubCategoryModal(null, category._id)}
                      className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Add first subcategory
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {categories.length === 0 && (
          <div className="p-12 text-center">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first category</p>
            <button
              onClick={() => openCategoryModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h3>
            <form onSubmit={handleCategorySubmit}>
              <FormInput
                label="Category Name"
                name="name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                required
                error={formErrors.name}
              />
              <FormInput
                label="Description"
                name="description"
                type="textarea"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                rows={3}
              />
              <ImageUpload
                label="Background Image"
                onImageSelect={setCategoryImage}
                existingImageUrl={editingCategory?.backgroundImage}
              />
              {formErrors.general && (
                <p className="text-red-500 text-sm mb-4">{formErrors.general}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingSubCategory ? 'Edit Subcategory' : 'Add Subcategory'}
            </h3>
            <form onSubmit={handleSubCategorySubmit}>
              <FormInput
                label="Parent Category"
                name="parentCategory"
                type="select"
                value={subCategoryForm.parentCategory}
                onChange={(e) => setSubCategoryForm({...subCategoryForm, parentCategory: e.target.value})}
                options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
                required
                error={formErrors.parentCategory}
              />
              <FormInput
                label="Subcategory Name"
                name="name"
                value={subCategoryForm.name}
                onChange={(e) => setSubCategoryForm({...subCategoryForm, name: e.target.value})}
                required
                error={formErrors.name}
              />
              <FormInput
                label="Description"
                name="description"
                type="textarea"
                value={subCategoryForm.description}
                onChange={(e) => setSubCategoryForm({...subCategoryForm, description: e.target.value})}
                rows={3}
              />
              {formErrors.general && (
                <p className="text-red-500 text-sm mb-4">{formErrors.general}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeSubCategoryModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingSubCategory ? 'Update' : 'Create'}
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