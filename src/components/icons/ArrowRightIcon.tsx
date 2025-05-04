import { memo } from 'react'

const ArrowRightIcon = memo(({ color = '#0D0D0D', className }: { color?: string; className?: string }) => {
  return (
    <svg
      width='32'
      height='32'
      viewBox='0 0 32 32'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M6.66663 16H25.3333' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M20 21.3333L25.3333 16' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M20 10.6667L25.3333 16' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
})

export default ArrowRightIcon
