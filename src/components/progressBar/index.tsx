import { FC } from 'react'
import { CheckoutTypeEnum, OrderStatus } from '~/@types/enums'
import { LIST_ORDER_STATUS_OPTIONS } from '~/@types/listOptionCommon'
import { IOrder } from '~/@types/models'

interface IStatusProgressBarProps {
  listOrders: IOrder[]
}

const calculatePercentage = (listOrders: IOrder[], status: OrderStatus) => {
  if (status === OrderStatus.STORAGE) {
    return (
      (listOrders.filter((order) => +order.checkoutType === CheckoutTypeEnum.STORAGE).length / listOrders.length) * 100
    )
  }

  return (
    (listOrders.filter((order) => +order.orderStatus === status && +order.checkoutType === CheckoutTypeEnum.RECEIVE)
      .length /
      listOrders.length) *
    100
  )
}

const StatusProgressBar: FC<IStatusProgressBarProps> = ({ listOrders }) => {
  return (
    <div className='flex w-full overflow-hidden rounded bg-[#EFEFEF] 2xs:h-7 xs:h-7 sm:h-8'>
      {LIST_ORDER_STATUS_OPTIONS.map((item) => (
        <div
          key={item.value}
          style={{ width: `${calculatePercentage(listOrders, item.value)}%` }}
          className={`h-full ${
            item.value === OrderStatus.AWAITING
              ? 'bg-blue-main'
              : item.value === OrderStatus.INTRANSIT
                ? 'bg-yellow-main'
                : item.value === OrderStatus.DELIVERED
                  ? 'bg-green-light'
                  : item.value === OrderStatus.CANCELLED
                    ? 'bg-redMain'
                    : 'bg-purple-main'
          }`}
        />
      ))}
    </div>
  )
}

export default StatusProgressBar
