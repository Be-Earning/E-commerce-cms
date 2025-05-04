import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, memo, ReactNode, useRef } from 'react'
import ic_delete from '~/assets/icons/close.svg'
import ic_arrowright from '~/assets/icons/arrow-right-white.svg'

type DialogCustomProps = {
  variant?: 'vertical' | 'horizontal'
  open: boolean
  onClose: () => void
  title: string
  titleButton: string
  children: ReactNode
  className?: string
  classNameBg?: string
  positionDialog?: string
  showBackground?: boolean
  onMouseLeave?: () => void
}

const DialogCustom = memo(
  ({
    open,
    onClose,
    title,
    titleButton,
    children,
    className,
    classNameBg,
    variant = 'vertical',
    positionDialog,
    showBackground = false,
    onMouseLeave
  }: DialogCustomProps) => {
    const cancelButtonRef = useRef(null)

    const handleSubmit = () => {
      const form = document.querySelector('form')
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
      }
      onClose()
    }
    return (
      <Transition show={open} as={Fragment}>
        <Dialog className='relative z-[600]' initialFocus={cancelButtonRef} onClose={onClose}>
          {showBackground && (
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div
                className={`bg-black/[.22] fixed inset-0 backdrop-blur-[80px] transition-opacity duration-200 ease-in-out ${classNameBg}`}
              />
            </TransitionChild>
          )}

          <div className='wrapper-content fixed inset-0 z-[600] w-screen overflow-y-auto bg-black-main/[.10]'>
            <div
              className={`flex min-h-full xs:px-4 sm:px-0 ${variant !== 'vertical' ? 'sm:pr-[11px]' : ''} ${positionDialog ? positionDialog : 'items-center'} justify-center`}
            >
              <TransitionChild
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <DialogPanel
                  onMouseLeave={onMouseLeave}
                  className={`relative transform overflow-hidden bg-white/[.76] shadow-4xl backdrop-blur-[40px] ${variant === 'vertical' ? 'rounded-br-2xl rounded-tr-2xl' : 'rounded-2xl'} mx-auto min-h-[200px] w-full max-w-[200px] transition-all ${className}`}
                >
                  <div className='absolute right-[20px] top-[20px] h-[16px] w-[16px] cursor-pointer'>
                    <img src={ic_delete} alt='' onClick={onClose} width='100%' height='100%' />
                  </div>
                  <div className='text-[28px] font-semibold capitalize'>{title}</div>
                  {children}
                  <div className='absolute bottom-3 right-4 flex justify-end md:bottom-[30px] md:right-[50px]'>
                    <button
                      type='button'
                      className='flex items-center rounded-[99px] bg-black-main px-[30px] py-[6px] font-semibold uppercase text-white md:text-[18px]'
                      onClick={handleSubmit}
                    >
                      {titleButton}
                      <img src={ic_arrowright} alt='' className='ml-2' />
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
  }
)

export default DialogCustom
