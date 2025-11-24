import React, { useState, useEffect } from 'react'
import { FileText, Save, X, File, UploadCloud, Trash2, Pencil, Image as ImageIcon, AlertCircle, Plus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import FormInput from '../components/FormInput'
import ImageUpload from '../components/ImageUpload'
import { getFreeContent, createFreeContent, updateFreeContent, deleteFreeContent } from '../lib/api'
import toast from 'react-hot-toast'

// Mock Data for Fallback
const MOCK_CONTENTS = [
  {
    _id: 'mock-fc1',
    title: 'The Art of Storytelling',
    description: 'A comprehensive guide to crafting compelling narratives and mastering the art of storytelling.',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80&auto=format&fit=crop',
    isStatic: true
  },
  {
    _id: 'mock-fc2',
    title: 'Literary Classics Collection',
    description: 'An introduction to timeless classics that have shaped the world of literature.',
    coverImage: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&q=80&auto=format&fit=crop',
    isStatic: true
  }
]

const AddFreeContent = () => {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [pdfFile, setPdfFile] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [existingPdfUrl, setExistingPdfUrl] = useState(null)
  // Key to force reset file inputs
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await getFreeContent()
      if (response.data && response.data.length > 0) {
        setContents(response.data)
      } else {
        setContents(MOCK_CONTENTS)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      toast.error('Loaded demo data (API unavailable)')
      setContents(MOCK_CONTENTS)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setIsEditMode(false)
    setEditId(null)
    setFormData({ title: '', description: '' })
    setPdfFile(null)
    setCoverImage(null)
    setExistingPdfUrl(null)
    // Increment key to force re-render of inputs
    setResetKey(prev => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEdit = (item) => {
    if (item.isStatic) {
      toast.error("Cannot edit static demo content")
      return
    }
    setIsEditMode(true)
    setEditId(item._id)
    setFormData({
      title: item.title,
      description: item.description || ''
    })
    setCoverImage(item.coverImage || null)
    setExistingPdfUrl(item.pdfUrl || null)
    setPdfFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (item) => {
    if (item.isStatic) {
      toast.error("Cannot delete static demo content")
      return
    }
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteFreeContent(item._id)
        toast.success('Content deleted successfully')
        fetchContent()
        if (editId === item._id) handleReset()
      } catch (error) {
        console.error(error)
        toast.error('Failed to delete content')
      }
    }
  }

  const handlePdfChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a valid PDF file')
        return
      }
      setPdfFile(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!isEditMode && !pdfFile) {
      toast.error('PDF file is required for new content')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        pdf: pdfFile,
        coverImage
      }

      if (isEditMode) {
        await updateFreeContent(editId, payload)
        toast.success('Content updated successfully')
      } else {
        await createFreeContent(payload)
        toast.success('Content created successfully')
      }
      handleReset()
      fetchContent()
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error('Failed to save content')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageHeader 
        title={isEditMode ? 'Edit Free Content' : 'Add Free Content'} 
        subtitle="Upload PDF resources and manage downloads"
        icon={FileText}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* INPUT FORM SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              {isEditMode ? <Pencil className="w-5 h-5 text-blue-600" /> : <UploadCloud className="w-5 h-5 text-green-600" />}
              {isEditMode ? 'Update Content Details' : 'Upload New Content'}
            </h2>
            {isEditMode && (
              <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
                <X className="w-4 h-4" /> Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormInput
                  label="Title (Compulsory)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., The Art of Storytelling"
                  required
                />
                <FormInput
                  label="Description (Optional)"
                  type="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this resource..."
                  rows={4}
                />
              </div>

              <div className="space-y-6">
                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF Document {isEditMode ? '(Optional to replace)' : '(Compulsory)'}
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 transition-colors text-center relative ${pdfFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    {/* Key forces recreation of input on reset */}
                    <input 
                      key={resetKey}
                      type="file" 
                      accept=".pdf" 
                      onChange={handlePdfChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2">
                      {pdfFile ? (
                        <FileText className="w-10 h-10 text-green-500" />
                      ) : (
                        <UploadCloud className="w-10 h-10 text-gray-400" />
                      )}
                      
                      <div className="text-sm">
                        {pdfFile ? (
                          <span className="font-semibold text-green-700 break-all">{pdfFile.name}</span>
                        ) : (
                          <span className="text-gray-500">Click to select PDF file</span>
                        )}
                      </div>
                      
                      {isEditMode && existingPdfUrl && !pdfFile && (
                        <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                          Current file available. Upload new to replace.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                {/* Key forces recreation of ImageUpload on reset */}
                <ImageUpload
                  key={resetKey}
                  label="Cover Image (Optional)"
                  onImageSelect={setCoverImage}
                  existingImage={typeof coverImage === 'string' ? coverImage : null}
                />
                <p className="text-xs text-gray-400 -mt-4">
                  Tip: If no image is provided, a default PDF icon will be used.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isEditMode ? 'Update Content' : 'Save Content'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* EXISTING CONTENT LIST SECTION */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 px-1">Existing Content</h3>
          
          {loading ? (
            <div className="flex justify-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : contents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No free content uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((item) => (
                <div key={item._id} className={`bg-white rounded-xl shadow-sm border flex flex-col transition-all duration-200 ${isEditMode && editId === item._id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:shadow-md'}`}>
                  <div className="relative h-40 bg-gray-100 rounded-t-xl overflow-hidden">
                    {item.coverImage ? (
                      <img 
                        src={item.coverImage} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-300">
                        <File className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* STATIC BADGE */}
                    {item.isStatic && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> STATIC
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                      <button
                        onClick={() => handleEdit(item)}
                        className={`p-2 rounded-full transition-colors ${item.isStatic ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                        title={item.isStatic ? "Cannot edit static content" : "Edit"}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className={`p-2 rounded-full transition-colors ${item.isStatic ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-red-600 hover:bg-red-50'}`}
                        title={item.isStatic ? "Cannot delete static content" : "Delete"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-bold text-gray-900 line-clamp-1" title={item.title}>{item.title}</h4>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2 mb-3 flex-1">
                      {item.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 border-t pt-3 mt-auto">
                      <File className="w-3 h-3" />
                      <span>PDF Document</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default AddFreeContent