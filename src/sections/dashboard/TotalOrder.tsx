import { ArcElement, Chart as ChartJS, Legend, Tooltip, TooltipItem } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Link } from 'react-router-dom'
import { OptionSelect } from '~/@types/common'
import { OrderStatus } from '~/@types/enums'
import { FILTER_DAY, LIST_ORDER_STATUS_OPTIONS } from '~/@types/listOptionCommon'
import { IOrder } from '~/@types/models/order'
import { SelectFilter } from '~/components/form'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import useResponsive from '~/hooks/useResponsive'
import { useAppSelector } from '~/redux/configStore'
import { calculateTotalCount } from '~/utils/covertStatus'
import { formatLocaleString } from '~/utils/format'
import { createGradient } from '~/utils/pallet'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const TotalOrder = memo(() => {
  const smDown = useResponsive('down', 'sm')

  const { listOrders } = useAppSelector((s) => s.order)

  const chartTotalOrderRef = useRef<ChartJS<'doughnut'>>(null)

  const [filterDay, setFilterDay] = useState<OptionSelect>(FILTER_DAY[0])
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined })

  const filterOrdersByDate = useCallback(
    (orders: IOrder[], filter: string, dateRange: { from?: Date; to?: Date }): IOrder[] => {
      const now = Date.now()

      return orders.filter((order) => {
        const orderDate = new Date(parseInt(order.createdAt) * 1000)
        const diffTime = now - orderDate.getTime()

        switch (filter) {
          case '1d':
            return diffTime <= 24 * 60 * 60 * 1000
          case '1m':
            return diffTime <= 30 * 24 * 60 * 60 * 1000
          case '1y':
            return diffTime <= 365 * 24 * 60 * 60 * 1000
          case 'custom':
            if (dateRange) {
              const { from, to } = dateRange
              if (from && to) {
                const fromTimestamp = from.getTime()
                const toTimestamp = to.getTime()
                const orderTimestamp = orderDate.getTime()
                return orderTimestamp >= fromTimestamp && orderTimestamp <= toTimestamp
              }
            }
            return true
          default:
            return true
        }
      })
    },
    []
  )

  const filteredOrders = useMemo(
    () => filterOrdersByDate(listOrders, filterDay.value, dateRange),
    [listOrders, filterDay, dateRange, filterOrdersByDate]
  )

  const listData = useMemo(
    () => [
      calculateTotalCount(filteredOrders, OrderStatus.AWAITING),
      calculateTotalCount(filteredOrders, OrderStatus.INTRANSIT),
      calculateTotalCount(filteredOrders, OrderStatus.DELIVERED),
      calculateTotalCount(filteredOrders, OrderStatus.CANCELLED),
      calculateTotalCount(filteredOrders, OrderStatus.STORAGE)
    ],
    [filteredOrders]
  )

  const percentages = useMemo(
    () => listData.map((value) => (value / filteredOrders.length) * 100),
    [listData, filteredOrders.length]
  )

  useEffect(() => {
    if (chartTotalOrderRef.current) {
      const chart = chartTotalOrderRef.current
      const ctx = chart.ctx

      const gradients = [
        createGradient(ctx, '#0D0D0DA3', '#0D0D0DA3'),
        createGradient(ctx, '#AFDDF4', '#34B3F1'),
        createGradient(ctx, '#37CFFF', '#0D57C6', '#0F5ED6'),
        createGradient(ctx, '#9DFFB3', '#1AA37A'),
        createGradient(ctx, '#FFFFFF', '#DEECF6')
      ]

      chart.data.datasets[0].backgroundColor = gradients
      chart.data.datasets[0].hoverBackgroundColor = gradients
      chart.update()
    }
  }, [listData])

  return (
    <div className='flex w-full flex-col justify-between rounded-[18px] bg-white/[.88] p-4 shadow-popover-custom backdrop-blur-[80px] xs:h-fit sm:h-[360px]'>
      <div className='flex w-full items-center justify-between'>
        <h6 className='font-customSemiBold text-[22px]/[32px] capitalize'>Total Order</h6>
        <SelectFilter
          hideClear
          options={FILTER_DAY}
          selected={filterDay}
          setSelected={setFilterDay}
          dateRange={dateRange}
          setDateRange={setDateRange}
          className='!h-7 !w-[128px] !ring-0 hover:!ring-[1px] focus:!ring-[1px]'
        />
      </div>

      <div className='flex justify-between xs:mt-7 xs:flex-col xs:items-center xs:gap-7 sm:mt-0 sm:flex-row sm:items-end'>
        <div className='flex gap-2 pb-2 pl-2 xs:order-2 xs:flex-row xs:flex-wrap sm:order-1 sm:flex-col'>
          {LIST_ORDER_STATUS_OPTIONS.map((o, i) => ({ ...o, orders: listData[i] })).map((option) => (
            <div
              key={option.value}
              className='flex h-[30px] items-center justify-between rounded bg-white/[.64] p-1 pl-2 shadow-popover-custom xs:w-[48.5%] sm:w-[147px]'
            >
              <div className='flex items-center gap-2'>
                <div
                  className={`size-2 rounded-full ${
                    option.value === OrderStatus.AWAITING
                      ? 'bg-black-main'
                      : option.value === OrderStatus.INTRANSIT
                        ? 'bg-ln-intransit'
                        : option.value === OrderStatus.DELIVERED
                          ? 'bg-ln-delivered'
                          : option.value === OrderStatus.CANCELLED
                            ? 'bg-ln-cancelled'
                            : 'bg-ln-storage shadow-card'
                  }`}
                />
                <p className='text-[14px]/[20px]'>{option.label}</p>
              </div>
              <div className='bg-grey-lighter flex h-[22px] items-center justify-center rounded-sm px-[6px] font-customSemiBold text-[16px] leading-none'>
                {formatLocaleString(option.orders)}
              </div>
            </div>
          ))}
        </div>

        <div className='xs:order-1 sm:order-2'>
          <div className='size-[296px] xl:-translate-y-3 xl:translate-x-6'>
            <div className='relative h-full w-full overflow-visible'>
              <Doughnut
                className='relative z-50'
                ref={chartTotalOrderRef}
                options={{
                  cutout: smDown ? 78 : 98,
                  plugins: {
                    datalabels: {
                      font: { size: 12 },
                      anchor: 'center',
                      align: 'center',
                      formatter: (value) => `${value > 0 ? `${value.toFixed(2)}%` : ''}`,
                      color: (context) => ['#FFF', '#0D0D0D', '#FFF', '#0D0D0D', '#0D0D0D'][context.dataIndex] || '#FFF'
                    },
                    legend: { display: false },
                    tooltip: {
                      position: 'nearest',
                      displayColors: false,
                      backgroundColor: 'rgba(14, 14, 14, 0.6)',
                      padding: 10,
                      callbacks: {
                        title: function () {
                          return ''
                        },
                        label: function (tooltipItem: TooltipItem<'doughnut'>) {
                          const dataset = tooltipItem.chart.data.datasets[tooltipItem.datasetIndex]
                          const total = (dataset.data as number[]).reduce(
                            (acc: number, value: number) => acc + value,
                            0
                          )
                          const currentValue = dataset.data[tooltipItem.dataIndex] as number
                          const percentage = (currentValue / total) * 100
                          return `${percentage.toFixed(2)}%`
                        }
                      }
                    }
                  }
                }}
                data={{
                  labels: ['5.0', '4.0', '3.0', '2.0', '1.0'],
                  datasets: [
                    {
                      data: percentages,
                      backgroundColor: [],
                      hoverBackgroundColor: [],
                      borderRadius: 5,
                      borderWidth: 0
                    }
                  ]
                }}
              />

              <div className='absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border-[2.5px] border-dotted border-[#A6A6A6] 2xs:size-[170px] xs:size-[155px] sm:size-[189.59px]'>
                <div className='flex items-center justify-center rounded-full bg-[#F8F8F8] xs:size-[140px] sm:size-[180.3px]'>
                  <div className='flex flex-col items-center justify-center gap-1 rounded-full bg-white shadow-chart-doughout xs:size-[120px] sm:size-[153.42px]'>
                    <h3 className='font-customSemiBold text-[28px]/[29.4px] text-[#292D30]'>
                      {formatLocaleString(filteredOrders.length)}
                    </h3>
                    <p className='text-[14px]/[15px] text-black-main'>Total order</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Link
          to={PATH_PRIVATE_APP.order.list}
          className='block text-right text-blue-dark underline xs:absolute xs:bottom-5 xs:right-5 sm:relative sm:order-3'
        >
          See more
        </Link>
      </div>
    </div>
  )
})

export default TotalOrder
