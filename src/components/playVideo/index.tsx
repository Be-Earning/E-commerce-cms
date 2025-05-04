import React, { useEffect, useRef } from 'react'

interface IAutoPlayVideoProps {
  source: string
  isHasControls?: boolean
}
const AutoPlayVideo: React.FunctionComponent<IAutoPlayVideoProps> = ({ source, isHasControls }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.error('error in autoplay video:', error)
        })
      }
    }

    playVideo()

    document.addEventListener('click', playVideo)

    return () => {
      document.removeEventListener('click', playVideo)
    }
  }, [])

  return (
    <video ref={videoRef} className='w-full  h-full' src={source} muted playsInline loop controls={isHasControls} />
  )
}

export default AutoPlayVideo
