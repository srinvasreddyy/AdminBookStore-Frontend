import React from 'react'
import { MoveUp, MoveDown, Trash2 } from 'lucide-react'
import FormInput from './FormInput'

const ShortVideoItem = ({ 
  video, 
  index, 
  totalItems,
  onUpdate, 
  onRemove, 
  onMove,
  errors 
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Short Video {index + 1}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onMove(video.id, 'up')}
            disabled={index === 0}
            className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <MoveUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(video.id, 'down')}
            disabled={index === totalItems - 1}
            className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <MoveDown className="w-4 h-4" />
          </button>
          {totalItems > 1 && (
            <button
              type="button"
              onClick={() => onRemove(video.id)}
              className="p-1 text-red-600 hover:text-red-800"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Video File
          </label>
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => onUpdate(video.id, 'video', e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-900 cursor-pointer"
            />
          </div>
          {errors[`short_${video.id}_video`] && (
            <p className="text-red-500 text-xs mt-1">{errors[`short_${video.id}_video`]}</p>
          )}
          {video.video && (
            <p className="text-xs text-gray-600 mt-1">
              Selected: {video.video.name}
            </p>
          )}
        </div>
        
        <FormInput
          label="Video Title"
          placeholder="Enter video title"
          value={video.title}
          onChange={(e) => onUpdate(video.id, 'title', e.target.value)}
        />
        
        <FormInput
          label="Description"
          type="textarea"
          rows={2}
          placeholder="Brief description of the video"
          value={video.description}
          onChange={(e) => onUpdate(video.id, 'description', e.target.value)}
        />
      </div>
    </div>
  )
}

export default ShortVideoItem
