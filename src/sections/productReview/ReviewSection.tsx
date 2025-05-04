import { memo, useCallback, useMemo, useRef, useState } from 'react'
import Slider from 'react-slick'
import images from '~/assets'
import { ReviewCard } from '~/components/reviewCard'
import { SliderPagination } from '~/components/sliderPagination'
import { useAppSelector } from '~/redux/configStore'

const ReviewSection = memo(() => {
  const { reviews } = useAppSelector((s) => s.product)

  const sliderRef = useRef<Slider>(null)
  const [activeSlide, setActiveSlide] = useState<number>(0)

  const handleGoToSlide = useCallback((index: number) => sliderRef.current?.slickGoTo(index), [sliderRef])

  const generateRandomRatings = () => {
    const ratingDistribution = {
      1: Math.floor(reviews.length * 0.1),
      2: Math.floor(reviews.length * 0.2),
      3: Math.floor(reviews.length * 0.3),
      4: Math.floor(reviews.length * 0.2),
      5: Math.floor(reviews.length * 0.2)
    }

    const allRatings = Object.entries(ratingDistribution).flatMap(([rating, count]) =>
      Array(count).fill(parseInt(rating))
    )

    for (let i = allRatings.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      // Swap elements
      ;[allRatings[i], allRatings[j]] = [allRatings[j], allRatings[i]]
    }

    return reviews.map((review, index) => ({
      ...review,
      rateValue: allRatings[index] || 1
    }))
  }

  const randomRatings = generateRandomRatings()
  const totalRating = useMemo(() => randomRatings.length, [randomRatings])

  const listRatings = useMemo(() => {
    const calculateRating = (value: number) => {
      const filteredRatings = randomRatings.filter((rating) => rating.rateValue === value)
      return {
        title: value,
        percent: (filteredRatings.length * 100) / totalRating,
        totalRatings: filteredRatings.length
      }
    }

    return [1, 2, 3, 4, 5].map(calculateRating)
  }, [randomRatings, totalRating])

  return (
    <section className='relative xs:py-[20px] sm:py-[50px]'>
      <div className='relative flex items-start justify-between xs:flex-col xs:px-4 sm:flex-row sm:px-20 sm:pr-28'>
        <div className='w-fit'>
          <h1 className='font-customBold capitalize xs:mb-5 xs:text-[32px] xs:leading-[40px] sm:mb-5 sm:text-[56px] sm:leading-[72px]'>
            Why do we look good <br /> from others?
          </h1>
          <p className='text-[20px] leading-[32px] text-black-main/[.64] xs:mb-5 sm:mb-0'>
            Read testimonials what they say about our product
          </p>
        </div>

        <div
          className={`py-8 shadow-5xl xs:min-h-[318px] xs:w-full xs:rounded-[17.39px] xs:px-[22px] sm:min-h-[316px] sm:w-[494px] sm:rounded-[24px] sm:px-[44.5px]`}
        >
          <div className='flex h-full items-center justify-between'>
            {listRatings?.map((rating, index) => (
              <div key={index} className='flex h-full flex-col items-center justify-between gap-3'>
                <p className='xs:text[14px] sm:text[20px] xs:leading-[19.6px] sm:leading-7'>{rating.totalRatings}</p>
                <div className='flex w-3 min-w-3 rounded-[2px] bg-gray-main xs:h-[200px] sm:h-[180px]'>
                  <div
                    className={`mt-auto w-full rounded-[2px] bg-gradient-to-b from-blue-main to-green-main opacity-100`}
                    style={{ height: `${rating.percent}%` }}
                  ></div>
                </div>
                <div className='flex items-center gap-[2px]'>
                  <p className='xs:text[14px] sm:text[20px] mt-[1px] xs:leading-[19.6px] sm:leading-7'>
                    {rating.title}
                  </p>
                  <img src={images.icons.star} alt='icon-star' className='xs:size-[14.32px] sm:size-5' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='absolute bottom-0 left-20 xs:hidden sm:flex'>
          <SliderPagination
            gap='gap-3'
            className='!size-[10px]'
            activeIndex={activeSlide}
            slideToGo={handleGoToSlide}
            slideCount={reviews.length}
          />
        </div>
      </div>

      {/* List review */}
      <div className='list-review w-[128%] xs:mt-[80px] xs:pl-4 sm:mt-[50px] sm:pl-20'>
        <Slider
          ref={sliderRef}
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
                slidesToScroll: 1
              }
            }
          ]}
          afterChange={(current) => setActiveSlide(current)}
        >
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </Slider>
      </div>
      <div className='mt-5 items-center justify-start gap-4 pl-4 xs:flex sm:hidden'>
        <button className='cursor-pointer' onClick={() => sliderRef.current?.slickPrev()}>
          <img src={images.icons.arrow_left} alt='arrow-left' className='size-6' />
        </button>
        <div className='xs:flex sm:hidden'>
          <SliderPagination
            gap='gap-3'
            className='!size-[6px]'
            activeIndex={activeSlide}
            slideToGo={handleGoToSlide}
            slideCount={reviews.length}
          />
        </div>
        <button className='cursor-pointer' onClick={() => sliderRef.current?.slickNext()}>
          <img src={images.icons.arrow_right} alt='arrow-right' className='size-6' />
        </button>
      </div>

      <div className='right-0 top-[60%] ml-[68%] mt-5 xs:absolute xs:scale-50 sm:relative sm:scale-100'>
        <svg width='120' height='120' viewBox='0 0 120 120' fill='none'>
          <g clipPath='url(#clip0_11_135)'>
            <path
              d='M120 60L120 8.5714L68.5713 8.5714L68.5713 60.0001L102.857 60C102.857 78.9048 87.4761 94.2857 68.5714 94.2857L68.5714 111.429C96.9308 111.429 120 88.3595 120 60ZM2.75202e-05 94.2857L3.05176e-05 111.429C28.3595 111.429 51.4287 88.3595 51.4287 60.0001L51.4287 8.57141L1.25334e-05 8.57142L2.15255e-05 60.0001L34.2857 60.0001C34.2857 78.9048 18.9048 94.2857 2.75202e-05 94.2857Z'
              fill='url(#paint0_linear_11_135)'
            />
          </g>
          <defs>
            <linearGradient
              id='paint0_linear_11_135'
              x1='108'
              y1='109.286'
              x2='44.0174'
              y2='-15.6798'
              gradientUnits='userSpaceOnUse'
            >
              <stop stopColor='#F2F3F5' />
              <stop offset='1' stopColor='#F6F6F7' />
            </linearGradient>
            <clipPath id='clip0_11_135'>
              <rect width='120' height='120' fill='white' transform='translate(120 120) rotate(180)' />
            </clipPath>
          </defs>
        </svg>
      </div>
    </section>
  )
})

export default ReviewSection
