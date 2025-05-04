import { useEffect, useState } from 'react'

const breakpoints: Record<string, number> = {
  xs: 365,
  '3xs': 400,
  '2xs': 500,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
}

export default function useResponsive(
  query: 'up' | 'down' | 'between' | 'only' = 'up',
  start: keyof typeof breakpoints = 'sm',
  end?: keyof typeof breakpoints
) {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => {
      let isMatch = false

      if (query === 'up') {
        isMatch = window.innerWidth >= breakpoints[start]
      } else if (query === 'down') {
        isMatch = window.innerWidth < breakpoints[start]
      } else if (query === 'between') {
        isMatch = window.innerWidth >= breakpoints[start] && window.innerWidth <= breakpoints[end!]
      } else if (query === 'only') {
        isMatch = window.innerWidth >= breakpoints[start] && (!end || window.innerWidth < breakpoints[end])
      }

      setMatches(isMatch)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [query, start, end])

  return matches
}

export function useWidth() {
  const [width, setWidth] = useState<keyof typeof breakpoints>('sm')

  useEffect(() => {
    const handleResize = () => {
      const currentWidth =
        (Object.keys(breakpoints).find(
          (key) => window.innerWidth >= breakpoints[key as keyof typeof breakpoints]
        ) as keyof typeof breakpoints) || 'sm'

      setWidth(currentWidth)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return width
}
