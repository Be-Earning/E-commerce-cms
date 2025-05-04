import { Transition } from '@headlessui/react'
import Lottie from 'lottie-react'
import { memo } from 'react'
import AnimationDot from '~/constants/animation/AnimationDot.json'
import { Logo } from '../logo'
import OceanEffect from './OceanEffect'

const LoadingMain = memo(({ isOpen, percent }: { isOpen: boolean; percent: string }) => {
  return (
    <Transition
      enter='ease-out duration-300'
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave='ease-in duration-200'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
      show={isOpen}
    >
      <div className='absolute bottom-0 left-0 right-0 top-0 z-50 overflow-hidden'>
        <div className='relative'>
          <div className='absolute bottom-0 left-0 right-0 top-0 z-10'>
            <OceanEffect />
          </div>

          <div className='absolute left-1/2 top-[18vh] z-20 flex -translate-x-1/2 transform flex-col items-center gap-5'>
            <Logo isChangeColor={false} />
            <div className='flex items-end'>
              <h1 className='font-customSemiBold text-[48px] leading-[50.4px] text-white'>Loading</h1>
              <Lottie animationData={AnimationDot} className='-mb-1 w-[50px]' />
            </div>
            <h5 className='font-customMedium text-[24px] capitalize leading-[26px] text-white/[.9]'>
              {percent ? percent : 'checking information'}
            </h5>
          </div>
        </div>
      </div>
    </Transition>
  )
})

export default LoadingMain
