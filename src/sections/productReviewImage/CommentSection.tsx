import { FC, memo } from 'react'
import { ICommentProductDetail } from '~/@types/models'
import { SPLIT_KEY } from '~/constants/splitKey'
import useResponsive from '~/hooks/useResponsive'

interface CommentSection {
  image: string
  comments: ICommentProductDetail[]
}

const CommentSection: FC<CommentSection> = memo(({ image, comments }) => {
  const smDown = useResponsive('down', 'sm', 'sm')

  return (
    <section className='relative px-4 xs:mt-[50px] sm:mt-[150px]'>
      <h1 className='absolute top-[1.5%] z-50 w-[422px] font-customBold capitalize xs:left-4 xs:text-[32px] xs:leading-[40px] sm:left-[11%] sm:text-[56px] sm:leading-[72px]'>
        the press comment on products
      </h1>

      <div className='z-0 flex w-full flex-col items-center pb-[30px] xs:pt-[120px] sm:pt-[100px]'>
        <div className='relative border border-solid'>
          <svg width={smDown ? '85%' : '596'} height='673' viewBox='0 0 596 673' fill='none'>
            <defs>
              <mask id='mask0_19_100' x='0' y='0' width={596} height={673}>
                <rect x='198' y='183' width='379' height='259' rx='12' fill='#D9D9D9' />
                <rect x='430' y='454' width='166' height='219' rx='12' fill='#D9D9D9' />
                <rect y='673' width='219' height='418' rx='12' transform='rotate(-90 0 673)' fill='#D9D9D9' />
                <rect x='198' width='285' height='171' rx='12' fill='#D9D9D9' />
                <rect x='30' y='109' width='157' height='210' rx='12' fill='#D9D9D9' />
                <rect x='57' y='331' width='129' height='111' rx='12' fill='#D9D9D9' />
              </mask>
            </defs>

            <g mask='url(#mask0_19_100)'>
              <rect x='0' y='0' width='690' height='690' fill='#ECF2F3' />
              {image && (
                <image
                  id='image0_19_100'
                  x={0}
                  y={0}
                  width='596'
                  height='673'
                  href={image}
                  preserveAspectRatio='xMidYMid slice'
                />
              )}
            </g>
          </svg>
          <div className='absolute -left-3 -top-3 flex size-6 shrink-0 items-center justify-center rounded-full bg-black-main text-[14px] text-white'>
            1
          </div>
        </div>
      </div>

      <div className='absolute flex flex-col xs:bottom-0 xs:right-4 xs:w-[291px] xs:items-end xs:gap-3 sm:top-[39%] sm:w-[366px] sm:items-start sm:gap-6'>
        <p className='font-customSemiBold xs:text-[18px] xs:leading-[10.4px] sm:text-[24px] sm:leading-[32px]'>
          {comments?.[0]?.name.split(SPLIT_KEY.COMMENT)[0]} - {comments?.[0]?.name.split(SPLIT_KEY.COMMENT)[1]}
        </p>
        <p className='text-blackMain/[.64] xs:text-right xs:text-[16px] sm:text-left sm:text-[20px]'>
          "{comments?.[0]?.message}." <span className='cursor-pointer text-[#31D366] underline'>See more</span>
        </p>
      </div>

      <div className='absolute right-0 top-[18%] w-[356px] flex-col gap-6 xs:hidden sm:flex'>
        <p className='font-customSemiBold text-[24px] leading-[32px]'>
          {comments?.[1]?.name.split(SPLIT_KEY.COMMENT)[0]} - {comments?.[1]?.name.split(SPLIT_KEY.COMMENT)[1]}
        </p>
        <p className='text-blackMain/[.64] xs:text-[16px] sm:text-[20px]'>
          "{comments?.[1]?.message}." <br />
          <span className='cursor-pointer text-[#31D366] underline'>See more</span>
        </p>
      </div>

      <div className='left-4 top-[14%] flex items-start justify-between xs:absolute sm:relative'>
        <div className='ml-[7.5%] mt-[20px] w-[453px] flex-col gap-6 xs:hidden sm:flex'>
          <p className='font-customSemiBold leading-[32px] xs:text-[18px] sm:text-[24px]'>
            {comments?.[2]?.name.split(SPLIT_KEY.COMMENT)[0]} - {comments?.[2]?.name.split(SPLIT_KEY.COMMENT)[1]}
          </p>
          <p className='text-blackMain/[.64] xs:text-[16px] sm:text-[20px]'>
            "{comments?.[2]?.message}." <span className='cursor-pointer text-[#31D366] underline'>See more</span>
          </p>
        </div>
        <div className='mr-[2%] flex flex-col xs:w-[277px] xs:gap-3 sm:w-[528px] sm:gap-6'>
          <p className='font-customSemiBold xs:text-[18px] xs:leading-[10.4px] sm:text-[24px] sm:leading-[32px]'>
            {comments?.[3]?.name.split(SPLIT_KEY.COMMENT)[0]} - {comments?.[3]?.name.split(SPLIT_KEY.COMMENT)[1]}
          </p>
          <p className='text-blackMain/[.64] xs:text-[16px] sm:text-[20px]'>
            " {comments?.[3]?.message}." <br />
            <span className='cursor-pointer text-[#31D366] underline'>See more</span>
          </p>
        </div>
      </div>

      <img
        src={'https://img.fi.ai/ecommerce/assets/images/arrow-radius-left.png'}
        alt='arrow-radius-left'
        className='absolute left-[20%] top-[30%] xs:hidden sm:flex'
      />
      <img
        src={'https://img.fi.ai/ecommerce/assets/images/arrow-radius-left-large.png'}
        className='absolute bottom-[20%] left-[15%] h-[125] w-[163.5px] xs:hidden sm:flex'
      />
      <img
        src={'https://img.fi.ai/ecommerce/assets/images/arrow-radius-right.png'}
        alt='arrow-radius-left'
        className='absolute h-[125] w-[163.5px] xs:bottom-[19%] xs:right-[-5%] xs:rotate-[75deg] xs:scale-[.55] sm:right-[22%] sm:top-[12%] sm:rotate-0 sm:scale-100'
      />
      <img
        src={'https://img.fi.ai/ecommerce/assets/images/arrow-radius-right-large.png'}
        alt='arrow-radius-left'
        className='absolute h-[125] w-[163.5px] xs:right-[55%] xs:top-[32%] xs:rotate-[220deg] xs:scale-[.46] sm:bottom-[20%] sm:right-[15%] sm:rotate-0 sm:scale-100'
      />
    </section>
  )
})

export default CommentSection
