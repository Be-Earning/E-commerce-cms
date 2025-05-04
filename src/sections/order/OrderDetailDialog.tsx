import { format } from 'date-fns'
import { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { OrderStatus, Role } from '~/@types/enums'
import { IOrder, IProductAttrs } from '~/@types/models'
import { AttributeItem } from '~/components/attributeItem'
import { ConfirmDialog, Dialog } from '~/components/dialog'
import { ConfirmDialogRef } from '~/components/dialog/ConfirmDialog'
import { DialogRef } from '~/components/dialog/Dialog'
import { CloseIcon } from '~/components/icons'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import { getListOrders } from '~/redux/order/order.slice'
import { sendTransaction } from '~/smartContract/combineSdk'
import { cn } from '~/utils/classNames'
import { ConverPaymentToString, ConverStatusToString } from '~/utils/covertStatus'
import { formatPrice, trimStringMiddle } from '~/utils/format'

interface IOrderDetailDialogProps {
  hasHeader?: boolean
  order: IOrder
}

export interface OrderDetailDialogRef {
  handleOpen: () => void
}

const OrderDetailDialog = memo(
  forwardRef<OrderDetailDialogRef, IOrderDetailDialogProps>(({ order, hasHeader = true }, ref) => {
    const dispatch = useAppDispatch()

    const dialogRef = useRef<DialogRef>(null)
    const confirmDialogRef = useRef<ConfirmDialogRef>(null)

    const { listCustomers } = useAppSelector((s) => s.customer)
    const { activeWallet, userRole } = useAppSelector((s) => s.user)

    const isAdmin = useMemo(() => +userRole === Role.ADMIN, [userRole])

    const customerOfOrder = useMemo(() => listCustomers.find((c) => c.user === order?.buyer), [listCustomers])

    let action = ''
    // const [action, setAction] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingCancel, setIsLoadingCancel] = useState<boolean>(false)

    const handleOpen = useCallback(() => {
      dialogRef.current?.open()
    }, [])

    useImperativeHandle(ref, () => ({ handleOpen }))

    const handleCancelOrder = useCallback(async () => {
      try {
        setIsLoadingCancel(true)
        const res = await sendTransaction(
          'RetailerChangeOrderStatus',
          { _orderID: +order?.orderID, _orderStatus: OrderStatus.CANCELLED },
          'ecom-order',
          activeWallet
        )
        if (res.data) {
          toast.success('Cancel order successfully!')
          dialogRef.current?.close()
          dispatch(getListOrders())
        } else {
          toast.error('Cancel order failed!')
        }
      } catch (error) {
        console.log('Cancel order error', error)
      } finally {
        setIsLoadingCancel(false)
      }
    }, [order, activeWallet])

    const handleApproveOrder = useCallback(async () => {
      try {
        setIsLoading(true)
        const res = await sendTransaction(
          'RetailerChangeOrderStatus',
          { _orderID: +order?.orderID, _orderStatus: isAdmin ? OrderStatus.DELIVERED : OrderStatus.INTRANSIT },
          'ecom-order',
          activeWallet
        )
        if (res.data) {
          toast.success('Approver order successfully!')
          dialogRef.current?.close()
          dispatch(getListOrders())
        } else {
          toast.error('Approver order failed!')
        }
      } catch (error) {
        console.log('Approve order error', error)
      } finally {
        setIsLoading(false)
      }
    }, [order, isAdmin, activeWallet])

    const confirmAction = useCallback(() => {
      if (action === 'approve') {
        handleApproveOrder()
      } else {
        handleCancelOrder()
      }
      confirmDialogRef.current?.handleClose()
    }, [action, handleApproveOrder, handleCancelOrder])

    return (
      <>
        <Dialog
          ref={dialogRef}
          hideCloseIcon
          paddingBg='2xs:!p-0 xs:!p-0 md:p-5 xl:!p-5'
          disableCloseBg={isLoading || isLoadingCancel}
          className={cn(
            'h-fit bg-white 2xs:h-screen 2xs:w-full 2xs:rounded-none xs:h-screen xs:w-full xs:rounded-none sm:h-fit sm:w-[538px] sm:!rounded-xl xl:min-w-[635px]'
          )}
        >
          <div className='flex h-full flex-col'>
            {hasHeader && (
              <div className='flex h-16 items-center justify-between bg-ln-green-blue-to-r text-left 2xs:px-4 xs:px-4 sm:px-5 md:pl-8 md:pr-6'>
                <div className='-translate-y-[2px] space-y-1'>
                  <h1 className='font-customSemiBold text-[20px]/[24px] text-white'>
                    {customerOfOrder?.fullName}{' '}
                    <span className='self-end text-[14px]/[14.7px] text-white/[.88]'>
                      ID: {trimStringMiddle(order?.buyer, 5, 5)}
                    </span>
                  </h1>

                  <p className='text-[14px]/[14.7px] text-white/[.88]'>
                    Email/Phone: {customerOfOrder?.email || customerOfOrder?.phoneNumber}
                  </p>
                </div>

                <button onClick={() => dialogRef.current?.close()} disabled={isLoading || isLoadingCancel}>
                  <CloseIcon color='white' className='size-4' />
                </button>
              </div>
            )}
            <div className='flex flex-1 flex-col 2xs:p-0 xs:p-0 sm:h-fit sm:p-0'>
              <div className='border-0 border-b-[1px] border-solid border-[#E5E5EA] 2xs:flex-1 2xs:p-4 xs:flex-1 xs:p-4 sm:p-6 md:p-0 md:px-8 md:pt-8 xl:p-8 xl:pb-0'>
                <h2 className='mb-6 font-customSemiBold text-[16px]/[16.8px] uppercase'>Order Detail</h2>
                <div
                  className={cn(
                    hasHeader ? 'md:mb-10' : 'md:mb-8',
                    'hide-scrollbar flex flex-col !gap-4 overflow-y-auto 2xs:mb-8 xs:mb-8 sm:mb-8 sm:max-h-[300px] md:max-h-[400px] lg:max-h-[400px] xl:max-h-[400px]'
                  )}
                >
                  {order?.productDetails?.map((product, index) => (
                    <div key={index} className='flex w-full items-center justify-between'>
                      <div className='flex w-full items-center 2xs:gap-3 xs:gap-3 sm:gap-5'>
                        <div className='size-[72px] flex-shrink-0 rounded-[8px]'>
                          <img
                            src={product.product?.params.images[0]}
                            alt={product.product.params.name}
                            className='size-full rounded-[8px] object-cover object-center'
                          />
                        </div>
                        <div className='flex w-full flex-grow flex-col gap-2'>
                          <p className='font-customSemiBold text-black-main 2xs:text-[16px]/[16.8px] xs:text-[16px]/[16.8px] sm:text-[16px]/[16.8px] md:text-[18px]/[18.9px] lg:text-[18px]/[18.9px] xl:text-[18px]/[18.9px]'>
                            {product.product.params.name}
                          </p>
                          {Number(product?.attribute?.length) > 0 && (
                            <AttributeItem isOrderDetail attribute={product.attribute as IProductAttrs[]} />
                          )}
                          <p className='text-[14px]/[14.7px] font-normal text-black-main/[.64] xs:hidden sm:hidden md:hidden lg:flex xl:flex'>
                            Quantity: {product.quantityInOrder}
                          </p>
                          <div className='w-full items-center justify-between 2xs:flex xs:flex sm:flex md:hidden lg:hidden xl:hidden'>
                            <div className='flex items-center gap-2'>
                              <span className='font-customSemiBold text-[14px]/[14.7px]'>
                                ${formatPrice(Number(product?.priceInOrder), 2)}
                              </span>
                              {order.cartItemIds.length > 0 && (
                                <span className='text-[14px] font-normal text-[#636364] line-through'>
                                  ${formatPrice(Number(product.variant?.priceOptions.retailPrice), 2)}
                                </span>
                              )}
                            </div>
                            <p className='text-[14px] font-normal text-[#636364]'>x{Number(product.quantityInOrder)}</p>
                            <p className='font-customSemiBold text-[14px] text-[#0D0D0D]'>
                              $
                              {(Number(product.quantityInOrder) * (Number(product.priceInOrder) / 10 ** 18)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='flex-col items-end gap-2 2xs:hidden xs:hidden sm:hidden md:flex'>
                        <span className='font-customSemiBold text-[18px]/[18.9px]'>
                          ${formatPrice(Number(product?.priceInOrder), 2)}
                        </span>
                        {order.cartItemIds.length > 0 && (
                          <span className='text-[14px]/[14.7px] font-normal text-[#636364] line-through'>
                            ${formatPrice(Number(product.variant?.priceOptions.retailPrice), 2)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={cn(
                  hasHeader ? 'md:pt-7' : 'md:pt-5',
                  '2xs:bg-order-detail 2xs:p-4 xs:bg-order-detail xs:p-4 sm:bg-order-detail sm:p-6 md:bg-none md:px-8'
                )}
              >
                {hasHeader && (
                  <div
                    className={cn(
                      hasHeader && '2xs:mb-5 xs:mb-5 sm:mb-10',
                      'gap-3 2xs:flex 2xs:flex-col 2xs:gap-2 xs:mb-5 xs:flex xs:flex-col sm:flex sm:flex-col md:grid md:grid-cols-3 md:items-center md:justify-center md:gap-5 lg:gap-5 xl:gap-5'
                    )}
                  >
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Order ID</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>#{order?.orderID}</p>
                    </div>
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Payment Method</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>
                        {ConverPaymentToString(Number(order?.paymentType))}
                      </p>
                    </div>
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Discount</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>$0.00</p>
                    </div>
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Date of Order</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>
                        {format(Number(order?.createdAt) * 1000, 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-nowrap text-[14px]/[14.7px] text-black-main/[.64]'>Estimated Delivery Time</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>
                        {format(Number(order?.createdAt) * 1000, 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Shipping Fee</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>
                        ${(Number(order?.shippingPrice) / 10 ** 18).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
                {!hasHeader && (
                  <div
                    className={cn(
                      hasHeader && '2xs:mb-5 xs:mb-5 sm:mb-10',
                      'gap-3 2xs:flex 2xs:flex-col 2xs:gap-2 xs:mb-5 xs:flex xs:flex-col sm:flex sm:flex-col md:grid md:!grid-cols-4 md:items-start md:justify-center md:gap-5 lg:gap-5 xl:gap-5'
                    )}
                  >
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Order ID</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>#{order?.orderID}</p>
                    </div>
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Payment Method</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>
                        {ConverPaymentToString(Number(order?.paymentType))}
                      </p>
                    </div>
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:ml-8 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Status</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>
                        {ConverStatusToString(Number(order?.orderStatus))}
                      </p>
                    </div>
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:ml-5 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Shipping Fee</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>
                        ${(Number(order?.shippingPrice) / 10 ** 18).toFixed(2)}
                      </p>
                    </div>

                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Date of Order</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>
                        {order?.createdAt && format(Number(order?.createdAt) * 1000, 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-nowrap text-[14px]/[14.7px] text-black-main/[.64]'>Estimated Delivery Time</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>
                        {order?.createdAt && format(Number(order?.createdAt) * 1000, 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:ml-8 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Discount</p>
                      <p className='font-customSemiBold text-[16px]/[16.8px] text-black-main'>$0.00</p>
                    </div>
                    <div className='flex items-center gap-5 2xs:gap-2 xs:gap-2 sm:gap-2 md:ml-5 md:flex-col md:items-start md:justify-start md:gap-3'>
                      <p className='text-[14px]/[14.7px] text-black-main/[.64]'>Total</p>
                      <p className='bg-ln-green-blue bg-clip-text font-customSemiBold text-[20px]/[21.5px] text-transparent'>
                        ${(Number(order?.totalPrice) / 10 ** 18).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {hasHeader && (
                  <div className='flex items-end justify-between gap-4 2xs:flex-col xs:flex-col sm:flex-row'>
                    <p className='text-[14px]/[14.7px] text-black-main/[.64]'>
                      Total Price:{' '}
                      <p className='bg-ln-green-blue bg-clip-text pt-2 font-customSemiBold text-[32px]/[33.6px] text-transparent'>
                        ${(Number(order?.totalPrice) / 10 ** 18).toFixed(2)}
                      </p>
                    </p>

                    {/* {(isAdmin ? isOrderNonePhysical && activeWallet === order.retailer : true) &&
                      +order?.checkoutType === CheckoutTypeEnum.RECEIVE &&
                      +order?.orderStatus === OrderStatus.AWAITING && (
                        <div className='flex w-full items-center gap-3 md:w-fit lg:w-fit xl:w-fit'>
                          <Button
                            fullWidth
                            size='small'
                            variant='outline-grey'
                            disabled={isLoading || isLoadingCancel}
                            className='h-10 rounded-[24px] 2xs:w-full xs:w-full sm:w-[105px] md:w-[140px]'
                            classNameText='xs:text-[14px] 2xs:text-[14px] sm:text-[16px]'
                            onClick={() => {
                              setAction('reject')
                              confirmDialogRef.current?.handleOpen()
                            }}
                          >
                            {isLoadingCancel ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'reject'}
                          </Button>
                          <Button
                            fullWidth
                            size='small'
                            disabled={isLoading || isLoadingCancel}
                            className='h-10 rounded-[24px] 2xs:w-full xs:w-full sm:w-[105px] md:w-[140px]'
                            classNameText='xs:text-[14px] 2xs:text-[14px] sm:text-[16px]'
                            onClick={() => {
                              setAction('approve')
                              confirmDialogRef.current?.handleOpen()
                            }}
                          >
                            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'approve'}
                          </Button>
                        </div>
                      )}
                    {(isAdmin ? isOrderNonePhysical && activeWallet === order.retailer : true) &&
                      +order?.checkoutType === CheckoutTypeEnum.RECEIVE &&
                      +order?.orderStatus === OrderStatus.INTRANSIT && (
                        <Button
                          fullWidth
                          size='small'
                          disabled={isLoading || isLoadingCancel}
                          className='h-10 rounded-[24px] 2xs:w-full xs:w-full sm:w-[105px] md:w-[140px]'
                          classNameText='xs:text-[14px] 2xs:text-[14px] sm:text-[16px]'
                          onClick={() => {
                            setAction('cancel')
                            confirmDialogRef.current?.handleOpen()
                          }}
                        >
                          {isLoadingCancel ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'cancel order'}
                        </Button>
                      )} */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {hasHeader && (
            <ConfirmDialog
              ref={confirmDialogRef}
              title={`${action === 'cancel' ? 'Cancel' : action === 'reject' ? 'Reject' : 'Approve'} order`}
              content={`Are you sure you want to ${action === 'cancel' ? 'cancel' : action === 'reject' ? 'Reject' : 'approve'} order with ID: #${order.orderID}?`}
              onConfirm={confirmAction}
            />
          )}
        </Dialog>
      </>
    )
  })
)

export default OrderDetailDialog
