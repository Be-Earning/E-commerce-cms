import { memo, useMemo } from 'react'
import { IProductAttrs } from '~/@types/models'
import { listColors } from '~/assets/mocks/color'
import { cn } from '~/utils/classNames'

interface IAttributeItem {
  attribute: IProductAttrs[]
  isOrderDetail?: boolean
  isOrderHistory?: boolean
  className?: string
}

const AttributeItem = memo(({ attribute, isOrderDetail, isOrderHistory, className }: IAttributeItem) => {
  const existCapacity = useMemo(() => attribute?.some((item) => item.key === 'capacities'), [attribute])
  const existColor = useMemo(() => attribute?.some((item) => item.key === 'color'), [attribute])

  return (
    <div className={cn(className)}>
      {existCapacity ? (
        <div
          className={cn(
            isOrderDetail ? 'text-[14px]/[14.7px]' : isOrderHistory ? 'text-[18px]/[18.9px]' : 'text-[16px]/[16.8px]',
            'text-nowrap text-left capitalize text-black-main/[.64]'
          )}
        >
          Capacity: {attribute?.[0].value}
        </div>
      ) : existColor ? (
        <div className='flex h-5 items-center gap-1'>
          <div
            className={cn(
              attribute?.[0].value === '#ffffff' && 'shadow-avatar',
              'flex size-5 shrink-0 items-center justify-center rounded-full font-customSemiBold'
            )}
            style={{
              fontSize: '12px',
              backgroundColor: attribute?.[0].value || '#000000',
              color: attribute?.[0].value === '#ffffff' || attribute?.[0].value === '#FFCC00' ? '#000' : '#fff',
              transition: 'color 300ms ease-in-out'
            }}
          >
            {listColors?.find((c) => c.value === attribute?.[0].value)?.label[0] || listColors[0].label[0]}
          </div>
          -
          <div
            className='flex size-5 shrink-0 items-center justify-center rounded-full bg-[#C7C7CC] font-customSemiBold leading-none'
            style={{
              fontSize:
                attribute?.[1].value === 'XXS' || attribute?.[1].value === 'XXL' || attribute?.[1].value === '3XL'
                  ? '9px'
                  : '12px'
            }}
          >
            {attribute?.[1].value}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
})

export default AttributeItem
