import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { cn } from '~/utils/classNames'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('m-0 overflow-hidden pt-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full ',
        month: 'space-y-4 w-full',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn('h-7 w-7  p-0 rounded-full bg-white flex items-center justify-center text-black'),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-full font-normal text-[0.8rem]',
        row: 'flex w-full gap-1 justify-between',
        cell: 'h-[40px] w-full text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          'w-full h-full p-0 font-normal bg-white rounded-md hover:border-2 hover:border-solid hover:border-[black] '
        ),
        day_range_end: 'bg-ln-green-blue text-white rounded-tl-none rounded-bl-none border-none',
        day_range_start: 'bg-ln-green-blue text-white rounded-tr-none rounded-br-none border-none',
        day_selected: 'border-0',
        day_today: 'bg-[#000000!important] text-white',
        day_outside:
          'day-outside text-muted-foreground opacity-20 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'bg-ln-green-blue text-white border-none',
        day_hidden: 'invisible',
        tbody: 'w-full flex flex-col gap-1',
        ...classNames
      }}
      components={{
        IconLeft: () => <ChevronLeft className='h-4 w-4' />,
        IconRight: () => <ChevronRight className='h-4 w-4' />
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
