import React, { memo } from 'react'

const IncreaseIcon = memo(
  ({ color, className }: { color?: 'white' | 'green' | 'pink' | string; className?: string }) => {
    const gradientId1 = React.useId()
    const gradientId2 = React.useId()

    return (
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        className={className}
        xmlns='http://www.w3.org/2000/svg'
      >
        <g clipPath={`url(#${gradientId1})`}>
          <mask
            id={gradientId2}
            style={{ maskType: 'luminance' }}
            maskUnits='userSpaceOnUse'
            x='0'
            y='3'
            width='16'
            height='10'
          >
            <path
              d='M0 3.92784H16V13H0V3.92784Z'
              fill={color === 'white' ? 'white' : color === 'green' ? '#00CA39' : color === 'pink' ? '#FF2D55' : color}
            />
          </mask>
          <g mask={`url(#${gradientId2})`}>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M14.6011 4.41942L10.8879 4.88598L12.0483 6.05238L8.74119 9.37646L5.43415 6.05238L0.560547 10.9511L1.49511 11.8906L5.44047 7.92494L8.74111 11.2426L12.9765 6.98542L14.1369 8.15182L14.6011 4.41942Z'
              fill={color === 'white' ? 'white' : color === 'green' ? '#00CA39' : color === 'pink' ? '#FF2D55' : color}
            />
          </g>
        </g>
        <defs>
          <clipPath id={gradientId1}>
            <rect
              width='16'
              height='16'
              fill={color === 'white' ? 'white' : color === 'green' ? '#00CA39' : color === 'pink' ? '#FF2D55' : color}
              transform='matrix(1 0 0 -1 0 16)'
            />
          </clipPath>
        </defs>
      </svg>
    )
  }
)

export default IncreaseIcon
