import { Dispatch, memo, ReactNode, SetStateAction } from 'react'
import { OptionSelect } from '~/@types/common'
import { ChevronDown, CloseIcon, SortIcon } from '~/components/icons'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import CalendarSelect from './CalendarSelect'
import { cn } from '~/utils/classNames'

type SelectFilterProps = {
  label?: string
  className?: string
  fullWidth?: boolean
  isSortBy?: boolean
  hideClear?: boolean
  isTransparent?: boolean
  options: OptionSelect[]
  selected: OptionSelect
  leftIcon?: ReactNode
  maxHeight?: string
  setSelected: Dispatch<SetStateAction<OptionSelect>>
  dateRange?: { from?: Date; to?: Date }
  setDateRange?: Dispatch<SetStateAction<{ from?: Date; to?: Date }>>
}

const SelectFilter = memo(
  ({
    label,
    className,
    fullWidth = false,
    isSortBy = false,
    hideClear = false,
    isTransparent = false,
    options,
    selected,
    setSelected,
    leftIcon,
    dateRange,
    setDateRange
  }: SelectFilterProps) => {
    const handleCustomClick = () => {
      setSelected({ value: 'custom', label: 'Custom' })
    }

    return (
      <Select
        value={selected.value}
        onValueChange={(value) => setSelected(options.find((option) => option.value === value)!)}
      >
        <SelectTrigger
          className={cn(
            'relative min-h-7 rounded-[14px] text-left shadow-avatar ring-1 ring-inset ring-black-main/[.22] transition-colors duration-300 ease-in-out hover:ring-[1.5px] hover:ring-black-main/[.30] focus:ring-[1.5px] focus:ring-black-main/[.30]',
            !isTransparent ? 'bg-ln-white' : 'bg-transparent',
            className,
            fullWidth ? 'xs:w-full' : ''
          )}
        >
          <div className='flex items-center gap-2'>
            {leftIcon && leftIcon}
            {isSortBy && (
              <>
                <SortIcon className='xs:size-[18px] sm:size-5' />
                <div className='h-6 border-0 border-r-[1px] border-solid border-black-main/[.1]' />
              </>
            )}
            <SelectValue placeholder={label ? `${label}: ${selected.label}` : selected.label} />
          </div>
          {!hideClear && selected.value !== '' && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                setSelected({ value: '', label: '' })
              }}
              className='absolute inset-y-0 right-5 flex cursor-pointer items-center pr-2'
            >
              <CloseIcon className='size-2' color={isTransparent ? 'white' : 'black'} />
            </span>
          )}
          {selected.value === 'custom' && <p className='absolute'>Custom</p>}
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {options.map((option, index) =>
              option.value !== 'custom' ? (
                <SelectItem key={index} value={option.value}>
                  {option.label}
                </SelectItem>
              ) : (
                dateRange &&
                setDateRange && (
                  <CalendarSelect key={index} selectedRange={dateRange} setDateRange={setDateRange}>
                    <button
                      onClick={handleCustomClick}
                      className='flex h-7 w-full items-center justify-between gap-[45px] rounded pl-2 text-[14px] hover:bg-gray-300/[.30]'
                    >
                      Custom <ChevronDown className='size-4 rotate-[-90deg]' />
                    </button>
                  </CalendarSelect>
                )
              )
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }
)

export default SelectFilter
