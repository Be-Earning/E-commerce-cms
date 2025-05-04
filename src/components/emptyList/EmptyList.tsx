import { memo } from 'react'
import { EmptyIcon } from '../icons'
import './styles.scss'
import { CircularProgress } from '@mui/material'

const EmptyList = memo(
  ({
    model,
    className,
    isLoading,
    content
  }: {
    model: string
    className?: string
    isLoading?: boolean
    content?: string
  }) => {
    return (
      <div
        className={`bg-empty flex w-full flex-col items-center justify-center border-b-[2px] border-solid border-black-main/[.07] bg-white/[.68] xs:h-[500px] xs:rounded-[12px] sm:h-[627px] sm:rounded-[14px] md:rounded-[16px] lg:rounded-[24px] ${className}`}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <EmptyIcon className='2xs:size-[60px] xs:size-[60px] sm:size-[70px]' />
            <h6 className='2xs:text-wrap 2xs:text-[14px] xs:text-nowrap xs:text-[14px] sm:text-nowrap sm:text-[16px] md:text-wrap'>
              {content ? content : `Currently, there are no ${model} available`}
            </h6>
          </>
        )}
      </div>
    )
  }
)

export default EmptyList
