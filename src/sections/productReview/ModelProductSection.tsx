import { memo, useCallback, useRef, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { IProductParams } from '~/@types/models'
import { FreeShippingCard } from '~/components/freeShippingCard'
import { GlobalWarranty } from '~/components/globalWarranty'
import { ArrowLeftIcon, ArrowRightIcon } from '~/components/icons'
import { RefundCard } from '~/components/refundCard'
import { formatDate, removeEscapeCharacters } from '~/utils/format'

type ModelProductSection = {
  product: IProductParams
}

const ModelProductSection = memo(({ product }: ModelProductSection) => {
  const swiperRef = useRef<any>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const { name, images, description } = product || {}

  const [activeSlide, setActiveSlide] = useState<number>(0)

  const handleSlideChange = useCallback(() => {
    if (swiperRef.current && swiperRef.current.swiper) setActiveSlide(swiperRef.current.swiper.realIndex)
  }, [swiperRef])

  return (
    <section className='model-product relative py-[50px] xs:mb-[50px] xs:pt-[100px] sm:mb-0 sm:pt-[180px]'>
      <Swiper
        ref={swiperRef}
        modules={[Navigation]}
        onSlideChange={handleSlideChange}
        navigation={{
          prevEl: prevRef.current ? prevRef.current : undefined,
          nextEl: nextRef.current ? nextRef.current : undefined
        }}
      >
        <SwiperSlide>
          <div className='w-full xs:h-[800px] sm:h-[1092px]'>
            <div className='xs:mb-0 xs:px-4 sm:mb-5 sm:px-5 md:px-5 lg:px-0'>
              <h1 className='text-center font-customBold capitalize xs:text-[32px] xs:leading-[40px] sm:text-[56px] sm:leading-[72px]'>
                {name}
              </h1>
              <div
                className='text-blackMain/[.64] mx-auto mt-5 text-center tracking-wide xs:text-[16px] xs:leading-[24px] sm:text-[18px] sm:leading-[28px] md:text-[20px] md:leading-[32px]'
                dangerouslySetInnerHTML={{
                  __html: removeEscapeCharacters(description) || ''
                }}
              />
            </div>
            <div className='relative flex w-full items-center justify-between'>
              <div className='z-0 xs:hidden sm:block'>
                <svg width='289' height='907' viewBox='0 0 289 907' fill='none'>
                  <path d='M0 0C63.3571 0 117.885 44.7698 130.218 106.915L289 907H0V0Z' fill='url(#linear_left)' />
                  <defs>
                    <linearGradient
                      id='linear_left'
                      x1='-72'
                      y1='19.5'
                      x2='234.499'
                      y2='1002'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#F8F8F9' />
                      <stop offset='1' stopColor='white' stopOpacity='0' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className='z-0 xs:hidden sm:block'>
                <svg width='289' height='907' viewBox='0 0 289 907' fill='none'>
                  <path d='M289 0C225.643 0 171.115 44.7698 158.782 106.915L0 907H289V0Z' fill='url(#linear_right)' />
                  <defs>
                    <linearGradient
                      id='linear_right'
                      x1='361'
                      y1='19.5'
                      x2='54.5005'
                      y2='1002'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#F8F8F9' />
                      <stop offset='1' stopColor='white' stopOpacity='0' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className='z-0 xs:block sm:hidden'>
                <svg width='78' height='429' viewBox='0 0 78 429' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M-1 0C15.8618 0 30.0394 12.6527 31.9499 29.406L77.4715 428.582H-1V0Z'
                    fill='url(#paint0_linear_322_667)'
                  />
                  <defs>
                    <linearGradient
                      id='paint0_linear_322_667'
                      x1='-20.55'
                      y1='9.21427'
                      x2='193.061'
                      y2='402.687'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#F8F8F9' />
                      <stop offset='1' stopColor='white' stopOpacity='0' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className='z-0 xs:block sm:hidden'>
                <svg width='79' height='429' viewBox='0 0 79 429' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M79 0C62.1382 0 47.9606 12.6527 46.0501 29.406L0.528465 428.582H79V0Z'
                    fill='url(#paint0_linear_322_668)'
                  />
                  <defs>
                    <linearGradient
                      id='paint0_linear_322_668'
                      x1='98.55'
                      y1='9.21427'
                      x2='-115.061'
                      y2='402.687'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#F8F8F9' />
                      <stop offset='1' stopColor='white' stopOpacity='0' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {images?.[1] && (
                <img
                  src={images?.[1]}
                  alt='product-single'
                  className='absolute left-1/2 z-30 -translate-x-1/2 transform xs:top-[40%] xs:max-w-[90%] sm:top-[-20px] sm:h-[750px]'
                />
              )}

              <div id='circle-big' className='absolute z-20 xs:left-[7%] xs:top-[30%] sm:left-[20%] sm:top-[19%]'>
                <svg
                  width='434'
                  height='434'
                  viewBox='0 0 434 434'
                  fill='none'
                  className='xs:size-[164px] sm:w-[434px]'
                >
                  <circle cx='217' cy='217' r='217' fill='#ECF2F3' />
                </svg>
              </div>

              <div id='circle-small' className='absolute z-20 xs:right-[8%] xs:top-[65%] sm:right-[27%] sm:top-[46%]'>
                <svg
                  width='290'
                  height='290'
                  viewBox='0 0 290 290'
                  fill='none'
                  className='xs:size-[125px] sm:w-[290px]'
                >
                  <circle cx='145' cy='145' r='145' fill='#ECF2F3' />
                </svg>
              </div>

              <div className='absolute bottom-10 left-1/2 z-40 w-full -translate-x-1/2 transform justify-center gap-5 xs:hidden sm:flex'>
                <FreeShippingCard />
                <GlobalWarranty />
                <RefundCard />
              </div>

              <div className='absolute -left-20 top-5 z-40 scale-[40%] xs:block sm:hidden'>
                <FreeShippingCard />
              </div>
              <div className='absolute -left-28 top-[90%] z-40 scale-[40%] xs:block sm:hidden'>
                <GlobalWarranty />
              </div>
              <div className='absolute -right-[70px] top-[40%] z-40 scale-[40%] xs:block sm:hidden'>
                <RefundCard />
              </div>
            </div>

            <div className='absolute bottom-0 z-10 w-full xs:px-0 sm:px-4'>
              <div className='w-full bg-gradient-to-t from-[#F2F3F5] to-[#F2F3F5]/[.0] xs:h-[278px] xs:rounded-bl-[28px] xs:rounded-br-[28px] sm:h-[398px] sm:rounded-bl-[60px] sm:rounded-br-[60px]' />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='flex w-full flex-col xs:h-[790px] sm:h-[1092px] sm:justify-between'>
            <div className='xs:mb-0 xs:px-4 sm:mb-5 sm:px-5 md:px-5 lg:px-0'>
              <h1 className='text-center font-customBold capitalize xs:text-[32px] xs:leading-[40px] sm:text-[56px] sm:leading-[72px]'>
                {name}
              </h1>
              <div
                className='text-blackMain/[.64] mx-auto mt-5 text-center tracking-wide xs:block xs:text-[16px] xs:leading-[24px] sm:hidden sm:text-[18px] sm:leading-[28px] md:text-[20px] md:leading-[32px]'
                dangerouslySetInnerHTML={{
                  __html: description || ''
                }}
              />
            </div>
            <div className='relative flex w-full items-center justify-between'>
              <div className='z-0 xs:hidden sm:block'>
                <svg width='289' height='907' viewBox='0 0 289 907' fill='none'>
                  <path d='M0 0C63.3571 0 117.885 44.7698 130.218 106.915L289 907H0V0Z' fill='url(#linear_left)' />
                  <defs>
                    <linearGradient
                      id='linear_left'
                      x1='-72'
                      y1='19.5'
                      x2='234.499'
                      y2='1002'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#F8F8F9' />
                      <stop offset='1' stopColor='white' stopOpacity='0' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className='z-0 xs:hidden sm:block'>
                <svg width='289' height='907' viewBox='0 0 289 907' fill='none'>
                  <path d='M289 0C225.643 0 171.115 44.7698 158.782 106.915L0 907H289V0Z' fill='url(#linear_right)' />
                  <defs>
                    <linearGradient
                      id='linear_right'
                      x1='361'
                      y1='19.5'
                      x2='54.5005'
                      y2='1002'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#F8F8F9' />
                      <stop offset='1' stopColor='white' stopOpacity='0' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className='z-0 xs:block sm:hidden'>
                <svg width='78' height='429' viewBox='0 0 78 429' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M-1 0C15.8618 0 30.0394 12.6527 31.9499 29.406L77.4715 428.582H-1V0Z'
                    fill='url(#paint0_linear_322_667)'
                  />
                  <defs>
                    <linearGradient
                      id='paint0_linear_322_667'
                      x1='-20.55'
                      y1='9.21427'
                      x2='193.061'
                      y2='402.687'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#F8F8F9' />
                      <stop offset='1' stopColor='white' stopOpacity='0' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className='z-0 xs:block sm:hidden'>
                <svg width='79' height='429' viewBox='0 0 79 429' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M79 0C62.1382 0 47.9606 12.6527 46.0501 29.406L0.528465 428.582H79V0Z'
                    fill='url(#paint0_linear_322_668)'
                  />
                  <defs>
                    <linearGradient
                      id='paint0_linear_322_668'
                      x1='98.55'
                      y1='9.21427'
                      x2='-115.061'
                      y2='402.687'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#F8F8F9' />
                      <stop offset='1' stopColor='white' stopOpacity='0' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {images?.[2] && (
                <img
                  src={images?.[2]}
                  alt={name}
                  className='absolute left-1/2 z-30 -translate-x-1/2 transform xs:top-[15%] xs:max-h-[310px] xs:max-w-[90%] sm:top-[-80px] sm:h-[800px]'
                />
              )}

              <div id='circle-big' className='absolute z-20 xs:left-[7%] xs:top-[30%] sm:left-[20%] sm:top-[19%]'>
                <svg
                  width='434'
                  height='434'
                  viewBox='0 0 434 434'
                  fill='none'
                  className='xs:size-[164px] sm:w-[434px]'
                >
                  <circle cx='217' cy='217' r='217' fill='#ECF2F3' />
                </svg>
              </div>

              <div id='circle-small' className='absolute z-20 xs:right-[8%] xs:top-[65%] sm:right-[27%] sm:top-[46%]'>
                <svg
                  width='290'
                  height='290'
                  viewBox='0 0 290 290'
                  fill='none'
                  className='xs:size-[125px] sm:w-[290px]'
                >
                  <circle cx='145' cy='145' r='145' fill='#ECF2F3' />
                </svg>
              </div>

              <div className='absolute left-1/2 z-[100] flex -translate-x-1/2 transform flex-col justify-center rounded-[32px] bg-white/[.44] shadow-box-content-model backdrop-blur-2xl xs:bottom-[-30%] xs:h-[224px] xs:w-[358px] xs:space-y-2 xs:p-5 sm:bottom-[8%] sm:h-[300px] sm:w-[1204px] sm:space-y-5 sm:p-10'>
                <h6 className='font-customSemiBold capitalize xs:text-[16px] xs:leading-[22px] sm:text-[24px] sm:leading-8'>
                  product manual:
                </h6>
                <div
                  className='text-blackMain/[.64] xs:text-[14px] xs:leading-[20px] sm:text-[24px] sm:leading-8'
                  dangerouslySetInnerHTML={{
                    __html: description || ''
                  }}
                />
                <h6 className='font-customSemiBold capitalize xs:text-[16px] xs:leading-[22px] sm:text-[24px] sm:leading-8'>
                  expiry: {formatDate(+product?.expiryTime / 1000, 'DD MMMM YYYY')}
                </h6>
              </div>
            </div>

            <div className='absolute bottom-0 z-10 w-full xs:px-0 sm:px-4'>
              <div className='w-full bg-gradient-to-t from-[#F2F3F5] to-[#F2F3F5]/[.0] xs:h-[278px] xs:rounded-bl-[28px] xs:rounded-br-[28px] sm:h-[398px] sm:rounded-bl-[60px] sm:rounded-br-[60px]' />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className='absolute left-[50%] z-[100] flex -translate-x-[50%] transform items-center gap-5 xs:bottom-[8%] sm:bottom-[5.5%]'>
        <button
          className='cursor-pointer'
          onClick={() => {
            if (swiperRef.current) swiperRef.current.swiper.slidePrev()
          }}
          disabled={Number(activeSlide) === 0}
        >
          <ArrowLeftIcon
            color={Number(activeSlide) === 0 ? '#2F373C70' : '#2F373C'}
            className='xs:size-[17px] sm:size-6'
          />
        </button>
        <button
          className='cursor-pointer'
          onClick={() => {
            if (swiperRef.current) swiperRef.current.swiper.slideNext()
          }}
          disabled={Number(activeSlide) === 1}
        >
          <ArrowRightIcon
            color={Number(activeSlide) === 1 ? '#2F373C70' : '#2F373C'}
            className='xs:size-[17px] sm:size-6'
          />
        </button>
      </div>
    </section>
  )
})

export default ModelProductSection
