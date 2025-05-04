import { memo } from 'react'

const TabBackground = memo(({ color = 'white', className }: { color?: 'white' | 'grey'; className?: string }) => {
  return (
    <svg
      width='218'
      height='56'
      viewBox='0 0 218 56'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <g filter='url(#filter0_d_3004_1534)'>
        <path
          d='M0 10C0 6.68629 2.68629 4 6 4H172.406C180.103 4 187.116 8.41662 190.442 15.3576L208 52H0V10Z'
          fill={color === 'white' ? 'white' : '#F4F4F5'}
        />
      </g>
      <defs>
        <filter
          id='filter0_d_3004_1534'
          x='0'
          y='0'
          width='218'
          height='56'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset dx='6' />
          <feGaussianBlur stdDeviation='2' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0' />
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_3004_1534' />
          <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_3004_1534' result='shape' />
        </filter>
      </defs>
    </svg>
  )
})

export default TabBackground
