import React from 'react'
import { Image, Plus } from 'lucide-react'
import FormSection from './FormSection'
import CarouselImageItem from './CarouselImageItem'

const CarouselImagesSection = ({ 
  carouselImages, 
  onUpdate, 
  onRemove, 
  onMove, 
  onAdd,
  errors 
}) => {
  return (
    <FormSection title="Carousel Images" icon={Image}>
      <div className="space-y-4">
        {carouselImages.map((carousel, index) => (
          <CarouselImageItem
            key={carousel.id}
            carousel={carousel}
            index={index}
            totalItems={carouselImages.length}
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
          Add Another Carousel Image
        </button>
      </div>
    </FormSection>
  )
}

export default CarouselImagesSection
