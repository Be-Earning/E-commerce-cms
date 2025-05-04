import React, { memo, ReactNode } from 'react'

type IconButtonProps = {
  ref?: React.LegacyRef<HTMLButtonElement>
  children: ReactNode
  title?: string
  leftTitle?: string
  color?: 'default' | 'white' | 'linear'
  variant?: 'container' | 'outline'
  size?: '28' | '32' | '36' | '40' | '44' | '48' | '50' | '52' | '54' | '56' | '60' | '64'
  shadow?: boolean
  disabled?: boolean
  className?: string
  onClick?: any
}

const IconButton = memo(
  ({
    ref,
    children,
    title,
    leftTitle,
    size = '52',
    color = 'default',
    variant = 'container',
    shadow = false,
    disabled,
    className,
    onClick
  }: IconButtonProps) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={` ${
          size === '28'
            ? `${title || leftTitle ? 'h-7 px-[16px]' : 'size-7'}`
            : size === '32'
              ? `${title || leftTitle ? 'h-8 min-h-8 px-[18px]' : 'size-8'}`
              : size === '36'
                ? `${title || leftTitle ? '!h-9 !min-h-9 !min-w-9 px-[16px]' : '!size-9 !min-h-9 !min-w-9'}`
                : size === '40'
                  ? `${title || leftTitle ? 'h-10 px-[16px]' : 'size-10'}`
                  : size === '44'
                    ? `${title || leftTitle ? 'h-11 px-[18px]' : 'size-11'}`
                    : size === '48'
                      ? `${title || leftTitle ? 'h-[48px] px-[18px]' : 'size-[48px]'}`
                      : size === '52'
                        ? `${title || leftTitle ? 'h-[52px] px-[20px]' : 'size-[52px]'}`
                        : size === '54'
                          ? `${title || leftTitle ? 'h-[54px] px-[22px]' : 'size-[54px]'}`
                          : size === '56'
                            ? `${title || leftTitle ? 'h-[56px] px-6' : 'size-[56px]'}`
                            : size === '60'
                              ? `${title || leftTitle ? 'h-[60px] px-[26px]' : 'size-[60px]'}`
                              : `${title || leftTitle ? 'h-16 px-7' : 'size-16'}`
        } ${
          disabled
            ? '!border-0 !bg-[#dcdcdc]'
            : color === 'default' && variant === 'container'
              ? 'bg-grey-main'
              : color === 'default' && variant === 'outline'
                ? 'bg-transparent'
                : color === 'linear' && variant === 'container'
                  ? 'from-greenMain bg-gradient-to-br to-blue-main'
                  : 'bg-white/[.44]'
        } ${color === 'default' && variant === 'container' ? 'hover:bg-grey-main' : 'hover:bg-white'} ${variant === 'outline' && color === 'white' ? 'border-2 border-solid border-black-main' : variant === 'outline' && color === 'default' ? 'border-2 border-solid border-black-main/[.22]' : ''} ${shadow && 'shadow-icon-button'} flex items-center ${title || leftTitle ? 'gap-2' : 'justify-center'} rounded-full backdrop-blur-2xl transition duration-300 ease-in-out hover:shadow-avatar ${className} `}
      >
        {leftTitle && (
          <p className='text-nowrap font-customRegular xs:text-[14px] xs:leading-[14.7px] sm:text-[18px] sm:leading-[18.9px]'>
            {leftTitle}
          </p>
        )}{' '}
        {children}{' '}
        {title && (
          <p className='text-nowrap font-customRegular xs:text-[14px] xs:leading-[14.7px] sm:text-[18px] sm:leading-[18.9px]'>
            {title}
          </p>
        )}
      </button>
    )
  }
)

export default IconButton
