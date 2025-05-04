import { memo } from 'react'
import { IFAQProduct } from '~/@types/models'
import { Button } from '~/components/button'
import useResponsive from '~/hooks/useResponsive'

type FaqProductCardProps = {
  faq: IFAQProduct
  icon: any
}

const FaqProductCard = memo(({ faq, icon }: FaqProductCardProps) => {
  const smDown = useResponsive('down', 'sm', 'sm')

  return (
    <div className='flex flex-col justify-between rounded-bl-[4px] rounded-br-[88px] rounded-tl-[88px] rounded-tr-[4px] bg-[#F8F8F9] p-10 xs:h-[718px] xs:w-full sm:h-[606px] sm:w-[473px]'>
      <div className='flex h-[96px] w-[96px] items-center justify-center rounded-full border-[1px] border-solid border-white bg-transparent'>
        <div className='flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white/[.44] backdrop-blur-[37.89px]'>
          <img src={icon} alt='icon' />
        </div>
      </div>
      <h1 className='font-customSemiBold text-[32px] leading-[42px] tracking-tight xs:pr-0 sm:pr-10'>{faq.question}</h1>
      <p className='text-blackMain/[.68] leading-[30px] xs:text-[16px] sm:text-[18px]'>{faq.answer}</p>
      <Button size={smDown ? 'medium' : 'large'} className='w-[173px] rounded-[26px] xs:text-[16px]'>
        See more
      </Button>
    </div>
  )
})

export default FaqProductCard
