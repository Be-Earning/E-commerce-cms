import { memo } from 'react'

const ChevronRight = memo(({ color = 'black', className }: { color?: string; className?: string }) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13.7476 11.9991L9.24978 16.5347C8.91688 16.8709 8.91688 17.413 9.24978 17.7491C9.40841 17.9097 9.62478 18 9.85045 18C10.0761 18 10.2925 17.9097 10.4511 17.7491L15.5496 12.6072C15.8835 12.2714 15.8835 11.7286 15.5496 11.3928L10.4513 6.25089C10.2925 6.09032 10.0761 6 9.85045 6C9.62478 6 9.40841 6.09032 9.24957 6.25089C8.91688 6.58707 8.91688 7.1292 9.25 7.46527L13.7476 11.9991Z'
        fill={color}
      />
    </svg>
  )
})

export default ChevronRight
