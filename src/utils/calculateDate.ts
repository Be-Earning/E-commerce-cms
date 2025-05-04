import { subDays, subMonths, subYears } from 'date-fns'
import { Matcher } from 'react-day-picker'
import { dateEnum } from '~/@types/enums/datePicker'

const calculateDateRange = (value) => {
  const today = new Date() // Ngày hiện tại

  switch (value) {
    case dateEnum.TODAY:
      return { from: today, to: today }

    case dateEnum.LAST_WEEK:
      return { from: subDays(today, 7), to: today }

    case dateEnum.LAST_MONTH:
      return { from: subDays(today, 30), to: today }

    case dateEnum.LAST_6_MONTHS:
      return { from: subMonths(today, 6), to: today }

    case dateEnum.LAST_YEAR:
      return { from: subYears(today, 1), to: today }

    default:
      return { from: today, to: today }
  }
}
const convertToMatcher = (date: Date): Matcher => {
  // Conversion logic here
  return date // Assuming Matcher can be a Date
}

export { calculateDateRange, convertToMatcher }
