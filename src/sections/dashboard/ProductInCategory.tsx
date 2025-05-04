import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip, PointElement } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { memo, useEffect, useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import { Link } from 'react-router-dom'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import useResponsive from '~/hooks/useResponsive'
import { useAppSelector } from '~/redux/configStore'
import { formatLocaleString } from '~/utils/format'

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip, ChartDataLabels)

const ProductInCategory = memo(() => {
  const smDown = useResponsive('down', 'sm')

  const chartRewardRef = useRef<ChartJS<'bar'>>(null)

  const { listProducts } = useAppSelector((s) => s.product)
  const { listCategories } = useAppSelector((s) => s.category)

  const productCountByCategory = listCategories.map((category) => {
    const count = listProducts.filter((product) => product.product.params.categoryID === category.id).length
    return count
  })

  useEffect(() => {
    if (listCategories.length > 0) {
      const chart = chartRewardRef.current
      if (chart) {
        const datasets = chart.data.datasets[0].data as number[]
        let maxIdx = 0
        let maxValue = 0

        datasets?.forEach((value, idx) => {
          if (value > maxValue) {
            maxValue = value
            maxIdx = idx
          }
        })

        const meta = chart.getDatasetMeta(0)
        const pointElement = meta.data[maxIdx] as PointElement
        const position = pointElement?.getCenterPoint()

        const tooltip = chart.tooltip
        tooltip?.setActiveElements([{ datasetIndex: 0, index: maxIdx }], { x: position?.x, y: position?.y })
        chart.update()
      }
    }
  }, [listCategories, chartRewardRef])

  return (
    <div className='h-[310px] w-full rounded-[18px] bg-white/[.88] px-5 py-4 shadow-popover-custom backdrop-blur-[80px]'>
      <h6 className='font-customSemiBold text-[22px]/[32px] capitalize'>Product quantity by category</h6>

      <div className='my-2 h-[210px] w-full'>
        <div className='h-full w-full'>
          <Bar
            ref={chartRewardRef}
            options={{
              indexAxis: smDown ? 'x' : 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                datalabels: {
                  font: { size: 12 },
                  color: '#fff',
                  anchor: 'end',
                  align: 'start',
                  formatter: (value) => (value > 0 ? formatLocaleString(value) : '')
                },
                legend: { display: false },
                tooltip: {
                  displayColors: false,
                  callbacks: {
                    title: () => '',
                    label: (tooltipItem) =>
                      `${tooltipItem.label}: ${formatLocaleString(tooltipItem.raw)} ${Number(tooltipItem.raw) > 1 ? 'products' : 'product'}`
                  }
                }
              },
              scales: {
                x: {
                  display: true,
                  grid: { display: !smDown },
                  border: { display: smDown, color: 'rgb(218, 218, 218)' },
                  ticks: { display: smDown, color: 'rgb(13, 13, 13)', font: { size: 14 } }
                },
                y: {
                  display: true,
                  grid: { display: smDown },
                  border: { display: !smDown, color: 'rgb(218, 218, 218)' },
                  ticks: { display: !smDown, color: 'rgb(13, 13, 13)', font: { size: 14 } }
                }
              }
            }}
            data={{
              labels: listCategories?.map((c) => c.name),
              datasets: [
                {
                  barThickness: smDown ? 40 : 24,
                  data: productCountByCategory,
                  borderColor: 'rgb(172, 204, 255)',
                  backgroundColor: (ctx) => {
                    const chart = ctx.chart
                    const { ctx: canvasCtx } = chart
                    const gradient = smDown
                      ? canvasCtx.createLinearGradient(0, 0, 0, chart.height)
                      : canvasCtx.createLinearGradient(0, 0, chart.width, 0)
                    gradient.addColorStop(0, 'rgba(175, 221, 244, 1)')
                    gradient.addColorStop(1, 'rgba(52, 179, 241, 1)')
                    return gradient
                  },
                  hoverBackgroundColor: (ctx) => {
                    const chart = ctx.chart
                    const { ctx: canvasCtx } = chart
                    const gradient = smDown
                      ? canvasCtx.createLinearGradient(0, 0, 0, chart.height)
                      : canvasCtx.createLinearGradient(0, 0, chart.width, 0)
                    gradient.addColorStop(0, 'rgba(175, 221, 244, 1)')
                    gradient.addColorStop(1, 'rgba(52, 179, 241, 1)')
                    return gradient
                  }
                }
              ]
            }}
          />
        </div>
      </div>

      <Link to={PATH_PRIVATE_APP.product.list} className='block text-right text-blue-dark underline'>
        See more
      </Link>
    </div>
  )
})

export default ProductInCategory
