import { cva, type VariantProps } from 'class-variance-authority'

import { HTMLAttributes, ReactNode } from 'react'
import { FaCircleCheck } from 'react-icons/fa6'
import { MdLock, MdWarning } from 'react-icons/md'
import { cn } from '~/utils/classNames'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 h-[36px] text-xs !font-customMedium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 gap-2 text-[14px]',
  {
    variants: {
      variant: {
        success: 'border-transparent bg-green-active text-green-light1 ',
        lock: 'border-transparent bg-red-lock text-red-dark ',
        warning: 'border-transparent bg-yellow-warning text-yellow-dark',
        outline: 'text-foreground'
      }
    },
    defaultVariants: {
      variant: 'outline'
    }
  }
)

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  children?: ReactNode
  className?: string
  variant?: 'success' | 'lock' | 'warning' | 'outline' | null | undefined
}
const renderIcon = (variant: string | null | undefined) => {
  switch (variant) {
    case 'success':
      return <FaCircleCheck className='size-4' />
    case 'lock':
      return <MdLock className='size-4' />
    case 'warning':
      return <MdWarning className='size-4' />
    default:
      return null
  }
}

function Badge({ className, variant, children, ...props }: Readonly<BadgeProps>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {renderIcon(variant)}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
