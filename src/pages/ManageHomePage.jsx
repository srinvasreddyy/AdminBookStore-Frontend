import React, { useState, useEffect } from 'react'
import { Edit, Trash2, Plus, RefreshCw, Image, Video, Play } from 'lucide-react'
import { apiGet, apiDelete, apiPatch } from '../lib/api'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import StatsCard from '../components/StatsCard'

const ManageHomePage = () => {
  const [carouselImages, setCarouselImages] = useState([])
  const [youtubeVideos, setYoutubeVideos] = useState([])
  const [shortVideos, setShortVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editForm, setEditForm] = useState({})
  const { user } = useAuth()

  useEffect(() => {
    if (user?._id) fetchHomepage()
  }, [user])

  const fetchHomepage = async () => {
    try {
      setLoading(true)
      const response = await apiGet(`/homepage/${user._id}`)
      const data = response.data
      setCarouselImages(data.carouselImages || [])
      setYoutubeVideos(data.youtubeVideos || [])
      setShortVideos(data.shortVideos || [])
    } catch (error) {
      console.error('Failed to fetch homepage:', error)
      toast.error('Failed to load homepage content')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const removeCarouselImage = async (id) => {
    if (!window.confirm('Are you sure you want to remove this carousel image?')) return
    try {
      await apiDelete(`/homepage/carousel/${id}`)
      setCarouselImages(carouselImages.filter(img => img._id !== id))
      toast.success('Carousel image removed successfully')
    } catch {
      toast.error('Failed to remove carousel image')
    }
  }

  const removeYoutubeVideo = async (id) => {
    if (!window.confirm('Are you sure you want to remove this YouTube video?')) return
    try {
      await apiDelete(`/homepage/youtube/${id}`)
      setYoutubeVideos(youtubeVideos.filter(vid => vid._id !== id))
      toast.success('YouTube video removed successfully')
    } catch {
      toast.error('Failed to remove YouTube video')
    }
  }

  const removeShortVideo = async (id) => {
    if (!window.confirm('Are you sure you want to remove this short video?')) return
    try {
      await apiDelete(`/homepage/shorts/${id}`)
      setShortVideos(shortVideos.filter(vid => vid._id !== id))
      toast.success('Short video removed successfully')
    } catch {
      toast.error('Failed to remove short video')
    }
  }

  const startEdit = (type, item) => {
    setEditingItem({ type, id: item._id })
    setEditForm({ ...item })
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditForm({})
  }

  const saveEdit = async () => {
    if (!editingItem) return

    try {
      let endpoint = ''
      let updateData = {}

      if (editingItem.type === 'carousel') {
        endpoint = `/homepage/carousel/${editingItem.id}`
        updateData = {
          title: editForm.title,
          subtitle: editForm.subtitle,
          bookLink: editForm.bookLink
        }
        await apiPatch(endpoint, updateData)
        setCarouselImages(carouselImages.map(img => img._id === editingItem.id ? { ...img, ...updateData } : img))
      } else if (editingItem.type === 'youtube') {
        endpoint = `/homepage/youtube/${editingItem.id}`
        updateData = {
          title: editForm.title,
          description: editForm.description,
          videoUrl: editForm.videoUrl
        }
        await apiPatch(endpoint, updateData)
        setYoutubeVideos(youtubeVideos.map(vid => vid._id === editingItem.id ? { ...vid, ...updateData } : vid))
      } else if (editingItem.type === 'shorts') {
        endpoint = `/homepage/shorts/${editingItem.id}`
        updateData = {
          title: editForm.title,
          description: editForm.description
        }
        await apiPatch(endpoint, updateData)
        setShortVideos(shortVideos.map(vid => vid._id === editingItem.id ? { ...vid, ...updateData } : vid))
      }

      toast.success('Item updated successfully')
      cancelEdit()
    } catch {
      toast.error('Failed to update item')
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchHomepage()
  }

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border border-neutral-300-b-2  border-neutral-300-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 max-lg:z-10 max-lg:top-11 border border-neutral-200 px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-neutral-800">Manage Home Page Content</h1>
          <p className="text-neutral-500 text-sm">View and manage existing carousel images, YouTube videos, and short videos</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex text-xs items-center gap-2 font-bold text-white px-4 py-2 b border-neutral-300 border rounded-lg bg-black hover:bg-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6">
        {/* Stats Cards */}
        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-[320px]">
            <StatsCard
              title="Carousel Images"
              value={loading ? '...' : carouselImages.length}
              subtitle="Active images"
              icon={Image}
              color="blue"
            />
            <StatsCard
              title="YouTube Videos"
              value={loading ? '...' : youtubeVideos.length}
              subtitle="Embedded videos"
              icon={Video}
              color="red"
            />
            <StatsCard
              title="Short Videos"
              value={loading ? '...' : shortVideos.length}
              subtitle="Uploaded videos"
              icon={Play}
              color="green"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">

          {/* Carousel Images Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-800">Carousel Images ({carouselImages.length})</h2>
            </div>
            {carouselImages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No carousel images found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {carouselImages.map(item => (
                  <div key={item._id} className="border border-neutral-300 rounded-lg overflow-hidden group">
                    <div className="relative">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black/10 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center gap-2">
                        <button
                          onClick={() => startEdit('carousel', item)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeCarouselImage(item._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      {editingItem?.type === 'carousel' && editingItem.id === item._id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editForm.title || ''}
                            onChange={e => handleEditFormChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 border border-neutral-300-gray-300 rounded-md text-sm"
                            placeholder="Title"
                          />
                          <input
                            type="text"
                            value={editForm.subtitle || ''}
                            onChange={e => handleEditFormChange('subtitle', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 border border-neutral-300-gray-300 rounded-md text-sm"
                            placeholder="Subtitle"
                          />
                          <input
                            type="text"
                            value={editForm.bookLink || ''}
                            onChange={e => handleEditFormChange('bookLink', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 border border-neutral-300-gray-300 rounded-md text-sm"
                            placeholder="Book Link"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-neutral-800 mb-1">{item.title}</h3>
                          {item.subtitle && <p className="text-sm text-neutral-600 mb-2">{item.subtitle}</p>}
                          {item.bookLink && <p className="text-xs text-blue-600 truncate">Link: {item.bookLink}</p>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* YouTube Videos Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-800">YouTube Videos ({youtubeVideos.length})</h2>
            </div>
            {youtubeVideos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500">No YouTube videos found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {youtubeVideos.map(item => (
                  <div key={item._id} className="border border-neutral-300 rounded-lg overflow-hidden group">
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <iframe
                          src={`https://www.youtube.com/embed/${item.videoUrl.split('v=')[1]?.split('&')[0]}`}
                          title={item.title}
                          className="w-full h-full"
                          frameborder border-neutral-300="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/20 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center gap-2">
                        <button
                          onClick={() => startEdit('youtube', item)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeYoutubeVideo(item._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      {editingItem?.type === 'youtube' && editingItem.id === item._id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editForm.title || ''}
                            onChange={e => handleEditFormChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 border border-neutral-300-gray-300 rounded-md text-sm"
                            placeholder="Title"
                          />
                          <textarea
                            value={editForm.description || ''}
                            onChange={e => handleEditFormChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 border border-neutral-300-gray-300 rounded-md text-sm"
                            placeholder="Description"
                            rows="3"
                          />
                          <input
                            type="text"
                            value={editForm.videoUrl || ''}
                            onChange={e => handleEditFormChange('videoUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 border border-neutral-300-gray-300 rounded-md text-sm"
                            placeholder="YouTube URL"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-neutral-500 text-white text-sm rounded hover:bg-neutral-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-neutral-800 mb-1">{item.title}</h3>
                          {item.description && <p className="text-sm text-neutral-600">{item.description}</p>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Short Videos Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-800">Short Videos ({shortVideos.length})</h2>
            </div>
            {shortVideos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500">No short videos found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {shortVideos.map(item => (
                  <div key={item._id} className="border border-neutral-300 rounded-lg overflow-hidden group">
                    <div className="relative">
                      <video src={item.videoUrl} className="w-full h-48 object-cover" controls />
                      <div className="absolute inset-0 bg-black/20 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center gap-2">
                        <button
                          onClick={() => startEdit('shorts', item)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeShortVideo(item._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      {editingItem?.type === 'shorts' && editingItem.id === item._id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editForm.title || ''}
                            onChange={e => handleEditFormChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 border border-neutral-300-gray-300 rounded-md text-sm"
                            placeholder="Title"
                          />
                          <textarea
                            value={editForm.description || ''}
                            onChange={e => handleEditFormChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 border border-neutral-300-gray-300 rounded-md text-sm"
                            placeholder="Description"
                            rows="3"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-neutral-500 text-white text-sm rounded hover:bg-neutral-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-neutral-800 mb-1">{item.title}</h3>
                          {item.description && <p className="text-sm text-neutral-600">{item.description}</p>}
                          <p className="text-xs text-neutral-500 mt-1">Duration: {Math.round(item.duration)}s</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ManageHomePage
