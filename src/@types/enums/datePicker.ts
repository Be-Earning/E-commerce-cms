enum dateEnum {
  TODAY = 'today',
  LAST_WEEK = 'last_week',
  LAST_MONTH = 'last_month',
  LAST_6_MONTHS = 'last_6_months',
  LAST_YEAR = 'last_year'
}

const listDate = [
  { value: dateEnum.TODAY, label: 'Today' },
  { value: dateEnum.LAST_WEEK, label: 'Last week' },
  { value: dateEnum.LAST_MONTH, label: 'Last month' },
  { value: dateEnum.LAST_6_MONTHS, label: 'Last 6 months' },
  { value: dateEnum.LAST_YEAR, label: 'Last year' }
]
export { dateEnum, listDate }
