import { GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { IProductPriceOptions, IProductTable, ProductInfo } from '~/@types/models'
import images from '~/assets'
import LinkIcon from '~/components/icons/Link'
import DataTable from '~/components/table'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import useResponsive from '~/hooks/useResponsive'
import { formatLocaleString } from '~/utils/format'

type CustomGridColDef = GridColDef & {
  filterComponent?: string
}

const AgentTableRow = memo(({ isLoading, listProducts }: { isLoading: boolean; listProducts: ProductInfo[] }) => {
  const navigate = useNavigate()

  const xlDown = useResponsive('down', 'xl')
  const lgDown = useResponsive('down', 'lg')
  const mdDown = useResponsive('down', 'md')
  const smDown = useResponsive('down', 'sm')

  const formattedProducts: IProductTable[] = useMemo(() => {
    return listProducts?.flatMap((product) => ({
      id: `${product.product.id}`,
      productName: product.product.params.name,
      categoryID: product.product.params.categoryID,
      createdAt: product.product.createdAt,
      imported: product.variants.reduce((acc, variant) => acc + Number(variant.priceOptions.quantity), 0),
      sold: product.product.params.sold,
      left:
        product.variants.reduce((acc, variant) => acc + Number(variant.priceOptions.quantity), 0) -
        +product.product.params.sold,
      status: product.product.params.isApprove === true ? 'Approve' : 'Pending',
      isFlashSale: product.product.params.isFlashSale,
      attributes: product.attributes,
      variants: product.variants,
      vipPrice: String(product.variants?.[0].priceOptions.vipPrice),
      retailer: product.product.params.retailer,
      images: product.product.params.images
    }))
  }, [listProducts])

  const columns: CustomGridColDef[] = useMemo(
    () => [
      {
        field: 'productName',
        headerName: 'PRODUCT',
        width: smDown ? 200 : mdDown ? 220 : lgDown ? 240 : xlDown ? 260 : 280,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        filterComponent: 'ProductFilter',
        renderCell: ({ value, row }) => {
          return (
            <div className='flex h-full items-center xs:gap-2 sm:gap-3 md:gap-3 lg:gap-3 xl:gap-4'>
              <img
                alt='Profile'
                src={row.images?.[0] || images.logo.logo_e_commerce}
                className='shrink-0 rounded-lg object-cover object-center xs:size-[52px] sm:size-[56px] md:size-[60px] lg:size-[64px] xl:size-[64px]'
              />
              <div className='flex h-full w-full flex-col overflow-hidden xs:gap-1 xs:pt-3 sm:gap-2 sm:pt-4 md:gap-2 lg:gap-[10px]'>
                <div className='truncate font-customSemiBold xs:text-[16px]/[16.8px] sm:text-[20px]/[20.8px] md:text-[22px]/[22.8px] lg:text-[24px]/[25px]'>
                  {value}
                </div>
              </div>
            </div>
          )
        }
      },
      {
        field: 'createdAt',
        headerName: 'POST TIME',
        width: smDown ? 160 : mdDown ? 180 : lgDown ? 200 : xlDown ? 220 : 240,
        filterable: false,
        filterComponent: 'DateFilter',
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value }) => (
          <div className='flex h-full items-center'>
            <div className='xs:text-[14px]/[14.7px] sm:text-[16px]/[16.8px] md:text-[18px]/[18.9px] lg:text-[20px]/[21px]'>
              {format(Number(value * 1000), 'dd/MM/yyyy, HH:mm:ss')}
            </div>
          </div>
        )
      },
      {
        field: 'variants',
        headerName: 'PRICE',
        width: smDown ? 140 : mdDown ? 160 : lgDown ? 180 : xlDown ? 200 : 220,
        filterable: false,
        filterComponent: 'PriceFilter',
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value }) => {
          const prices = value?.[0].priceOptions as IProductPriceOptions
          return (
            <div className='flex h-full w-full items-center'>
              <div className='font-customMedium xs:text-[14px]/[14.7px] sm:text-[16px]/[16.8px] md:text-[18px]/[18.9px] lg:text-[20px]/[21px]'>
                ${(+prices?.vipPrice / 10 ** 18).toFixed(2)} - ${(+prices?.memberPrice / 10 ** 18).toFixed(2)}
              </div>
            </div>
          )
        }
      },
      {
        field: 'imported',
        headerName: 'QUANTITY',
        width: smDown ? 90 : mdDown ? 100 : lgDown ? 100 : xlDown ? 120 : 140,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value }) => (
          <div className='flex h-full items-center'>
            <div className='xs:text-[14px]/[14.7px] sm:text-[16px]/[16.8px] md:text-[18px]/[18.9px] lg:text-[20px]/[21px]'>
              {formatLocaleString(value)}
            </div>
          </div>
        )
      },
      {
        field: 'sold',
        headerName: 'SOLD',
        width: smDown ? 80 : mdDown ? 90 : lgDown ? 100 : xlDown ? 120 : 140,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value }) => (
          <div className='flex h-full items-center'>
            <div className='xs:text-[14px]/[14.7px] sm:text-[16px]/[16.8px] md:text-[18px]/[18.9px] lg:text-[20px]/[21px]'>
              {formatLocaleString(value)}
            </div>
          </div>
        )
      },
      {
        field: 'left',
        headerName: 'LEFT',
        width: smDown ? 90 : mdDown ? 100 : lgDown ? 110 : xlDown ? 120 : 140,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value }) => (
          <div className='flex h-full items-center'>
            <div className='xs:text-[14px]/[14.7px] sm:text-[16px]/[16.8px] md:text-[18px]/[18.9px] lg:text-[20px]/[21px]'>
              {formatLocaleString(value)}
            </div>
          </div>
        )
      },
      {
        field: 'id',
        headerName: '',
        width: 20,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value }) => (
          <div className='flex h-full items-center'>
            <button
              className='cursor-pointer border-none outline-none focus:outline-none'
              onClick={() => navigate(PATH_PRIVATE_APP.product.root + `/detail/${value}`)}
            >
              <LinkIcon className='size-[18px]' />
            </button>
          </div>
        )
      }
    ],
    [smDown, mdDown, lgDown, xlDown]
  )

  return (
    <DataTable
      model='products'
      isLoading={isLoading}
      columns={columns}
      rows={formattedProducts}
      pageSizes={5}
      title=''
      rowHeight={70}
    />
  )
})

export default AgentTableRow
