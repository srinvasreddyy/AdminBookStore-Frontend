import React from 'react'
import { MoveUp, MoveDown, Trash2, Youtube } from 'lucide-react'
import FormInput from './FormInput'

const YoutubeVideoItem = ({ 
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
        <h3 className="text-sm font-semibold text-gray-700">Video {index + 1}</h3>
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
        <FormInput
          label="YouTube URL"
          placeholder="https://www.youtube.com/watch?v=..."
          value={video.url}
          onChange={(e) => onUpdate(video.id, 'url', e.target.value)}
          required
          error={errors[`youtube_${video.id}_url`]}
          icon={Youtube}
        />
        
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

export default YoutubeVideoItem
