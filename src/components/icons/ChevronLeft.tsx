import { memo } from 'react'

const ChevronLeft = memo(({ color = 'black', className }: { color?: string; className?: string }) => {
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
        d='M10.2524 11.9991L14.7502 16.5347C15.0831 16.8709 15.0831 17.413 14.7502 17.7491C14.5916 17.9097 14.3752 18 14.1496 18C13.9239 18 13.7075 17.9097 13.5489 17.7491L8.45042 12.6072C8.11646 12.2714 8.11646 11.7286 8.45042 11.3928L13.5487 6.25089C13.7075 6.09032 13.9239 6 14.1496 6C14.3752 6 14.5916 6.09032 14.7504 6.25089C15.0831 6.58707 15.0831 7.1292 14.75 7.46527L10.2524 11.9991Z'
        fill={color}
      />
    </svg>
  )
})

export default ChevronLeft
