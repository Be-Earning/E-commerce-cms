import { useRef, useCallback } from 'react'

interface UseHorizontalScroll {
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  scrollRef: React.RefObject<HTMLDivElement>
}

export const useHorizontalScroll = (): UseHorizontalScroll => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (scrollRef.current) {
      const startX = e.pageX
      const startScrollLeft = scrollRef.current.scrollLeft

      const onMouseMove = (e: MouseEvent) => {
        if (scrollRef.current) {
          const x = e.pageX - startX
          scrollRef.current.scrollLeft = startScrollLeft - x
        }
      }

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    }
  }, [])

  return {
    handleMouseDown,
    scrollRef
  }
}
