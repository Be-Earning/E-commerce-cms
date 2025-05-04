import { format } from 'date-fns'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Role } from '~/@types/enums'
import { IAgentTable, ICustomerInfor } from '~/@types/models'
import { DateRangePickerFilter } from '~/components/datePickerFilter'
import LinkIcon from '~/components/icons/Link'
import Search from '~/components/search/Search'
import DataTable from '~/components/table'
import useResponsive from '~/hooks/useResponsive'
import FilterLayout from '~/layouts/components/filter'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import { getListCustomers } from '~/redux/customer/customer.slice'
import { getListProducts } from '~/redux/product/product.slice'
import { CustomGridColDef } from '~/sections/customer/customerModel'
import { cn } from '~/utils/classNames'
import { formatDateV2, shortCenter } from '~/utils/format'

const ListAgents = memo(() => {
  const dispatch = useAppDispatch()

  const { pathname } = useLocation()

  const { listProducts } = useAppSelector((s) => s.product)
  const { listCustomers, isLoading } = useAppSelector((s) => s.customer)

  const xlDown = useResponsive('down', 'xl')
  const lgDown = useResponsive('down', 'lg')
  const mdDown = useResponsive('down', 'md')
  const smDown = useResponsive('down', 'sm')

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredProducts, setFilteredProducts] = useState<ICustomerInfor[]>()
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })

  useEffect(() => {
    dispatch(getListCustomers())
    dispatch(getListProducts())
  }, [])

  const listCustomersByRole = useMemo(
    () => listCustomers.filter((customer) => +customer.role === Role.RETAILER),
    [listCustomers]
  )

  const listDataTable: IAgentTable[] = useMemo(() => {
    return listCustomersByRole.flatMap((customer, index) => {
      const productsOfCustomer = listProducts.filter((p) => p.product.params.retailer === customer.user)
      return {
        ...customer,
        id: `${index + 1}`,
        productPosted: productsOfCustomer.length,
        productSold: productsOfCustomer.reduce((total: number, product) => total + +product.product.params.sold, 0)
      }
    })
  }, [listCustomersByRole, listProducts, pathname])

  const columsMangement: CustomGridColDef[] = useMemo(() => {
    const allColumns: CustomGridColDef[] = [
      {
        field: 'fullName',
        headerName: 'AGENT',
        width: smDown ? 200 : mdDown ? 220 : lgDown ? 250 : xlDown ? 300 : 350,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        filterComponent: 'CustomerFilter',
        renderCell: ({ value, row }) => {
          return (
            <div className='flex h-full items-center rp-table-space'>
              <img
                alt='avatar'
                src={row.image || 'https://img.fi.ai/avatar_image/1.png'}
                className='shrink-0 rounded-lg object-cover object-center shadow-avatar xs:size-[52px] sm:size-[56px] md:size-[60px] lg:size-[64px]'
              />
              <div className='flex flex-col gap-2'>
                <div className='font-customSemiBold rp-lg-text'>{value}</div>

                <div className='text-black-main/[.64] rp-md-text'>ID: {shortCenter(row.user)}</div>
              </div>
            </div>
          )
        }
      },
      {
        field: 'createdAt',
        headerName: 'RETRISTRATION DATE',
        filterComponent: 'DateFilter',
        width: smDown ? 140 : mdDown ? 160 : lgDown ? 180 : xlDown ? 240 : 280,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value }) => (
          <div className='flex h-full items-center'>
            <div className='rp-xl-text'>{formatDateV2(+value * 1000)}</div>
          </div>
        )
      },
      {
        field: 'productPosted',
        headerName: 'PRODUCTS POSTED',
        width: smDown ? 100 : mdDown ? 120 : lgDown ? 160 : xlDown ? 200 : 240,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value }) => (
          <div className='flex h-full items-center'>
            <div className='rp-xl-text'>{value}</div>
          </div>
        )
      },
      {
        field: 'productSold',
        headerName: 'PRODUCTS SOLD',
        width: smDown ? 100 : mdDown ? 140 : lgDown ? 180 : xlDown ? 200 : 240,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value }) => (
          <div className='flex h-full items-center'>
            <div className='rp-xl-text'>{value}</div>
          </div>
        )
      },
      {
        field: 'user',
        headerName: '',
        width: 20,
        filterable: false,
        sortable: false,
        disableColumnMenu: true,
        renderCell: ({ value }) => {
          const pathDetail = `/agent/detail/${value}`
          return (
            <div className='flex h-full w-full items-center'>
              <Link to={pathDetail} className='cursor-pointer border-none outline-none focus:outline-none'>
                <LinkIcon />
              </Link>
            </div>
          )
        }
      }
    ]

    return allColumns
  }, [xlDown, smDown, mdDown, lgDown, listDataTable, pathname])

  useEffect(() => {
    let filtered = listDataTable || []

    if (searchTerm)
      filtered = filtered.filter((customer) => customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))

    if (dateRange.from) {
      const fromDayFormat = format(dateRange.from, 'MM/dd/yyyy')
      const toDayFormat = dateRange.to ? format(dateRange.to, 'MM/dd/yyyy') : format(new Date(), 'MM/dd/yyyy')
      const fromDay = new Date(fromDayFormat).getTime()
      const toDay = new Date(toDayFormat).getTime()

      filtered = filtered.filter((customer) => {
        const customerDay = new Date(format(Number(customer.createdAt) * 1000, 'MM/dd/yyyy')).getTime()
        return customerDay >= fromDay && customerDay <= toDay
      })
    }

    setFilteredProducts(filtered)
  }, [searchTerm, dateRange])

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range)
  }, [])

  return (
    <div className={cn('bg-list-agent', 'bg-top bg-no-repeat xs:p-4 sm:p-5')}>
      <div className='bg-white/[.76] shadow-header backdrop-blur-[200px] xs:mt-14 xs:rounded-2xl xs:px-[14px] xs:py-6 sm:mt-[68px] sm:rounded-3xl sm:px-5 sm:py-5 md:px-10 md:py-10 lg:px-12 lg:py-10 xl:px-20 xl:py-12'>
        <FilterLayout title={`Agent Management`}>
          <Search onSearch={(value) => handleSearch(value)} placeHolder='Search By Name ...' />
          <DateRangePickerFilter onConfirm={(value) => handleDateRangeChange(value)} />
        </FilterLayout>
        <DataTable
          title=''
          pageSizes={7}
          rowHeight={smDown ? 65 : mdDown ? 70 : lgDown ? 75 : 80}
          tableHeight={smDown ? 650 : mdDown ? 680 : lgDown ? 710 : 750}
          isLoading={isLoading}
          hasHeaderTable={false}
          columns={columsMangement}
          model='agents'
          rows={filteredProducts || []}
        />
      </div>
    </div>
  )
})

export default ListAgents
