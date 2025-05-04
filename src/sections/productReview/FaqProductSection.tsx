import { memo, useCallback, useRef, useState } from 'react'
import Slider from 'react-slick'
import { IFAQProduct } from '~/@types/models'
import { FaqProductCard } from '~/components/faqProductCard'
import { ArrowLeftIcon, ArrowRightIcon } from '~/components/icons'
import { SliderPagination } from '~/components/sliderPagination'
import images from '~/assets'
import './styles.scss'

type FaqProductSection = {
  faq: IFAQProduct[]
}

const icon = [images.icons.faq1, images.icons.faq2, images.icons.faq3]

const FaqProductSection = memo(({ faq }: FaqProductSection) => {
  const sliderFaqProductRef = useRef<Slider>(null)

  const [activeSlide, setActiveSlide] = useState<number>(0)

  const handleGoToSlide = useCallback(
    (index: number) => sliderFaqProductRef.current?.slickGoTo(index),
    [sliderFaqProductRef]
  )

  return (
    <section className='faq-product relative pl-4 xs:mt-5 sm:mt-10'>
      <h1 className='mb-10 text-center font-customBold capitalize leading-[76px] xs:text-[32px] sm:text-[56px]'>
        FAQ for products
      </h1>
      <div className='relative'>
        <Slider
          ref={sliderFaqProductRef}
          arrows={false}
          infinite
          speed={500}
          slidesToShow={3}
          slidesToScroll={1}
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 640,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false
              }
            }
          ]}
          afterChange={(current) => setActiveSlide(current)}
        >
          {faq?.map((faq, index) => {
            return (
              <div key={faq.id}>
                <FaqProductCard faq={faq} icon={icon[index % icon.length]} />
              </div>
            )
          })}
        </Slider>
        <div className='mt-10 flex items-center justify-center gap-5'>
          <button className='cursor-pointer' onClick={() => sliderFaqProductRef.current?.slickPrev()}>
            <ArrowLeftIcon className='xs:size-6 sm:size-8' />
          </button>
          <SliderPagination
            gap='gap-5'
            className='xs:!size-[6px] sm:!size-[10px]'
            activeIndex={activeSlide}
            slideToGo={handleGoToSlide}
            slideCount={faq.length}
          />
          <button className='cursor-pointer' onClick={() => sliderFaqProductRef.current?.slickNext()}>
            <ArrowRightIcon className='xs:size-6 sm:size-8' />
          </button>
        </div>
      </div>
    </section>
  )
})

export default FaqProductSection
