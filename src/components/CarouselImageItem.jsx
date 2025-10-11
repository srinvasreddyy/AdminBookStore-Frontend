import React from 'react'
import { MoveUp, MoveDown, Trash2, Link } from 'lucide-react'
import FormInput from './FormInput'
import ImageUpload from './ImageUpload'

const CarouselImageItem = ({ 
  carousel, 
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
        <h3 className="text-sm font-semibold text-gray-700">Slide {index + 1}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onMove(carousel.id, 'up')}
            disabled={index === 0}
            className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <MoveUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(carousel.id, 'down')}
            disabled={index === totalItems - 1}
            className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <MoveDown className="w-4 h-4" />
          </button>
          {totalItems > 1 && (
            <button
              type="button"
              onClick={() => onRemove(carousel.id)}
              className="p-1 text-red-600 hover:text-red-800"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <ImageUpload
            label={`Carousel Image ${index + 1}`}
            onImageSelect={(file) => onUpdate(carousel.id, 'image', file)}
            required
          />
          {errors[`carousel_${carousel.id}_image`] && (
            <p className="text-red-500 text-xs mt-1">{errors[`carousel_${carousel.id}_image`]}</p>
          )}
        </div>
        
        <FormInput
          label="Title"
          placeholder="Enter slide title"
          value={carousel.title}
          onChange={(e) => onUpdate(carousel.id, 'title', e.target.value)}
          required
          error={errors[`carousel_${carousel.id}_title`]}
        />
        
        <FormInput
          label="Subtitle"
          placeholder="Enter slide subtitle"
          value={carousel.subtitle}
          onChange={(e) => onUpdate(carousel.id, 'subtitle', e.target.value)}
        />
        
        <div className="md:col-span-2">
          <FormInput
            label="Link (Optional)"
            placeholder="https://example.com/product"
            value={carousel.link}
            onChange={(e) => onUpdate(carousel.id, 'link', e.target.value)}
            icon={Link}
          />
        </div>
      </div>
    </div>
  )
}

export default CarouselImageItem
