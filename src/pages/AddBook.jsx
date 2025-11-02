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
  X,
  Eye
} from 'lucide-react'
import FormSection from '../components/FormSection'
import FormInput from '../components/FormInput'
import MultipleImageUpload from '../components/MultipleImageUpload'
import { apiPostForm, apiGet, apiPatch, apiPatchForm } from '../lib/api'
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
    bestseller: false
  })

  const [coverImages, setCoverImages] = useState([])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    fetchCategories()
    if (bookId) {
      setIsEditMode(true)
      fetchBookData(bookId)
    }
  }, [bookId])

  const fetchBookData = async (id) => {
    try {
      setLoading(true)
      const response = await apiGet(`/books/${id}`)
      const book = response.data

      // Populate form with existing data
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
        salePrice: book.salePrice || '',
        deliveryFee: book.deliveryCharge || '',
        stock: book.stock || '',
        format: book.format || '',
        fullDescription: book.fullDescription || '',
        shortDescription: book.shortDescription || '',
        tags: book.tags?.map(tag => tag.name).join(', ') || '',
        featured: book.isFeatured || false,
        bestseller: book.isBestSeller || false
      })

      // Set existing cover images (these will be URLs)
      setCoverImages(book.coverImages || [])
    } catch (error) {
      console.error('Error fetching book data:', error)
      toast.error('Failed to load book data')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await apiGet('/categories/selectable')
      setCategories(response.data.filter(cat => !cat.deleted))
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoadingCategories(false)
    }
  }

  const categoryOptions = categories.map(cat => ({
    value: cat._id,
    label: cat.name
  }))

  const formats = [
    { value: 'Hardcover', label: 'Hardcover' },
    { value: 'Paperback', label: 'Paperback' },
    // { value: 'ebook', label: 'E-Book' },
    // { value: 'audiobook', label: 'Audiobook' }
  ]

  const languages = [
    { value: 'english', label: 'English' },
    // { value: 'telugu', label: 'Telugu' },
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
    
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.author.trim()) newErrors.author = 'Author is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.price) newErrors.price = 'Price is required'
    if (!formData.deliveryFee) newErrors.deliveryFee = 'Delivery fee is required'
    if (!formData.stock) newErrors.stock = 'Stock quantity is required'
    if (!formData.fullDescription.trim()) newErrors.fullDescription = 'Full description is required'
    if (!isEditMode && coverImages.length === 0) newErrors.coverImages = 'At least one cover image is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const formDataToSend = new FormData()
      
      // Append form data
      Object.keys(formData).forEach(key => {
        const value = formData[key]
        if (value === '' || value === null || value === undefined) return

        // Handle tags specially: user enters comma-separated names or IDs.
        // Append each tag as a separate FormData field so backend receives an array.
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

          // Append ObjectId-like values as 'tags' (IDs)
          tagIds.forEach(id => formDataToSend.append('tags', id))
          // Append plain names separately so backend can handle creation/lookup if supported
          tagNames.forEach(name => formDataToSend.append('tagNames', name))

          return
        }

        // Map admin boolean fields and delivery fee to backend field names
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
        if (key === 'deliveryFee') {
          appendKey = 'deliveryCharge'
          appendValue = value
        }

        formDataToSend.append(appendKey, appendValue)
      })
      
      // For edit mode, only append new images, existing ones are handled by the backend
      if (isEditMode) {
        // Check if new images were selected (File objects vs URLs)
        const newImages = coverImages.filter(img => img instanceof File)
        newImages.forEach((image) => {
          formDataToSend.append('coverImages', image)
        })
      } else {
        // For create mode, append all images
        coverImages.forEach((image) => {
          formDataToSend.append('coverImages', image)
        })
      }
      
      if (isEditMode) {
        // Send multipart/form-data for PATCH so file uploads are handled properly
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
      // In edit mode, refetch the original data
      fetchBookData(bookId)
    } else {
      // In create mode, reset to empty
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
        bestseller: false
      })
      setCoverImages([])
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
              className="flex text-xs items-center gap-2 font-bold text-white  px-4 py-2 border border-gray-300 rounded-lg bg-black hover:bg-gray-900 transition-colors"
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
              {/* Basic Information */}
              <FormSection title="Basic Information" icon={BookOpen}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Book Title"
                    name="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    error={errors.title}
                    icon={BookOpen}
                  />
                  <FormInput
                    label="Author"
                    name="author"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    error={errors.author}
                    icon={User}
                  />
                  <FormInput
                    label="ISBN"
                    name="isbn"
                    placeholder="978-3-16-148410-0"
                    value={formData.isbn}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    label="Publisher"
                    name="publisher"
                    placeholder="Enter publisher name"
                    value={formData.publisher}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    label="Publication Date"
                    name="publicationDate"
                    type="date"
                    value={formData.publicationDate}
                    onChange={handleInputChange}
                    icon={Calendar}
                  />
                  <FormInput
                    label="Number of numberOfPages"
                    name="numberOfPages"
                    type="number"
                    placeholder="e.g., 350"
                    value={formData.numberOfPages}
                    onChange={handleInputChange}
                  />
                </div>
              </FormSection>

              {/* Category & Format */}
              <FormSection title="Category & Format" icon={Tag}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Category"
                    name="category"
                    type="select"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    error={errors.category}
                    options={categoryOptions}
                    disabled={loadingCategories}
                  />
                  <FormInput
                    label="Format"
                    name="format"
                    type="select"
                    value={formData.format}
                    onChange={handleInputChange}
                    options={formats}
                  />
                  <FormInput
                    label="Language"
                    name="language"
                    type="select"
                    value={formData.language}
                    onChange={handleInputChange}
                    options={languages}
                  />
                </div>
              </FormSection>

              {/* Description */}
              <FormSection title="Description" icon={FileText}>
                <FormInput
                  label="Short Description"
                  name="shortDescription"
                  type="textarea"
                  rows={3}
                  placeholder="Brief description for listing numberOfPages (max 200 characters)"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Full Description"
                  name="fullDescription"
                  type="textarea"
                  rows={6}
                  placeholder="Detailed description of the book, its content, and what readers can expect..."
                  value={formData.fullDescription}
                  onChange={handleInputChange}
                  required
                  error={errors.fullDescription}
                />
                <FormInput
                  label="Tags"
                  name="tags"
                  placeholder="adventure, fiction, bestseller (comma-separated)"
                  value={formData.tags}
                  onChange={handleInputChange}
                  icon={Tag}
                />
              </FormSection>
            </div>

            {/* Right Column - Pricing & Media */}
            <div className="space-y-6">
              {/* Cover Images */}
              <FormSection title="Cover Images" icon={BookOpen}>
                <MultipleImageUpload
                  label="Book Cover Images"
                  onImagesSelect={handleImagesSelect}
                  required={!isEditMode}
                  maxImages={5}
                  existingImages={isEditMode ? coverImages.filter(img => typeof img === 'string') : []}
                />
                {errors.coverImages && (
                  <p className="text-red-500 text-xs mt-1">{errors.coverImages}</p>
                )}
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
                  required
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
                  required
                  error={errors.deliveryFee}
                  icon={DollarSign}
                />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-neutral-800">
                    <span className="font-semibold">Tip:</span> Leave sale price empty if the book is not on sale
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
                  required
                  error={errors.stock}
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
                </div>
              </FormSection>

              {/* Submit Buttons */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-neutral-800 font-bold text-sm to-neutral-900 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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