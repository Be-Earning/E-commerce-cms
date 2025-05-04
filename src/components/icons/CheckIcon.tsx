import { memo } from 'react'

const CheckIcon = memo(({ className }: { className?: string }) => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M2.66699 8.34033L6.31973 12L13.3337 4.99304L12.3267 4L6.31973 9.99999L3.66001 7.3403L2.66699 8.34033Z'
        fill='#69CB3A'
      />
    </svg>
  )
})

export default CheckIcon
