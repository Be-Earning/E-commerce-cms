import { memo } from 'react'

type SliderPaginationProps = {
  slideToGo: (index: number) => void
  activeIndex: number
  slideCount: number
  className?: string
  color?: 'black' | 'white'
  gap?: string
  size?: 4 | 6 | 8
}

const SliderPagination = memo(
  ({ slideToGo, activeIndex, slideCount, className, color = 'black', gap, size = 6 }: SliderPaginationProps) => {
    return (
      <div className={`flex items-center ${gap ? gap : 'gap-3'}`}>
        {Array.from({ length: slideCount }).map((_, index) => (
          <div
            key={index}
            onClick={() => slideToGo(index)}
            className={`${size === 4 ? 'size-1' : size === 8 ? 'size-2' : 'size-[6px]'} shrink-0 rounded-3xl ${
              activeIndex === index
                ? color === 'black'
                  ? 'bg-black-main/[.68]'
                  : 'bg-white/[.68]'
                : color === 'black'
                  ? 'bg-black-main/[.32]'
                  : 'bg-white/[.32]'
            } ${color === 'black' ? 'hover:bg-black-main/[.68]' : 'hover:bg-white/[.68]'} cursor-pointer transition-colors duration-100 ease-linear ${className}`}
          />
        ))}
      </div>
    )
  }
)

export default SliderPagination
