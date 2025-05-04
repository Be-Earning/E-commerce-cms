export const smoothScrollToTop = (duration: number) => {
  const startPosition = window.scrollY
  const distance = -startPosition
  let startTime: number | null = null

  const animateScroll = (currentTime: number) => {
    if (!startTime) startTime = currentTime
    const progress = currentTime - startTime

    window.scrollTo(0, easeInOut(progress, startPosition, distance, duration))

    if (progress < duration) {
      requestAnimationFrame(animateScroll)
    }
  }

  const easeInOut = (t: number, b: number, c: number, d: number) => {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  requestAnimationFrame(animateScroll)
}
