import { GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Role } from '~/@types/enums'
import { IProductAttrs, IProductPriceOptions, IProductTable } from '~/@types/models'
import images from '~/assets'
import { listColors } from '~/assets/mocks/color'
import { DateRangePickerFilter } from '~/components/datePickerFilter'
import { FilterSelect } from '~/components/filterSelect'
import { CheckSuccessIcon, EditIcon } from '~/components/icons'
import LinkIcon from '~/components/icons/Link'
import PendingIcon from '~/components/icons/PendingIcon'
import Search from '~/components/search/Search'
import DataTable from '~/components/table'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import useResponsive from '~/hooks/useResponsive'
import FilterLayout from '~/layouts/components/filter'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import { getListCustomers } from '~/redux/customer/customer.slice'
import {
  clearProductReview,
  getListProducts,
  getListProductsRetailer,
  setEditingProduct
} from '~/redux/product/product.slice'
import { cn } from '~/utils/classNames'
import { ConverCategory, ConvertStatus } from '~/utils/covertStatus'
import { formatLocaleString, shortCenter } from '~/utils/format'

type CustomGridColDef = GridColDef & {
  filterComponent?: string
}

const ListProduct = memo(() => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { userRole } = useAppSelector((s) => s.user)
  const { listProducts } = useAppSelector((s) => s.product)
  const { listCustomers } = useAppSelector((s) => s.customer)

  const xlDown = useResponsive('down', 'xl')
  const lgDown = useResponsive('down', 'lg')
  const mdDown = useResponsive('down', 'md')
  const smDown = useResponsive('down', 'sm')

  const isAdmin = useMemo(() => +userRole === Role.ADMIN, [userRole])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [agentFilter, setAgentFilter] = useState('all')
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })

  const formattedProducts: IProductTable[] = useMemo(() => {
    return listProducts.flatMap((product) => ({
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

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      if (+userRole === Role.RETAILER) {
        await dispatch(getListProductsRetailer())
      } else {
        await Promise.all([dispatch(getListProducts()), dispatch(getListCustomers())])
      }
      setIsLoading(false)
    })()
  }, [setIsLoading, userRole])

  console.log('isLoading', isLoading)

  const columns: CustomGridColDef[] = useMemo(
    () => [
      {
        field: 'productName',
        headerName: 'PRODUCT NAME',
        width: smDown ? 200 : mdDown ? 280 : lgDown ? 300 : xlDown ? 310 : 320,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        filterComponent: 'ProductFilter',
        renderCell: ({ value, row }) => {
          const arrt = row.attributes as IProductAttrs[][]
          const listImages = row.images as string[]

          return (
            <div className='flex h-full items-center xs:gap-2 sm:gap-3 md:gap-3 lg:gap-3 xl:gap-4'>
              <img
                alt='Profile'
                src={listImages?.length > 0 ? row.images?.[0] : images.logo.logo_e_commerce}
                className='shrink-0 rounded-lg object-cover object-center xs:size-[52px] sm:size-[66px] md:size-[76px] lg:size-[90px] xl:size-[96px]'
              />
              <div className='flex h-full w-full flex-col overflow-hidden xs:gap-1 xs:pt-3 sm:gap-2 sm:pt-4 md:gap-2 lg:gap-[10px]'>
                <div className='truncate font-customSemiBold xs:text-[16px]/[16.8px] sm:text-[20px]/[20.8px] md:text-[22px]/[22.8px] lg:text-[24px]/[25px]'>
                  {value}
                </div>

                <div className='h-5'>
                  {arrt?.[0]?.length > 0 ? (
                    arrt?.[0]?.length === 1 ? (
                      <div className='capitalize text-black-main/[.64] xs:text-[14px]/[14.7px] sm:text-[16px]/[16.8px] md:text-[17px]/[17.8px] lg:text-[18px]/[18.9px]'>
                        Capacity: {arrt?.[0]?.[0].value}
                      </div>
                    ) : (
                      <div className='flex h-6 items-center gap-1 font-customMedium'>
                        <div
                          className='flex size-6 shrink-0 items-center justify-center rounded-full'
                          style={{
                            fontSize: '12px',
                            backgroundColor: arrt?.[0]?.[0].value || '#000000',
                            color:
                              arrt?.[0]?.[0].value === '#ffffff' || arrt?.[0]?.[0].value === '#FFCC00'
                                ? '#000'
                                : '#fff',
                            transition: 'color 300ms ease-in-out'
                          }}
                        >
                          {listColors?.find((c) => c.value === arrt?.[0]?.[0].value)?.label || listColors[0].label}
                        </div>
                        -
                        <div
                          className='flex size-6 shrink-0 items-center justify-center rounded-full bg-[#C7C7CC]'
                          style={{
                            fontSize:
                              arrt?.[0]?.[1].value === 'XXS' ||
                              arrt?.[0]?.[1].value === 'XXL' ||
                              arrt?.[0]?.[1].value === '3XL'
                                ? '10px'
                                : '12px'
                          }}
                        >
                          {arrt?.[0]?.[1].value}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className='capitalize text-black-main/[.64] xs:text-[14px]/[14.7px] sm:text-[16px]/[16.8px] md:text-[17px]/[17.8px] lg:text-[18px]/[18.9px]'>
                      {ConverCategory(row.categoryID)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }
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
        field: 'createdAt',
        headerName: 'DATE POST',
        width: smDown ? 120 : mdDown ? 130 : lgDown ? 140 : xlDown ? 150 : 160,
        filterable: false,
        filterComponent: 'DateFilter',
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value }) => (
          <div className='flex h-full items-center'>
            <div className='xs:text-[14px]/[14.7px] sm:text-[16px]/[16.8px] md:text-[18px]/[18.9px] lg:text-[20px]/[21px]'>
              {format(Number(value * 1000), 'dd/MM/yyyy')}
            </div>
          </div>
        )
      },
      {
        field: 'imported',
        headerName: 'IMPORTED',
        width: smDown ? 90 : mdDown ? 100 : lgDown ? 100 : xlDown ? 110 : 110,
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
        width: smDown ? 80 : mdDown ? 90 : lgDown ? 100 : xlDown ? 110 : 110,
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
        width: smDown ? 90 : mdDown ? 100 : lgDown ? 110 : xlDown ? 110 : 110,
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
        field: 'status',
        headerName: 'STATUS',
        width: smDown ? 120 : mdDown ? 150 : lgDown ? 160 : xlDown ? 160 : 160,
        filterable: false,
        sortable: false,
        filterComponent: 'StatusFilter',
        disableColumnMenu: true,
        renderCell: ({ value }) => {
          const { className } = ConvertStatus(value)
          return (
            <div className='flex h-full items-center'>
              <div
                className={cn(
                  className,
                  'flex items-center justify-center gap-2 rounded-[48px] text-black-main/[.64] xs:h-8 xs:px-2 xs:text-[14px]/[14.7px] sm:h-[40px] sm:px-3 sm:text-[16px]/[16.8px] md:h-[44px] md:px-3 md:text-[18px]/[18.9px] lg:h-[48px] lg:px-3 lg:text-[20px]/[20px]'
                )}
              >
                <span>
                  {value === 'Approve' ? <CheckSuccessIcon className='size-5' /> : <PendingIcon className='size-5' />}
                </span>
                {value}
              </div>
            </div>
          )
        }
      },
      {
        field: 'id',
        headerName: '',
        width: 20,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value, row }) => (
          <div className='flex h-full items-center'>
            <button
              className='cursor-pointer border-none outline-none focus:outline-none'
              onClick={() => {
                if (+userRole === Role.RETAILER) {
                  dispatch(clearProductReview())
                  dispatch(setEditingProduct(true))
                  navigate({
                    pathname: PATH_PRIVATE_APP.product.root + `/update/${value}`,
                    search: createSearchParams({
                      isEditing: '1',
                      creaetProductType: row.isFlashSale ? 'product-sale' : 'product'
                    }).toString()
                  })
                  console.log('go update')
                } else {
                  navigate(PATH_PRIVATE_APP.product.root + `/detail/${value}`)
                }
              }}
            >
              {+userRole === Role.RETAILER ? (
                <EditIcon className='size-[18px]' color='#007AFF' opacity='0.44' />
              ) : (
                <LinkIcon className='size-[18px]' />
              )}
            </button>
          </div>
        )
      }
    ],
    [userRole, smDown, mdDown, lgDown, xlDown]
  )

  const filteredProducts = useMemo(() => {
    let filtered = formattedProducts

    if (searchTerm) {
      filtered = filtered.filter((product) => product.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (dateRange.from) {
      const fromDayFormat = format(dateRange.from, 'MM/dd/yyyy')
      const toDayFormat = dateRange.to ? format(dateRange.to, 'MM/dd/yyyy') : format(dateRange.from, 'MM/dd/yyyy')
      const fromDay = new Date(fromDayFormat).getTime()
      const toDay = new Date(toDayFormat).getTime()
      console.log('fromDay', fromDayFormat, fromDay)
      console.log('toDay', toDayFormat, toDay)

      filtered = filtered.filter((customer) => {
        const customerDay = new Date(format(Number(customer.createdAt) * 1000, 'MM/dd/yyyy')).getTime()
        return customerDay >= fromDay && customerDay <= toDay
      })
    }

    if (agentFilter !== 'all') {
      filtered = filtered.filter((product) => product.retailer === agentFilter)
    }

    return filtered
  }, [formattedProducts, searchTerm, dateRange, agentFilter])

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range)
  }, [])

  return (
    <div
      className={cn(
        isAdmin ? 'bg-list-product' : 'bg-list-product-retailer',
        'relative bg-top bg-no-repeat xs:p-4 sm:p-5'
      )}
    >
      <div className='bg-white/[.76] shadow-header backdrop-blur-[200px] 2xs:mt-12 xs:mt-14 xs:rounded-2xl xs:px-[14px] xs:py-6 sm:mt-[68px] sm:rounded-3xl sm:px-5 sm:py-5 md:px-10 md:py-10 lg:px-12 lg:py-10 xl:px-20 xl:py-12'>
        <FilterLayout title='Product Management'>
          <Search
            onSearch={handleSearch}
            placeHolder='Search By Name ...'
            className='xs:w-full sm:w-full md:w-full lg:w-[328px]'
          />
          <DateRangePickerFilter onConfirm={handleDateRangeChange} className='xs:w-10 sm:w-[216px]' />
          {isAdmin && (
            <FilterSelect
              option={[
                { value: 'all', label: 'All agents' },
                ...listCustomers
                  .filter((agent) => +agent.role === Role.RETAILER)
                  .map((agent) => ({
                    value: agent.user,
                    label: agent.fullName === '' ? `Agent ${shortCenter(agent.id)}` : agent.fullName
                  }))
              ]}
              placeholder='Filter by agent'
              hasFilterText={false}
              onChange={setAgentFilter}
              triggerClassName='xs:w-10 sm:w-[216px]'
            />
          )}
        </FilterLayout>
        <DataTable
          title=''
          model='products'
          isLoading={isLoading}
          pageSizes={smDown ? 7 : mdDown ? 6 : 5}
          rowHeight={smDown ? 68 : 112}
          columns={columns}
          hasHeaderTable={true}
          rows={filteredProducts}
        />
      </div>

      {!isAdmin && (
        <button
          onClick={() => navigate(PATH_PRIVATE_APP.product.add)}
          className='absolute flex shrink-0 items-center justify-center rounded-full border-[2px] border-solid border-white/[.3] bg-ln-button-post-product shadow-18xl transition duration-200 ease-in-out hover:scale-[102%] xs:bottom-8 xs:right-8 xs:size-14 sm:bottom-8 sm:right-8 sm:size-14 md:bottom-10 md:right-10 md:size-16'
        >
          <img src={images.icons.post_product} alt='post-product' className='xs:size-6 sm:size-6 md:size-8' />
        </button>
      )}
    </div>
  )
})

export default ListProduct
