import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { memo, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { OptionSelect } from '~/@types/common'
import images from '~/assets'
import { cn } from '~/utils/classNames'

interface SelectFieldProps {
  name: string
  index: number
  label?: string
  options: OptionSelect[]
  disabled?: boolean
  className?: string | null
  classNameLabel?: string | null
  required?: boolean
  value?: OptionSelect
  size?: 'small' | 'medium'
  model?: 'color' | 'size'
}

const SelectField = memo(
  ({
    name,
    index,
    label,
    options = [],
    disabled = false,
    required = false,
    className = null,
    classNameLabel = null,
    size = 'medium',
    model = 'color'
  }: SelectFieldProps) => {
    const { control, watch } = useFormContext()

    const colorSize = watch('colorSize')

    const defaultValue = model === 'color' ? { value: '#000000', label: 'B' } : { value: 'S', label: 'S' }

    const [selected, setSelected] = useState<OptionSelect>(defaultValue)

    useEffect(() => {
      const optionSlected = options.find(
        (o) => o.value === (model === 'color' ? colorSize[index].color : colorSize[index].size)
      ) as OptionSelect
      if (optionSlected) {
        setSelected(optionSlected)
      }
    }, [control, colorSize, options, index])

    return (
      <Controller
        name={name}
        control={control}
        defaultValue={''}
        render={({ field, fieldState }) => {
          return (
            <div className={`flex w-[80px] flex-col gap-1 ${className}`}>
              <div className='flex flex-col xs:gap-2 sm:gap-3'>
                {label && (
                  <label
                    htmlFor={name}
                    className={`${size === 'small' ? 'text-[16px]' : 'xs:text-[18px] sm:text-[20px]/[18px]'} font-customSemiBold capitalize ${disabled && 'text-black-main/[.32]'} ${classNameLabel}`}
                  >
                    {label} {required && <span className='text-red-main'>*</span>}
                  </label>
                )}

                <Combobox
                  value={selected}
                  onChange={(value) => {
                    if (value) {
                      setSelected(value)
                      field.onChange(value?.value)
                    }
                  }}
                >
                  <div className='relative'>
                    <ComboboxInput disabled={true} className='h-[52px] w-20 bg-transparent' />
                    <ComboboxButton disabled={disabled} className='absolute inset-0 h-[52px] w-20 bg-transparent'>
                      <div className='flex h-full w-full items-center gap-2 rounded-[14px] border border-solid border-gray-border pl-3'>
                        <div
                          id='colorDiv'
                          className={cn(
                            selected.label === 'W' && 'shadow-avatar',
                            'flex size-8 shrink-0 items-center justify-center rounded-full font-customSemiBold text-[18px]/[18px]'
                          )}
                          style={{
                            fontSize:
                              selected.value === 'XXS' || selected.value === 'XXL' || selected.value === '3XL'
                                ? '14px'
                                : '18px',
                            backgroundColor: model === 'color' ? selected.value : '#000000',
                            color:
                              model === 'color'
                                ? selected.label === 'W' || selected.label === 'Y'
                                  ? '#000'
                                  : '#fff'
                                : '#fff',
                            transition: 'color 300ms ease-in-out'
                          }}
                        >
                          {selected.label}
                        </div>
                        <img src={images.icons.chevron_bot} alt='icon-arrow' className='size-6' />
                      </div>
                    </ComboboxButton>
                  </div>
                  {options?.length > 0 && (
                    <ComboboxOptions
                      anchor='bottom'
                      className={cn(
                        'shadow-lg scroll-bar-small flex w-20 flex-col items-center gap-3 rounded-xl bg-white py-5 shadow-popover-custom transition duration-200 ease-in-out focus:outline-none'
                      )}
                    >
                      {options.map((option) => (
                        <ComboboxOption
                          id='colorDiv'
                          key={option.value}
                          value={option}
                          className={cn(
                            'size-10 rounded-full',
                            selected.value === option.value && 'border-[2px] border-solid border-[#007AFF] p-[2px]'
                          )}
                        >
                          <div
                            className={cn(
                              model === 'color' && 'shadow-avatar',
                              selected.value === option.value ? 'size-8' : 'size-10',
                              'flex shrink-0 cursor-pointer items-center justify-center rounded-full font-customSemiBold text-[16px] transition duration-200 ease-in-out hover:scale-105'
                            )}
                            style={{
                              fontSize: model === 'color' ? '18px' : '16px',
                              background:
                                model === 'color'
                                  ? option.value
                                  : selected.value === option.value
                                    ? '#000000'
                                    : '#D1D1D6',
                              color:
                                model === 'color'
                                  ? option.label === 'W' || option.label === 'Y'
                                    ? '#000'
                                    : '#fff'
                                  : selected.value === option.value
                                    ? '#fff'
                                    : '#000'
                            }}
                          >
                            {option.label}
                          </div>
                        </ComboboxOption>
                      ))}
                    </ComboboxOptions>
                  )}
                </Combobox>
              </div>

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

export default SelectField
