import { memo } from 'react'
import { ProductInfo } from '~/@types/models'
import { FavoriteIcon } from '../icons'

type ProductCardBannerProps = {
  product: ProductInfo
}

const ProductCardBanner = memo(({ product }: ProductCardBannerProps) => {
  const { images, name } = product?.product.params || {}
  const { priceOptions } = product?.variants?.[0] || {}

  return (
    <div className='relative flex items-center justify-start bg-white/[.44] shadow-4xl backdrop-blur-2xl xs:h-[76.8px] xs:w-[256px] xs:gap-3 xs:rounded-xl xs:px-[7px] sm:h-[140px] sm:w-[450px] sm:gap-5 sm:rounded-3xl sm:px-[18px]'>
      <div className='relative rounded-lg border border-solid xs:size-[62.17px] xs:min-w-[62.17px] sm:size-[106px] sm:min-w-[106px]'>
        <img
          src={images?.[0]}
          alt={name}
          className='h-full w-full rounded-lg bg-white/[.50] object-cover object-center'
        />
        <div className='absolute -left-3 -top-3 flex size-6 shrink-0 items-center justify-center rounded-full bg-black-main text-[14px] text-white'>
          1
        </div>
      </div>
      <div className='flex flex-col xs:gap-0 sm:gap-3'>
        <p className='font-customBold leading-[21px] xs:text-[11.7px] sm:text-[20px]'>{name}</p>
        <p
          className={`text-blackMain/[.64] text-nowrap xs:text-[12px] xs:leading-[22px] sm:text-[16px] sm:leading-[16.8px]`}
        >
          Member Price:{' '}
          <span
            className={`text-blackMain font-customSemiBold xs:text-[17px] xs:leading-[22px] sm:text-[24px] sm:leading-[25.2px]`}
          >
            {+priceOptions.memberPrice / 10 ** 18}$
          </span>{' '}
          <span
            className={`text-blackMain/[.64] line-through xs:text-[13px] xs:leading-[22px] sm:text-[16px] sm:leading-[16.8px]`}
          >
            {+priceOptions.retailPrice / 10 ** 18}$
          </span>
        </p>
        <div className='flex items-end gap-1'>
          <p
            className={`text-blackMain/[.64] cursor-pointer underline hover:text-green-main xs:text-[10px] xs:leading-[22px] sm:text-[16px] sm:leading-[16.8px]`}
          >
            VIP Price:{' '}
          </p>
          <span className={`font-customBold xs:text-[17px] xs:leading-[22px] sm:text-[24px] sm:leading-[25.2px]`}>
            {Number(priceOptions.vipPrice) / 10 ** 18}$
          </span>
        </div>
      </div>
      <button>
        <FavoriteIcon
          color='black'
          className='absolute xs:right-2 xs:top-2 xs:size-[14.63px] sm:right-4 sm:top-4 sm:size-6'
        />
      </button>
    </div>
  )
})

export default ProductCardBanner
