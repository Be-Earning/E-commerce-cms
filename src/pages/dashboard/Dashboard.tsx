import { memo, useEffect, useMemo } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Role } from '~/@types/enums'
import images from '~/assets'
import { Button } from '~/components/button'
import { DashboardItem } from '~/components/dashboardItem'
import { IncreaseIcon, NavDiamondIcon, NavHealthIcon, NavNetworkIcon } from '~/components/icons'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import useResponsive from '~/hooks/useResponsive'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import { fetchRootPrivate } from '~/redux/root/root.slice'
import { ListProductSearch, ProductInCategory, TotalOrder, TotalRevenue } from '~/sections/dashboard'
import { cn } from '~/utils/classNames'
import { formatLocaleString } from '~/utils/format'

const Dashboard = memo(() => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { activeWallet, userRole } = useAppSelector((s) => s.user)
  const { listCustomers } = useAppSelector((s) => s.customer)
  const { listProducts } = useAppSelector((s) => s.product)
  const { systemInfo } = useAppSelector((s) => s.tracking)

  const xsDown = useResponsive('down', 'xs')
  const xs2Down = useResponsive('down', '2xs')

  const isAdmin = useMemo(() => +userRole === Role.ADMIN, [userRole])

  useEffect(() => {
    if (!activeWallet) return
    dispatch(fetchRootPrivate())
  }, [activeWallet])

  return (
    <div
      className={cn(
        `overflow-hidden bg-top bg-no-repeat xs:p-4 sm:p-4 md:p-4 lg:p-5`,
        isAdmin ? 'bg-dashboard-admin' : 'bg-dashboard-retailer'
      )}
    >
      <div className='space-y-5 xs:mt-16 sm:mt-16 md:mt-16 lg:mt-20'>
        <div className='grid xs:gap-4 sm:gap-4 md:grid-rows-2 md:flex-col md:gap-4 lg:grid-cols-7 lg:grid-rows-1 lg:flex-row lg:gap-5'>
          <div className='xs:row-span-1 sm:row-span-1 md:row-span-1 lg:col-span-4'>
            <TotalRevenue />
          </div>
          <div className='xs:row-span-1 sm:row-span-1 md:row-span-1 lg:col-span-3'>
            <TotalOrder />
          </div>
        </div>

        <div className='gap-5 xs:grid-rows-1 sm:grid sm:grid-rows-2 md:grid-rows-2 lg:grid-cols-2 lg:grid-rows-1'>
          <section
            className={cn('gap-5 xs:flex xs:flex-col sm:grid lg:col-span-1', isAdmin ? 'grid-cols-2' : 'grid-rows-2')}
          >
            {isAdmin && (
              <div
                className={`relative flex flex-col items-center justify-center overflow-hidden rounded-[20px] bg-ln-green-blue text-white shadow-popover-custom backdrop-blur-[80px] xs:aspect-square xs:w-full sm:aspect-auto sm:h-[310px] sm:w-full lg:w-[335px]`}
              >
                <h6 className='uppercas font-customSemiBold text-[22px]/[32px]'>Total visits</h6>
                <h1 className='mb-10 mt-2 w-full truncate px-2 text-center font-customSemiBold text-[52px]/[54.6px]'>
                  {systemInfo?.totalVistors ? formatLocaleString(systemInfo?.totalVistors) : 0}
                </h1>
                <div className='mb-12 flex items-center gap-2'>
                  <IncreaseIcon />
                  <p className='text-[16px]/[12px]'>10% since last week</p>
                </div>
                <Button variant='outline-white' className='!h-[40px]' classNameText='text-[16px]'>
                  MANAGER
                </Button>
                <div className='absolute top-[46%] w-[434px]'>
                  <img src={images.dashboard.dashboard_layer} alt='dashboard-layer' className='object-cover' />
                </div>
              </div>
            )}
            <div className={cn('flex gap-5', isAdmin ? 'flex-col' : 'w-full xs:flex-col sm:flex-row')}>
              <DashboardItem
                color='blue'
                title='Total Customer'
                data={formatLocaleString(listCustomers.filter((customer) => +customer.role === Role.CUSTOMER).length)}
                icon={<img src={images.dashboard.total_customer} alt='icon' className='size-6' />}
                onClick={() => navigate(PATH_PRIVATE_APP.customer.list)}
                className='xs:h-[154px] sm:h-[145px]'
              />
              <DashboardItem
                color='green'
                title={isAdmin ? 'Total Agent' : 'Total Product'}
                colorPercent='pink'
                data={formatLocaleString(
                  isAdmin
                    ? listCustomers.filter((customer) => +customer.role === Role.RETAILER).length
                    : listProducts.length
                )}
                icon={
                  <img
                    src={isAdmin ? images.dashboard.total_agent : images.dashboard.total_product}
                    alt='icon'
                    className='size-6'
                  />
                }
                onClick={() => navigate(isAdmin ? PATH_PRIVATE_APP.agent.list : PATH_PRIVATE_APP.product.list)}
                className='xs:h-[154px] sm:h-[145px]'
              />
            </div>
            {!isAdmin && (
              <div
                className={cn(
                  xs2Down ? 'xs:aspect-square' : 'xs:aspect-[2/1]',
                  'relative h-full w-full overflow-hidden rounded-[20px] bg-ln-green-blue-to-r shadow-iner-green-blue sm:aspect-auto'
                )}
              >
                <div className='absolute right-[-75px] top-1/2 size-[396px] -translate-y-1/2 transform'>
                  <img
                    src={images.dashboard.layer_phone_hand}
                    alt='layer-phone-hand'
                    className='h-full w-full object-cover object-center xs:-translate-x-10 xs:translate-y-14'
                  />
                </div>
                <img
                  src={images.dashboard.phone_hand}
                  alt='phone-hand'
                  className={cn(
                    xs2Down ? 'xs:-bottom-[25%]' : 'xs:-bottom-[25%]',
                    xsDown ? 'xs:-bottom-[20%]' : 'xs:-bottom-10',
                    'absolute -right-[34px] sm:top-[-118px]'
                  )}
                />

                <div
                  className={cn(
                    xs2Down ? 'xs:left-[10%] xs:top-1/2' : 'xs:left-[10%] xs:top-[55%]',
                    'absolute flex size-7 items-center justify-center rounded-full bg-ln-blue-to-t sm:left-1/2 sm:top-4 lg:left-[360px]'
                  )}
                >
                  <div className='opacity-[.64]'>
                    <NavHealthIcon className='size-3' color='white' />
                  </div>
                </div>
                <div className='absolute bottom-[17px] right-3 flex size-6 items-center justify-center rounded-full bg-ln-blue-to-t'>
                  <div className='opacity-[.64]'>
                    <NavNetworkIcon className='size-[10px]' color='white' />
                  </div>
                </div>
                <div
                  className={cn(
                    xs2Down ? 'xs:bottom-[20%] xs:left-[20%]' : 'xs:bottom-[15%] xs:left-[30%]',
                    'absolute flex size-[33px] items-center justify-center rounded-full bg-ln-green-to-t sm:left-[60%] sm:top-[99px] lg:left-[394px]'
                  )}
                >
                  <div className='opacity-[.64]'>
                    <NavDiamondIcon className='size-4' color='white' />
                  </div>
                </div>

                <div className='flex h-full flex-col items-start gap-2 pl-7 xs:justify-start xs:pt-8 sm:justify-center sm:pt-0'>
                  <h4 className='font-customSemiBold text-[20px]/[18px] capitalize text-white'>
                    Create a product post
                  </h4>
                  <p className='mb-2 mt-[2px] font-customLight text-[13px]/[16px] text-white/[.64]'>
                    to highlight new items, share detailed descriptions, and <br className='xs:hidden sm:flex' /> engage
                    potential customers with appealing visuals
                  </p>
                  <Button
                    onClick={() =>
                      navigate({
                        pathname: PATH_PRIVATE_APP.product.add,
                        search: createSearchParams({ isEditing: '0', creaetProductType: 'product' }).toString()
                      })
                    }
                    variant='outline-white'
                    className='!h-[32px] !w-[148px]'
                    classNameText='text-[16px] uppercas'
                  >
                    post now
                  </Button>
                </div>
              </div>
            )}
          </section>
          <div className='xs:row-span-1 xs:mt-5 sm:row-span-1 md:row-span-1 lg:col-span-1'>
            {isAdmin ? <ProductInCategory /> : <ListProductSearch />}
          </div>
        </div>
      </div>
    </div>
  )
})

export default Dashboard
