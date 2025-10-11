import React from 'react'
import { Video, Plus } from 'lucide-react'
import FormSection from './FormSection'
import ShortVideoItem from './ShortVideoItem'

const ShortVideosSection = ({ 
  shortVideos, 
  onUpdate, 
  onRemove, 
  onMove, 
  onAdd,
  errors 
}) => {
  return (
    <FormSection title="Short Videos" icon={Video}>
      <div className="space-y-4">
        {shortVideos.map((video, index) => (
          <ShortVideoItem
            key={video.id}
            video={video}
            index={index}
            totalItems={shortVideos.length}
            onUpdate={onUpdate}
            onRemove={onRemove}
            onMove={onMove}
            errors={errors}
          />
        ))}
        
        <button
          type="button"
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Another Short Video
        </button>
      </div>
    </FormSection>
  )
}

export default ShortVideosSection
