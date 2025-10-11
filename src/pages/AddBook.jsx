import React, { useState } from 'react'
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
import ImageUpload from '../components/ImageUpload'

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publicationDate: '',
    category: '',
    language: '',
    pages: '',
    price: '',
    salePrice: '',
    stock: '',
    format: '',
    description: '',
    shortDescription: '',
    tags: '',
    featured: false,
    bestseller: false
  })

  const [coverImage, setCoverImage] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'science', label: 'Science' },
    { value: 'technology', label: 'Technology' },
    { value: 'biography', label: 'Biography' },
    { value: 'history', label: 'History' },
    { value: 'self-help', label: 'Self-Help' },
    { value: 'business', label: 'Business' },
    { value: 'children', label: 'Children' },
    { value: 'romance', label: 'Romance' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'fantasy', label: 'Fantasy' }
  ]

  const formats = [
    { value: 'hardcover', label: 'Hardcover' },
    { value: 'paperback', label: 'Paperback' },
    { value: 'ebook', label: 'E-Book' },
    { value: 'audiobook', label: 'Audiobook' }
  ]

  const languages = [
    { value: 'english', label: 'English' },
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

  const handleImageSelect = (file) => {
    setCoverImage(file)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.author.trim()) newErrors.author = 'Author is required'
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.price) newErrors.price = 'Price is required'
    if (!formData.stock) newErrors.stock = 'Stock quantity is required'
    if (!coverImage) newErrors.coverImage = 'Cover image is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form Data:', formData)
      console.log('Cover Image:', coverImage)
      alert('Book added successfully!')
      setIsSubmitting(false)
      handleReset()
    }, 1500)
  }

  const handleReset = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publicationDate: '',
      category: '',
      language: '',
      pages: '',
      price: '',
      salePrice: '',
      stock: '',
      format: '',
      description: '',
      shortDescription: '',
      tags: '',
      featured: false,
      bestseller: false
    })
    setCoverImage(null)
    setErrors({})
  }

  const handlePreview = () => {
    console.log('Preview book:', formData)
    // Implement preview functionality
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 max-lg:z-10 max-lg:top-11 border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Add New Book</h1>
            <p className="text-gray-500 mt-0 text-sm">Fill in the details to add a new book to the store</p>
          </div>
          <div className="flex gap-3">
           
            <button
              type="button"
              onClick={handleReset}
              className="flex text-sm items-center gap-2 font-bold text-white  px-4 py-2 border border-gray-300 rounded-lg bg-black hover:bg-gray-900 transition-colors"
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
                    required
                    error={errors.isbn}
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
                    label="Number of Pages"
                    name="pages"
                    type="number"
                    placeholder="e.g., 350"
                    value={formData.pages}
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
                    options={categories}
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
                  placeholder="Brief description for listing pages (max 200 characters)"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                />
                <FormInput
                  label="Full Description"
                  name="description"
                  type="textarea"
                  rows={6}
                  placeholder="Detailed description of the book, its content, and what readers can expect..."
                  value={formData.description}
                  onChange={handleInputChange}
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
              {/* Cover Image */}
              <FormSection title="Cover Image" icon={BookOpen}>
                <ImageUpload
                  label="Book Cover"
                  onImageSelect={handleImageSelect}
                  required
                />
                {errors.coverImage && (
                  <p className="text-red-500 text-xs mt-1">{errors.coverImage}</p>
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Book
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