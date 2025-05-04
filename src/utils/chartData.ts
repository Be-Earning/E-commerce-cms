import moment from 'moment'
import { formatDate } from './format'

type DataItem = {
  label: string
  value: number
}

export function processData(
  data: number[],
  type: string,
  smDown: boolean,
  hourRange?: number,
  length?: number
): DataItem[] {
  switch (type) {
    case 'day':
      return Array.from({ length: length ? length : smDown ? 6 : 12 }).map((_, i) => {
        const startHour: any = (i * (hourRange ? (hourRange as number) : 2)) % 24
        const endHour: any = (startHour + (hourRange ? (hourRange as number) : 2)) % 24
        let value: any
        if (startHour > endHour) {
          value = data?.filter(
            (item) => moment(item * 1000).format('HH') >= startHour || moment(item * 1000).format('HH') < endHour
          ).length
        } else {
          value = data?.filter(
            (item) => moment(item * 1000).format('HH') >= startHour && moment(item * 1000).format('HH') < endHour
          ).length
        }
        return {
          label: `${startHour}h`,
          value
        }
      })

    case 'week': {
      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const startOfWeek = moment().startOf('isoWeek')
      return daysOfWeek.map((day, index) => {
        const dayStart = startOfWeek.clone().add(index, 'days')
        const dayEnd = dayStart.clone().endOf('day')

        const value = data?.filter((item) => {
          const itemTime = moment(item * 1000)
          return itemTime.isBetween(dayStart, dayEnd, null, '[)')
        }).length

        return {
          label: day,
          value
        }
      })
    }

    case 'month':
      return Array.from({ length: length ? length : smDown ? 6 : 12 }, (_, i) => {
        return {
          label: moment().subtract(i, 'd').format('DD MMMM'),
          value: data?.filter((item) => formatDate(item, 'DD') == moment().subtract(i, 'd').format('DD')).length
        }
      }).reverse()

    case 'threeMonth':
      return Array.from({ length: length ? length : smDown ? 6 : 12 })
        .map((_, i) => {
          return {
            label: `W${12 - i * (smDown ? 2 : 1)}`,
            value: data?.filter(
              (item) =>
                moment(item * 1000) <= moment().subtract(i * (smDown ? 2 : 1), 'week') &&
                moment(item * 1000) > moment().subtract(i * (smDown ? 2 : 1) + 1, 'week')
            ).length
          }
        })
        .reverse()

    case 'sixMonth':
      return Array.from({ length: length ? length : smDown ? 6 : 12 })
        .map((_, i) => {
          return {
            label: `W${24 - i * (smDown ? 4 : 2)}`,
            value: data?.filter(
              (item) =>
                moment(item * 1000) <= moment().subtract(i * (smDown ? 4 : 2), 'week') &&
                moment(item * 1000) > moment().subtract((i + 1) * (smDown ? 4 : 2), 'week')
            ).length
          }
        })
        .reverse()

    case 'year': {
      const currentMonth = moment().month()
      return Array.from({ length: length ? length : smDown ? 6 : 12 }).map((_, i) => {
        const monthIndex = (currentMonth - 2 + i + 12) % 12
        const month = moment().month(monthIndex).startOf('month')
        return {
          label: month.format('MMM'),
          value: data?.filter((item) => moment(item * 1000).month() === monthIndex).length
        }
      })
    }

    case 'all':
      return Array.from({ length: smDown ? 6 : 12 })
        .map((_, i) => {
          const startHour = moment().subtract(i, 'hours')
          const endHour = moment().subtract(i + 1, 'hours')

          const value = data?.filter((item) => {
            const itemTime = moment(item * 1000)
            return itemTime.isBetween(endHour, startHour, 'hour', '[)')
          }).length

          return {
            label: `${moment().subtract(i, 'hour').format('HH')}h`,
            value
          }
        })
        .reverse()

    default:
      return []
  }
}
