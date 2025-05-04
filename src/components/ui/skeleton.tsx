import { cn } from '~/utils/classNames'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded bg-gray-300', className)} {...props} />
}

export { Skeleton }
