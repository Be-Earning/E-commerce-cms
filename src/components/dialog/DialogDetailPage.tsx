import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Dispatch, Fragment, memo, ReactNode, SetStateAction } from 'react'

type DialogDetailPageProps = {
  children: ReactNode
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  className?: string
}

const DialogDetailPage = memo(({ children, open, setOpen, className }: DialogDetailPageProps) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog className='relative z-[700]' onClose={setOpen}>
        <div className='wrapper-content fixed inset-0 z-[100] w-screen overflow-y-auto'>
          <div className='min-h-full items-end justify-center sm:items-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-150'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <DialogPanel
                className={`wrapper-content overflow-y-auto bg-white transition-all sm:h-full sm:max-h-[100vh] sm:min-h-[100vh] sm:w-full sm:min-w-[100vw] sm:max-w-[100vw] ${className}`}
              >
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
})

export default DialogDetailPage
