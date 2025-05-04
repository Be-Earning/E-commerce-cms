import { memo, useMemo, useState } from 'react'
import { IFAQProductDetail } from '~/@types/models'
import FQAArrowIcon from '~/components/icons/FQAArrowIcon'
import NoDataIcon from '~/components/icons/NoDataIcon'
import { Skeleton } from '~/components/ui/skeleton'
import ReviewCommentFAQ from '~/layouts/components/review'
import { cn } from '~/utils/classNames'

const FAQForProduct = memo(({ faqs, isLoading }: { isLoading: boolean; faqs: IFAQProductDetail[] }) => {
  const [showAll, setShowAll] = useState(false)

  const reviewsToShow = useMemo(() => (showAll ? faqs : faqs?.slice(0, 3)) || [], [faqs, showAll])

  return (
    <section className='flex flex-col gap-8'>
      <h1 className='font-customSemiBold capitalize xs:text-[24px]/[25px] sm:text-[26px]/[27px] md:text-[28px]/[29px] lg:text-[32px]/[32px]'>
        FAQ For Product
      </h1>
      <div className='flex flex-col gap-5 divide-x-0 divide-y divide-solid divide-gray-lighter'>
        {isLoading ? (
          Array.from({ length: 3 })?.map((_, index) => (
            <ReviewCommentFAQ key={index} name={`FAQ ${index + 1}`} className={cn(index !== 0 && 'pt-6')}>
              <div className='flex w-full flex-col gap-2 font-customMedium text-black-main xs:text-[16px]/[24px] sm:text-[17px]/[25px] md:text-[18px]/[26px]'>
                <Skeleton className='h-[18px] w-[300px]' />
                <div className='flex gap-3'>
                  <FQAArrowIcon className='mt-[5px] size-3 flex-shrink-0 xs:h-4 xs:w-4' />
                  <Skeleton className='h-[18px] w-full' />
                </div>
              </div>
            </ReviewCommentFAQ>
          ))
        ) : reviewsToShow.length === 0 ? (
          <div className='flex h-[400px] w-full flex-col items-center justify-center gap-3'>
            <NoDataIcon />
            <p> Currently, there are no FAQ available in product</p>
          </div>
        ) : (
          reviewsToShow?.map((item, index) => (
            <ReviewCommentFAQ key={item.id} name={`FAQ ${index + 1}`} className={cn(index !== 0 && 'pt-6')}>
              <div className='flex w-full flex-col gap-2 font-customMedium text-black-main xs:text-[16px]/[24px] sm:text-[17px]/[25px] md:text-[18px]/[26px]'>
                <p>{item.title}</p>
                <div className='flex gap-3'>
                  <FQAArrowIcon className='mt-[5px] size-3 flex-shrink-0 xs:h-4 xs:w-4' />
                  <p>{item.content}</p>
                </div>
              </div>
            </ReviewCommentFAQ>
          ))
        )}

        {faqs?.length > 3 && (
          <button className='pt-4 text-left text-blue-main' onClick={() => setShowAll(!showAll)}>
            {showAll ? '-' : '+'} Show {showAll ? 'Less' : 'More'}
          </button>
        )}
      </div>
    </section>
  )
})

export default FAQForProduct
