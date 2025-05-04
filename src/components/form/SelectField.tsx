import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { memo, useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { OptionSelect } from '~/@types/common'
import images from '~/assets'
import { capitalizeFirstLetter, isObject } from '~/utils/convert'
import { CheckIcon } from '../icons'
import { cn } from '~/utils/classNames'

interface SelectFieldProps {
  name: string
  label?: string
  rules?: Record<string, unknown>
  options: OptionSelect[]
  width?: string
  disabled?: boolean
  fullWidth?: boolean
  className?: string | null
  classNameLabel?: string | null
  required?: boolean
  helperText?: string
  placeholder?: string
  value?: OptionSelect
  variant?: 'outline' | 'container'
  size?: 'small' | 'medium'
  showInput?: boolean
  changeCategory?: (value: string) => void
}

const SelectField = memo(
  ({
    name,
    label,
    width,
    value,
    helperText,
    placeholder,
    rules = {},
    options = [],
    disabled = false,
    fullWidth = false,
    required = false,
    className = null,
    classNameLabel = null,
    variant = 'outline',
    size = 'medium',
    showInput = false,
    changeCategory
  }: SelectFieldProps) => {
    const { control, setValue } = useFormContext()

    const [query, setQuery] = useState<string>('')
    const [selected, setSelected] = useState<OptionSelect>({ value: '', label: '' })

    useEffect(() => {
      if (value) {
        const optionSelected = options.find(
          (o) => String(o.value) === String(value) || Number(o.value) === Number(value)
        )
        if (optionSelected) {
          setSelected(optionSelected)
        } else {
          if (!isObject(value)) {
            setSelected({ value: value, label: capitalizeFirstLetter(String(value)) })
          } else {
            setSelected(value)
          }
        }
      }
    }, [value, options])

    const optionRenders = useMemo(
      () =>
        query === ''
          ? options
          : options.filter((option) => {
              return option.label.toLowerCase().includes(query.toLowerCase())
            }),
      [query, options]
    )

    return (
      <Controller
        name={name}
        rules={rules}
        control={control}
        defaultValue={''}
        render={({ field, fieldState }) => {
          return (
            <div className={`relative flex flex-col gap-1 ${fullWidth ? 'w-full' : 'w-[350px]'} ${width ? width : ''}`}>
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
                      changeCategory && changeCategory(value?.value)
                    }
                  }}
                  onClose={() => setQuery('')}
                >
                  <div className='relative'>
                    <ComboboxInput
                      disabled={disabled}
                      placeholder={placeholder}
                      onChange={(event) => setQuery(event.target.value.trimStart())}
                      displayValue={(option: OptionSelect) => option?.label}
                      onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === 'Enter' && query !== '' && showInput) {
                          setValue(name, query)
                          setSelected({ value: query, label: capitalizeFirstLetter(query) })
                          field.onChange(query)
                        }
                      }}
                      className={cn(
                        `shadow-sm relative w-full py-1.5 pl-5 pr-10 focus:outline-none`,
                        size === 'small' ? 'h-[48px]' : 'xs:h-11 sm:h-[52px]',
                        variant === 'outline'
                          ? `${disabled ? 'bg-black-main/[.03]' : 'bg-transparent hover:ring-black-main/[.3]'} rounded-[30px] border-[1px] border-solid border-gray-border capitalize focus:ring-[1px] focus:ring-black-main/[.3]`
                          : `${disabled ? 'bg-black-main/[.03]' : 'bg-grey-lighter'} rounded-lg`,
                        selected.value !== '' && 'bg-white',
                        disabled && 'hover:bg-black-main/[.05]',
                        className
                      )}
                    />
                    <ComboboxButton disabled={disabled} className='group absolute inset-y-0 right-0 px-2.5'>
                      <img src={images.icons.chevron_bot} alt='icon-arrow' />
                    </ComboboxButton>
                    {helperText && (
                      <div className='min-h-[18px]'>
                        <p className='ml-2 text-gray-400 xs:text-[13px] sm:text-[14px]'>{helperText}</p>
                      </div>
                    )}
                    {fieldState.error && (
                      <div className='absolute left-0 top-full mt-1 min-h-[18px]'>
                        <p className='ml-2 text-nowrap text-red-500 xs:text-[13px] sm:text-[14px]'>
                          {fieldState.error.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <ComboboxOptions
                    anchor='bottom'
                    className={cn(
                      'shadow-lg scroll-bar-small mt-2 !max-h-[270px] w-[var(--input-width)] overflow-auto rounded-xl bg-white p-3 shadow-popover-custom transition duration-200 ease-in-out focus:outline-none'
                    )}
                  >
                    {(optionRenders.length === 0 || options?.length === 0) && <p>No options</p>}
                    {optionRenders.map((option, index) => (
                      <ComboboxOption
                        key={option.value}
                        value={option}
                        className={cn(
                          optionRenders.length - 1 !== index &&
                            'border-0 border-b-[1px] border-solid border-black-default/[.1]',
                          index === 0 ? 'pb-2 pt-0' : 'py-2',
                          optionRenders.length - 1 === index ? 'pb-0 pt-2' : 'py-2',
                          'data-[focus]:bg-black/5 flex cursor-pointer select-none items-center justify-between px-3 py-2 transition duration-200 ease-in-out'
                        )}
                      >
                        <div className='font-customMedium capitalize'>{option.label}</div>
                        {selected.value === option.value && <CheckIcon className='fill-black size-6' />}
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                </Combobox>
              </div>
            </div>
          )
        }}
      />
    )
  }
)

export default SelectField
