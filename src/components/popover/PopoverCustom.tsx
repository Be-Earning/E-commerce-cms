import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Fragment, memo, ReactNode, useEffect, useRef, useState } from 'react'

type PopoverProps = {
  className?: string
  position?: any
  children: ReactNode
  content: ReactNode
}

const PopoverCustom = memo(({ children, content, className, position }: PopoverProps) => {
  const popoverButtonRef = useRef<HTMLButtonElement>(null)
  const popoverPanelRef = useRef<HTMLDivElement>(null)

  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverPanelRef.current && !popoverPanelRef.current.contains(event.target as Node)) {
        setShow(false)
      }
    }

    if (show) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [show])

  return (
    <Popover>
      <PopoverButton ref={popoverButtonRef} onClick={() => setShow(!show)} className='w-full'>
        {children}
      </PopoverButton>
      <Transition
        as={Fragment}
        show={show}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 translate-y-0'
        enterTo='opacity-100 translate-y-2'
        leave='transition ease-in duration-200'
        leaveFrom='opacity-100 translate-y-2'
        leaveTo='opacity-0 translate-y-0'
      >
        <PopoverPanel
          ref={popoverPanelRef}
          anchor={position ? position : 'bottom end'}
          className={`z-[200] ${className}`}
        >
          {content}
        </PopoverPanel>
      </Transition>
    </Popover>
  )
})

export default PopoverCustom
