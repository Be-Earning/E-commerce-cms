import { memo } from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { cn } from '~/utils/classNames'

interface ButtonLoginProps {
  className?: string
  icon: string
  content: string
  onClick: (e: any) => void
}

const ButtonLogin = memo((props: ButtonLoginProps) => {
  const { className, icon, content, onClick } = props

  return (
    <div
      className={cn(
        className,
        'flex h-[84px] w-full items-center justify-between rounded-[8.4px] bg-white px-3 hover:cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className='flex items-center gap-3'>
        <img src={icon} className='h-10 w-10 object-cover' />
        <span className='text-[18pxrem]/[18.9px] font-customBold'>{content}</span>
      </div>
      <MdKeyboardArrowRight className='text-[1.5rem] text-[#31D366]' />
    </div>
  )
})

export default ButtonLogin
