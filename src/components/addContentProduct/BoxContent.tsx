import { Plus } from 'lucide-react'
import { FC, memo, ReactNode, useCallback, useRef } from 'react'
import { ConfirmDialog } from '../dialog'
import { ConfirmDialogRef } from '../dialog/ConfirmDialog'
import { DeleteIcon, EditIcon } from '../icons'
import { Skeleton } from '../skeleton'
import { cn } from '~/utils/classNames'

interface BoxContentProps {
  index: number
  model: 'comment' | 'faq' | 'review'
  placeholder: string
  placeholderChild?: string
  className?: string
  content?: ReactNode | string
  onOpenModal?: () => void
  onDelete?: () => void
  isLoadingData: boolean
}

const BoxContent: FC<BoxContentProps> = memo(
  ({ index, model, placeholder, placeholderChild, className, content, onOpenModal, onDelete, isLoadingData }) => {
    const dialogRef = useRef<ConfirmDialogRef>(null)

    const handleDelete = useCallback(() => {
      onDelete && onDelete()
    }, [model, index, onDelete])

    return (
      <>
        <div
          className={cn(
            'relative flex w-full justify-between gap-[30px] rounded-2xl border border-solid border-gray-border xs:py-[16px] xs:pl-[26px] xs:pr-[16px] sm:py-[18px] sm:pl-[34px] sm:pr-[18px]',
            placeholderChild || content ? 'items-start' : 'items-center',
            className
          )}
        >
          <span className='absolute top-1/2 flex shrink-0 -translate-y-1/2 transform items-center justify-center rounded-full bg-black-main font-customSemiBold text-white xs:left-[-12px] xs:size-6 xs:text-[14px] sm:left-[-18px] sm:size-9 xl:text-[18px]/[18px]'>
            {index}
          </span>
          {isLoadingData ? (
            <div className='w-full space-y-2'>
              <Skeleton className='h-[16px] !w-full' />
              {placeholderChild && <Skeleton className='h-[16px] !w-full' />}
            </div>
          ) : content ? (
            <div className='line-clamp-5'>{content}</div>
          ) : (
            <div className='space-y-1 xs:overflow-hidden'>
              <p className='text-black-main/[.44] xs:text-[16px] sm:text-[17px] md:text-[17px] lg:text-[18px]/[26px]'>
                {placeholder}
              </p>
              {placeholderChild && (
                <p className='text-black-main/[.44] xs:truncate xs:text-[16px] sm:text-[17px] md:text-[17px] lg:text-[18px]/[26px]'>
                  {placeholderChild}
                </p>
              )}
            </div>
          )}
          <div className='flex items-center gap-3'>
            <button onClick={onOpenModal}>
              {content ? (
                <EditIcon className='xs:size-5 sm:size-6' color='#007AFF' />
              ) : (
                <Plus className='xs:size-5 sm:size-6' color='#007AFF' />
              )}
            </button>
            {(content || index > (model === 'comment' ? 4 : 3)) && (
              <button onClick={() => dialogRef.current?.handleOpen()}>
                <DeleteIcon className='xs:size-5 sm:size-6' color='#FF2D55' />
              </button>
            )}
          </div>
        </div>

        {(content || index > (model === 'comment' ? 4 : 3)) && (
          <ConfirmDialog
            ref={dialogRef}
            title='Confirm Delete'
            content={`Are you sure you want to delete this ${model}?`}
            onConfirm={handleDelete}
          />
        )}
      </>
    )
  }
)

export default BoxContent
