import { memo } from 'react'
import ic_delete from '~/assets/icons/close.svg'
import ic_success from '~/assets/icons/ic_success.svg'

interface ModalSuccessProps {
  onClose: () => void
}

const ModalSuccess = memo(({ onClose }: ModalSuccessProps) => {
  return (
    <div className='fixed -left-5 -top-5 z-50 flex h-[110%] w-[114%] items-center justify-center bg-white/[.64] shadow-card-feature backdrop-blur-sm'>
      <div className='relative flex w-[90%] flex-col items-center gap-3 rounded-3xl bg-white/80 py-10'>
        <img src={ic_success} className='h-[120px] w-[120px]' />
        <span className='font-customBold text-[18px]/[22px] text-[#1E1B39]'>Success!</span>
        <span className='text-[1rem]/[1.625rem] text-[#1E1B39]/[.68]'>Create wallet successfully!</span>
        <img src={ic_delete} className='absolute right-5 top-5 h-4 w-4' onClick={onClose} />
      </div>
    </div>
  )
})

export default ModalSuccess
