import { motion } from 'framer-motion'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { Role } from '~/@types/enums'
import images from '~/assets'
import { ConfirmDialogRef } from '~/components/dialog/ConfirmDialog'
import { IconButton } from '~/components/iconButton'
import {
  CloseIcon,
  NavAgentIcon,
  NavCutomerIcon,
  NavHomeIcon,
  NavLogoutIcon,
  NavOrderIcon,
  NavPostProductIcon,
  NavProductIcon
} from '~/components/icons'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import useResponsive from '~/hooks/useResponsive'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import { clearProductReview } from '~/redux/product/product.slice'
import { LogoutDialog } from '~/sections/logout'
import { cn } from '~/utils/classNames'

const Header = memo(() => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<ConfirmDialogRef>(null)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const windowRef = useRef(window)

  const { pathname } = useLocation()

  const smDown = useResponsive('down', 'sm')

  const { userRole } = useAppSelector((s) => s.user)

  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [scrolledTo20, setScrolledTo20] = useState<boolean>(false)
  const [itemHover, setItemHover] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => {
      if (windowRef.current.scrollY >= 20 && !scrolledTo20) {
        setScrolledTo20(true)
      } else if (windowRef.current.scrollY < 20 && scrolledTo20) {
        setScrolledTo20(false)
      }
    }

    windowRef.current.addEventListener('scroll', handleScroll)
    return () => windowRef.current.removeEventListener('scroll', handleScroll)
  }, [scrolledTo20, windowRef])

  const configNavbar = useMemo(() => {
    return [
      {
        url: PATH_PRIVATE_APP.dashboard,
        label: 'Home',
        icon: (color: string) => <NavHomeIcon color={color} className='size-6' />
      },
      {
        url: PATH_PRIVATE_APP.order.list,
        label: 'order management',
        icon: (color: string) => <NavOrderIcon color={color} className='size-6' />
      },
      {
        url: PATH_PRIVATE_APP.product.list,
        label: 'Product management',
        icon: (color: string) => <NavProductIcon color={color} className='size-6' />
      },
      {
        url: PATH_PRIVATE_APP.customer.list,
        label: 'Customer management',
        icon: (color: string) => <NavCutomerIcon color={color} className='size-6' />
      },
      {
        url: PATH_PRIVATE_APP.agent.list,
        label: 'agent management',
        icon: (color: string) => <NavAgentIcon color={color} className='size-6' />
      },
      {
        url: PATH_PRIVATE_APP.product.add,
        label: 'post product',
        icon: (color: string) => <NavPostProductIcon color={color} className='size-6' />
      },
      {
        url: '',
        label: 'logout',
        icon: (color: string) => <NavLogoutIcon color={color} className='size-6' />
      }
    ]
  }, [])

  const navbarRender = useMemo(
    () =>
      +userRole === Role.ADMIN
        ? configNavbar.filter((nav) => nav.url !== PATH_PRIVATE_APP.product.add)
        : configNavbar.filter((nav) => nav.url !== PATH_PRIVATE_APP.agent.list),
    [userRole]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
      if (scrollRef.current) {
        const startX = 'touches' in e ? e.touches[0].pageX : e.pageX
        const startScrollLeft = scrollRef.current.scrollLeft

        const onMove = (moveEvent: MouseEvent | TouchEvent) => {
          if (scrollRef.current) {
            const x =
              'touches' in moveEvent ? moveEvent.touches[0].pageX - startX : (moveEvent as MouseEvent).pageX - startX
            scrollRef.current.scrollLeft = startScrollLeft - x
          }
        }

        const onEnd = () => {
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
    <>
      <header
        className={cn(
          scrolledTo20 && 'bg-white/[.12] shadow-header backdrop-blur-2xl',
          `fixed top-0 z-[500] flex w-full max-w-[1440px] items-center justify-between overflow-hidden transition-colors duration-300 ease-in-out xs:p-4 sm:p-4 md:p-4 lg:p-5`
        )}
      >
        {!showMenu ? (
          <IconButton
            title={smDown ? '' : 'Menu'}
            size={smDown ? '40' : '48'}
            className={`z-20 bg-white/[.76] shadow-popover-custom-2 backdrop-blur-[80px]`}
            onClick={(e: any) => {
              e.stopPropagation()
              setShowMenu((prev) => !prev)
            }}
          >
            <img src={images.icons.menu} alt='icons-menu' className='xs:size-5 sm:size-6' />
          </IconButton>
        ) : (
          <div className='h-12'></div>
        )}

        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={showMenu ? { x: 0, opacity: 1 } : { x: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`shadow-lg absolute flex w-full flex-row items-center gap-3`}
        >
          <button onClick={() => setShowMenu(false)}>
            <CloseIcon className='size-5' />
          </button>
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            className='wrapper-content flex w-full cursor-grab flex-row flex-nowrap items-center gap-3 overflow-x-auto py-[2px] pr-10'
          >
            {navbarRender.map((nav) => {
              return (
                <div
                  key={nav.label}
                  onMouseEnter={() => setItemHover(nav.label)}
                  onMouseLeave={() => setItemHover('')}
                  onClick={() => {
                    if (nav.label !== 'logout') {
                      navigate(nav.url)
                      if (nav.url === PATH_PRIVATE_APP.product.add) {
                        dispatch(clearProductReview())
                        navigate({
                          pathname: nav.url,
                          search: createSearchParams({ isEditing: '0', creaetProductType: 'product' }).toString()
                        })
                      }
                    } else {
                      dialogRef.current?.handleOpen()
                    }
                  }}
                  className={`flex h-[46px] w-fit cursor-pointer items-center gap-[10px] rounded-[28px] pl-3 pr-4 shadow-4xl transition duration-300 ease-in-out hover:scale-[102%] xs:h-11 sm:h-[46px] ${
                    pathname === nav.url
                      ? 'bg-gradient-to-r from-green-main to-blue-main backdrop-blur-[40px]'
                      : 'bg-white'
                  }`}
                >
                  <div className='min-w-6'>
                    {nav.icon(pathname === nav.url ? '#FFFFFF' : itemHover === nav.label ? 'linear' : '#0D0D0D')}
                  </div>
                  <p
                    className={`w-full !text-nowrap font-customMedium capitalize xs:text-[16px] sm:text-[17px] md:text-[18px] ${
                      pathname === nav.url
                        ? 'text-[#FFF]'
                        : itemHover === nav.label
                          ? 'bg-gradient-to-r from-green-main to-blue-main bg-clip-text text-transparent'
                          : 'text-blackMain'
                    }`}
                  >
                    {nav.label}
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>
      </header>

      <LogoutDialog ref={dialogRef} />
    </>
  )
})

export default Header
