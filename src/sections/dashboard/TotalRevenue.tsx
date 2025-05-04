import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
  TooltipModel
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { memo, useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { OptionSelect } from '~/@types/common'
import { FILTER_DAY } from '~/@types/listOptionCommon'
import { DashboardItem } from '~/components/dashboardItem'
import { SelectFilter } from '~/components/form'
import useResponsive from '~/hooks/useResponsive'
import { processData } from '~/utils/chartData'
import { formatLocaleString } from '~/utils/format'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ChartDataLabels)

const TotalRevenue = memo(() => {
  const chartRevenueRef = useRef<ChartJS<'line'>>(null)

  const smDown = useResponsive('down', 'sm')

  const [filterDay, setFilterDay] = useState<OptionSelect>(FILTER_DAY[0])

  const dataDaySearchTrend = processData([20, 55, 99, 99, 77], 'day', smDown)
  const dataMonthSearchTrend = processData([20, 40, 99, 99, 77], 'month', smDown)
  const dataYearSearchTrend = processData([20, 55, 99, 99, 77], 'year', smDown)

  const dataDayPurchases = processData([20, 55], 'day', smDown)
  const dataMonthPurchases = processData([20, 55], 'month', smDown)
  const dataYearPurchases = processData([20, 55], 'year', smDown)

  const gradient = document.createElement('canvas').getContext('2d')
  const linearGradientGreen = gradient?.createLinearGradient(0, 0, 0, 400)
  linearGradientGreen?.addColorStop(0, 'rgba(96, 236, 142)')
  linearGradientGreen?.addColorStop(1, 'rgba(255, 255, 255, 0)')
  const linearGradientBlue = gradient?.createLinearGradient(0, 0, 0, 400)
  linearGradientBlue?.addColorStop(0, 'rgb(84, 149, 252)')
  linearGradientBlue?.addColorStop(1, 'rgba(255, 255, 255, 0)')

  useEffect(() => {
    const chart = chartRevenueRef.current
    if (chart) {
      const datasets = chart.data.datasets
      let maxIdx1 = 0
      let maxIdx2 = 0
      let maxValue1 = 0
      let maxValue2 = 0

      datasets[0].data.forEach((value, idx) => {
        if (typeof value === 'number' && value > maxValue1) {
          maxValue1 = value
          maxIdx1 = idx
        }
      })

      datasets[1].data.forEach((value, idx) => {
        if (typeof value === 'number' && value > maxValue2) {
          maxValue2 = value
          maxIdx2 = idx
        }
      })

      const meta1 = chart.getDatasetMeta(0)
      const pointElement1 = meta1.data[maxIdx1] as PointElement
      const position1 = pointElement1?.getCenterPoint()

      const meta2 = chart.getDatasetMeta(1)
      const pointElement2 = meta2.data[maxIdx2] as PointElement
      const position2 = pointElement2?.getCenterPoint()

      const tooltip = chart.tooltip
      tooltip?.setActiveElements(
        [
          {
            datasetIndex: 0,
            index: maxIdx1
          },
          {
            datasetIndex: 1,
            index: maxIdx2
          }
        ],
        { x: (position1.x + position2.x) / 2, y: Math.min(position1.y, position2.y) }
      )
      chart.update()
    }
  }, [])

  return (
    <div className='flex w-full items-center gap-4 rounded-[18px] bg-white/[.88] p-[14px] shadow-popover-custom backdrop-blur-[80px] 2xs:w-full xs:h-fit xs:w-full xs:flex-col sm:h-fit sm:w-full sm:flex-col md:h-[360px] md:w-full md:flex-row'>
      <div className='flex w-full flex-1 flex-col'>
        <div className='flex items-center justify-between'>
          <h6 className='font-customSemiBold text-[22px]/[32px] capitalize'>Total Revenue</h6>
          <SelectFilter
            hideClear
            options={FILTER_DAY}
            selected={filterDay}
            setSelected={setFilterDay}
            className='!h-7 !w-[128px] !ring-0 hover:!ring-[1px] focus:!ring-[1px]'
          />
        </div>

        <div className='h-[290px] xs:mt-5 xs:w-full sm:mt-3 sm:w-full lg:max-w-[540px]'>
          <div className='h-full w-full'>
            <Line
              className='w-full'
              ref={chartRevenueRef}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  datalabels: { display: false },
                  legend: { display: false },
                  tooltip: {
                    displayColors: true,
                    backgroundColor: '#ffffff',
                    borderColor: 'rgba(190, 198, 213, 0.3)',
                    borderWidth: 2,
                    bodyColor: '#0D0D0D',
                    titleColor: '#959595',
                    titleFont: {
                      weight: 'normal'
                    },
                    footerColor: '#0D0D0D',
                    footerFont: {
                      weight: 'normal'
                    },
                    padding: 10,
                    callbacks: {
                      title: function (tooltipItems) {
                        const date = new Date()
                        return `${tooltipItems[0].label} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} `
                      },
                      label: function (this: TooltipModel<'line'>, tooltipItem: TooltipItem<'line'>) {
                        const datasetLabel = tooltipItem.dataset.label || ''
                        return `  ${datasetLabel}    ${tooltipItem.parsed.y}`
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: { display: true, color: '#0D0D0D' }
                  },
                  y: {
                    ticks: { display: false },
                    border: { display: false }
                  }
                }
              }}
              data={{
                labels:
                  (filterDay.value === '1d' && dataDaySearchTrend?.map((data) => data.label)) ||
                  (filterDay.value === '1m' && dataMonthSearchTrend?.map((data) => data.label)) ||
                  dataYearSearchTrend?.map((data) => data.label),
                datasets: [
                  {
                    label: 'Profit',
                    fill: true,
                    data:
                      (filterDay.value === '1d' && dataDaySearchTrend?.map((data) => data.value)) ||
                      (filterDay.value === '1m' && dataMonthSearchTrend?.map((data) => data.value)) ||
                      dataYearSearchTrend?.map((data) => data.value),
                    borderColor: 'rgb(96, 236, 142)',
                    backgroundColor: linearGradientGreen,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    pointStyle: 'line',
                    tension: smDown ? 0.6 : 0
                  },
                  {
                    label: 'Expense',
                    fill: true,
                    data:
                      (filterDay.value === '1d' && dataDayPurchases?.map((data) => data.value)) ||
                      (filterDay.value === '1m' && dataMonthPurchases?.map((data) => data.value)) ||
                      dataYearPurchases?.map((data) => data.value),
                    borderColor: 'rgb(84, 149, 252)',
                    backgroundColor: linearGradientBlue,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    pointStyle: 'line',
                    tension: smDown ? 0.5 : 0
                  }
                ]
              }}
            />
          </div>
        </div>
      </div>
      <div className='col-span-1 flex h-full w-full flex-col gap-[14px] md:min-w-[200px] md:max-w-[200px]'>
        <DashboardItem
          textSize='small'
          title='Total Profit'
          colorPercent='white'
          data={formatLocaleString(260800000)}
          className='bg-ln-blue-to-t'
        />
        <DashboardItem
          textSize='small'
          title='Revenue'
          data={formatLocaleString(721600000)}
          className='bg-ln-gray-to-l !shadow-card'
        />
        <DashboardItem
          textSize='small'
          title='Expense'
          colorPercent='pink'
          data={formatLocaleString(460800000)}
          className='bg-ln-gray-dark-to-l !shadow-card'
        />
      </div>
    </div>
  )
})

export default TotalRevenue
