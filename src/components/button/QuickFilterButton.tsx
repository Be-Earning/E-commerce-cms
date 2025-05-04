import { FC, memo, useCallback } from 'react'
import { cn } from '~/utils/classNames'
import { ConverStatusToString } from '~/utils/covertStatus'

interface IQuickFilterButton {
  status: string
  active?: boolean
  isOrderStatus?: boolean
  className?: string
  totalCount: number
  onClick?: () => void
}

const QuickFilterButton: FC<IQuickFilterButton> = memo(
  ({ active, isOrderStatus, totalCount, status, className, onClick }) => {
    const renderBGIcon = useCallback(() => {
      let bgIcon = ''
      switch (status) {
        case '0':
          bgIcon = 'bg-blue-main'
          break
        case '1':
          bgIcon = 'bg-yellow-main'
          break
        case '2':
          bgIcon = 'bg-green-light'
          break
        case '3':
          bgIcon = 'bg-red-main'
          break
        case '4':
          bgIcon = 'bg-purple-main'
          break
        default:
          break
      }
      return bgIcon
    }, [status])

    return (
      <div
        onClick={() => onClick && onClick()}
        className={cn(
          `relative flex h-11 w-fit cursor-pointer items-center justify-between gap-5 rounded-sm bg-white pl-4 pr-3 shadow-button transition-all duration-300 ease-in-out after:absolute after:bottom-[0px] after:left-0 after:h-[3px] after:rounded-bl-[16px] after:rounded-br-[16px] after:bg-gradient-to-r after:from-[#31D366] after:via-blue-500 after:to-[#5495FC] after:transition-all after:duration-300 hover:border-none hover:after:w-full xs:border xs:border-solid xs:border-gray-dark`,
          active ? 'border-none after:w-full' : 'border-none after:w-0',
          className
        )}
      >
        <div className='flex items-center gap-2'>
          {isOrderStatus && <span className={cn('size-2 shrink-0 rounded-full', renderBGIcon())} />}
          <span className='text-nowrap font-customMedium capitalize rp-md-text'>
            {ConverStatusToString(Number(status))}
          </span>
        </div>
        <span className='flex h-[22.1px] min-w-[49px] shrink-0 justify-center rounded-[2px] bg-[#F8F8F9] px-[5px] text-center font-customSemiBold text-[16px]/[20px]'>
          {totalCount}
        </span>
      </div>
    )
  }
)

export default QuickFilterButton
