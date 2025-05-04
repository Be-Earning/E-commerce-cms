import { OptionSelect } from '~/@types/common'
import { TimeFilter, Gender } from '~/@types/enums'
import { OrderStatus } from './enums/order'

export const LIST_ORDER_STATUS_OPTIONS: OptionSelect[] = [
  { value: OrderStatus.AWAITING, label: 'Awaiting' },
  { value: OrderStatus.INTRANSIT, label: 'In transit' },
  { value: OrderStatus.DELIVERED, label: 'Delivered' },
  { value: OrderStatus.CANCELLED, label: 'Cancelled' }
  // { value: OrderStatus.STORAGE, label: 'Storgae' }
]

export const FILTER_DAY: OptionSelect[] = [
  { value: '1d', label: 'Daily' },
  { value: '1m', label: 'Monthly' },
  { value: '1y', label: 'Yearly' },
  { value: 'custom', label: 'Custom' }
]

export const LIST_TIME_FILTER_OPTIONS: OptionSelect[] = [
  {
    value: TimeFilter.MONTHS_12,
    label: '12 months'
  },
  {
    value: TimeFilter.DAYS_30,
    label: '30 days  '
  },
  {
    value: TimeFilter.DAYS_7,
    label: '7 days'
  },
  {
    value: TimeFilter.HOURS_24,
    label: '24 hours'
  }
]

export const LIST_GENDER_OPTIONS: OptionSelect[] = [
  {
    value: Gender.MALE.toString(),
    label: 'Male'
  },
  {
    value: Gender.FEMALE.toString(),
    label: 'Female'
  }
]

export const LIST_LANGUAGE_OPTIONS: OptionSelect[] = [
  {
    value: 'en',
    label: 'English'
  },
  {
    value: 'vi',
    label: 'Chinese'
  },
  {
    value: 'ja',
    label: 'Japanese'
  },
  {
    value: 'ko',
    label: 'Korean'
  },
  {
    value: 'fra',
    label: 'Fracais'
  },
  {
    value: 'vi',
    label: 'Vietnamese'
  },
  {
    value: 'por',
    label: 'Português'
  },
  {
    value: 'ita',
    label: 'Italiano'
  },
  {
    value: 'ces',
    label: 'Cestina'
  },
  {
    value: 'ba',
    label: 'Bahasa'
  }
]
