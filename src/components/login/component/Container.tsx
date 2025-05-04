import { memo, ReactNode } from 'react'
import { cn } from '~/utils/classNames'

interface ContainerProps {
  children: ReactNode
  className?: string
}

const Container = memo(({ children, className }: ContainerProps) => {
  return <div className={cn(className, 'w-full grow')}>{children}</div>
})

export default Container
