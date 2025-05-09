import React, { memo } from 'react'

const ArrowTopRightIcon = memo(
  ({ color = 'linear', className }: { color?: 'black' | 'white' | 'linear' | 'grey'; className?: string }) => {
    const gradientId0 = React.useId()
    const gradientId1 = React.useId()

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
          d='M18.6667 4C18.2667 4 18 4.13334 17.7333 4.4L4.4 17.7333C3.86667 18.2667 3.86667 19.0667 4.4 19.6C4.93333 20.1333 5.73333 20.1333 6.26667 19.6L19.6 6.26667C20.1333 5.73334 20.1333 4.93333 19.6 4.4C19.3333 4.13334 19.0667 4 18.6667 4Z'
          fill={`url(#${gradientId0})`}
        />
        <path
          d='M18.6667 3.99984H6.66671C5.86671 3.99984 5.33337 4.53317 5.33337 5.33317C5.33337 6.13317 5.86671 6.66651 6.66671 6.66651H17.3334V17.3332C17.3334 18.1332 17.8667 18.6665 18.6667 18.6665C19.4667 18.6665 20 18.1332 20 17.3332V5.33317C20 4.53317 19.4667 3.99984 18.6667 3.99984Z'
          fill={`url(#${gradientId1})`}
        />
        <defs>
          <linearGradient id={gradientId0} x1='20' y1='12' x2='4' y2='12' gradientUnits='userSpaceOnUse'>
            <stop
              stopColor={
                color === 'linear'
                  ? '#5495FC'
                  : color === 'black'
                    ? '#0D0D0D'
                    : color === 'grey'
                      ? '#0D0D0D70'
                      : '#FFFFFF'
              }
            />
            <stop
              offset='1'
              stopColor={
                color === 'linear'
                  ? '#31D366'
                  : color === 'black'
                    ? '#0D0D0D'
                    : color === 'grey'
                      ? '#0D0D0D70'
                      : '#FFFFFF'
              }
            />
          </linearGradient>
          <linearGradient
            id={gradientId1}
            x1='20'
            y1='11.3332'
            x2='5.33337'
            y2='11.3332'
            gradientUnits='userSpaceOnUse'
          >
            <stop stopColor={color === 'linear' ? '#5495FC' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
            <stop offset='1' stopColor={color === 'linear' ? '#31D366' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
          </linearGradient>
        </defs>
      </svg>
    )
  }
)

export default ArrowTopRightIcon
