import React, { memo } from 'react'

const NavAgentIcon = memo(
  ({ color, className }: { color?: 'black' | 'white' | 'linear' | string; className?: string }) => {
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
          d='M21.2539 6.09342L15.0664 2.52051C14.056 1.93717 12.806 1.93717 11.7852 2.52051L5.60807 6.09342C4.59766 6.67676 3.97266 7.76009 3.97266 8.93717V16.0622C3.97266 17.2288 4.59766 18.3122 5.60807 18.9059L11.7956 22.4788C12.806 23.0622 14.056 23.0622 15.0768 22.4788L21.2643 18.9059C22.2747 18.3226 22.8997 17.2393 22.8997 16.0622V8.93717C22.8893 7.76009 22.2643 6.68717 21.2539 6.09342ZM13.431 7.64551C14.7747 7.64551 15.8581 8.72884 15.8581 10.0726C15.8581 11.4163 14.7747 12.4997 13.431 12.4997C12.0872 12.4997 11.0039 11.4163 11.0039 10.0726C11.0039 8.73926 12.0872 7.64551 13.431 7.64551ZM16.2227 17.3538H10.6393C9.79557 17.3538 9.30599 16.4163 9.77474 15.7184C10.4831 14.6663 11.8581 13.958 13.431 13.958C15.0039 13.958 16.3789 14.6663 17.0872 15.7184C17.556 16.4059 17.056 17.3538 16.2227 17.3538Z'
          fill={`url(#${gradientId2})`}
        />

        <defs>
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

export default NavAgentIcon
