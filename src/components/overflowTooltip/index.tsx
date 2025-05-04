import { Tooltip } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
const OverflowTooltip = ({ content, isOverFlowMultipleLines = false, triggerClassName = '', children, width }) => {

  const [isOverflow, setIsOverflow] = useState(false)
  const ref = useRef<HTMLElement>(null)
  let timeoutId: NodeJS.Timeout | null = null

  const handleMouseOver = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    } else {
      let isTextOverFlow = false
      const node = ref.current as HTMLElement | null;
      if (!node) return
      if (isOverFlowMultipleLines) {
        isTextOverFlow = node.scrollHeight > node.offsetHeight || node.scrollHeight > node.clientHeight
      } else {
        isTextOverFlow = node.scrollWidth > node.offsetWidth || node.scrollWidth > node.clientWidth
      }
      setIsOverflow(isTextOverFlow)
    }
  }

  const handleMouseOut = () => {
    timeoutId = setTimeout(() => {
      setIsOverflow(false)
    }, 100)
  }

  const handleDropdownItemClick = () => {
    setTimeout(() => {
      setIsOverflow(false)
    }, 100)
  }

  useEffect(() => {
    const node = ref.current
    if (node) {
      node.addEventListener('mouseenter', handleMouseOver)
      node.addEventListener('mouseleave', handleMouseOut)
      node.addEventListener('touchstart', handleMouseOver)
      node.addEventListener('touchend', handleMouseOut)
      node.addEventListener('click', handleDropdownItemClick) // Thêm sự kiện click cho dropdown item

      return () => {
        node.removeEventListener('mouseenter', handleMouseOver)
        node.removeEventListener('mouseleave', handleMouseOut)
        node.removeEventListener('touchstart', handleMouseOver)
        node.removeEventListener('touchend', handleMouseOut)
        node.removeEventListener('click', handleDropdownItemClick) // Loại bỏ sự kiện click khi component unmounts
      }
    }
  }, [ref.current])

  return (
    <Tooltip
      title={content}
      arrow
      placement='top'
      open={isOverflow} // Đảm bảo tooltip không mở khi dropdown được chọn
      ref={ref}
      followCursor
      className={`overflow-item overflow-hidden text-ellipsis whitespace-nowrap ${triggerClassName} ${!isOverflow ? 'disabled-popup' : ''}`}
      style={{ width: width }}
    >
      {children}
    </Tooltip>
  )
}

export default OverflowTooltip
