import { DialogPanel, Dialog as DialogTailwind, Transition, TransitionChild } from '@headlessui/react'
import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react'
import { CloseIcon } from '../icons'
import { cn } from '~/utils/classNames'

export type DialogProps = {
  children: ReactNode
  className?: string
  classNameBg?: string
  zIndex?: string
  closeIconClose?: string
  paddingBg?: string
  hideCloseIcon?: boolean
  disableCloseBg?: boolean
}

export type DialogRef = {
  open: () => void
  close: () => void
}

const Dialog = forwardRef<DialogRef, DialogProps>(
  (
    {
      children,
      className,
      classNameBg,
      zIndex,
      closeIconClose,
      hideCloseIcon = false,
      paddingBg,
      disableCloseBg = false
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false)
    }))

    return (
      <Transition show={isOpen}>
        <DialogTailwind
          className={`relative z-[500] ${zIndex ? zIndex : ''}`}
          onClose={() => {
            if (!disableCloseBg) {
              setIsOpen(false)
            }
          }}
        >
          <TransitionChild
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div
              className={`fixed inset-0 bg-black-default/[.2] shadow-4xl backdrop-blur-[40px] transition-opacity ${classNameBg}`}
            />
          </TransitionChild>
          <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
            <div className={cn('flex min-h-full justify-center p-4 xs:items-center sm:items-center sm:p-0', paddingBg)}>
              <TransitionChild
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <DialogPanel
                  className={`relative w-full min-w-[300px] transform overflow-hidden rounded-3xl bg-white transition-all ${className}`}
                >
                  {!hideCloseIcon && (
                    <button className='absolute right-5 top-5 z-50 size-4' onClick={() => setIsOpen(false)}>
                      <CloseIcon color={closeIconClose ? closeIconClose : '#9291A5'} className='size-full' />
                    </button>
                  )}
                  {children}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </DialogTailwind>
      </Transition>
    )
  }
)

export default Dialog
