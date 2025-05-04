import { format } from 'date-fns'
import moment from 'moment'

export const formatDate = (date: number, format = 'DD/MM/YYYY') => {
  if (!date) return ''
  return moment(date * 1000).format(format)
}
export const formatDateV2 = (date: number, formatType = 'dd/MM/yyyy') => {
  if (!date) return ''
  return format(Number(date), formatType)
}

/**
 *  This function is used to shorten string
 *  @param str is string need to shorten
 * @param maxLength is max length of string
 * @returns string
 * @example
 * ```tsx
 * shortenString('This is a long string', 10) // return 'This...string'
 * ```
 *
 */
export const shortenString = (str?: string, maxLength = 10) => {
  if (!str) return ''
  const sideLength = Math.floor(maxLength / 2)
  return str.length > maxLength ? `${str.slice(0, sideLength)}...${str.slice(-sideLength)}` : str
}

export const formatLocaleString = (number) => {
  const format = (_str) => _str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const str = number + ''
  const idx = str.indexOf('/')
  return idx === -1 ? format(str) : `${format(str.slice(0, idx))}.${str.slice(idx + 1)}`
}

export const roundNumber = (_number, decimal = 4) => {
  const number = +_number
  const min = 10 ** decimal
  return number > min ? formatLocaleString(Math.floor(number / min) * min) + '+' : formatLocaleString(number)
}

export const formatPrice = (number: number, fix?: number) => {
  return fix ? (number / 10 ** 18).toFixed(fix) : number / 10 ** 18
}

export const trimStringMiddle = (str: string, startChars: number, endChars: number): string => {
  if (str.length <= startChars + endChars) {
    return str
  }
  const start = str.slice(0, startChars)
  const end = str.slice(-endChars)
  return `${start}...${end}`
}

export const shortCenter = (string: string) =>
  string.length > 8 ? `${string.slice(0, 4)}...${string.slice(-4)}` : string

export const isBytes32 = (value: string): boolean => {
  // Kiểm tra nếu chuỗi có độ dài đúng 64 ký tự
  if (value.length !== 64) {
    return false
  }

  // Kiểm tra nếu chuỗi chỉ chứa các ký tự hex hợp lệ (0-9, a-f)
  const hexPattern = /^[0-9a-fA-F]{64}$/
  return hexPattern.test(value)
}

export const removeEscapeCharacters = (str) => {
  // Loại bỏ tất cả các escape character dư (\\, \", \n, \t, ...), và các dấu \" dư
  return (
    str
      // eslint-disable-next-line no-useless-escape
      .replace(/\\(["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '$1') // Loại bỏ các escape characters
      .replace(/\\"/g, '"') // Loại bỏ dấu escape nháy kép (\" -> ")
      .replace(/\\\\/g, '') // Loại bỏ các dấu \\ dư
      .replace(/font-size:\s*[^;]+pt/g, 'font-size: 18px !important')
  )
}
