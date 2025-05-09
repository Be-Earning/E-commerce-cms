import { memo } from 'react'

const LocationIcon = memo(({ color = '#0D0D0D', className }: { color?: string; className?: string }) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M10.0011 0C6.00711 0 2.75781 3.2493 2.75781 7.2432C2.75781 12.1998 9.2398 19.4763 9.51578 19.7836C9.775 20.0723 10.2276 20.0718 10.4863 19.7836C10.7623 19.4763 17.2443 12.1998 17.2443 7.2432C17.2442 3.2493 13.995 0 10.0011 0ZM10.0011 10.8875C7.9916 10.8875 6.35684 9.25266 6.35684 7.2432C6.35684 5.23375 7.99164 3.59898 10.0011 3.59898C12.0105 3.59898 13.6452 5.23379 13.6452 7.24324C13.6452 9.2527 12.0105 10.8875 10.0011 10.8875Z'
        fill={color}
      />
    </svg>
  )
})

export default LocationIcon
