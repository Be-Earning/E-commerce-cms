import React, { useState } from 'react'
import { cn } from '~/utils/classNames'

interface ImageGroupProps {
  images: string[]
}

const ImageGroup: React.FC<ImageGroupProps> = ({ images }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const displayImages = images.slice(0, 3)
  const remainingCount = images.length - 3

  return (
    <div className='flex items-center'>
      <div className='relative flex'>
        {displayImages.map((src, index) => (
          <div
            key={index}
            className={cn(
              'relative transition-transform duration-300 ease-in-out',
              hoveredIndex === index ? 'z-50 scale-110' : 'scale-100',
              index > 0 ? '-ml-10' : '',
              index === 0 ? 'z-20' : index === 1 ? 'z-10' : ''
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <img
              src={src}
              alt={`Image ${index + 1}`}
              className='shadow-lg rounded-lg object-cover object-center xs:size-[52px] sm:size-[56px] md:size-[60px] lg:size-[64px]'
            />
          </div>
        ))}
      </div>
      {remainingCount > 0 && (
        <div className='text-black-main0 ml-3 font-customMedium text-[20px]/[21px]'>+{remainingCount}</div>
      )}
    </div>
  )
}

export default ImageGroup
