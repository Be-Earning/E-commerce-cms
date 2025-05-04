import { memo, ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  type?: 'button' | 'reset' | 'submit' | undefined
  className?: string
  classNameText?: string
  fullWidth?: boolean
  shadow?: boolean
  disabled?: boolean
  variant?:
    | 'container'
    | 'outline'
    | 'linear'
    | 'grey'
    | 'outline-white'
    | 'outline-linear'
    | 'outline-grey'
    | 'blue'
    | 'green'
    | 'red'
    | ''
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
}

const Button = memo(
  ({
    children,
    type = 'button',
    className,
    classNameText,
    fullWidth,
    shadow,
    disabled,
    variant = 'container',
    size = 'medium',
    onClick
  }: ButtonProps) => {
    return (
      <div
        className={`${fullWidth ? 'w-full' : 'w-fit'} ${variant === 'outline-linear' ? 'to-blue-main flex items-center justify-center rounded-lg bg-gradient-to-r from-greenMain p-[2px]' : 'p-0'}`}
      >
        <button
          type={type}
          disabled={disabled}
          className={` ${size === 'small' ? `${fullWidth ? 'w-full' : 'w-[120px]'} h-[40px]` : size === 'medium' ? `${fullWidth ? 'w-full' : 'w-[165px]'} h-[48px]` : `${fullWidth ? 'w-full' : 'w-[196px]'} h-[52px]`} ${
            variant === 'container'
              ? 'bg-black-main text-white'
              : variant === 'outline'
                ? 'border-black-main text-black-main border-[2px] border-solid bg-transparent'
                : variant === 'outline-white'
                  ? 'border-[2px] border-solid border-white bg-white/[.22] text-white'
                  : variant === 'linear'
                    ? disabled
                      ? '!border-none !bg-[#dcdcdd] !text-white'
                      : 'to-blue-main bg-gradient-to-tr from-greenMain'
                    : variant === 'grey'
                      ? 'bg-grey-main'
                      : variant === 'outline-grey'
                        ? 'border-black-main/[.64] text-black-main/[.64] border-[2px] border-solid bg-transparent'
                        : variant === 'blue'
                          ? 'bg-blue-main text-white'
                          : variant === 'green'
                            ? 'bg-greenMain text-white'
                            : variant === 'red'
                              ? 'bg-red-main text-white'
                              : 'bg-white'
          } ${variant === 'outline-linear' && 'rounded-md'} ${(variant === 'blue' || variant === 'green') && 'rounded-xl'} ${disabled ? '!border-none !bg-[#dcdcdd] !text-white' : ''} rounded-3xl text-[20px] ${shadow ? 'shadow-button' : ''} ${className} ${!disabled && variant !== 'outline-linear' && 'hover:shadow-avatar'} transition-all duration-200 ease-in-out ${variant === 'outline-linear' && 'hover:bg-white/[.95]'} `}
          onClick={onClick}
        >
          <p
            className={`mb-[1px] text-nowrap font-customSemiBold uppercase leading-none ${variant === 'outline-linear' && 'to-blue-main bg-gradient-to-r from-greenMain bg-clip-text text-transparent'} ${classNameText}`}
          >
            {children}
          </p>
        </button>
      </div>
    )
  }
)

export default Button
