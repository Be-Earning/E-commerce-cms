import { memo } from 'react'
import images from '~/assets'

const FreeShippingCard = memo(() => {
  return (
    <div className='w-[355px] h-[235px] rounded-[32px] bg-white/[.44] backdrop-blur-2xl p-6 flex flex-col items-center overflow-hidden shadow-6xl'>
      <p className='xs:text-[25px] sm:text-[16px] leading-5 text-blackMain/[.64] xs:mb-2 sm:mb-0'>Shipping fee</p>
      <h6 className='xs:text-[35px] sm:text-[26px] font-customBold leading-[40px] mb-[60px]'>Free shipping</h6>
      <div className='relative rotate-[27deg] scale-110'>
        <img
          src={images.icons.shipping_top}
          alt='shipping-top'
          className='absolute top-[-18%] left-[-5%] z-10 rotate-[-27deg] xs:scale-110 sm:scale-90'
        />
        <img
          src={images.icons.shipping_bottom}
          alt='shipping-bottom'
          className='rotate-[-13.63deg] xs:scale-110 sm:scale-90'
        />
      </div>
    </div>
  )
})

export default FreeShippingCard
