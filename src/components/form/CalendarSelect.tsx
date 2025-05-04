import { Minus } from 'lucide-react'
import React, { Dispatch, ReactNode, SetStateAction, useCallback, useRef, useState } from 'react'
import { Matcher } from 'react-day-picker'
import { useOnClickOutside } from 'usehooks-ts'
import { CalendarIcon } from '~/components/icons'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { convertToMatcher } from '~/utils/calculateDate'
import { cn } from '~/utils/classNames'

interface DateRangePickerFilterProps {
  children: ReactNode
  selectedRange: { from?: Date; to?: Date }
  setDateRange: Dispatch<SetStateAction<{ from?: Date; to?: Date }>>
}

const CalendarSelect: React.FC<DateRangePickerFilterProps> = ({ children, selectedRange, setDateRange }) => {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [activeCalendar, setActiveCalendar] = useState<'from' | 'to'>('from')

  useOnClickOutside(ref, () => setOpen(false))

  const range_start: Matcher | Matcher[] = selectedRange?.from
    ? convertToMatcher(selectedRange?.from)
    : (undefined as unknown as Matcher)
  const range_end: Matcher | Matcher[] = selectedRange?.to
    ? convertToMatcher(selectedRange?.to)
    : (undefined as unknown as Matcher)

  const handleDateChange = useCallback((date: Date, type: 'from' | 'to') => {
    if (type === 'from') {
      setDateRange((prevRange) => ({
        from: date,
        to: prevRange.to !== undefined && prevRange?.to < date ? date : prevRange.to
      }))
    } else {
      setDateRange((prevRange) => ({
        ...prevRange,
        to: date
      }))
    }
  }, [])

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <button onClick={() => setOpen(!open)}>{children}</button>
      </PopoverTrigger>
      <PopoverContent style={{ top: 0, left: '100%' }} className='w-auto bg-gray-calendar p-4 shadow-popover' ref={ref}>
        <div className='flex w-full'>
          <div className='right-calendar flex w-full flex-col items-center justify-center pt-3'>
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

export default CalendarSelect
