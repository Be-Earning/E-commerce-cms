import { memo } from 'react'
import { ICommentProduct } from '~/@types/models'
import { BoxContent, SectionLayout } from '~/components/addContentProduct'
import { Dialog } from '~/components/dialog'
import { useAddContentProduct } from '~/hooks/useAddContentProduct'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import AddCommentDialog from './AddCommentDialog'
import { deleteComment, setEditing } from '~/redux/product/product.slice'

const AddPressComment = memo(({ isLoadingData }: { isLoadingData: boolean }) => {
  const dispatch = useAppDispatch()

  const { comments } = useAppSelector((s) => s.product)

  const {
    index,
    indices: commentsIdx,
    dialogRef,
    handleAddItem: handleAddComment,
    handleDeleteItem: handleDeleteComment,
    handleOpenModal
  } = useAddContentProduct<ICommentProduct>({
    items: comments,
    defaultIdsLength: 4
  })

  return (
    <>
      <SectionLayout title='The press comment' actionContent='comment' onClick={handleAddComment}>
        {commentsIdx.map((index, idx) => {
          const commentData = comments[idx]
          return (
            <BoxContent
              key={index}
              index={index}
              model='comment'
              isLoadingData={isLoadingData}
              placeholder='The press’s name, Newsroom, Comment, ...'
              content={
                commentData && (
                  <p className='font-customMedium text-[18px]/[26px]'>
                    The press’s name: {commentData?.name}; <br /> Newsroom: {commentData?.commentId}; <br />
                    Comment: {commentData?.comment}
                  </p>
                )
              }
              onOpenModal={() => {
                if (commentData) {
                  handleOpenModal(commentData.id, commentData)
                } else {
                  dialogRef.current?.open()
                  dispatch(setEditing(false))
                }
              }}
              onDelete={() => {
                handleDeleteComment(idx)
                dispatch(deleteComment(commentData.id))
              }}
            />
          )
        })}
      </SectionLayout>

      <Dialog ref={dialogRef} className='xs:w-full sm:w-fit'>
        <AddCommentDialog index={index} onClose={() => dialogRef.current?.close()} />
      </Dialog>
    </>
  )
})

export default AddPressComment
