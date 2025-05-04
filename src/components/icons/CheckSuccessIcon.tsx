import { memo } from 'react'

const CheckSuccessIcon = memo(({ color = '#31D366', className }: { color?: string; className?: string }) => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='7.99935' cy='8.00001' r='7.33333' fill={color} />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.777 4.94444L6.9192 8.79658L5.21284 7.08452L4.33398 7.97479L6.9192 10.5657L11.6673 5.8233L10.777 4.94444Z'
        fill='white'
      />
    </svg>
  )
})

export default CheckSuccessIcon
