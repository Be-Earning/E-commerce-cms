import { memo } from 'react'

const CircleIcon = memo(
  ({ color = '#0D0D0D', opacity = '0.44', className }: { color?: string; opacity?: string; className?: string }) => {
    return (
      <svg width='6' height='6' viewBox='0 0 6 6' fill='none' className={className} xmlns='http://www.w3.org/2000/svg'>
        <circle opacity={opacity} cx='3' cy='3' r='3' fill={color} />
      </svg>
    )
  }
)

export default CircleIcon
