import { FC, ReactNode } from 'react'
import { cn } from '~/utils/classNames'

interface IReviewCommentFAQProps {
  name: string
  children: ReactNode
  className?: string
}

const ReviewCommentFAQ: FC<IReviewCommentFAQProps> = ({ name, children, className }) => {
  return (
    <div className={cn('flex xs:flex-col sm:flex-col md:flex-row', className)}>
      <p className='flex-shrink-0 text-gray-darker xs:text-[16px]/[24px] sm:text-[17px]/[25px] md:min-w-[120px] md:text-[18px]/[26px] lg:min-w-[152px]'>
        {name}
      </p>
      {children}
    </div>
  )
}

export default ReviewCommentFAQ
