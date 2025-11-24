import React, { useState, useEffect } from 'react'
import { Gift, Save, X, ImageIcon, Trash2, Pencil, Upload, Plus, AlertCircle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import FormInput from '../components/FormInput'
import MultipleImageUpload from '../components/MultipleImageUpload'
import { getSpecials, createSpecial, updateSpecial, deleteSpecial } from '../lib/api'
import toast from 'react-hot-toast'

// Mock Data for Fallback
const MOCK_SPECIALS = [
  {
    _id: 'mock-s1',
    title: 'Vintage Book Fair 2024',
    description: 'Exclusive glimpses from our annual vintage book fair featuring rare first editions.',
    images: [
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80&auto=format&fit=crop'
    ],
    isStatic: true
  },
  {
    _id: 'mock-s2',
    title: 'Summer Reading Collection',
    description: 'A curated list of the best books to read this summer season.',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80&auto=format&fit=crop'
    ],
    isStatic: true
  }
]

const AddSpecial = () => {
  const [specials, setSpecials] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Form State
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [images, setImages] = useState([])
  // Key to force-reset the image uploader component
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    fetchSpecials()
  }, [])

  const fetchSpecials = async () => {
    try {
      setLoading(true)
      const response = await getSpecials()
      if (response.data && response.data.length > 0) {
        setSpecials(response.data)
      } else {
        setSpecials(MOCK_SPECIALS)
      }
    } catch (error) {
      console.error('Error fetching specials:', error)
      toast.error('Loaded demo data (API unavailable)')
      setSpecials(MOCK_SPECIALS)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setIsEditMode(false)
    setEditId(null)
    setFormData({ title: '', description: '' })
    setImages([])
    // Increment key to force re-render of the upload component
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
    setImages(item.images || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (item) => {
    if (item.isStatic) {
      toast.error("Cannot delete static demo content")
      return
    }
    if (window.confirm('Are you sure you want to delete this special?')) {
      try {
        await deleteSpecial(item._id)
        toast.success('Special deleted successfully')
        fetchSpecials()
        if (editId === item._id) handleReset()
      } catch (error) {
        console.error(error)
        toast.error('Failed to delete special')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    if (images.length > 30) {
      toast.error('Maximum 30 images allowed')
      return
    }

    const oversized = images.find(img => img instanceof File && img.size > 5 * 1024 * 1024)
    if (oversized) {
      toast.error(`Image "${oversized.name}" exceeds 5MB limit`)
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        images
      }

      if (isEditMode) {
        await updateSpecial(editId, payload)
        toast.success('Special updated successfully')
      } else {
        await createSpecial(payload)
        toast.success('Special created successfully')
      }
      
      // Clear form after successful submit
      handleReset()
      fetchSpecials()
    } catch (error) {
      console.error('Error saving special:', error)
      toast.error('Failed to save special')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageHeader 
        title={isEditMode ? 'Edit Special' : 'Add Specials'} 
        subtitle="Create exclusive collections and highlight events"
        icon={Gift}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* INPUT FORM SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              {isEditMode ? <Pencil className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-green-600" />}
              {isEditMode ? 'Update Details' : 'Create New Special'}
            </h2>
            {isEditMode && (
              <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
                <X className="w-4 h-4" /> Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Title (Compulsory)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Vintage Book Fair 2024"
                required
              />
              <FormInput
                label="Description (Optional)"
                type="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this collection..."
                rows={1} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Images (Max 30, 5MB each)
              </label>
              {/* Key forces re-render on reset */}
              <MultipleImageUpload
                key={resetKey} 
                onImagesSelect={setImages}
                existingImages={images}
                maxImages={30}
                label="Upload Collection Images"
              />
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
                    {isEditMode ? 'Update Special' : 'Save Special'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* EXISTING SPECIALS LIST SECTION */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 px-1">Existing Specials</h3>
          
          {loading ? (
            <div className="flex justify-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : specials.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No specials created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specials.map((item) => (
                <div key={item._id} className={`bg-white rounded-xl shadow-sm border transition-all duration-200 ${isEditMode && editId === item._id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:shadow-md'}`}>
                  <div className="relative h-48 bg-gray-100 rounded-t-xl overflow-hidden">
                    {item.images?.[0] ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-10 h-10" />
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
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                      {item.images?.length || 0} Images
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 truncate">{item.title}</h4>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2 min-h-[2.5em]">
                      {item.description || 'No description'}
                    </p>
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

export default AddSpecial