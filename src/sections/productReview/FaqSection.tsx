import { memo, useState } from 'react'
import { IFAQProduct } from '~/@types/models'
import { FaqCard } from '~/components/faqCard'

type FaqSection = {
  faqP05: IFAQProduct[]
}

const FaqSection = memo(({ faqP05 }: FaqSection) => {
  const [faqActive, setFaqActive] = useState<number>(0)

  return (
    <section className='xs:px-2 xs:pt-5 sm:px-4 sm:pt-20'>
      <h1 className='text-left font-customBold leading-[76px] xs:mb-0 xs:ml-0 xs:text-[32px] sm:mb-10 sm:ml-24 sm:text-[56px]'>
        FAQ of PO5
      </h1>
      <div className='flex xs:flex-col xs:items-start xs:gap-3 sm:flex-row sm:items-center sm:gap-5'>
        {faqP05?.map((faq, index) => (
          <FaqCard key={index} index={index} faqPo5={faq} setFaqActive={setFaqActive} isActive={index === faqActive} />
        ))}
      </div>
    </section>
  )
})

export default FaqSection
