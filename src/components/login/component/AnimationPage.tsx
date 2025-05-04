import React, { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import { cn } from '~/utils/classNames'

interface AnimationPageProps extends PropsWithChildren {
  className?: string
  isVisble?: boolean
  homePage?: boolean
}

const AnimationPage = React.forwardRef<HTMLDivElement, AnimationPageProps>((props, ref) => {
  const { isVisble, className, homePage = false, children } = props

  const variants = {
    visible: { transform: 'translateX(0)' },
    hide: { transform: homePage ? 'translateX(-100%)' : 'translateX(100%)' }
  }

  return (
    <motion.div
      ref={ref}
      className={cn('relative flex h-full w-full flex-col rounded-2xl', className)}
      variants={variants}
      animate={isVisble ? 'visible' : 'hide'}
      transition={{ ease: 'easeInOut', duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
})

export default AnimationPage
