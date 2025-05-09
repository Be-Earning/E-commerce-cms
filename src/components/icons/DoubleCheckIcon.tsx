import { memo } from 'react'

const DoubleCheckIcon = memo(({ color = 'white', className }: { color?: string; className?: string }) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M9.77208 10.9849L10.8327 12.0455L17.2721 5.60607L18.3327 6.66667L10.8327 14.1667L5.9842 9.31819L7.0448 8.25758L8.63571 9.84849L9.77208 10.9849ZM9.77208 8.78789L13.56 5.00001L14.5448 6.13637L10.7569 9.92425L9.77208 8.78789ZM7.57511 13.1061L6.5145 14.1667L1.66602 9.31819L2.72662 8.25758L3.78723 9.31819C3.86299 9.31819 7.57511 13.1061 7.57511 13.1061Z'
        fill={color}
      />
    </svg>
  )
})

export default DoubleCheckIcon
