import React, { useState, useEffect } from 'react'
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react'

const MultipleImageUpload = ({ label, onImagesSelect, required = false, maxImages = 5, existingImages = [] }) => {
  const [previews, setPreviews] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  // Initialize with existing images
  useEffect(() => {
    if (existingImages.length > 0) {
      const existingPreviews = existingImages.map((url, index) => ({
        id: `existing-${index}`,
        url: url,
        isExisting: true
      }))
      setPreviews(existingPreviews)
    }
  }, [existingImages])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    processFiles(files)
  }

  const processFiles = (files) => {
    const validFiles = files.filter(file => file && file.type.startsWith('image/'))

    const totalImages = previews.length + validFiles.length
    if (totalImages > maxImages) {
      alert(`You can only upload up to ${maxImages} images`)
      return
    }

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPreview = {
          id: Date.now() + Math.random(),
          file: file,
          preview: reader.result,
          isExisting: false
        }
        setPreviews(prev => {
          const updated = [...prev, newPreview]
          // Only pass new files to the callback, not existing images
          const newFiles = updated.filter(p => !p.isExisting).map(p => p.file)
          onImagesSelect(newFiles)
          return updated
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeImage = (id) => {
    setPreviews(prev => {
      const updated = prev.filter(p => p.id !== id)
      // Only pass new files to the callback, not existing images
      const newFiles = updated.filter(p => !p.isExisting).map(p => p.file)
      onImagesSelect(newFiles)
      return updated
    })
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
        <span className="text-xs text-gray-500 ml-2">({previews.length}/{maxImages})</span>
      </label>

      {/* Image Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {previews.map((preview, index) => (
            <div key={preview.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                <img
                  src={preview.isExisting ? preview.url : preview.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(preview.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 transform scale-75 group-hover:scale-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Cover
                  </div>
                )}
                {preview.isExisting && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Existing
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {previews.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="multiple-image-upload"
            required={required && previews.length === 0}
          />
          <label htmlFor="multiple-image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium mb-1">
                Add Images
              </p>
              <p className="text-gray-400 text-sm">
                Click to select or drag and drop
              </p>
              <p className="text-gray-400 text-xs mt-1">
                PNG, JPG, WEBP up to 10MB each
              </p>
            </div>
          </label>
        </div>
      )}

      {previews.length === 0 && required && (
        <p className="text-red-500 text-xs mt-1">At least one image is required</p>
      )}
    </div>
  )
}

export default MultipleImageUpload