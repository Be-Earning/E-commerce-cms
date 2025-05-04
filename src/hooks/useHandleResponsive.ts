import { useCallback } from 'react'
import useResponsive from '~/hooks/useResponsive'

export const useHandleResponsive = () => {
  const xlDown = useResponsive('down', 'xl')
  const lgDown = useResponsive('down', 'lg')
  const mdDown = useResponsive('down', 'md')
  const smDown = useResponsive('down', 'sm')

  const colWidth = useCallback(
    (value) => {
      const breakpoints = [
        { condition: smDown, factor: 20 },
        { condition: mdDown, factor: 28 },
        { condition: lgDown, factor: 30 },
        { condition: xlDown, factor: 31 }
      ]

      const breakpoint = breakpoints.find((bp) => bp.condition)
      return breakpoint ? (value * breakpoint.factor) / 32 : value
    },
    [xlDown, lgDown, mdDown, smDown]
  )

  return {
    colWidth,
    smDown,
    mdDown,
    lgDown,
    xlDown
  }
}
