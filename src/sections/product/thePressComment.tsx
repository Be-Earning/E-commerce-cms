import { memo, useMemo, useState } from 'react'
import { ICommentProductDetail } from '~/@types/models'
import NoDataIcon from '~/components/icons/NoDataIcon'
import { Skeleton } from '~/components/ui/skeleton'
import { SPLIT_KEY } from '~/constants/splitKey'
import ReviewCommentFAQ from '~/layouts/components/review'
import { cn } from '~/utils/classNames'

const ThePressComment = memo(({ comments, isLoading }: { isLoading: boolean; comments: ICommentProductDetail[] }) => {
  const [showAll, setShowAll] = useState(false)

  const commentsToShow = useMemo(() => (showAll ? comments : comments?.slice(0, 3)) || [], [comments, showAll])

  return (
    <section className='flex flex-col gap-8'>
      <h1 className='font-customSemiBold capitalize xs:text-[24px]/[25px] sm:text-[26px]/[27px] md:text-[28px]/[29px] lg:text-[32px]/[32px]'>
        the press comment
      </h1>

      <div className='flex flex-col gap-6 divide-x-0 divide-y divide-solid divide-gray-lighter'>
        {isLoading ? (
          Array.from({ length: 3 })?.map((_, index) => (
            <ReviewCommentFAQ key={index} name={`Review ${index + 1}`} className={cn(index !== 0 && 'pt-6')}>
              <div className='w-full font-customMedium xs:text-[16px]/[24px] sm:text-[17px]/[25px] md:text-[18px]/[26px]'>
                <div className='w-full space-y-2'>
                  <Skeleton className='h-[18px] w-[300px]' />
                  <Skeleton className='h-[18px] w-[200px]' />
                  <Skeleton className='h-[18px] w-full' />
                </div>
              </div>
            </ReviewCommentFAQ>
          ))
        ) : commentsToShow.length === 0 ? (
          <div className='flex h-[400px] w-full flex-col items-center justify-center gap-3'>
            <NoDataIcon />
            <p> Currently, there are no comment available in product</p>
          </div>
        ) : (
          commentsToShow?.map((item, index) => (
            <ReviewCommentFAQ key={index} name={`Comment ${index + 1}`} className={cn(index !== 0 && 'pt-6')}>
              <div className='w-full font-customMedium xs:text-[16px]/[24px] sm:text-[17px]/[25px] md:text-[18px]/[26px]'>
                <p>The press’s name: {item.name.split(SPLIT_KEY.COMMENT)[0]}</p>
                <p>Newsroom: {item.name.split(SPLIT_KEY.COMMENT)[1]}</p>
                <p>Comment: "{item.message}";</p>
              </div>
            </ReviewCommentFAQ>
          ))
        )}

        {comments?.length > 3 && (
          <button className='pt-4 text-left text-blue-main' onClick={() => setShowAll(!showAll)}>
            {showAll ? '-' : '+'} Show {showAll ? 'Less' : 'More'}
          </button>
        )}
      </div>
    </section>
  )
})

export default ThePressComment
