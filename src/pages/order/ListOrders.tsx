import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { CheckoutTypeEnum, OrderStatus, Role } from '~/@types/enums'
import { LIST_ORDER_STATUS_OPTIONS } from '~/@types/listOptionCommon'
import { IOrder, ProductInfo } from '~/@types/models'
import { QuickFilterButton } from '~/components/button'
import { DateRangePickerFilter } from '~/components/datePickerFilter'
import { EmptyList } from '~/components/emptyList'
import { FilterSelect } from '~/components/filterSelect'
import { SortIcon } from '~/components/icons'
import OrderCart from '~/components/orderCard'
import StatusProgressBar from '~/components/progressBar'
import Search from '~/components/search/Search'
import { useHorizontalScroll } from '~/hooks/useHorizontalScroll'
import useInfiniteScroll from '~/hooks/useInfiniteScroll'
import FilterLayout from '~/layouts/components/filter'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import { getListOrders } from '~/redux/order/order.slice'
import { cn } from '~/utils/classNames'
import { calculateTotalCount } from '~/utils/covertStatus'
import { getPagePagination } from '~/utils/handleArray'

const ListOrder = memo(() => {
  const dispatch = useAppDispatch()

  const { activeWallet, userRole } = useAppSelector((s) => s.user)
  const { listProducts } = useAppSelector((s) => s.product)

  const { isLoading, listOrders } = useAppSelector((s) => s.order)

  const { scrollRef, handleMouseDown } = useHorizontalScroll()

  const [itemPerPage, setItemPerPage] = useState<number>(5)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortFilter, setSortFilter] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.AWAITING)
  const [checkoutTypeSelected, setCheckoutTypeSelected] = useState<CheckoutTypeEnum>(CheckoutTypeEnum.RECEIVE)
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })
  const [listOrdersMap, setListOrdersMap] = useState<IOrder[]>([])

  const listOrderByRole = useMemo(() => {
    const productIdsSet = new Set(listProducts.map((product) => product.product.id))

    return +userRole === Role.ADMIN
      ? listOrders
      : listOrders.filter((order) => order.productIds.some((productId) => productIdsSet.has(productId)))
  }, [userRole, activeWallet, listOrders, listProducts])

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range)
  }, [])

  const handleStatusFilter = useCallback((status: number) => {
    setSelectedStatus(status)
    if (status === OrderStatus.STORAGE) {
      setCheckoutTypeSelected(CheckoutTypeEnum.STORAGE)
    } else {
      setCheckoutTypeSelected(CheckoutTypeEnum.RECEIVE)
    }
  }, [])

  useEffect(() => {
    dispatch(getListOrders())
  }, [])

  useEffect(() => {
    if (listOrderByRole) {
      const newListOrder = listOrderByRole.map((order) => {
        let listProductMap: ProductInfo[] = []

        listProducts.forEach((product) => {
          order.productIds.forEach((id, index) => {
            if (product.product.id === id) {
              const variantIdx = product.variants.findIndex((vari) => vari.variantID === order.variantIds[index])
              listProductMap.push({
                ...product,
                quantityInOrder: Number(order.quantities[index] ? order.quantities[index] : 0),
                priceInOrder: Number(order.prices[index] ? order.prices[index] : 0),
                variant: product.variants.find((vari) => vari.variantID === order.variantIds[index]),
                attribute: product.attributes[variantIdx]
              })
            }
          })
        })

        const newOrder: IOrder = {
          ...order,
          productDetails: listProductMap
        }

        return newOrder
      })
      setListOrdersMap(newListOrder)
    }
  }, [listProducts, listOrderByRole])

  const filteredOrders = useMemo(() => {
    return [...listOrdersMap]
      .filter((order) => {
        if (searchTerm) {
          const lowerKeyword = searchTerm.toLowerCase().trim()
          const productIds = listProducts
            .filter((product) => product.product.params.name.toLowerCase().includes(lowerKeyword))
            .map((product) => product.product.id)
          return order.productIds.some((productId) => productIds.includes(productId))
        }
        return true
      })
      .filter((order) => {
        if (dateRange.from) {
          const fromDate = Number(new Date(dateRange.from))
          const toDate = dateRange.to ? Number(new Date(dateRange.to)) : Number(new Date())
          const orderDate = new Date(Number(order.createdAt.padEnd(13, '0'))).setHours(0, 0, 0, 0)

          return orderDate >= fromDate && orderDate <= toDate
        }
        return true
      })
      .filter((order) =>
        checkoutTypeSelected === CheckoutTypeEnum.STORAGE
          ? +order.checkoutType === checkoutTypeSelected
          : +order.orderStatus === selectedStatus && +order.checkoutType === checkoutTypeSelected
      )
      .sort((a, b) =>
        sortFilter === 'newest to oldest'
          ? Number(b.createdAt) - Number(a.createdAt)
          : Number(a.createdAt) - Number(b.createdAt)
      )
  }, [listOrdersMap, searchTerm, dateRange, selectedStatus, sortFilter])

  const { itemsData } = useInfiniteScroll({
    items: filteredOrders,
    itemsPerPage: 2,
    query: document.querySelector('.order-content')
  })

  const listTrackOrderPagination = useMemo(
    () => getPagePagination(filteredOrders, 1, itemPerPage),
    [filteredOrders, itemPerPage]
  )

  return (
    <div className='bg-list-order bg-top bg-no-repeat p-3 lg:p-5'>
      <div className='flex-1 bg-[#f4f6fc] shadow-header 2xs:!mt-16 xs:mt-16 xs:rounded-2xl xs:px-[14px] xs:py-6 sm:mt-[80px] sm:rounded-3xl sm:px-5 sm:py-5 md:px-10 md:py-10 lg:px-12 lg:py-10 xl:px-20 xl:py-12'>
        <div className='flex w-full items-center justify-between md:mb-2 lg:mb-0'>
          <FilterLayout title='Order Management'>
            <Search onSearch={(value) => handleSearch(value)} placeHolder='Search by Order ID ...' className='w-full' />
            <FilterSelect
              triggerClassName='w-[48px] md:w-[350px]'
              option={[
                { value: 'newest to oldest', label: 'Newest to Oldest' },
                { value: 'oldest to newest', label: 'Oldest to Newest' }
              ]}
              placeholder='Newest to Oldest'
              icon={<SortIcon />}
              hasFilterText={false}
              onChange={(value) => setSortFilter(value)}
            />
            <DateRangePickerFilter onConfirm={(value) => handleDateRangeChange(value)} />
          </FilterLayout>
        </div>

        <StatusProgressBar listOrders={listOrderByRole} />

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          className='wrapper-content mb-3 flex w-full overflow-auto pb-1 2xs:mt-4 2xs:gap-[8px] xs:mb-8 xs:mt-4 xs:gap-[8px] sm:mt-4 sm:gap-2 md:mb-8 md:mt-5 md:gap-4 lg:mb-0 lg:mt-6'
        >
          {LIST_ORDER_STATUS_OPTIONS.map((item) => (
            <QuickFilterButton
              key={item.value}
              isOrderStatus
              status={item.value.toString()}
              active={selectedStatus === item.value}
              totalCount={calculateTotalCount(listOrderByRole, item.value)}
              onClick={() => handleStatusFilter(item.value)}
              className='w-full'
            />
          ))}
        </div>

        <div className='flex-col gap-10 xs:flex sm:flex md:flex lg:flex xl:hidden'>
          {listTrackOrderPagination.length === 0 ? (
            <EmptyList model='orders' />
          ) : !isLoading ? (
            listTrackOrderPagination.map((order: IOrder, index: number) => <OrderCart key={index} order={order} />)
          ) : isLoading ? (
            <EmptyList isLoading={isLoading} model='orders' />
          ) : null}
          {filteredOrders.length > 5 && !isLoading && (
            <button
              onClick={() => {
                if (itemPerPage < filteredOrders.length) {
                  setItemPerPage(itemPerPage + 2)
                } else {
                  setItemPerPage(5)
                }
              }}
              className='cursor-pointer'
            >
              <p className='2xs:text-[14px]/[1 8.9px] font-customMedium text-blue-main underline xs:text-[14px]/[18.9px] sm:text-[16px]/[24px] md:text-[20px]/[24px]'>
                {itemPerPage < filteredOrders.length ? 'View more' : 'View less'}
              </p>
            </button>
          )}
        </div>

        <div
          className={cn(
            itemsData.length === 0 || isLoading ? 'pr-0' : 'pr-[10px]',
            'order-content max-h-[600px] flex-col gap-10 overflow-y-auto pt-[30px] xs:hidden sm:hidden md:hidden lg:hidden xl:flex'
          )}
        >
          <style>
            {`
              .order-content::-webkit-scrollbar {
                width: 2px;
                margin-top: 32px;
              }
              .order-content::-webkit-scrollbar-track {
                background: #f1f1f1;
                margin-top: 32px;
              }
              .order-content::-webkit-scrollbar-thumb {
                background: #636364;
                border-radius: 4px;
              }
              .order-content::-webkit-scrollbar-thumb:hover {
                background: #636364;
              }
            `}
          </style>
          {itemsData.length === 0 ? (
            <EmptyList model='orders' />
          ) : !isLoading ? (
            itemsData.map((order: IOrder, index: number) => <OrderCart key={index} order={order} />)
          ) : isLoading ? (
            <EmptyList isLoading={isLoading} model='orders' />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  )
})

export default ListOrder
