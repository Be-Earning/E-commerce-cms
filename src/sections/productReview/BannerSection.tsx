import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { IProductCreate } from '~/@types/models'
import images from '~/assets'
import { Button } from '~/components/button'
import { IconButton } from '~/components/iconButton'
import { ShoppingBagIcon } from '~/components/icons'
import { ProductCardBanner } from '~/components/productCardBanner'
import { SliderPagination } from '~/components/sliderPagination'
import useResponsive from '~/hooks/useResponsive'
import { formatDate, formatLocaleString } from '~/utils/format'
import { getUniqueColors } from '~/utils/pallet'

type BannerSectionProps = {
  product: IProductCreate
  purchases: number
  trend: number
}

const BannerSection = memo(({ purchases, trend, product }: BannerSectionProps) => {
  const swiperRef = useRef<any>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const { pathname } = useLocation()

  const listImages = useMemo(
    () => product?.params?.images.slice(1) || product?.params?.images || [],
    [product?.params?.images]
  )

  const smDown = useResponsive('down', 'sm', 'sm')

  const uniqueColors = getUniqueColors(product)

  const [activeSlide, setActiveSlide] = useState<number>(0)
  const [showColors, setShowColors] = useState<boolean>(false)
  const [colorSelect, setColorSelect] = useState<string>(uniqueColors?.[0])

  useEffect(() => window.scrollTo(0, 0), [pathname])

  const handleGoToSlide = useCallback(
    (index: number) => {
      const activeIndex = index === 3 ? 0 : index === 4 ? 1 : index === 5 ? 2 : index
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideToLoop(activeIndex === 0 ? 3 : activeIndex)
      }
      setActiveSlide(activeIndex)
    },
    [swiperRef]
  )

  const handleSlideChange = useCallback(() => {
    if (swiperRef.current && swiperRef.current.swiper) setActiveSlide(swiperRef.current.swiper.realIndex)
  }, [swiperRef])

  console.log('product---', product)

  return (
    <>
      <section className='relative overflow-hidden border-b-[3px] border-solid border-[#FFFFFF52] bg-ln-gray xs:h-[844px] sm:h-[810px]'>
        <h1 className='text-white/-[.68] absolute left-1/2 -translate-x-1/2 transform font-customBold text-white xs:top-[280px] xs:text-[120px] sm:top-[260px] sm:text-[160px] md:top-[240px] md:text-[200px] lg:top-[260px] lg:text-[240px]/[252px]'>
          WONDERFUL
        </h1>

        <div className='relative xs:mt-[180px] sm:mt-10'>
          <Swiper
            ref={swiperRef}
            loop
            grabCursor
            slidesPerView={1}
            initialSlide={0}
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current ? prevRef.current : undefined,
              nextEl: nextRef.current ? nextRef.current : undefined
            }}
            onSlideChange={handleSlideChange}
          >
            {listImages?.map((img, index: number) => (
              <SwiperSlide key={`${img}-${index}`}>
                <img
                  src={img}
                  alt='product-banner'
                  className='mx-auto object-cover xs:h-[438px] xs:w-[380px] sm:h-[550px] md:h-[600px] lg:h-[700px]'
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className='absolute z-20 flex items-center gap-3 bg-white/[.44] shadow-4xl backdrop-blur-2xl xs:left-1 xs:top-[240px] xs:h-[44px] xs:w-fit xs:rounded-lg xs:px-3 sm:left-[190px] sm:top-[154px] sm:h-[88px] sm:min-w-[377px] sm:rounded-3xl sm:p-5'>
          <div className='flex xs:-space-x-[10px] sm:-space-x-[18px]'>
            {Array.from({ length: smDown ? 3 : 5 }).map((_, index: number) => (
              <img
                key={index}
                className='inline-block rounded-full border-[2px] border-solid border-white shadow-avatar ring-white xs:size-7 sm:size-12'
                src='https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
                alt='Image Description'
              />
            ))}
          </div>
          <p className='font-customBold capitalize leading-[18.9px] xs:text-[12px] sm:text-[18px]'>
            +{formatLocaleString(trend)} purchasing
          </p>
        </div>

        <div className='absolute z-50 mb-10 xs:right-4 xs:top-[10%] sm:right-[110px] sm:top-[135px]'>
          <p className='font-customBold xs:mb-1 xs:text-[48px] xs:leading-[50.4px] sm:mb-3 sm:text-[72px] sm:leading-[75.6px]'>
            {formatLocaleString(purchases)}+
          </p>
          <p className='text-blackMain/[.68] font-customMedium capitalize leading-[21px] xs:text-[13.67px] sm:text-[20px]'>
            purchases in your country
          </p>
        </div>

        <div className='absolute z-50 flex flex-col xs:bottom-20 xs:left-[5%] xs:gap-3 sm:bottom-[37px] sm:left-[116px] sm:gap-6'>
          {uniqueColors.length > 0 && (
            <div
              className={`flex items-center overflow-hidden rounded-[31px] bg-white/[.44] shadow-4xl backdrop-blur-[38.71px] transition-all duration-1000 ease-in-out ${
                showColors ? 'xs:w-fit sm:w-fit' : 'shrink-0 xs:w-[48px] sm:w-[60px]'
              } xs:h-[48px] xs:px-[13px] sm:h-[60px] sm:px-[18px]`}
            >
              <div className={`flex items-center ${showColors ? 'xs:gap-[8px] sm:gap-[10px]' : 'gap-[20px]'}`}>
                {uniqueColors.map((color, index) => (
                  <div
                    key={`${color}+${index}`}
                    onClick={() => (showColors ? setColorSelect(color) : setShowColors(true))}
                    className={`flex cursor-pointer items-center justify-center transition-all duration-300 ease-in-out ${
                      showColors && color === colorSelect
                        ? 'border-blackMain rounded-full border-[2px] border-solid p-1'
                        : 'p-0'
                    }`}
                  >
                    <svg
                      width={smDown ? '20' : '24'}
                      height={smDown ? '20' : '24'}
                      viewBox={`0 0 ${smDown ? '20 20' : '25 25'}`}
                      fill='none'
                    >
                      <circle
                        cx={smDown ? '9.9999' : '12'}
                        cy={smDown ? '9.9999' : '12'}
                        r={smDown ? '9.6' : '12'}
                        fill={`${color}`}
                      />
                    </svg>
                  </div>
                ))}
                {showColors && (
                  <div
                    onClick={() => setShowColors(!showColors)}
                    className='ml-[10px] transition-all duration-300 ease-in-out'
                  >
                    <img src={images.icons.exit} alt='icon-exit' className='cursor-pointer' />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className='flex items-center gap-4'>
            <Button className='rounded-[27px] xs:h-[48px] xs:w-[173px] sm:h-[54px] sm:w-[200px]'>BUY NOW</Button>
            <button
              className={`flex shrink-0 items-center justify-center rounded-full bg-black-main p-[2px] transition-colors duration-300 ease-in-out xs:size-[48px] sm:size-[54px]`}
            >
              <div className='flex size-full shrink-0 items-center justify-center rounded-full bg-[#f5f5f6]'>
                <ShoppingBagIcon
                  color={'#0D0D0D'}
                  className='transition-colors duration-150 ease-in-out xs:size-5 sm:size-6'
                />
              </div>
            </button>
          </div>

          <div className='flex items-center gap-3'>
            <p className='text-blackMain/[.64] font-customRegular xs:text-[10.24px] sm:text-[16px]/[16.8px]'>
              Remain:{' '}
              <span className='text-blackMain font-customMedium'>
                {formatDate(+product.params.expiryTime, 'h:mm:ss')}
              </span>
            </p>
            <svg width='6' height='6' viewBox='0 0 6 6' fill='none'>
              <circle opacity='0.44' cx='3' cy='3' r='3' fill='#0D0D0D' />
            </svg>
            <p className='text-blackMain/[.64] font-customRegular xs:text-[10.24px] sm:text-[16px]/[16.8px]'>
              Left:{' '}
              <span className='text-blackMain font-customMedium'>
                {product._variants.reduce(
                  (total: number, currentProduct) => total + currentProduct.priceOptions.quantity,
                  0
                )}{' '}
                items
              </span>
            </p>
          </div>
        </div>

        <div className='absolute flex items-center gap-4 xs:bottom-6 xs:right-[4%] sm:bottom-[35px] sm:right-[118px]'>
          <p className='text-blackMain/[.44] font-customMedium xs:text-[16px] sm:text-[18px]/[18.9px]'>
            Discover our product
          </p>
          <Link to={product.params.videoUrl}>
            <IconButton size={smDown ? '28' : '32'} color='white' shadow>
              <img src={images.icons.play} alt='icon-play' className='xs:size-[8.5px] sm:size-[10px]' />
            </IconButton>
          </Link>
        </div>

        <div className='absolute z-50 xs:bottom-[250px] xs:right-4 sm:bottom-[118px] sm:right-[177px]'>
          <ProductCardBanner product={product} />
        </div>

        {product && product?.params?.images?.length > 1 && (
          <div className='absolute z-10 flex -translate-x-1/2 transform items-center justify-center xs:bottom-7 xs:left-[15%] xs:gap-2 sm:bottom-6 sm:left-1/2 sm:gap-3'>
            <button className='cursor-pointer' ref={prevRef} onClick={() => swiperRef.current?.swiper.slidePrev()}>
              <img src={images.icons.arrow_left} alt='arrow-left' className='xs:size-6 sm:size-8' />
            </button>
            <SliderPagination
              gap='gap-3'
              className='xs:!size-[8px] sm:!size-[10px]'
              activeIndex={activeSlide}
              slideToGo={handleGoToSlide}
              slideCount={listImages?.length as number}
            />
            <button className='cursor-pointer' ref={nextRef} onClick={() => swiperRef.current?.swiper.slideNext()}>
              <img src={images.icons.arrow_right} alt='arrow-right' className='xs:size-6 sm:size-8' />
            </button>
          </div>
        )}
      </section>
    </>
  )
})

export default BannerSection
