import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { NavLink, useParams } from 'react-router-dom'
import { Role } from '~/@types/enums'
import { EnumListProductType } from '~/@types/enums/list'
import { ICustomerDetail, ICustomerPurchases } from '~/@types/models'
import { QuickFilterButton } from '~/components/button'
import { CloseIcon } from '~/components/icons'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import { getUserInfo, getUserPurchaseInfo } from '~/contract/functionSmc'
import { useAppSelector } from '~/redux/configStore'
import { CustomerTableRow, PersonalProfile } from '~/sections/customer'
import { getLocalStorage, setLocalStorage } from '~/utils/localStorage'

const CustomerDetail = memo(() => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const { id: customerAddress = '' } = useParams()

  const { activeWallet, userRole } = useAppSelector((s) => s.user)

  const customerPurchaseDataLocal = useMemo(
    () => getLocalStorage(`customer_purchase_${customerAddress}`),
    [customerAddress]
  )
  const customerInforDataLocal = useMemo(() => getLocalStorage(`infor_customer_${customerAddress}`), [customerAddress])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [customerDetail, setCustomerDetail] = useState<ICustomerDetail>()
  const [customerPurchases, setCustomerPurchases] = useState<ICustomerPurchases>()
  const [categoryTabs, setCategoryTabs] = useState<EnumListProductType>(EnumListProductType.PURCHASE)

  const customerPurchaseData: ICustomerPurchases = useMemo(
    () => customerPurchaseDataLocal || customerPurchases,
    [customerPurchaseDataLocal, customerPurchases]
  )
  const customerDetailData: ICustomerDetail = useMemo(
    () => customerInforDataLocal || customerDetail,
    [customerInforDataLocal, customerDetail]
  )

  const getListCustomerPurchase = useCallback(async () => {
    try {
      setIsLoading(true)

      const promises =
        +userRole === Role.ADMIN
          ? [
              getUserInfo(activeWallet, customerAddress), // index 0
              getUserPurchaseInfo(activeWallet, customerAddress) // index 1
            ]
          : [getUserInfo(activeWallet, customerAddress)]

      const results = await Promise.all(promises)

      const resInfor = results[0]
      const res = +userRole === Role.ADMIN ? results[1] : null

      if (resInfor?.data) {
        setCustomerDetail(resInfor.data)
        setLocalStorage(`infor_customer_${customerAddress}`, JSON.stringify(resInfor.data))
      }

      if (+userRole === Role.ADMIN && res?.success) {
        setCustomerPurchases(res.data)
        setLocalStorage(`customer_purchase_${customerAddress}`, JSON.stringify(res.data))
      }

      if (!resInfor?.data || (+userRole === Role.ADMIN && !res?.success)) {
        toast.error('Fetch customer details failed!')
      }
    } catch (error: any) {
      console.log('error', error)
      toast.error(error.message || 'Fetch customer details failed!')
    } finally {
      setIsLoading(false)
    }
  }, [customerAddress, activeWallet, userRole])

  useEffect(() => {
    getListCustomerPurchase()
  }, [customerAddress, activeWallet])

  const handleQuickFilter = useCallback((status: number) => {
    setCategoryTabs(status)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
      if (scrollRef.current) {
        e.preventDefault()

        const startX = 'touches' in e ? e.touches[0].pageX : e.pageX
        const startScrollLeft = scrollRef.current.scrollLeft

        scrollRef.current.style.cursor = 'grabbing'

        const onMove = (moveEvent: MouseEvent | TouchEvent) => {
          if (scrollRef.current) {
            const x =
              'touches' in moveEvent ? moveEvent.touches[0].pageX - startX : (moveEvent as MouseEvent).pageX - startX
            scrollRef.current.scrollLeft = startScrollLeft - x
          }
        }

        const onEnd = () => {
          if (scrollRef.current) {
            scrollRef.current.style.cursor = 'grab'
          }
          window.removeEventListener('mousemove', onMove)
          window.removeEventListener('mouseup', onEnd)
          window.removeEventListener('touchmove', onMove)
          window.removeEventListener('touchend', onEnd)
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onEnd)
        window.addEventListener('touchmove', onMove)
        window.addEventListener('touchend', onEnd)
      }
    },
    [scrollRef]
  )

  return (
    <div className='h-full bg-list-customer bg-top bg-no-repeat p-5'>
      <div className='ml-auto flex justify-end'>
        <NavLink to={PATH_PRIVATE_APP.customer.list} className='relative z-[500] flex items-center gap-2'>
          <CloseIcon className='size-4' color='#ffffff' />
        </NavLink>
      </div>
      <div className='mt-14 space-y-5 bg-white/[.76] backdrop-blur-[200px]'>
        <div className='flex flex-col gap-5 xs:p-5 sm:p-8 md:p-10 lg:p-20'>
          <PersonalProfile customerDetailData={customerDetailData} />
          {+userRole === Role.ADMIN && (
            <>
              <div className='mt-20 flex w-full justify-between overflow-hidden xs:mb-3 xs:flex-col xs:items-start xs:gap-3 sm:mb-3 sm:flex-col sm:gap-4 md:mb-3 md:flex-col md:gap-5 lg:mb-6 lg:flex-col xl:flex-row xl:items-center'>
                <h2 className='text-nowrap rp-small-title'>Purchases Information</h2>
                <div
                  ref={scrollRef}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                  className='wrapper-content flex w-full cursor-grab flex-nowrap items-center gap-4 overflow-x-auto px-5 py-5 xs:justify-start sm:justify-start md:justify-start lg:justify-start xl:justify-end'
                >
                  <QuickFilterButton
                    status={EnumListProductType.PURCHASE.toString()}
                    totalCount={Number(customerPurchases?._orders.length) || 0}
                    onClick={() => handleQuickFilter(EnumListProductType.PURCHASE)}
                    active={categoryTabs === EnumListProductType.PURCHASE}
                  />
                  <QuickFilterButton
                    status={EnumListProductType.CART.toString()}
                    totalCount={Number(customerPurchases?._cart.items.length) || 0}
                    onClick={() => handleQuickFilter(EnumListProductType.CART)}
                    active={categoryTabs === EnumListProductType.CART}
                  />
                  <QuickFilterButton
                    status={EnumListProductType.WISHLIST.toString()}
                    totalCount={Number(customerPurchases?._productIds.length) || 0}
                    onClick={() => handleQuickFilter(EnumListProductType.WISHLIST)}
                    active={categoryTabs === EnumListProductType.WISHLIST}
                  />
                </div>
              </div>

              <CustomerTableRow
                categoryTabs={categoryTabs}
                isLoading={isLoading}
                customerPurchaseData={customerPurchaseData}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
})

export default CustomerDetail
