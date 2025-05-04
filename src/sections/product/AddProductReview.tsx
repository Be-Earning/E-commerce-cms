import { memo } from 'react'
import { ICommentProduct } from '~/@types/models'
import { BoxContent, SectionLayout } from '~/components/addContentProduct'
import { Dialog } from '~/components/dialog'
import { useAddContentProduct } from '~/hooks/useAddContentProduct'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import AddCommentDialog from './AddCommentDialog'
import { StarIcon } from '~/components/icons'
import { deleteReview, setEditing } from '~/redux/product/product.slice'

const AddProductReview = memo(({ isLoadingData }: { isLoadingData: boolean }) => {
  const dispatch = useAppDispatch()
  const { reviews } = useAppSelector((s) => s.product)

  console.log('reviews---', reviews)

  const {
    index,
    indices: reviewsIdx,
    dialogRef,
    handleAddItem: handleAddReview,
    handleDeleteItem: handleDeleteReview,
    handleOpenModal
  } = useAddContentProduct<ICommentProduct>({
    items: reviews,
    defaultIdsLength: 3
  })

  return (
    <>
      <SectionLayout title='Product review' actionContent='review' onClick={handleAddReview}>
        {reviewsIdx.map((index, idx) => {
          const reviewData = reviews[idx]

          return (
            <BoxContent
              key={index}
              index={index}
              model='review'
              isLoadingData={isLoadingData}
              placeholder='Reviewer’s name, ID, Comment, Rate, ...'
              content={
                reviewData && (
                  <p className='font-customMedium text-[18px]/[26px]'>
                    Review’s name: {reviewData?.name}; <br /> ID: {reviewData?.commentId}; <br />
                    Comment: {reviewData?.comment}; <br />{' '}
                    <span className='flex items-center gap-1'>
                      Rate: {reviewData?.rating || 0} <StarIcon />;
                    </span>
                  </p>
                )
              }
              onOpenModal={() => {
                if (reviewData) {
                  handleOpenModal(reviewData.id, reviewData)
                } else {
                  dialogRef.current?.open()
                  dispatch(setEditing(false))
                }
              }}
              onDelete={() => {
                handleDeleteReview(idx)
                dispatch(deleteReview(reviewData.id))
              }}
            />
          )
        })}
      </SectionLayout>

      <Dialog ref={dialogRef} className='xs:w-full sm:w-fit'>
        <AddCommentDialog model='review' index={index} onClose={() => dialogRef.current?.close()} />
      </Dialog>
    </>
  )
})

export default AddProductReview
