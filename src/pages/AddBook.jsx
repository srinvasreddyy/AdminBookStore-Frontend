import React, { useState, useEffect } from 'react'
import { 
  BookOpen, 
  FileText, 
  DollarSign, 
  Package, 
  Tag, 
  User, 
  Calendar,
  Save,
  X
} from 'lucide-react'
import FormSection from '../components/FormSection'
import FormInput from '../components/FormInput'
import MultipleImageUpload from '../components/MultipleImageUpload'
import { apiPostForm, apiGet, apiPatchForm, getAllCategories } from '../lib/api'
import toast from 'react-hot-toast'

const AddBook = ({ bookId }) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publicationDate: '',
    category: '', 
    language: '',
    numberOfPages: '',
    price: '',
    salePrice: '',
    deliveryFee: '',
    stock: '',
    format: '',
    fullDescription: '',
    shortDescription: '',
    tags: '',
    featured: false,
    bestseller: false,
    oldBook: false
  })

  const [coverImages, setCoverImages] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Category Handling
  const [categoryTree, setCategoryTree] = useState([])
  const [selectedPath, setSelectedPath] = useState([]) 
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [initialCategoryLoaded, setInitialCategoryLoaded] = useState(null) 

  useEffect(() => {
    fetchCategories()
    if (bookId) {
      setIsEditMode(true)
      fetchBookData(bookId)
    }
  }, [bookId])

  // Sync Edit Mode Category with Tree
  useEffect(() => {
    if (categoryTree.length > 0 && initialCategoryLoaded) {
      const path = findPathToCategory(categoryTree, initialCategoryLoaded)
      if (path) {
        setSelectedPath(path)
        setFormData(prev => ({ ...prev, category: initialCategoryLoaded }))
      }
    }
  }, [categoryTree, initialCategoryLoaded])

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await getAllCategories() 
      setCategoryTree(response.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoadingCategories(false)
    }
  }

  const findPathToCategory = (nodes, targetId, path = []) => {
    for (const node of nodes) {
      if (node._id === targetId) return [...path, node]
      if (node.children?.length) {
        const found = findPathToCategory(node.children, targetId, [...path, node])
        if (found) return found
      }
    }
    return null
  }

  const fetchBookData = async (id) => {
    try {
      setLoading(true)
      const response = await apiGet(`/books/${id}`)
      const book = response.data

      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        publicationDate: book.publicationDate ? new Date(book.publicationDate).toISOString().split('T')[0] : '',
        category: book.category?._id || '',
        language: book.language || '',
        numberOfPages: book.numberOfPages || '',
        price: book.price || '',
        salePrice: book.salePrice !== undefined ? book.salePrice : '',
        deliveryFee: book.deliveryCharge || '',
        stock: book.stock || '',
        format: book.format || '',
        fullDescription: book.fullDescription || '',
        shortDescription: book.shortDescription || '',
        tags: book.tags?.map(tag => tag.name).join(', ') || '',
        featured: book.isFeatured || false,
        bestseller: book.isBestSeller || false,
        oldBook: book.oldBook || false,
      })

      setCoverImages(book.coverImages || [])
      
      if (book.category?._id) {
        setInitialCategoryLoaded(book.category._id)
      }

    } catch (error) {
      console.error('Error fetching book data:', error)
      toast.error('Failed to load book data')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (level, selectedId) => {
    const currentOptions = level === 0 ? categoryTree : selectedPath[level - 1]?.children || []
    const selectedCategory = currentOptions.find(c => c._id === selectedId)

    if (!selectedCategory) return

    const newPath = [...selectedPath.slice(0, level), selectedCategory]
    setSelectedPath(newPath)
    
    setFormData(prev => ({ ...prev, category: selectedCategory._id }))
  }

  const getOptionsForLevel = (level) => {
    if (level === 0) return categoryTree
    const parent = selectedPath[level - 1]
    return parent?.children || []
  }

  const formats = [
    { value: 'Hardcover', label: 'Hardcover' },
    { value: 'Paperback', label: 'Paperback' },
  ]

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImagesSelect = (files) => {
    setCoverImages(files)
  }

  const validateForm = () => {
    const newErrors = {}
    
    // STRICT VALIDATION: Only these 5 fields are required
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.author.trim()) newErrors.author = 'Author is required'
    if (!formData.price) newErrors.price = 'Regular price is required'
    if (formData.salePrice === '') newErrors.salePrice = 'Sale price is required'
    if (!formData.deliveryFee) newErrors.deliveryFee = 'Delivery fee is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    
    try {
      const formDataToSend = new FormData()
      
      Object.keys(formData).forEach(key => {
        const value = formData[key]
        // Only append if value exists (handles optional fields being empty)
        if (value === '' || value === null || value === undefined) return

        if (key === 'tags' && typeof value === 'string') {
          const tagsArray = value.split(',').map(t => t.trim()).filter(Boolean)
          const idRegex = /^[0-9a-fA-F]{24}$/
          const tagIds = []
          const tagNames = []

          tagsArray.forEach(tagVal => {
            if (idRegex.test(tagVal)) {
              tagIds.push(tagVal)
            } else {
              tagNames.push(tagVal)
            }
          })

          tagIds.forEach(id => formDataToSend.append('tags', id))
          tagNames.forEach(name => formDataToSend.append('tagNames', name))
          return
        }

        let appendKey = key
        let appendValue = value
        if (key === 'featured') {
          appendKey = 'isFeatured'
          appendValue = String(Boolean(value))
        }
        if (key === 'bestseller') {
          appendKey = 'isBestSeller'
          appendValue = String(Boolean(value))
        }
        if (key === 'oldBook') {
          appendKey = 'oldBook'
          appendValue = String(Boolean(value))
        }
        if (key === 'deliveryFee') {
          appendKey = 'deliveryCharge'
          appendValue = value
        }

        formDataToSend.append(appendKey, appendValue)
      })
      
      if (isEditMode) {
        const newImages = coverImages.filter(img => img instanceof File)
        newImages.forEach((image) => {
          formDataToSend.append('coverImages', image)
        })
      } else {
        coverImages.forEach((image) => {
          formDataToSend.append('coverImages', image)
        })
      }
      
      if (isEditMode) {
        await apiPatchForm(`/books/${bookId}`, formDataToSend)
        toast.success('Book updated successfully!')
      } else {
        await apiPostForm('/books', formDataToSend)
        toast.success('Book created successfully!')
        handleReset()
      }
    } catch (error) {
      console.error('Error saving book:', error)
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} book`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    if (isEditMode) {
      fetchBookData(bookId)
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publicationDate: '',
        category: '',
        language: '',
        numberOfPages: '',
        price: '',
        salePrice: '',
        deliveryFee: '',
        stock: '',
        format: '',
        fullDescription: '',
        shortDescription: '',
        tags: '',
        featured: false,
        bestseller: false,
        oldBook: false
      })
      setCoverImages([])
      setSelectedPath([])
      setErrors({})
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="text-lg font-semibold">Loading book data...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white sticky top-0 z-50 max-lg:z-10 max-lg:top-11 border-b border-gray-200 px-8 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              {isEditMode ? 'Edit Book' : 'Add New Book'}
            </h1>
            <p className="text-gray-500 mt-0 text-sm">
              {isEditMode ? 'Update the book details below' : 'Fill in the details to add a new book to the store'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex text-xs items-center gap-2 font-bold text-white px-4 py-2 border border-gray-300 rounded-lg bg-black hover:bg-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 max-lg:p-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Information */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Category Selection Section (Optional) */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <h3 className="text-base font-semibold text-gray-800">Category Selection (Optional)</h3>
                </div>
                
                {loadingCategories ? (
                   <div className="text-sm text-gray-500">Loading categories...</div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Level 1 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Main Category</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                          value={selectedPath[0]?._id || ''}
                          onChange={(e) => handleCategoryChange(0, e.target.value)}
                        >
                          <option value="">Select...</option>
                          {categoryTree.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Level 2 */}
                      {selectedPath.length > 0 && getOptionsForLevel(1).length > 0 && (
                        <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-left-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Sub Category</label>
                          <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                            value={selectedPath[1]?._id || ''}
                            onChange={(e) => handleCategoryChange(1, e.target.value)}
                          >
                            <option value="">Select...</option>
                            {getOptionsForLevel(1).map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <FormSection title="Basic Information" icon={BookOpen}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Book Title"
                    name="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required={true}
                    error={errors.title}
                    icon={BookOpen}
                  />
                  <FormInput
                    label="Author"
                    name="author"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={handleInputChange}
                    required={true}
                    error={errors.author}
                    icon={User}
                  />
                  <FormInput
                    label="ISBN"
                    name="isbn"
                    placeholder="978-3-16-148410-0"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    required={false}
                  />
                  <FormInput
                    label="Publisher"
                    name="publisher"
                    placeholder="Enter publisher name"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    required={false}
                  />
                  <FormInput
                    label="Publication Date"
                    name="publicationDate"
                    type="date"
                    value={formData.publicationDate}
                    onChange={handleInputChange}
                    required={false}
                    icon={Calendar}
                  />
                  <FormInput
                    label="Number of Pages"
                    name="numberOfPages"
                    type="number"
                    placeholder="e.g., 350"
                    value={formData.numberOfPages}
                    onChange={handleInputChange}
                    required={false}
                  />
                </div>
              </FormSection>

              {/* Other Attributes */}
              <FormSection title="Details" icon={FileText}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Format"
                    name="format"
                    type="select"
                    value={formData.format}
                    onChange={handleInputChange}
                    options={formats}
                    required={false}
                  />
                  <FormInput
                    label="Language"
                    name="language"
                    type="select"
                    value={formData.language}
                    onChange={handleInputChange}
                    options={languages}
                    required={false}
                  />
                </div>
                <div className="mt-4 space-y-4">
                  <FormInput
                    label="Short Description"
                    name="shortDescription"
                    type="textarea"
                    rows={2}
                    placeholder="Brief description..."
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    required={false}
                  />
                  <FormInput
                    label="Full Description"
                    name="fullDescription"
                    type="textarea"
                    rows={5}
                    placeholder="Detailed description..."
                    value={formData.fullDescription}
                    onChange={handleInputChange}
                    required={false}
                  />
                  <FormInput
                    label="Tags"
                    name="tags"
                    placeholder="adventure, fiction, bestseller (comma-separated)"
                    value={formData.tags}
                    onChange={handleInputChange}
                    icon={Tag}
                    required={false}
                  />
                </div>
              </FormSection>
            </div>

            {/* Right Column - Pricing & Media */}
            <div className="space-y-6">
              {/* Cover Images */}
              <FormSection title="Cover Images" icon={BookOpen}>
                <MultipleImageUpload
                  label="Book Cover Images (up to 10)"
                  onImagesSelect={handleImagesSelect}
                  required={false}
                  maxImages={10}
                  existingImages={isEditMode ? coverImages.filter(img => typeof img === 'string') : []}
                />
              </FormSection>

              {/* Pricing */}
              <FormSection title="Pricing" icon={DollarSign}>
                <FormInput
                  label="Regular Price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  required={true}
                  error={errors.price}
                  icon={DollarSign}
                />
                <FormInput
                  label="Sale Price"
                  name="salePrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  required={true}
                  error={errors.salePrice}
                  icon={DollarSign}
                />
                <FormInput
                  label="Delivery Fee"
                  name="deliveryFee"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.deliveryFee}
                  onChange={handleInputChange}
                  required={true}
                  error={errors.deliveryFee}
                  icon={DollarSign}
                />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-neutral-800">
                    <span className="font-semibold">Tip:</span> Set sale price to 0 if not on sale.
                  </p>
                </div>
              </FormSection>

              {/* Inventory */}
              <FormSection title="Inventory" icon={Package}>
                <FormInput
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required={false}
                  icon={Package}
                />
                 <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-neutral-600 border-gray-300 rounded focus:ring-neutral-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-neutral-600 transition-colors">
                        Featured Book
                      </span>
                      <p className="text-xs text-gray-500">Display on homepage</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="bestseller"
                      checked={formData.bestseller}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-neutral-600 border-gray-300 rounded focus:ring-neutral-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-neutral-600 transition-colors">
                        Bestseller
                      </span>
                      <p className="text-xs text-gray-500">Mark as bestseller</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="oldBook"
                      checked={formData.oldBook}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-neutral-600 border-gray-300 rounded focus:ring-neutral-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-neutral-600 transition-colors">
                        Old Book
                      </span>
                      <p className="text-xs text-gray-500">Mark as pre-owned/used</p>
                    </div>
                  </label>
                </div>
              </FormSection>

              {/* Submit Buttons */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-neutral-800 to-neutral-900 font-bold text-sm text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {isEditMode ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {isEditMode ? 'Update Book' : 'Save Book'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full mt-3 font-bold px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddBook