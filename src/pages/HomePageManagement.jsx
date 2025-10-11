import React, { useState } from 'react'
import { Save, X, Eye } from 'lucide-react'
import CarouselImagesSection from '../components/CarouselImagesSection'
import YoutubeVideosSection from '../components/YoutubeVideosSection'
import ShortVideosSection from '../components/ShortVideosSection'

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
    
    // Validate carousel images
    carouselImages.forEach((img, index) => {
      if (!img.image) {
        newErrors[`carousel_${img.id}_image`] = 'Image is required'
      }
      if (!img.title.trim()) {
        newErrors[`carousel_${img.id}_title`] = 'Title is required'
      }
    })

    // Validate YouTube videos
    youtubeVideos.forEach((vid, index) => {
      if (!vid.url.trim()) {
        newErrors[`youtube_${vid.id}_url`] = 'YouTube URL is required'
      } else if (!vid.url.includes('youtube.com') && !vid.url.includes('youtu.be')) {
        newErrors[`youtube_${vid.id}_url`] = 'Invalid YouTube URL'
      }
    })

    // Validate short videos
    shortVideos.forEach((vid, index) => {
      if (!vid.video) {
        newErrors[`short_${vid.id}_video`] = 'Video file is required'
      }
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
    
    // Simulate API call
    setTimeout(() => {
      console.log('Carousel Images:', carouselImages)
      console.log('YouTube Videos:', youtubeVideos)
      console.log('Short Videos:', shortVideos)
      alert('Home page content updated successfully!')
      setIsSubmitting(false)
    }, 1500)
  }

  const handleReset = () => {
    setCarouselImages([{ id: 1, image: null, title: '', subtitle: '', link: '', order: 1 }])
    setYoutubeVideos([{ id: 1, url: '', title: '', description: '', order: 1 }])
    setShortVideos([{ id: 1, video: null, title: '', description: '', order: 1 }])
    setErrors({})
  }

  const handlePreview = () => {
    console.log('Preview homepage content')
    // Implement preview functionality
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 max-lg:z-10 max-lg:top-11 border-b border-gray-200 px-8 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Home Page Management</h1>
            <p className="text-gray-500 mt-0 text-sm">Manage carousel images, YouTube videos, and short videos</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="flex text-xs items-center gap-2 font-bold text-gray-700 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
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
          
          {/* Carousel Images Section */}
          <CarouselImagesSection
            carouselImages={carouselImages}
            onUpdate={updateCarouselImage}
            onRemove={removeCarouselImage}
            onMove={moveCarouselImage}
            onAdd={addCarouselImage}
            errors={errors}
          />

          {/* YouTube Videos Section */}
          <YoutubeVideosSection
            youtubeVideos={youtubeVideos}
            onUpdate={updateYoutubeVideo}
            onRemove={removeYoutubeVideo}
            onMove={moveYoutubeVideo}
            onAdd={addYoutubeVideo}
            errors={errors}
          />

          {/* Short Videos Section */}
          <ShortVideosSection
            shortVideos={shortVideos}
            onUpdate={updateShortVideo}
            onRemove={removeShortVideo}
            onMove={moveShortVideo}
            onAdd={addShortVideo}
            errors={errors}
          />

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
                onClick={handleReset}
                className="flex-1 font-bold px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default HomePageManagement