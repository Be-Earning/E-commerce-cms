import React, { memo } from 'react'

const NavHomeIcon = memo(
  ({ color, className }: { color?: 'black' | 'white' | 'linear' | string; className?: string }) => {
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
          d='M21.8694 10.8081C21.7709 11.0852 21.5892 11.325 21.3491 11.4948C21.1091 11.6647 20.8224 11.7562 20.5284 11.7568H19.8151V19.573C19.8039 19.9615 19.6393 20.3297 19.3572 20.5971C19.0751 20.8644 18.6986 21.0091 18.3101 20.9995H15.136C14.7475 21.0091 14.371 20.8644 14.0889 20.5971C13.8068 20.3297 13.6422 19.9615 13.631 19.573V16.0066H10.2928V19.573C10.2816 19.9615 10.1169 20.3297 9.83488 20.5971C9.55281 20.8644 9.1763 21.0091 8.78778 20.9995H5.62793C5.23941 21.0091 4.8629 20.8644 4.58083 20.5971C4.29876 20.3297 4.13411 19.9615 4.12291 19.573V11.7568H3.40963C3.11661 11.7533 2.83177 11.6597 2.59384 11.4886C2.35591 11.3176 2.17643 11.0774 2.07979 10.8008C1.98316 10.5241 1.97407 10.2244 2.05375 9.94243C2.13344 9.66044 2.29803 9.40982 2.52515 9.22466L11.0845 2.31295C11.3376 2.11037 11.652 2 11.9761 2C12.3003 2 12.6147 2.11037 12.8678 2.31295L21.4271 9.22466C21.6552 9.41073 21.8201 9.66279 21.8993 9.94629C21.9785 10.2298 21.968 10.5308 21.8694 10.8081Z'
          fill={`url(#${gradientId1})`}
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
        </defs>
      </svg>
    )
  }
)

export default NavHomeIcon
