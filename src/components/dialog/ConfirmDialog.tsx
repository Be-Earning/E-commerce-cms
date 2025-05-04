import Lottie from 'lottie-react'
import { forwardRef, memo, useCallback, useImperativeHandle, useRef } from 'react'
import AnimationQuestion from '~/constants/animation/AnimationQuestion.json'
import { Button } from '../button'
import Dialog, { DialogRef } from './Dialog'
import { cn } from '~/utils/classNames'

interface ConfirmDialogProps {
  title: string
  content: string
  onConfirm: () => void
}

export interface ConfirmDialogRef {
  handleOpen: () => void
  handleClose: () => void
}

const ConfirmDialog = memo(
  forwardRef<ConfirmDialogRef, ConfirmDialogProps>(({ title, content, onConfirm }, ref) => {
    const dialogRef = useRef<DialogRef>(null)

    const handleOpen = useCallback(() => {
      dialogRef.current?.open()
    }, [])

    const handleClose = useCallback(() => {
      dialogRef.current?.open()
    }, [])

    useImperativeHandle(ref, () => ({ handleOpen, handleClose }))

    return (
      <Dialog
        ref={dialogRef}
        zIndex='z-[700]'
        className={cn('h-fit !rounded-2xl bg-white/[.88] xs:w-full sm:w-[538px]')}
      >
        <div className='relative flex h-full flex-col items-center justify-center gap-5 p-5 py-10'>
          <div className='space-y-5 text-center'>
            <Lottie animationData={AnimationQuestion} className='mx-auto xs:w-[80px] sm:w-[100px]' />
            <h1 className='font-customBold xs:text-[18px] xs:leading-[18.9px] sm:text-[28px] sm:leading-[29.4px]'>
              {title}
            </h1>
            <p className='text-blackMain/[.76] text-center xs:text-[14px] xs:leading-[14.7px] sm:text-[20px] sm:leading-[21px]'>
              {content}
            </p>
          </div>
          <Button
            size='medium'
            className={`mt-4 xs:h-10 xs:w-[120px] sm:h-12 sm:w-[180px]`}
            classNameText='xs:text-[14px] sm:text-[18px]'
            onClick={() => {
              onConfirm()
              dialogRef.current?.close()
            }}
          >
            CONFIRM
          </Button>
        </div>
      </Dialog>
    )
  })
)

export default ConfirmDialog
