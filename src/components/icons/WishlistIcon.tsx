import React, { memo } from 'react'

const WishlistIcon = memo(
  ({ color = 'linear', className }: { color?: 'black' | 'white' | 'linear'; className?: string }) => {
    const gradientId0 = React.useId()
    const gradientId1 = React.useId()
    const gradientId2 = React.useId()
    const gradientId3 = React.useId()
    const gradientId4 = React.useId()
    const gradientId5 = React.useId()
    const gradientId6 = React.useId()
    const gradientId7 = React.useId()

    return (
      <svg
        width='36'
        height='36'
        viewBox='0 0 36 36'
        fill='none'
        className={className}
        xmlns='http://www.w3.org/2000/svg'
      >
        <g clipPath='url(#clip0_942_3890)'>
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M26.0078 19.741C27.086 18.5255 28.6127 17.8778 30.308 17.9818C32.922 18.143 35.1873 20.0247 35.8169 22.5578C36.1542 23.9149 36.1908 26.1003 34.4497 28.8054C32.9482 31.1382 30.3972 33.4317 26.8656 35.6251C26.4642 36.0431 25.8012 36.1219 25.3132 35.8091C24.4643 35.2649 23.6729 34.7139 22.9384 34.1574H2.30777C1.03523 34.1574 0 33.1221 0 31.8495V2.30792C0 1.03531 1.03523 0 2.30777 0H24.5812C25.8536 0 26.8888 1.03531 26.8888 2.30792V12.4373C26.8888 13.1172 26.3378 13.6682 25.6581 13.6682C24.9783 13.6682 24.4273 13.1172 24.4273 12.4373V2.46177H2.46162V31.6957H20.1018C18.9251 30.5059 17.8674 29.1679 17.1338 27.6568H10.8085C10.1288 27.6568 9.57769 27.1057 9.57769 26.4258C9.57769 25.746 10.1287 25.1949 10.8085 25.1949H16.3172C16.1019 23.9611 16.1877 22.6723 16.6615 21.5065H10.8085C10.1288 21.5065 9.57769 20.9554 9.57769 20.2755C9.57769 19.5957 10.1287 19.0446 10.8085 19.0446H18.5297C20.2991 17.6845 22.7807 17.4742 24.7038 18.6432C25.1818 18.9337 25.6195 19.3032 26.0078 19.741ZM24.9111 22.5544C24.2755 21.1286 23.2078 20.3318 21.9536 20.3318C20.4295 20.3318 19.0772 21.7715 18.78 22.9318C18.0157 25.9156 20.7205 29.7614 25.9578 33.2875C31.3702 29.8305 34.1535 26.0708 33.428 23.1517C32.9925 21.3997 31.4268 20.5174 30.1565 20.439C28.8018 20.3562 27.718 21.1048 27.1841 22.4945C26.7994 23.4964 25.3478 23.5337 24.9111 22.5544Z'
            fill={`url(#${gradientId0})`}
          />
          <path
            d='M6.68611 9.12884C7.36491 9.12884 7.91519 8.57774 7.91519 7.89792C7.91519 7.2181 7.36491 6.66699 6.68611 6.66699C6.00731 6.66699 5.45703 7.2181 5.45703 7.89792C5.45703 8.57774 6.00731 9.12884 6.68611 9.12884Z'
            fill={`url(#${gradientId1})`}
          />
          <path
            d='M25.6584 17.6674C24.9787 17.6674 24.4277 17.1163 24.4277 16.4365V16.0017C24.4277 15.3218 24.9787 14.7708 25.6584 14.7708C26.3382 14.7708 26.8892 15.3218 26.8892 16.0017V16.4365C26.8893 17.1163 26.3382 17.6674 25.6584 17.6674Z'
            fill={`url(#${gradientId2})`}
          />
          <path
            d='M20.15 9.12884H10.8089C10.1291 9.12884 9.57812 8.57776 9.57812 7.89792C9.57812 7.21807 10.1292 6.66699 10.8089 6.66699H20.15C20.8298 6.66699 21.3808 7.21807 21.3808 7.89792C21.3808 8.57776 20.8298 9.12884 20.15 9.12884Z'
            fill={`url(#${gradientId3})`}
          />
          <path
            d='M10.8089 15.2792H20.15C20.8298 15.2792 21.3808 14.7282 21.3808 14.0483C21.3808 13.3685 20.8298 12.8174 20.15 12.8174H10.8089C10.1292 12.8174 9.57812 13.3685 9.57812 14.0483C9.57812 14.7282 10.1291 15.2792 10.8089 15.2792Z'
            fill={`url(#${gradientId4})`}
          />
          <path
            d='M6.68611 15.2836C7.36491 15.2836 7.91519 14.7325 7.91519 14.0527C7.91519 13.3729 7.36491 12.8218 6.68611 12.8218C6.00731 12.8218 5.45703 13.3729 5.45703 14.0527C5.45703 14.7325 6.00731 15.2836 6.68611 15.2836Z'
            fill={`url(#${gradientId5})`}
          />
          <path
            d='M7.91519 20.2754C7.91519 20.9552 7.36491 21.5063 6.68611 21.5063C6.00731 21.5063 5.45703 20.9552 5.45703 20.2754C5.45703 19.5955 6.00731 19.0444 6.68611 19.0444C7.36491 19.0444 7.91519 19.5955 7.91519 20.2754Z'
            fill={`url(#${gradientId6})`}
          />
          <path
            d='M6.68611 27.6567C7.36491 27.6567 7.91519 27.1056 7.91519 26.4257C7.91519 25.7459 7.36491 25.1948 6.68611 25.1948C6.00731 25.1948 5.45703 25.7459 5.45703 26.4257C5.45703 27.1056 6.00731 27.6567 6.68611 27.6567Z'
            fill={`url(#${gradientId7})`}
          />
        </g>
        <defs>
          <linearGradient id={gradientId0} x1='36' y1='18' x2='0' y2='18' gradientUnits='userSpaceOnUse'>
            <stop stopColor={color === 'linear' ? '#5495FC' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
            <stop offset='1' stopColor={color === 'linear' ? '#31D366' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
          </linearGradient>
          <linearGradient id={gradientId1} x1='36' y1='18' x2='0' y2='18' gradientUnits='userSpaceOnUse'>
            <stop stopColor={color === 'linear' ? '#5495FC' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
            <stop offset='1' stopColor={color === 'linear' ? '#31D366' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
          </linearGradient>
          <linearGradient id={gradientId2} x1='36' y1='18' x2='0' y2='18' gradientUnits='userSpaceOnUse'>
            <stop stopColor={color === 'linear' ? '#5495FC' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
            <stop offset='1' stopColor={color === 'linear' ? '#31D366' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
          </linearGradient>
          <linearGradient id={gradientId3} x1='36' y1='18' x2='0' y2='18' gradientUnits='userSpaceOnUse'>
            <stop stopColor={color === 'linear' ? '#5495FC' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
            <stop offset='1' stopColor={color === 'linear' ? '#31D366' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
          </linearGradient>
          <linearGradient id={gradientId4} x1='36' y1='18' x2='0' y2='18' gradientUnits='userSpaceOnUse'>
            <stop stopColor={color === 'linear' ? '#5495FC' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
            <stop offset='1' stopColor={color === 'linear' ? '#31D366' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
          </linearGradient>
          <linearGradient id={gradientId5} x1='36' y1='18' x2='0' y2='18' gradientUnits='userSpaceOnUse'>
            <stop stopColor={color === 'linear' ? '#5495FC' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
            <stop offset='1' stopColor={color === 'linear' ? '#31D366' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
          </linearGradient>
          <linearGradient id={gradientId6} x1='36' y1='18' x2='0' y2='18' gradientUnits='userSpaceOnUse'>
            <stop stopColor={color === 'linear' ? '#5495FC' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
            <stop offset='1' stopColor={color === 'linear' ? '#31D366' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
          </linearGradient>
          <linearGradient id={gradientId7} x1='36' y1='18' x2='0' y2='18' gradientUnits='userSpaceOnUse'>
            <stop stopColor={color === 'linear' ? '#5495FC' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
            <stop offset='1' stopColor={color === 'linear' ? '#31D366' : color === 'black' ? '#0D0D0D' : '#FFFFFF'} />
          </linearGradient>
          <clipPath id='clip0_942_3890'>
            <rect width='36' height='36' fill='white' />
          </clipPath>
        </defs>
      </svg>
    )
  }
)

export default WishlistIcon
