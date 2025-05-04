import { memo } from 'react'

const ArrowLeftIcon = memo(({ color = '#0D0D0D', className }: { color?: string; className?: string }) => {
  return (
    <svg
      width='32'
      height='32'
      viewBox='0 0 32 32'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M25.3334 16H6.66671' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M12 21.3333L6.66667 16' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M12 10.6667L6.66667 16' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
})

export default ArrowLeftIcon
