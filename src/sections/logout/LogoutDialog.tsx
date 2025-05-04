import { forwardRef, memo, useCallback, useImperativeHandle, useRef } from 'react'
import { Button } from '~/components/button'
import { Dialog } from '~/components/dialog'
import { ConfirmDialogRef } from '~/components/dialog/ConfirmDialog'
import { DialogRef } from '~/components/dialog/Dialog'
import { LogoutIcon } from '~/components/icons'
import useLogout from '~/hooks/useLogout'

const LogoutDialog = memo(
  forwardRef<ConfirmDialogRef>((_, ref) => {
    const { handleLogout } = useLogout()

    const dialogRef = useRef<DialogRef | null>(null)

    const handleOpen = useCallback(() => dialogRef.current?.open(), [dialogRef])
    const handleClose = useCallback(() => dialogRef.current?.open(), [dialogRef])

    useImperativeHandle(ref, () => ({ handleOpen, handleClose }))

    return (
      <Dialog
        ref={dialogRef}
        zIndex='z-[700]'
        className='!rounded-2xl bg-white/[.88] xs:h-[258px] xs:w-full sm:h-[316px] sm:w-[538px]'
      >
        <div className='relative flex h-full flex-col items-center justify-center gap-4'>
          <LogoutIcon className='xs:size-[60px] sm:size-[80px]' />
          <div className='space-y-3 text-center'>
            <h1 className='font-customBold xs:text-[18px] xs:leading-[18.9px] sm:text-[28px] sm:leading-[29.4px]'>
              Log Out?
            </h1>
            <p className='text-black-main/[.76] xs:text-[14px] xs:leading-[14.7px] sm:text-[20px] sm:leading-[21px]'>
              Are you sure want to log out?
            </p>
          </div>
          <div className='mt-4 flex items-center gap-4'>
            <Button
              size='medium'
              variant='outline'
              onClick={() => dialogRef.current?.close()}
              classNameText='xs:text-[14px] sm:text-[18px]'
              className={`xs:h-10 xs:w-[120px] sm:h-12 sm:w-[180px]`}
            >
              Cancel
            </Button>
            <Button
              size='medium'
              onClick={handleLogout}
              className={`xs:h-10 xs:w-[120px] sm:h-12 sm:w-[180px]`}
              classNameText='xs:text-[14px] sm:text-[18px]'
            >
              Log out
            </Button>
          </div>
        </div>
      </Dialog>
    )
  })
)

export default LogoutDialog
