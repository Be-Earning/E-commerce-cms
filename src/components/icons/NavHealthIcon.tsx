import React, { memo } from 'react'

const NavHealthIcon = memo(
  ({ color, className }: { color?: 'black' | 'white' | 'linear' | string; className?: string }) => {
    const gradientId1 = React.useId()
    const gradientId2 = React.useId()

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
          d='M11.9937 3.90003C7.19841 -0.294171 1.10122 3.39098 1.00124 8.38679C0.975761 9.65999 1.34329 10.9002 2.07486 12.0435H6.81671L7.66012 10.6378C7.90502 10.2297 8.49769 10.2165 8.75647 10.6234L10.536 13.4197L13.1299 7.94373C13.3561 7.46591 14.0303 7.45074 14.2798 7.91408L16.5034 12.0435H21.9126C25.9197 5.78089 18.0004 -1.35357 11.9937 3.90003Z'
          fill={`url(#${gradientId1})`}
        />
        <path
          d='M15.5508 12.9936L13.749 9.64735L11.2011 15.0262C10.9844 15.4838 10.3468 15.5236 10.075 15.0963L8.22874 12.1952L7.73408 13.0196C7.67682 13.115 7.59583 13.194 7.49898 13.2488C7.40214 13.3036 7.29275 13.3325 7.18146 13.3325H3.09424C3.22236 13.4666 2.53951 12.7851 11.539 21.738C11.7904 21.9881 12.1967 21.9881 12.4481 21.738C21.3091 12.9228 20.765 13.4663 20.8929 13.3325H16.1183C16.0019 13.3325 15.8877 13.301 15.7878 13.2413C15.6879 13.1816 15.606 13.096 15.5508 12.9936Z'
          fill={`url(#${gradientId2})`}
        />
        <defs>
          <linearGradient id={gradientId1} x1='23' y1='7.74704' x2='1' y2='7.74704' gradientUnits='userSpaceOnUse'>
            <stop
              stopColor={
                color === 'black' ? '#0D0D0D' : color === 'white' ? 'white' : color === 'linear' ? '#5495FC' : color
              }
            />
            <stop offset='1' stopColor={color === 'black' ? '#0D0D0D' : color === 'linear' ? '#31D366' : color} />
          </linearGradient>
          <linearGradient
            id={gradientId2}
            x1='20.8924'
            y1='15.7864'
            x2='3.09375'
            y2='15.7864'
            gradientUnits='userSpaceOnUse'
          >
            <stop
              stopColor={
                color === 'black' ? '#0D0D0D' : color === 'white' ? 'white' : color === 'linear' ? '#5495FC' : color
              }
            />
            <stop offset='1' stopColor={color === 'black' ? '#0D0D0D' : color === 'linear' ? '#31D366' : color} />
          </linearGradient>
        </defs>
      </svg>
    )
  }
)

export default NavHealthIcon
