import { format } from 'date-fns'
import { memo, useMemo, useRef, useState } from 'react'

import { CheckoutTypeEnum, OrderStatus } from '~/@types/enums/order'
import { IOrder } from '~/@types/models/order'
import { Button } from '~/components/button'
import { AwaitingIcon, CancelledIcon, DeliveredIcon, InTragicIcon, StorageIcon } from '~/components/icons'
import useResponsive from '~/hooks/useResponsive'
import { OrderDetailDialog } from '~/sections/order'
import { trimStringMiddle } from '~/utils/format'
import OrderSearch from '../icons/OrderSearch'
import ProductInOrder from '../productInOrder/ProductInOrder'
import { OrderDetailDialogRef } from '~/sections/order/OrderDetailDialog'

type OrderCardProps = {
  order: IOrder
}

const OrderCard = memo(({ order }: OrderCardProps) => {
  const dialogRef = useRef<OrderDetailDialogRef>(null)

  const xlDown = useResponsive('down', 'xl')

  const statusSelected = useMemo(() => +order.orderStatus, [order])
  const checkoutType = useMemo(() => +order.checkoutType, [order])

  const [showMore, setShowMore] = useState<boolean>(false)

  const listProductsRender = useMemo(
    () => (!showMore ? order.productDetails.slice(0, 1) : order.productDetails),
    [showMore, order.productDetails]
  )

  return (
    <>
      <div className='relative bg-inherit'>
        <div className='absolute left-5 top-[-20px] flex items-center gap-2 bg-[#f4f6fc] pr-[10px] 2xs:!top-[-18px] xs:top-[-20px]'>
          <div className='flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-green-main to-blue-main 2xs:!size-9 xs:size-10'>
            {checkoutType === CheckoutTypeEnum.STORAGE ? (
              <StorageIcon color='white' className='size-5 2xs:!size-4 xs:size-5' />
            ) : statusSelected === OrderStatus.AWAITING ? (
              <AwaitingIcon color='white' className='size-5 2xs:!size-4 xs:size-5' />
            ) : statusSelected === OrderStatus.INTRANSIT ? (
              <InTragicIcon color='white' className='size-5 2xs:!size-4 xs:size-5' />
            ) : statusSelected === OrderStatus.DELIVERED ? (
              <DeliveredIcon color='white' className='size-5 2xs:!size-4 xs:size-5' />
            ) : (
              <CancelledIcon color='white' className='size-5 2xs:!size-4 xs:size-5' />
            )}
          </div>
          <p className='text-nowrap font-customSemiBold 2xs:!text-[15px]/[15.8px] xs:text-[16px]/[16.8px] sm:text-[20px]/[21px]'>
            {`${xlDown ? '#' : 'ID Customer: '} ${trimStringMiddle(order.buyer, 5, 5)}`} -{' '}
            <span className='font-customRegular'>{format(+order.createdAt * 1000, 'dd/MM/yyyy')}</span>
          </p>
        </div>
        <div className='rounded-xl border-[2.5px] border-solid border-blue-main/[.12] 2xs:p-4 2xs:pt-7 xs:p-4 xs:pt-7 sm:p-5 sm:pt-10'>
          <div className='mb-10'>
            <div className='flex flex-col 2xs:gap-[14px] xs:gap-[14px] sm:gap-4'>
              {listProductsRender?.map((product) => <ProductInOrder key={product.product.id} product={product} />)}
            </div>
            {order.productDetails.length > 1 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className='mt-6 cursor-pointer text-[16px]/[18px] text-[#007AFF] underline xs:hidden sm:hidden md:flex'
              >
                Show {showMore ? 'less' : 'more'}
              </button>
            )}
          </div>
          <div className='flex w-full items-end justify-between gap-4 2xs:flex-col xs:flex-col sm:flex-col md:flex-row'>
            <div className='flex items-end 2xs:!gap-4 xs:order-2 xs:w-full xs:gap-5 md:order-1 md:w-fit md:gap-8'>
              <div className='flex flex-col items-start 2xs:!min-w-[80px] 2xs:!gap-1 xs:min-w-[100px] xs:gap-2 md:min-w-[100px] md:gap-3 xl:min-w-[140px]'>
                <p className='text-[16px]/[16.8px] text-black-main/[.64]'>Order ID</p>
                <p className='line-clamp-1 font-customSemiBold text-[18px]/[18.9px] text-black-main'>
                  #{order.orderID}
                </p>
              </div>
              <div className='flex 2xs:order-2 2xs:w-full 2xs:justify-end 2xs:gap-3 xs:order-2 xs:w-full xs:justify-end xs:gap-3 sm:order-2 sm:w-full sm:justify-end sm:gap-[14px] md:order-1 md:w-fit md:items-center lg:order-1'>
                <button
                  onClick={() => dialogRef.current?.handleOpen()}
                  className='h-[40px] w-[40px] items-center justify-center rounded-full border border-solid border-black-main xs:flex sm:flex md:flex lg:hidden xl:hidden'
                >
                  <OrderSearch />
                </button>
                <div className='xs:hidden sm:hidden md:hidden lg:flex xl:flex'>
                  <Button
                    size='small'
                    variant='outline-grey'
                    className='h-10 rounded-[24px] 2xs:w-[135px] xs:w-[135px] sm:w-[135px] md:w-[165px] xl:w-[165px]'
                    classNameText='xs:text-[14px] 2xs:text-[14px] sm:text-[16px]'
                    onClick={() => dialogRef.current?.handleOpen()}
                  >
                    see detail
                  </Button>
                </div>
                <Button
                  size='small'
                  className='h-10 rounded-[24px] 2xs:w-[105px] xs:w-[105px] sm:w-[105px] md:w-[165px] xl:w-[165px]'
                  classNameText='xs:text-[14px] 2xs:text-[14px] sm:text-[16px]'
                >
                  chat now
                </Button>
              </div>
            </div>
            <div className='flex w-full items-center 2xs:justify-between xs:order-1 xs:justify-between sm:justify-between md:order-2 md:justify-end'>
              {order.productDetails.length > 1 ? (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className='mb-3 mt-6 cursor-pointer text-[16px]/[18px] text-[#007AFF] underline xs:flex sm:flex md:hidden'
                >
                  Show {showMore ? 'less' : 'more'}
                </button>
              ) : (
                <div></div>
              )}
              <p className='2xs:order-1 2xs:text-[16px]/[16.8px] xs:order-1 xs:text-[16px]/[16.8px] sm:order-1 sm:text-[20px]/[21px] md:order-2 md:text-[20px]/[21px] lg:order-2 xl:text-[20px]/[21px]'>
                Total:{' '}
                <span className='font-customSemiBold 2xs:!text-[24px]/[25.4px] xs:text-[24px]/[25.4px] sm:text-[40px]/[42px] md:text-[40px]/[42px] xl:text-[40px]/[42px]'>
                  ${(Number(order.totalPrice) / 10 ** 18).toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <OrderDetailDialog ref={dialogRef} order={order} />
    </>
  )
})

export default OrderCard
