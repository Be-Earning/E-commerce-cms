import { Dispatch, memo, SetStateAction } from 'react'

import { IFAQProduct } from '~/@types/models'
import images from '~/assets'
import { IconButton } from '~/components/iconButton'
import useResponsive from '~/hooks/useResponsive'

type FaqCardProps = {
  faqPo5: IFAQProduct
  index: number
  isActive: boolean
  setFaqActive: Dispatch<SetStateAction<number>>
}

const FaqCard = memo(({ faqPo5, index, isActive, setFaqActive }: FaqCardProps) => {
  const smDown = useResponsive('down', 'sm', 'sm')

  return (
    <div
      onClick={() => setFaqActive(index)}
      className={`xs:min-h-[140px] ${isActive ? 'xs:h-fit' : 'xs:h-[140px]'} h-full xs:p-6 sm:min-h-[580px] sm:p-8 md:p-10 ${isActive ? 'xs:pt-6 sm:pt-16 md:pt-20' : ''} ${isActive ? 'bg-black-main xs:w-full sm:w-2/5' : 'bg-[#F6F6F7] xs:w-full sm:w-1/5'} flex flex-col transition-colors duration-500 ease-in-out xs:gap-6 xs:rounded-[30px] sm:gap-12 sm:rounded-[45px] md:rounded-[60px]`}
    >
      <img
        src={images.icons.faqIcon}
        alt='faq-icon'
        className={`xs:size-11 sm:size-[60px] md:size-[72px] ${!isActive ? 'hidden' : ''}`}
      />
      <div
        className={`${smDown ? 'w-full' : ''} flex ${isActive ? 'h-fit xs:flex-col' : 'h-[500px] xs:flex-row'} sm:flex-col ${isActive ? (smDown ? 'justify-between gap-5' : 'gap-5') : 'items-end justify-between'} text-white`}
      >
        {!isActive && !smDown && <div className='text-black'></div>}
        <div className='w-full'>
          <h1
            className={`${smDown || (isActive && smDown) ? 'w-[205px]' : isActive ? 'w-fit' : index === 1 ? 'w-[180px]' : 'w-[190px]'} ${isActive ? 'font-customSemiBold text-white xs:text-[24px] sm:text-[32px]' : 'w-full font-customMedium text-[24px] text-black-main'} leading-[34px]`}
          >
            {faqPo5?.answer}
          </h1>
        </div>
        <p className={`leading-[30px] text-white/[.68] xs:text-[16px] sm:text-[18px] ${!isActive ? 'hidden' : ''}`}>
          {faqPo5?.question}
        </p>
        {!isActive && (
          <IconButton color='white' size={smDown ? '44' : '64'}>
            <img src={images.icons.arrow_top_right} alt='arrow-top-right' className='xs:size-[16.5px] sm:size-[24px]' />
          </IconButton>
        )}
      </div>
    </div>
  )
})

export default FaqCard
