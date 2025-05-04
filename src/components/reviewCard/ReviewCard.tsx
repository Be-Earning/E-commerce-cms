import { memo } from 'react'
import { ICommentProduct } from '~/@types/models'
import images from '~/assets'

type TReviewCard = {
  review: ICommentProduct
}

const ReviewCard = memo(({ review }: TReviewCard) => {
  return (
    <div className='flex flex-col xs:w-[78%] xs:gap-4 sm:w-[495px] sm:gap-7'>
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-1'>
          {Array.from({ length: 5 }).map((_, index: number) => (
            <img
              key={index}
              className={`opacity-10 xs:size-[18px] sm:size-6`}
              src={images.icons.star}
              alt='icon-star'
            />
          ))}
        </div>
        {/* <p className='leading-[33.6px] xs:text-[18px] sm:text-[24px]'>{review?.ratings?.toFixed(1)}</p> */}
      </div>
      <p className='xs: text-blackMain/[.64] pr-0 font-customMedium xs:text-[14px] xs:leading-6 sm:pr-5 sm:text-[20px] sm:leading-8'>
        {review.comment}
      </p>
      <h6 className='font-customSemiBold leading-none xs:text-[18px] sm:text-[24px]'>
        ID Customer: <span className='font-customSemiBold'>{review.commentId}</span>
      </h6>
    </div>
  )
})

export default ReviewCard
