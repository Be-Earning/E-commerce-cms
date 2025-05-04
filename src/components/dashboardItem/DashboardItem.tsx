import { memo, ReactNode } from 'react'
import { IncreaseIcon } from '../icons'

type DashboardItemProps = {
  icon?: ReactNode
  title: string
  data: number | string
  textSize?: 'small' | 'medium' | 'large'
  color?: 'blue' | 'green'
  colorPercent?: 'pink' | 'green' | 'white'
  className?: string
  onClick?: () => void
}

const DashboardItem = memo(
  ({
    icon,
    title,
    data,
    textSize = 'medium',
    color = 'blue',
    colorPercent = 'green',
    className,
    onClick
  }: DashboardItemProps) => {
    return (
      <div
        className={`flex h-full w-full items-center ${className} bg-white/[.88] backdrop-blur-[80px] ${textSize === 'medium' ? 'rounded-[20px]' : 'rounded-xl'} relative min-h-[100px] shadow-popover-custom`}
      >
        {icon && (
          <div
            className={`absolute left-0 top-1/2 h-16 w-1 -translate-y-1/2 rounded-br-[2px] rounded-tr-[2px] ${color === 'blue' ? 'bg-ln-blue-to-b' : 'bg-ln-green-to-t'}`}
          />
        )}
        <div className={`w-full ${textSize === 'medium' ? 'pl-8 pr-5' : 'px-4'} flex items-center justify-between`}>
          <div className={`flex flex-col items-start ${textSize === 'medium' ? 'gap-2' : 'gap-1'}`}>
            <p
              className={`${textSize === 'medium' ? 'text-[16px]/[18px]' : 'text-[14px]/[18px]'} font-customMedium ${colorPercent === 'white' ? 'text-white/[.72]' : 'text-black-main/[.44]'}`}
            >
              {title}
            </p>
            <h3
              className={`${textSize === 'medium' ? 'font-customMedium text-[40px]/[42px]' : 'font-customSemiBold text-[28px]/[29.4px]'} ${colorPercent === 'white' ? 'text-white' : 'text-black-main'} mb-1 tracking-tight`}
            >
              {data}
            </h3>
            <div className='flex items-center gap-1'>
              <IncreaseIcon color={colorPercent} />
              <p
                className={`${textSize === 'medium' ? 'text-[16px]/[16px]' : 'text-[12px]/[12px]'} ${colorPercent === 'green' ? 'text-green-lighter' : colorPercent === 'pink' ? 'text-pink-main' : 'text-white'}`}
              >
                10% since last week
              </p>
            </div>
          </div>
          {icon && (
            <button
              onClick={onClick}
              className={`flex size-12 items-center justify-center rounded-lg ${color === 'blue' ? 'bg-ln-blue-to-b' : 'bg-ln-green-to-t'}`}
            >
              {icon}
            </button>
          )}
        </div>
      </div>
    )
  }
)

export default DashboardItem
