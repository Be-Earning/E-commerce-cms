import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { OptionSelect } from '~/@types/common'
import { LIST_LANGUAGE_OPTIONS } from '~/@types/listOptionCommon'
import images from '~/assets'
import { SelectFilter } from '~/components/form'
import { GlobalIcon } from '~/components/icons'
import { useAppSelector } from '~/redux/configStore'

const FooterEcom = memo(() => {
  const { listCategories } = useAppSelector((s) => s.category)

  const [language, setLanguage] = useState<OptionSelect>({ value: 'en', label: 'English' })

  return (
    <footer className='mx-auto mt-[50px] w-full max-w-[1440px] xs:p-[5px] sm:p-4'>
      <div className='flex flex-col gap-6 rounded-lg bg-black-main py-8 xs:px-[15px] sm:px-6 md:px-10'>
        <Link to={''} className='flex items-center gap-3'>
          <img src={images.logo.logo_white} alt='logo-white' className='xs:size-7 sm:size-[30px]' />
          <p className='font-customSemiBold text-white xs:text-[18px] sm:text-[20px]'>Power Of Five</p>
        </Link>
        <div className='border-[1px] border-solid border-white opacity-20'></div>
        <div className='flex h-full gap-6'>
          <div className='flex flex-col justify-between xs:w-1/2 sm:w-1/3'>
            <div className='flex flex-col gap-5'>
              <p className='font-customSemiBold text-[14px] leading-[19.6px] text-white'>Product</p>

              <div className='flex flex-col gap-[6px] font-customXLight text-[14px] tracking-wider text-white/[.64]'>
                {listCategories?.slice(0, 5)?.map((category) => (
                  <Link to='' key={category.id}>
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className='flex-col gap-5 xs:flex sm:hidden'>
              <p className='font-customSemiBold text-[14px] leading-[19.6px] text-white'>Contact us</p>

              <div className='flex flex-col gap-[6px] font-customXLight text-[14px] tracking-wider text-white/[.64]'>
                <p>+1 891 989-11-91</p>
                <p>help@logoipsum.com</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-5 xs:w-1/2 sm:w-1/3'>
            <p className='font-customSemiBold text-[14px] leading-[19.6px] text-white'>Help</p>

            <div className='flex flex-col gap-[6px] font-customXLight text-[14px] tracking-wider text-white/[.64]'>
              <p>Customer Service</p>
              <p>My Account</p>
              <p>Legal & Privacy</p>
              <p>Gift Card Terms and Conditions</p>
              <p>Do not sell or share my personal data</p>
              <p>Our commitment to accessibility</p>
              <p>Report a scam</p>
              <p>Cookie notice & settings</p>
            </div>
          </div>

          <div className='flex h-[242px] w-1/3 flex-col items-end !justify-between xs:hidden sm:flex'>
            <div className='flex w-full justify-between'>
              <div className='flex flex-col gap-5'>
                <p className='font-customSemiBold text-[14px] leading-[19.6px] text-white'>Contact us</p>

                <div className='flex flex-col gap-[6px] font-customXLight text-[14px] tracking-wider text-white/[.64]'>
                  <a href='tel:+18919891191' className='text-inherit'>
                    +1 891 989-11-91
                  </a>
                  <a href='mailto:phuson2809@gmail.com' className='text-inherit'>
                    help@logoipsum.com
                  </a>
                </div>
              </div>

              <div className='flex gap-2'>
                <button className='flex size-10 items-center justify-center rounded-full bg-white/10'>
                  <img src={images.icons.instagram} alt='instagram' />
                </button>
                <button className='flex size-10 items-center justify-center rounded-full bg-white/10'>
                  <img src={images.icons.facebook} alt='facebook' />
                </button>
                <button className='flex size-10 items-center justify-center rounded-full bg-white/10'>
                  <img src={images.icons.yuoTube} alt='yuoTube' />
                </button>
              </div>
            </div>

            <div className='flex w-full items-end justify-between'>
              <SelectFilter
                isTransparent
                leftIcon={<GlobalIcon />}
                options={LIST_LANGUAGE_OPTIONS}
                selected={language}
                setSelected={setLanguage}
              />
            </div>
          </div>
        </div>
        <div className='xs:flex sm:hidden'>
          <SelectFilter
            isTransparent
            leftIcon={<GlobalIcon />}
            options={LIST_LANGUAGE_OPTIONS}
            selected={language}
            setSelected={setLanguage}
            maxHeight='max-h-40'
          />
        </div>
        <div className='items-center justify-between xs:flex sm:hidden'>
          <div className='flex gap-2'>
            <button className='flex size-10 items-center justify-center rounded-full bg-white/10'>
              <img src={images.icons.instagram} alt='instagram' />
            </button>
            <button className='flex size-10 items-center justify-center rounded-full bg-white/10'>
              <img src={images.icons.facebook} alt='facebook' />
            </button>
            <button className='flex size-10 items-center justify-center rounded-full bg-white/10'>
              <img src={images.icons.yuoTube} alt='yuoTube' />
            </button>
          </div>
        </div>

        <div className='relative flex justify-center overflow-hidden'>
          <h1
            className='text-blackMain text-nowrap text-center font-customBold uppercase xs:text-[45px] xs:leading-[68.46px] sm:text-[173px] sm:leading-[242.2px]'
            style={{ WebkitTextStroke: '2px', WebkitTextStrokeColor: '#60EC8E' }}
          >
            Power Of Five
          </h1>
          <div className='absolute bottom-0 w-full bg-gradient-to-b from-black-main/[.5] via-black-main to-black-main xs:h-[90%] sm:h-[85%]'></div>
        </div>
      </div>
    </footer>
  )
})

export default FooterEcom
