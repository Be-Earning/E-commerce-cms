import { memo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '~/utils/classNames'

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label?: string
  rows?: number
  rules?: Partial<Record<string, unknown>>
  defaultValue?: string
  disabled?: boolean
  placeholder?: string
  width?: string
  fullWidth?: boolean
  className?: string
  helperText?: string
  classNameLabel?: string
  required?: boolean
  variant?: 'outline' | 'container'
}

const TextareaField = memo(
  ({
    name,
    label = '',
    rows = 4,
    rules = {},
    defaultValue = '',
    placeholder = '',
    width,
    disabled = false,
    fullWidth = false,
    className,
    required = false,
    variant = 'outline',
    helperText,
    classNameLabel,
    ...props
  }: TextareaFieldProps) => {
    const { control } = useFormContext()

    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => (
          <div className={`relative flex flex-col gap-1 ${fullWidth ? 'w-full' : 'w-[350px]'} ${width ? width : ''}`}>
            <div className='flex flex-col xs:gap-2 sm:gap-3'>
              {label && (
                <label
                  htmlFor={name}
                  className={cn(
                    'font-customSemiBold capitalize leading-none xs:text-[18px] sm:text-[20px]',
                    { 'text-black-main/[.32]': disabled },
                    classNameLabel
                  )}
                >
                  {label} {required && <span className='text-red-main'>*</span>}
                </label>
              )}
              <textarea
                {...field}
                {...props}
                id={name}
                rows={rows}
                required={required}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                  `scroll-bar-small w-full bg-transparent px-5 py-2 transition-colors duration-300 ease-in-out`,
                  {
                    'bg-black-main/[.03]': disabled,
                    'rounded-[16px] border-[1px] border-solid border-gray-border focus:ring-[1px] focus:ring-black-main/[.30]':
                      variant === 'outline' && !disabled,
                    'bg-grey-lighter rounded-lg hover:bg-black-main/[.05] focus:bg-black-main/[.05]':
                      variant !== 'outline' && !disabled
                  },
                  className
                )}
                onChange={(e) => {
                  const value = e.target.value.trimStart()
                  field.onChange(value)
                }}
              />
            </div>
            {helperText && (
              <div className='min-h-[18px]'>
                <p className='ml-2 text-gray-400 xs:text-[13px] sm:text-[14px]'>{helperText}</p>
              </div>
            )}
            {fieldState.error && (
              <div className='absolute left-0 top-full mt-1 min-h-[18px]'>
                <p className='ml-2 text-red-500 xs:text-[13px] sm:text-[14px]'>{fieldState.error.message}</p>
              </div>
            )}
          </div>
        )}
      />
    )
  }
)

export default TextareaField
