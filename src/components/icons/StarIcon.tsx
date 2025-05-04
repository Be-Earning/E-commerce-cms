import { memo } from 'react'

const StarIcon = memo(({ color = '#FFCC00', className }: { color?: string; className?: string }) => {
  return (
    <svg
      width='13'
      height='13'
      viewBox='0 0 13 13'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M6.5 0L4.49083 4.15747L0 4.82032L3.25 8.05792L2.48166 12.6257L6.5 10.4703L10.5183 12.6257L9.75 8.05792L13 4.82483L8.50917 4.15747L6.5 0Z'
        fill={color}
      />
    </svg>
  )
})

export default StarIcon
