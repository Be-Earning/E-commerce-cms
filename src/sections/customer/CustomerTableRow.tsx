import { GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { FC, memo, useCallback, useMemo, useRef, useState } from 'react'
import { PaymentTypeEnum } from '~/@types/enums'
import { EnumListProductType } from '~/@types/enums/list'
import { ICustomerPurchases, IOrder, IProductPriceOptions, ProductInfo } from '~/@types/models'
import { AttributeItem } from '~/components/attributeItem'
import LinkIcon from '~/components/icons/Link'
import ImageGroup from '~/components/imageGroup'
import DataTable from '~/components/table'
import useResponsive from '~/hooks/useResponsive'
import { useAppSelector } from '~/redux/configStore'
import { ConverStatusToString, ConvertStatus } from '~/utils/covertStatus'
import { formatDateV2, formatPrice, shortCenter } from '~/utils/format'
import { OrderDetailDialog } from '../order'
import { OrderDetailDialogRef } from '../order/OrderDetailDialog'
import { cn } from '~/utils/classNames'

type CustomGridColDef = GridColDef & {
  filterComponent?: string
}

interface ICustomerTableRow {
  categoryTabs: number
  isLoading: boolean
  customerPurchaseData: ICustomerPurchases
}

const CustomerTableRow: FC<ICustomerTableRow> = memo(({ categoryTabs, isLoading, customerPurchaseData }) => {
  const dialogRef = useRef<OrderDetailDialogRef>(null)

  const xlDown = useResponsive('down', 'xl')
  const lgDown = useResponsive('down', 'lg')
  const mdDown = useResponsive('down', 'md')
  const smDown = useResponsive('down', 'sm')

  const { listProducts } = useAppSelector((s) => s.product)

  const [selectedOrderID, setSelectedOrderID] = useState<string>('')

  const handleClick = useCallback(
    (orderID: string) => {
      if (selectedOrderID === orderID) {
        setSelectedOrderID('')
      } else {
        setSelectedOrderID(orderID)
      }
      dialogRef.current?.handleOpen()
    },
    [selectedOrderID, dialogRef]
  )

  const listProductWishList = useMemo(
    () =>
      listProducts.filter((p) =>
        customerPurchaseData?._productIds.map((item) => item.productID).includes(p.product.id)
      ),
    [listProducts, customerPurchaseData]
  )

  const listProductCart = useMemo(
    () =>
      listProducts.filter((p) =>
        customerPurchaseData?._cart.items.map((item) => item.productID).includes(p.product.id)
      ),
    [listProducts, customerPurchaseData]
  )

  const dataWishlists = useMemo(() => {
    return listProductWishList.flatMap((product) => ({
      id: `${product.product.id}`,
      productName: product.product.params.name,
      images: product.product.params.images,
      timeToAdd: product.product.createdAt,
      variants: product.variants,
      attributes: product.attributes
    }))
  }, [listProducts, listProductWishList])

  const dataCarts = useMemo(() => {
    let listProductMap: any[] = []
    listProductCart.forEach((product) => {
      customerPurchaseData?._cart.items.forEach((item) => {
        if (product.product.id === item.productID) {
          const variantIdx = product.variants.findIndex((vari) => vari.variantID === item.variantID)
          listProductMap.push({
            id: `${product.product.id}-${item.variantID}`,
            productName: product.product.params.name,
            images: product.product.params.images,
            timeToAdd: product.product.createdAt,
            variant: product.variants[variantIdx],
            attribute: product.attributes[variantIdx],
            quantity: item?.quantity,
            totalPrice: Number(item?.quantity) * Number(product.variants[variantIdx]?.priceOptions.vipPrice)
          })
        }
      })
    })
    return listProductMap
  }, [listProducts, listProductCart, customerPurchaseData])

  const dataPurchases = useMemo(() => {
    return customerPurchaseData?._orders.map((order) => {
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

      const newOrder = {
        ...order,
        id: `${order.orderID}`,
        productDetails: listProductMap
      }

      return newOrder
    })
  }, [listProducts, customerPurchaseData])

  const columnsTotalPurchase: CustomGridColDef[] = [
    {
      field: 'productDetails',
      headerName: 'PRODUCT',
      width: smDown ? 190 : mdDown ? 200 : lgDown ? 210 : xlDown ? 220 : 170,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return (
          <div className='flex h-full items-center justify-start'>
            <ImageGroup images={value.map((product: ProductInfo) => product.product.params.images?.[0])} />
          </div>
        )
      }
    },
    {
      field: 'id',
      headerName: 'ORDER ID',
      width: smDown ? 140 : mdDown ? 150 : lgDown ? 160 : xlDown ? 170 : 140,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return (
          <div className='flex h-full w-full items-center'>
            <div className='font-customMedium rp-xl-text'>#{value}</div>
          </div>
        )
      }
    },
    {
      field: 'createdAt',
      headerName: 'DATE OF ORDER',
      width: smDown ? 120 : mdDown ? 130 : lgDown ? 140 : xlDown ? 150 : 160,
      filterable: false,
      filterComponent: 'DateFilter',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return (
          <div className='flex h-full w-full items-center'>
            <div className='font-customMedium rp-xl-text'>{format(Number(value * 1000), 'dd/MM/yyyy')}</div>
          </div>
        )
      }
    },
    {
      field: 'user',
      headerName: 'PAYMENT METHOD',
      width: smDown ? 120 : mdDown ? 120 : lgDown ? 130 : xlDown ? 140 : 160,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value, row }) => {
        return (
          <div className='flex h-full w-full items-center'>
            <div className='font-customMedium rp-xl-text'>
              {+row.paymentType === PaymentTypeEnum.VISA ? 'Visa' : ''}{' '}
              {+row.paymentType === PaymentTypeEnum.VISA ? `****${value.slice(-4)}` : shortCenter(value)}
            </div>
          </div>
        )
      }
    },
    {
      field: 'discount',
      headerName: 'DISCOUNT',
      width: smDown ? 100 : mdDown ? 110 : lgDown ? 120 : xlDown ? 130 : 120,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return (
          <div className='flex h-full w-full items-center'>
            <div className='font-customMedium rp-xl-text'>${formatPrice(value || 0, 2)}</div>
          </div>
        )
      }
    },
    {
      field: 'shippingPrice',
      headerName: 'SHIPPING',
      width: smDown ? 100 : mdDown ? 110 : lgDown ? 120 : xlDown ? 130 : 120,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return (
          <div className='flex h-full w-full items-center'>
            <div className='font-customMedium rp-xl-text'>${formatPrice(value || 0, 2)}</div>
          </div>
        )
      }
    },
    {
      field: 'totalPrice',
      headerName: 'TOTAL',
      width: smDown ? 110 : mdDown ? 120 : lgDown ? 130 : xlDown ? 140 : 140,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return (
          <div className='flex h-full w-full items-center'>
            <div className='font-customMedium rp-xl-text'>${formatPrice(value || 0, 2)}</div>
          </div>
        )
      }
    },
    {
      field: 'orderStatus',
      headerName: 'STATUS',
      width: smDown ? 140 : mdDown ? 150 : lgDown ? 160 : xlDown ? 170 : 180,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        const { className } = ConvertStatus(+value)
        return (
          <div className='flex h-full items-center'>
            <div
              className={cn(
                className,
                'flex h-[36px] min-w-[114px] items-center justify-center rounded-[4px] px-3 text-center text-[20px]/[21px]'
              )}
            >
              {ConverStatusToString(+value)}
            </div>
          </div>
        )
      }
    },
    {
      field: 'orderID',
      headerName: '',
      width: 20,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return (
          <>
            <div className='flex h-full w-full items-center'>
              <button
                onClick={() => handleClick(value)}
                className='cursor-pointer border-none outline-none focus:outline-none'
              >
                <LinkIcon />
              </button>
            </div>
          </>
        )
      }
    }
  ]

  const columsItemInCart: CustomGridColDef[] = [
    {
      field: 'productName',
      headerName: 'PRODUCT',
      width: smDown ? 200 : mdDown ? 250 : lgDown ? 300 : xlDown ? 320 : 350,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value, row }) => {
        return (
          <div className='flex h-full items-center xs:gap-2 sm:gap-3 md:gap-3 lg:gap-3 xl:gap-4'>
            <img
              alt='avatar'
              src={row.images?.[0] ? row.images?.[0] : 'https://img.fi.ai/avatar_image/1.png'}
              className='shrink-0 rounded-lg object-cover object-center shadow-avatar xs:size-[52px] sm:size-[56px] md:size-[60px] lg:size-[64px]'
            />
            <div className='space-y-1'>
              <p className='font-customMedium rp-xl-text'>{value}</p>
              <AttributeItem attribute={row.attribute} />
            </div>
          </div>
        )
      }
    },
    {
      field: 'timeToAdd',
      headerName: 'TIME TO ADD',
      width: smDown ? 180 : mdDown ? 290 : lgDown ? 310 : xlDown ? 330 : 350,
      filterable: false,
      filterComponent: 'DateFilter',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return (
          <div className='flex h-full items-center'>
            <div className='font-customMedium rp-xl-text'>
              {formatDateV2(Number(value) * 1000, 'dd/MM/yyyy, hh:mm:ss')}
            </div>
          </div>
        )
      }
    },
    {
      field: 'variant',
      headerName: 'PRICE',
      width: smDown ? 140 : mdDown ? 160 : lgDown ? 180 : xlDown ? 200 : 240,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        const prices = value?.priceOptions as IProductPriceOptions
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
      field: 'quantity',
      headerName: 'QUANTITY',
      width: smDown ? 60 : mdDown ? 70 : lgDown ? 80 : xlDown ? 90 : 140,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return (
          <div className='flex h-full w-full items-center'>
            <div className='font-customMedium rp-xl-text'>{value}</div>
          </div>
        )
      }
    },
    {
      field: 'totalPrice',
      headerName: 'TOTAL',
      width: smDown ? 110 : mdDown ? 120 : lgDown ? 130 : xlDown ? 140 : 150,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return (
          <div className='flex h-full w-full items-center'>
            <div className='font-customMedium rp-xl-text'>${(+value / 10 ** 18).toFixed(2)}</div>
          </div>
        )
      }
    }
  ]

  const columsItemInWishList: CustomGridColDef[] = [
    {
      field: 'productName',
      headerName: 'PRODUCT',
      width: smDown ? 200 : mdDown ? 250 : lgDown ? 300 : xlDown ? 400 : 500,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value, row }) => {
        return (
          <div className='flex h-full items-center xs:gap-2 sm:gap-3 md:gap-3 lg:gap-3 xl:gap-4'>
            <img
              alt='avatar'
              src={row.images?.[0] ? row.images?.[0] : 'https://img.fi.ai/avatar_image/1.png'}
              className='shrink-0 rounded-lg object-cover object-center shadow-avatar xs:size-[52px] sm:size-[56px] md:size-[60px] lg:size-[64px]'
            />
            <div className='space-y-1'>
              <p className='font-customMedium rp-xl-text'>{value}</p>
              <AttributeItem attribute={row.attributes?.[0]} />
            </div>
          </div>
        )
      }
    },
    {
      field: 'timeToAdd',
      headerName: 'TIME TO ADD',
      width: smDown ? 180 : mdDown ? 290 : lgDown ? 310 : xlDown ? 330 : 450,
      filterable: false,
      filterComponent: 'DateFilter',
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        return (
          <div className='flex h-full items-center'>
            <div className='font-customMedium rp-xl-text'>
              {formatDateV2(Number(value) * 1000, 'dd/MM/yyyy, hh:mm:ss')}
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
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ value }) => {
        const prices = value?.[0].priceOptions as IProductPriceOptions
        return (
          <div className='flex h-full w-full items-center'>
            <div className='font-customMedium xs:text-[14px]/[14.7px] sm:text-[16px]/[16.8px] md:text-[18px]/[18.9px] lg:text-[20px]/[21px]'>
              ${(+prices?.vipPrice / 10 ** 18).toFixed(2)} - ${(+prices?.retailPrice / 10 ** 18).toFixed(2)}
            </div>
          </div>
        )
      }
    }
  ]

  return (
    <>
      {categoryTabs === EnumListProductType.PURCHASE ? (
        <DataTable
          isLoading={isLoading}
          columns={columnsTotalPurchase}
          rows={dataPurchases}
          pageSizes={7}
          title=''
          rowHeight={smDown ? 68 : mdDown ? 75 : lgDown ? 78 : xlDown ? 80 : 80}
          model='purchases'
        />
      ) : categoryTabs === EnumListProductType.CART ? (
        <DataTable
          model='carts'
          isLoading={isLoading}
          columns={columsItemInCart}
          rows={dataCarts}
          pageSizes={7}
          title=''
          rowHeight={smDown ? 68 : mdDown ? 75 : lgDown ? 78 : xlDown ? 80 : 80}
        />
      ) : (
        <DataTable
          model='wishlists'
          isLoading={isLoading}
          columns={columsItemInWishList}
          rows={dataWishlists}
          pageSizes={7}
          title=''
          rowHeight={smDown ? 68 : mdDown ? 75 : lgDown ? 78 : xlDown ? 80 : 80}
        />
      )}

      {dataPurchases && (
        <OrderDetailDialog
          ref={dialogRef}
          order={dataPurchases?.find((order) => order.orderID === selectedOrderID) as IOrder}
          hasHeader={false}
        />
      )}
    </>
  )
})

export default CustomerTableRow
