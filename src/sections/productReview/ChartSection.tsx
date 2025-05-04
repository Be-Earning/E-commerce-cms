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
import { memo, useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { OptionSelect } from '~/@types/common'
import useResponsive from '~/hooks/useResponsive'
import { processData } from '~/utils/chartData'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

const FILTER_DAY: OptionSelect[] = [
  { value: '1d', label: '1D' },
  { value: '1m', label: '1M' },
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
  { value: 'all', label: 'All' }
]

type ChartSection = {
  searchTrend: number[]
  purchases: number[]
}

const ChartSection = memo(({ searchTrend, purchases }: ChartSection) => {
  const smDown = useResponsive('down', 'sm')
  const [filterDay, setFilterDay] = useState<string>('1d')

  const dataDaySearchTrend = processData(searchTrend, 'day', smDown)
  const dataMonthSearchTrend = processData(searchTrend, 'month', smDown)
  const dataThreeMonthSearchTrend = processData(searchTrend, 'threeMonth', smDown)
  const dataSixMonthSearchTrend = processData(searchTrend, 'sixMonth', smDown)
  const dataYearSearchTrend = processData(searchTrend, 'year', smDown)
  const dataAllSearchTrend = processData(searchTrend, 'all', smDown)

  const dataDayPurchases = processData(purchases, 'day', smDown)
  const dataMonthPurchases = processData(purchases, 'month', smDown)
  const dataThreeMonthPurchases = processData(purchases, 'threeMonth', smDown)
  const dataSixMonthPurchases = processData(purchases, 'sixMonth', smDown)
  const dataYearPurchases = processData(purchases, 'year', smDown)
  const dataAllPurchases = processData(purchases, 'all', smDown)
  const chartRef = useRef<ChartJS<'line'>>(null)

  const gradient = document.createElement('canvas').getContext('2d')
  const linearGradientGreen = gradient?.createLinearGradient(0, 0, 0, 400)
  linearGradientGreen?.addColorStop(0, 'rgba(96, 236, 142)')
  linearGradientGreen?.addColorStop(1, 'rgba(255, 255, 255, 0)')
  const linearGradientBlue = gradient?.createLinearGradient(0, 0, 0, 400)
  linearGradientBlue?.addColorStop(0, 'rgb(84, 149, 252)')
  linearGradientBlue?.addColorStop(1, 'rgba(255, 255, 255, 0)')

  useEffect(() => {
    const chart = chartRef.current
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
      const position1 = pointElement1.getCenterPoint()

      const meta2 = chart.getDatasetMeta(1)
      const pointElement2 = meta2.data[maxIdx2] as PointElement
      const position2 = pointElement2.getCenterPoint()

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
    <section className='relative flex flex-col items-center xs:px-4 xs:pt-[50px] sm:px-4 sm:pt-[100px]'>
      <div className='z-50 mx-auto xs:w-full'>
        <h1 className='font-customBold capitalize xs:mb-[20px] xs:text-[32px] xs:leading-[40px] sm:mb-[50px] sm:text-[56px] sm:leading-[72px]'>
          Search and <br className='xs:block sm:hidden' /> Purchase Trends
        </h1>

        <div className='bg-white/[.88] shadow-4xl backdrop-blur-2xl xs:h-fit xs:w-full xs:min-w-[358px] xs:rounded-[18px] xs:py-5 sm:h-[552px] sm:w-[1203px] sm:rounded-3xl'>
          <div className='flex flex-nowrap items-center pl-14 xs:gap-2 xs:p-5 xs:pt-0 sm:gap-4 sm:p-10'>
            {FILTER_DAY.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterDay(option.value as string)}
                className={`flex items-center justify-center xs:h-[20px] sm:h-[29px] ${option.value === filterDay ? 'bg-black-main text-white hover:backdrop-blur-2xl' : 'bg-gray-light hover:bg-gray-300'} rounded py-2 transition-all duration-300 ease-in-out xs:px-2 sm:px-4`}
              >
                <p className='font-customMedium uppercase leading-none xs:text-[11.96px] sm:text-[18px]'>
                  {option.label}
                </p>
              </button>
            ))}
          </div>

          <div className='w-full xs:h-[270px] xs:px-4 sm:h-[420px] sm:px-10'>
            <div className='h-full w-full'>
              <Line
                ref={chartRef}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
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
                      position: 'right',
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: '#0D0D0D',
                        font: {
                          weight: 'normal'
                        }
                      }
                    },
                    y: {
                      position: 'right'
                    }
                  }
                }}
                data={{
                  labels:
                    (filterDay === '1d' && dataDaySearchTrend?.map((data) => data.label)) ||
                    (filterDay === '1m' && dataMonthSearchTrend?.map((data) => data.label)) ||
                    (filterDay === '3m' && dataThreeMonthSearchTrend?.map((data) => data.label)) ||
                    (filterDay === '6m' && dataSixMonthSearchTrend?.map((data) => data.label)) ||
                    (filterDay === '1y' && dataYearSearchTrend?.map((data) => data.label)) ||
                    dataAllSearchTrend?.map((data) => data.label),
                  datasets: [
                    {
                      label: 'Searches',
                      fill: true,
                      data:
                        (filterDay === '1d' && dataDaySearchTrend?.map((data) => data.value)) ||
                        (filterDay === '1m' && dataMonthSearchTrend?.map((data) => data.value)) ||
                        (filterDay === '3m' && dataThreeMonthSearchTrend?.map((data) => data.value)) ||
                        (filterDay === '6m' && dataSixMonthSearchTrend?.map((data) => data.value)) ||
                        (filterDay === '1y' && dataYearSearchTrend?.map((data) => data.value)) ||
                        dataAllSearchTrend?.map((data) => data.value),

                      borderColor: 'rgb(96, 236, 142)',
                      backgroundColor: linearGradientGreen,
                      pointRadius: 2,
                      pointHoverRadius: 4,
                      pointStyle: 'line',
                      tension: smDown ? 0.6 : 0
                    },
                    {
                      label: 'Purchases',
                      fill: true,
                      data:
                        (filterDay === '1d' && dataDayPurchases?.map((data) => data.value)) ||
                        (filterDay === '1m' && dataMonthPurchases?.map((data) => data.value)) ||
                        (filterDay === '3m' && dataThreeMonthPurchases?.map((data) => data.value)) ||
                        (filterDay === '6m' && dataSixMonthPurchases?.map((data) => data.value)) ||
                        (filterDay === '1y' && dataYearPurchases?.map((data) => data.value)) ||
                        dataAllPurchases?.map((data) => data.value),
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
      </div>

      <div className='absolute z-10 xs:bottom-[-5%] xs:w-full xs:px-0 sm:bottom-[-10%] sm:w-[1400px] sm:px-4'>
        <div className='h-[398px] w-full bg-gradient-to-t from-[#F2F3F5] to-[#F2F3F5]/[.0] text-gray-400 xs:rounded-bl-[30px] xs:rounded-br-[30px] sm:rounded-bl-[60px] sm:rounded-br-[60px]'></div>
      </div>
    </section>
  )
})

export default ChartSection
