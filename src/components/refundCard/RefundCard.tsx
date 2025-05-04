import { memo } from 'react'
import images from '~/assets'

const RefundCard = memo(() => {
  return (
    <div className='relative flex h-[235px] flex-col items-center overflow-hidden rounded-[32px] bg-white/[.44] p-8 pb-0 shadow-6xl backdrop-blur-2xl xs:w-[280px] sm:w-[355px]'>
      <div className='absolute top-1/2 z-50 flex -translate-y-1/2 transform flex-col items-center'>
        <div className='mb-4 mt-3 flex flex-col items-center'>
          <p className='text-blackMain/[.64] leading-5'>Refund</p>
          <h6 className='leading-0 font-customBold text-[26px]'>within 15 days</h6>
          <p className='text-blackMain/[.64] leading-5'>from delivery date</p>
        </div>

        <img src={images.icons.refund} alt='icon-refund' />
      </div>
      <img
        src={images.image.circle_white}
        alt='circle-white'
        className='absolute bottom-[-80px] z-20 size-[245.16px]'
      />
    </div>
  )
})

export default RefundCard
