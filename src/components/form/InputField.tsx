import { memo, ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '~/utils/classNames'

interface InputFieldProps {
  name: string
  label?: string
  type?: string
  rules?: Partial<Record<string, unknown>>
  defaultValue?: string
  disabled?: boolean
  showDataDisable?: boolean
  placeholder?: string
  width?: string
  gap?: string
  fullWidth?: boolean
  className?: string | null
  classNameLabel?: string | null
  helperText?: string
  required?: boolean
  rightIcon?: ReactNode
  variant?: 'outline' | 'container' | 'outline-green'
  size?: 'small' | 'medium'
  noStyle?: boolean
}

const InputField = memo(
  ({
    name,
    label = '',
    type = 'text',
    rules = {},
    defaultValue = '',
    placeholder = '',
    showDataDisable = false,
    width,
    gap,
    disabled = false,
    fullWidth = false,
    className = null,
    classNameLabel = null,
    required = false,
    helperText,
    rightIcon,
    variant = 'outline',
    size = 'medium',
    noStyle = false
  }: InputFieldProps) => {
    const { control } = useFormContext()

    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => {
          return (
            <div className={`relative flex flex-col gap-1 ${fullWidth ? 'w-full' : 'w-[300px]'} ${width ? width : ''}`}>
              <div className={`flex w-full flex-col ${gap ? gap : 'xs:gap-2 sm:gap-3'}`}>
                {label && (
                  <label
                    htmlFor={name}
                    className={`${size === 'small' ? 'text-[16px]' : 'xs:text-[18px] sm:text-[20px]/[18px]'} font-customSemiBold capitalize ${disabled && 'text-black-main/[.32]'} ${classNameLabel}`}
                  >
                    {label} {required && <span className='text-red-main'>*</span>}
                  </label>
                )}
                <div className='relative'>
                  <input
                    {...field}
                    id={name}
                    type={type}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                    value={disabled || field.value === 0 ? (showDataDisable ? field.value : '') : field.value}
                    className={
                      !noStyle
                        ? cn(
                            `shadow-sm relative w-full py-1.5 pl-5 pr-10 focus:outline-none`,
                            size === 'small' ? 'h-[48px]' : 'xs:h-11 sm:h-[52px]',
                            variant === 'outline'
                              ? `${disabled ? 'bg-black-main/[.03]' : 'bg-transparent hover:ring-black-main/[.3]'} rounded-[30px] border-[1px] border-solid border-gray-border focus:ring-[1px] focus:ring-black-main/[.3]`
                              : `${disabled ? 'bg-black-main/[.03]' : 'bg-grey-lighter'} rounded-lg focus:bg-black-main/[.05]`,
                            field.value !== '' && 'bg-white',
                            disabled && 'bg-black-main/[.05]',
                            className
                          )
                        : cn(
                            'w-full rounded-tl-md rounded-tr-md border-0 border-b-[1px] border-solid border-gray-border py-1.5',
                            className
                          )
                    }
                    onChange={(e) => {
                      let value = e.target.value.trimStart()
                      field.onChange(value)
                    }}
                  />
                  <div
                    className={`absolute top-1/2 ${noStyle ? 'right-0' : size === 'small' ? 'right-[20px]' : 'right-[20px]'} z-10 -translate-y-1/2 transform`}
                  >
                    {rightIcon}
                  </div>
                </div>
              </div>
              {helperText && (
                <div className='min-h-[18px]'>
                  <p className='ml-2 text-gray-400 xs:text-[13px] sm:text-[14px]'>{helperText}</p>
                </div>
              )}
              {fieldState.error && (
                <div className='left-0 top-full mt-1 min-h-[18px]'>
                  <p className='ml-2 text-nowrap text-red-500 xs:text-[13px] sm:text-[14px]'>
                    {fieldState.error.message}
                  </p>
                </div>
              )}
            </div>
          )
        }}
      />
    )
  }
)

export default InputField
