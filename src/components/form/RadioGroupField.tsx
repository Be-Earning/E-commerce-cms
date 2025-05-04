import { memo, ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface RadioGroupFieldProps {
  name: string
  gap?: string
  label?: string
  rules?: Partial<Record<string, unknown>>
  disabled?: boolean
  required?: boolean
  className?: string | null
  classNameLabel?: string | null
  helperText?: string
  defaultValue?: string
  options: { value: number | string; label: ReactNode }[]
}

const RadioGroupField = memo(
  ({
    gap,
    name,
    label,
    rules = {},
    disabled = false,
    required = false,
    className = null,
    classNameLabel = null,
    helperText,
    defaultValue = '',
    options
  }: RadioGroupFieldProps) => {
    const { control } = useFormContext()

    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => {
          return (
            <div className={`flex w-full items-start gap-1 xs:flex-col sm:flex-row`}>
              <div className={`flex flex-col ${gap ? gap : 'xs:gap-2 sm:gap-3'}`}>
                {label && (
                  <label
                    htmlFor={name}
                    className={`font-customSemiBold capitalize xs:text-[18px] sm:text-[20px]/[18px] ${disabled && 'text-black-main/[.32]'} ${classNameLabel}`}
                  >
                    {label} {required && <span className='text-red-main'>*</span>}
                  </label>
                )}
                <div className='flex w-full xs:flex-col xs:items-start xs:gap-4 sm:flex-row sm:items-center sm:gap-10 md:gap-5 lg:gap-10'>
                  {options.map((option, i) => (
                    <div key={i} className={`flex items-center gap-3 ${className}`}>
                      <input
                        {...field}
                        id={name}
                        type='radio'
                        required={required}
                        disabled={disabled}
                        value={option.value}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value)
                        }}
                        checked={field.value === option.value || +field.value === option.value}
                        className='checked:after:content-[" "] flex size-6 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-full border border-solid border-black-main transition-all duration-300 ease-linear checked:bg-transparent checked:after:size-4 checked:after:shrink-0 checked:after:rounded-full checked:after:bg-black-main hover:scale-[102%]'
                      />
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>

              {helperText && (
                <div className='h-[18px]'>
                  <p className='mt-2 text-[14px] text-gray-400'>{helperText}</p>
                </div>
              )}

              {fieldState.error && (
                <div className='min-h-[18px]'>
                  <p className='ml-2 text-red-500 xs:text-[13px] sm:text-[14px]'>{fieldState.error.message}</p>
                </div>
              )}
            </div>
          )
        }}
      />
    )
  }
)

export default RadioGroupField
