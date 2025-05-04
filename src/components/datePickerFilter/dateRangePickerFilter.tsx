import { Minus } from 'lucide-react'
import React, { useCallback, useRef, useState } from 'react'
import { Matcher } from 'react-day-picker'
import { useOnClickOutside } from 'usehooks-ts'
import { listDate } from '~/@types/enums/datePicker'
import { CalendarIcon, ChevronDown } from '~/components/icons'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { calculateDateRange, convertToMatcher } from '~/utils/calculateDate'
import { cn } from '~/utils/classNames'
interface DateRangePickerFilterProps {
  className?: string
  onConfirm?: (range: { from?: Date; to?: Date }) => void
}
/**
 * DateRangePickerFilter component is used to filter date range
 * @param onConfirm use to handle confirm date range
 *
 */
const DateRangePickerFilter: React.FC<DateRangePickerFilterProps> = ({ className, onConfirm }) => {
  const ref = useRef(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [activeCalendar, setActiveCalendar] = useState<'from' | 'to'>('from')
  const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined })
  const [selectedDate, setSelectedDate] = useState<{
    isConfirm: boolean
    value: Date | null | string
    isClickTab?: boolean
  }>({
    isConfirm: false,
    value: null
  })
  useOnClickOutside(ref, () => setOpen(false))

  const range_start: Matcher | Matcher[] = selectedRange.from
    ? convertToMatcher(selectedRange.from)
    : (undefined as unknown as Matcher)
  const range_end: Matcher | Matcher[] = selectedRange.to
    ? convertToMatcher(selectedRange.to)
    : (undefined as unknown as Matcher)

  /**
   * handleToggleActive function is used to handle toggle active date range
   * @param index is index of date range
   * @returns void
   *
   */
  const handleToggleActive = useCallback((index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index))
    const range = calculateDateRange(listDate[index].value)
    setSelectedRange(range)
    setSelectedDate({
      isConfirm: false,
      isClickTab: true,
      value: listDate[index].label
    })
  }, [])

  /**
   * handleDateChange function is used to handle change date range
   * @param date is date selected
   * @param type is type of date range
   * @returns void
   */
  const handleDateChange = useCallback((date: Date, type: 'from' | 'to') => {
    if (type === 'from') {
      // If from date is greater than to date, set to date to from date value and set from date to selected date
      setSelectedRange((prevRange) => ({
        from: date,
        to: prevRange.to !== undefined && prevRange.to < date ? date : prevRange.to
      }))
    } else {
      // If to date is less than from date, set from date to to date value and set to date to selected date
      setSelectedRange((prevRange) => ({
        ...prevRange,
        to: date
      }))
    }
  }, [])

  const handleConfirm = useCallback(() => {
    onConfirm && onConfirm(selectedRange)
    let value = ''
    if (!selectedDate.isClickTab) {
      if (selectedRange.from) {
        value = selectedRange.from.toLocaleDateString()
        if (selectedRange.to) {
          value += ` - ${selectedRange.to.toLocaleDateString()}`
        }
      }
      if (value !== '') {
        setSelectedDate({
          isConfirm: true,
          value
        })
      }
    } else {
      setSelectedDate({
        isConfirm: true,
        value: selectedDate.value
      })
    }
    if (selectedRange.from || selectedDate.isClickTab) {
      setOpen(false)
    }
  }, [selectedRange])

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center justify-between rounded-lg bg-white p-2 xs:h-10 xs:min-w-10 sm:h-11 sm:min-w-[200px] md:h-12',
            className
          )}
          onClick={() => setOpen(!open)}
        >
          <div className='pointer-events-none inset-y-0 start-0 flex items-center xs:gap-0 sm:gap-2'>
            <CalendarIcon className='xs:ml-[2px] sm:ml-0' />
            <span className='border-0 border-l border-solid border-gray-lighter pl-2 text-sm text-black-main xs:hidden sm:flex md:flex'>{`${selectedDate.isConfirm ? selectedDate.value : 'Choose date'}`}</span>
          </div>
          <ChevronDown className='xs:hidden sm:hidden md:flex' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-auto bg-gray-calendar p-4 shadow-popover' ref={ref}>
        <div className='flex w-full xs:block'>
          <div className='left-calendar flex w-full flex-shrink-0 flex-col justify-between border-0 border-solid border-gray-dark xs:border-r-0 xs:pr-0 sm:border-r sm:pr-2 md:max-w-[130px] md:pr-2'>
            <div className='left-top-calendar grid-col-5 grid w-full gap-2 lg:flex lg:flex-col'>
              {listDate.map((item, index) => (
                <button
                  key={item.value}
                  onClick={() => handleToggleActive(index)}
                  className={cn(
                    'w-full rounded-sm px-3 py-1 text-left text-[14px]',
                    activeIndex === index ? 'bg-black-main text-white' : 'bg-gray-dark'
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className='left-bottom-calendar mt-2'>
              <button
                className='text-black mb-2 w-full rounded-sm bg-gray-200 py-1 font-customMedium uppercase'
                onClick={() => {
                  setSelectedRange({ from: undefined, to: undefined })
                  setActiveIndex(null)
                  setActiveCalendar('from')
                  setSelectedDate({
                    isConfirm: false,
                    value: null,
                    isClickTab: false
                  })
                  onConfirm && onConfirm({ from: undefined, to: undefined })
                }}
              >
                Clear
              </button>
              <button
                className='w-full rounded-sm bg-ln-green-blue py-1 font-customMedium uppercase text-white'
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
          <div className='right-calendar flex w-full flex-col items-center justify-center pl-4 pt-3'>
            <div className='top-right-calendar flex w-full items-end justify-center gap-3'>
              <div className='flex flex-col gap-2'>
                <label htmlFor='fromDate' className='text-black-main'>
                  From
                </label>
                <button
                  id='fromDate'
                  className={cn(
                    'flex w-[145px] items-center justify-between border border-solid border-gray-dark bg-transparent px-2 py-1',
                    selectedRange.from ? 'text-black-main' : 'text-gray-400'
                  )}
                  onClick={() => setActiveCalendar('from')}
                >
                  {selectedRange.from ? selectedRange.from.toLocaleDateString() : 'dd/mm/yyyy'}
                  <CalendarIcon />
                </button>
              </div>
              <Minus className='pb-2' />
              <div className='flex flex-col gap-2'>
                <label htmlFor='toDate' className='text-black-main'>
                  To
                </label>
                <button
                  id='toDate'
                  className={cn(
                    'flex w-[145px] items-center justify-between border border-solid border-gray-dark bg-transparent px-2 py-1 disabled:cursor-not-allowed',
                    selectedRange.to ? 'text-black-main' : 'text-gray-400'
                  )}
                  onClick={() => setActiveCalendar('to')}
                  disabled={!selectedRange.from}
                >
                  {selectedRange.to ? selectedRange.to.toLocaleDateString() : 'dd/mm/yyyy'}
                  <CalendarIcon className={cn(selectedRange.to ? 'text-black-main' : 'text-gray-400')} />
                </button>
              </div>
            </div>
            <div className='bottom-right-calendar w-full'>
              <Calendar
                mode='single'
                weekStartsOn={1}
                selected={
                  activeCalendar === 'from'
                    ? selectedRange.from
                    : activeCalendar === 'to'
                      ? selectedRange.to
                      : undefined
                }
                modifiers={{
                  range_start,
                  range_end,
                  range_middle: (date: Date) => {
                    if (!selectedRange.to) return false
                    return (
                      selectedRange.from !== undefined &&
                      selectedRange.to !== undefined &&
                      date > selectedRange.from &&
                      date < selectedRange.to
                    )
                  },
                  selected:
                    selectedRange.from !== undefined && selectedRange.to !== undefined
                      ? [selectedRange.from, selectedRange.to]
                      : []
                }}
                onDayClick={(date) => handleDateChange(date, activeCalendar)}
                disabled={activeCalendar === 'to' ? ([{ before: selectedRange.from }] as unknown as Date[]) : undefined}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateRangePickerFilter
