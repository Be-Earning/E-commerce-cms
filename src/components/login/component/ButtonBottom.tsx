import { memo } from 'react'
import ic_back from '~/assets/icons/arrow-left.svg'
import { cn } from '~/utils/classNames'

interface ButtonBottom {
  title: string
  className?: string
  onBack: () => void
  onNext: () => void
}

const ButtonBottom = memo(({ title, className, onBack, onNext }: ButtonBottom) => {
  return (
    <div className={cn('flex w-full gap-3', className)}>
      <button
        className='flex h-12 w-12 items-center justify-center rounded-full border border-solid border-[#00000038] hover:cursor-pointer'
        onClick={onBack}
      >
        <img src={ic_back} className='h-6 w-6' />
      </button>
      <button
        className='flex grow items-center justify-center rounded-[26px] bg-[#0D0D0D] text-[1.125rem] uppercase text-white hover:cursor-pointer'
        onClick={onNext}
      >
        {title}
      </button>
    </div>
  )
})

export default ButtonBottom
