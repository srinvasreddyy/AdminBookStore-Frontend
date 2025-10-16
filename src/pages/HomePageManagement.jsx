import React, { useState, useEffect } from 'react'
import { Save, X } from 'lucide-react'
import CarouselImagesSection from '../components/CarouselImagesSection'
import YoutubeVideosSection from '../components/YoutubeVideosSection'
import ShortVideosSection from '../components/ShortVideosSection'
import { apiGet, apiPostForm, apiPost, apiDelete } from '../lib/api'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const HomePageManagement = () => {
  // Carousel Images State
  const [carouselImages, setCarouselImages] = useState([
    { id: 1, image: null, title: '', subtitle: '', link: '', order: 1 }
  ])

  // YouTube Videos State
  const [youtubeVideos, setYoutubeVideos] = useState([
    { id: 1, url: '', title: '', description: '', order: 1 }
  ])

  // Short Videos State
  const [shortVideos, setShortVideos] = useState([
    { id: 1, video: null, title: '', description: '', order: 1 }
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const { user } = useAuth()
  const [selectedSection, setSelectedSection] = useState(null) // 'carousel', 'youtube', 'shorts'

 
  // Removed useEffect that fetches existing homepage data

  const fetchHomepage = async () => {
    try {
      const response = await apiGet(`/homepage/${user._id}`)
      const data = response.data
      // populate state
      setCarouselImages(data.carouselImages.map((item, idx) => ({
        id: item._id || idx+1,
        image: item.imageUrl,
        title: item.title,
        subtitle: item.subtitle,
        link: item.bookLink || '',
        order: idx+1
      })))
      setYoutubeVideos(data.youtubeVideos.map((item, idx) => ({
        id: item._id || idx+1,
        url: item.videoUrl,
        title: item.title,
        description: item.description,
        order: idx+1
      })))
      setShortVideos(data.shortVideos.map((item, idx) => ({
        id: item._id || idx+1,
        video: item.videoUrl,
        title: item.title,
        description: item.description,
        order: idx+1
      })))
    } catch (error) {
      console.error('Failed to fetch homepage:', error)
    }
  }

  // Carousel Image Handlers
  const addCarouselImage = () => {
    const newId = Math.max(...carouselImages.map(img => img.id), 0) + 1
    setCarouselImages([...carouselImages, {
      id: newId,
      image: null,
      title: '',
      subtitle: '',
      link: '',
      order: carouselImages.length + 1
    }])
  }

  const removeCarouselImage = (id) => {
    const item = carouselImages.find(i => i.id === id)
    // If this looks like an existing DB id (string), call API to remove
    if (typeof item?.id === 'string' && item.id.length > 10) {
      apiDelete(`/homepage/carousel/${item.id}`)
        .then(() => {
          setCarouselImages(carouselImages.filter(img => img.id !== id))
          toast.success('Carousel image removed')
        })
        .catch(err => {
          console.error('Failed to remove carousel image:', err)
          toast.error('Failed to remove image')
        })
      return
    }
    setCarouselImages(carouselImages.filter(img => img.id !== id))
  }

  const updateCarouselImage = (id, field, value) => {
    setCarouselImages(carouselImages.map(img =>
      img.id === id ? { ...img, [field]: value } : img
    ))
  }

  const moveCarouselImage = (id, direction) => {
    const index = carouselImages.findIndex(img => img.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === carouselImages.length - 1)
    ) return

    const newImages = [...carouselImages]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]]
    
    // Update order
    newImages.forEach((img, idx) => {
      img.order = idx + 1
    })
    
    setCarouselImages(newImages)
  }

  // YouTube Video Handlers
  const addYoutubeVideo = () => {
    const newId = Math.max(...youtubeVideos.map(vid => vid.id), 0) + 1
    setYoutubeVideos([...youtubeVideos, {
      id: newId,
      url: '',
      title: '',
      description: '',
      order: youtubeVideos.length + 1
    }])
  }

  const removeYoutubeVideo = (id) => {
    const item = youtubeVideos.find(i => i.id === id)
    if (typeof item?.id === 'string' && item.id.length > 10) {
      apiDelete(`/homepage/youtube/${item.id}`)
        .then(() => {
          setYoutubeVideos(youtubeVideos.filter(vid => vid.id !== id))
          toast.success('YouTube video removed')
        })
        .catch(err => {
          console.error('Failed to remove youtube video:', err)
          toast.error('Failed to remove video')
        })
      return
    }
    setYoutubeVideos(youtubeVideos.filter(vid => vid.id !== id))
  }

  const updateYoutubeVideo = (id, field, value) => {
    setYoutubeVideos(youtubeVideos.map(vid =>
      vid.id === id ? { ...vid, [field]: value } : vid
    ))
  }

  const moveYoutubeVideo = (id, direction) => {
    const index = youtubeVideos.findIndex(vid => vid.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === youtubeVideos.length - 1)
    ) return

    const newVideos = [...youtubeVideos]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newVideos[index], newVideos[swapIndex]] = [newVideos[swapIndex], newVideos[index]]
    
    // Update order
    newVideos.forEach((vid, idx) => {
      vid.order = idx + 1
    })
    
    setYoutubeVideos(newVideos)
  }

  // Short Video Handlers
  const addShortVideo = () => {
    const newId = Math.max(...shortVideos.map(vid => vid.id), 0) + 1
    setShortVideos([...shortVideos, {
      id: newId,
      video: null,
      title: '',
      description: '',
      order: shortVideos.length + 1
    }])
  }

  const removeShortVideo = (id) => {
    const item = shortVideos.find(i => i.id === id)
    if (typeof item?.id === 'string' && item.id.length > 10) {
      apiDelete(`/homepage/shorts/${item.id}`)
        .then(() => {
          setShortVideos(shortVideos.filter(vid => vid.id !== id))
          toast.success('Short video removed')
        })
        .catch(err => {
          console.error('Failed to remove short video:', err)
          toast.error('Failed to remove short video')
        })
      return
    }
    setShortVideos(shortVideos.filter(vid => vid.id !== id))
  }

  const updateShortVideo = (id, field, value) => {
    setShortVideos(shortVideos.map(vid =>
      vid.id === id ? { ...vid, [field]: value } : vid
    ))
  }

  const moveShortVideo = (id, direction) => {
    const index = shortVideos.findIndex(vid => vid.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === shortVideos.length - 1)
    ) return

    const newVideos = [...shortVideos]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newVideos[index], newVideos[swapIndex]] = [newVideos[swapIndex], newVideos[index]]
    
    // Update order
    newVideos.forEach((vid, idx) => {
      vid.order = idx + 1
    })
    
    setShortVideos(newVideos)
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validate carousel images - no validation required
    carouselImages.forEach((img, index) => {
      // Optional validation can be added here if needed
    })

    // Validate YouTube videos - only if URL is provided
    youtubeVideos.forEach((vid, index) => {
      if (vid.url.trim()) {
        if (!vid.url.includes('youtube.com') && !vid.url.includes('youtu.be')) {
          newErrors[`youtube_${vid.id}_url`] = 'Invalid YouTube URL'
        }
      }
    })

    // Validate short videos - no validation required
    shortVideos.forEach((vid, index) => {
      // No additional validation needed for short videos
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      alert('Please fix all validation errors before submitting')
      return
    }

    setIsSubmitting(true)
    
    try {
      if (selectedSection === 'carousel') {
        // Submit carousel images
        for (const item of carouselImages) {
          if (item.image && item.image instanceof File) {
            const form = new FormData()
            form.append('title', item.title)
            form.append('subtitle', item.subtitle)
            form.append('bookLink', item.link || '')
            form.append('image', item.image)
            await apiPostForm('/homepage/carousel', form)
          }
        }
      } else if (selectedSection === 'youtube') {
        // Submit YouTube videos
        for (const item of youtubeVideos) {
          if (!item.id || String(item.id).length < 10) {
            await apiPost('/homepage/youtube', {
              title: item.title,
              description: item.description,
              videoUrl: item.url,
            })
          }
        }
      } else if (selectedSection === 'shorts') {
        // Submit short videos
        for (const item of shortVideos) {
          if (item.video && item.video instanceof File) {
            const form = new FormData()
            form.append('title', item.title)
            form.append('description', item.description)
            form.append('video', item.video)
            await apiPostForm('/homepage/shorts', form)
          }
        }
      }

      toast.success('Home page content updated successfully!')
      // Refresh to load newly saved items
      fetchHomepage()
    } catch (error) {
      console.error('Failed to update homepage:', error)
      toast.error(error.message || 'Failed to update homepage')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setCarouselImages([{ id: 1, image: null, title: '', subtitle: '', link: '', order: 1 }])
    setYoutubeVideos([{ id: 1, url: '', title: '', description: '', order: 1 }])
    setShortVideos([{ id: 1, video: null, title: '', description: '', order: 1 }])
    setErrors({})
  }

  const getImageSrc = (img) => {
    if (!img) return null
    if (typeof img === 'string') return img
    if (img instanceof File) return URL.createObjectURL(img)
    return null
  }

  if (!selectedSection) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white sticky top-0 z-50 max-lg:z-10 max-lg:top-11 border-b border-gray-200 px-8 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-800">Home Page Management</h1>
              <p className="text-gray-500 mt-0 text-sm">Choose what you want to manage</p>
            </div>
          </div>
        </div>

        <div className="p-8 max-lg:p-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Select Section to Manage</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setSelectedSection('carousel')}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-bold">Carousel Images</h3>
                  <p className="text-sm text-gray-600">Manage homepage carousel images</p>
                </button>
                <button
                  onClick={() => setSelectedSection('youtube')}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-bold">YouTube Videos</h3>
                  <p className="text-sm text-gray-600">Manage YouTube video links</p>
                </button>
                <button
                  onClick={() => setSelectedSection('shorts')}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-bold">Short Videos</h3>
                  <p className="text-sm text-gray-600">Manage short video uploads</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 max-lg:z-10 max-lg:top-11 border-b border-gray-200 px-8 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              Manage {selectedSection === 'carousel' ? 'Carousel Images' : selectedSection === 'youtube' ? 'YouTube Videos' : 'Short Videos'}
            </h1>
            <p className="text-gray-500 mt-0 text-sm">
              {selectedSection === 'carousel' ? 'Manage carousel images' : selectedSection === 'youtube' ? 'Manage YouTube videos' : 'Manage short videos'}
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
      <form onSubmit={handleSubmit} className="p-8 max-lg:p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Conditional Sections */}
          {selectedSection === 'carousel' && (
            <CarouselImagesSection
              carouselImages={carouselImages}
              onUpdate={updateCarouselImage}
              onRemove={removeCarouselImage}
              onMove={moveCarouselImage}
              onAdd={addCarouselImage}
              errors={errors}
            />
          )}

          {selectedSection === 'youtube' && (
            <YoutubeVideosSection
              youtubeVideos={youtubeVideos}
              onUpdate={updateYoutubeVideo}
              onRemove={removeYoutubeVideo}
              onMove={moveYoutubeVideo}
              onAdd={addYoutubeVideo}
              errors={errors}
            />
          )}

          {selectedSection === 'shorts' && (
            <ShortVideosSection
              shortVideos={shortVideos}
              onUpdate={updateShortVideo}
              onRemove={removeShortVideo}
              onMove={moveShortVideo}
              onAdd={addShortVideo}
              errors={errors}
            />
          )}

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-neutral-800 font-bold text-sm to-neutral-900 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelectedSection(null)}
                className="flex-1 font-bold px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Selection
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default HomePageManagement