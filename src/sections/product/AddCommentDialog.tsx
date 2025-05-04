import { yupResolver } from '@hookform/resolvers/yup'
import StarIcon from '@mui/icons-material/Star'
import { Rating } from '@mui/material'
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { QueryConfig } from '~/@types/common'
import { ICommentProduct, IProductDetail } from '~/@types/models'
import { ICommentFrom } from '~/@types/models/form'
import images from '~/assets'
import { Button } from '~/components/button'
import { InputField, TextareaField } from '~/components/form'
import useQueryConfig from '~/hooks/useQueryConfig'
import useResponsive from '~/hooks/useResponsive'
import useValidationForm from '~/hooks/useValidationForm'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import { addNewComment, addNewReview, updateComment, updateReview } from '~/redux/product/product.slice'
import { cn } from '~/utils/classNames'
import { getLocalStorage } from '~/utils/localStorage'

interface AddCommentDialogProps {
  index: number
  model?: 'comment' | 'review'
  onClose: () => void
}

const AddCommentDialog: FC<AddCommentDialogProps> = memo(({ index, model = 'comment', onClose }) => {
  const { id: productId } = useParams()

  const xsDown = useResponsive('down', 'xs')

  const dispatch = useAppDispatch()

  const { isEditing, comments, reviews } = useAppSelector((s) => s.product)

  const queryConfig: QueryConfig = useQueryConfig()
  const { schemaAddReview, schemaAddComment } = useValidationForm()
  const productDataLocal: IProductDetail = useMemo(() => getLocalStorage(`product_${productId}`), [productId])

  const isExistComment = useMemo(
    () => productDataLocal?._comments.some((faq) => +faq.id === Number(index)),
    [index, productDataLocal]
  )

  console.log('isExistComment---', isExistComment)

  const isEditingPage = useMemo(() => Number(queryConfig.isEditing) === 1, [queryConfig.isEditing])

  const [ratings, setRatings] = useState<number>(5)

  const addCommentForm = useForm<ICommentFrom>({
    resolver: yupResolver(model === 'comment' ? schemaAddComment : schemaAddReview),
    mode: 'onBlur'
  })

  const { handleSubmit, setValue } = addCommentForm

  const handleSetValueFrom = useCallback(() => {
    try {
      const dataEdit = model === 'comment' ? comments.find((c) => c.id === index) : reviews.find((r) => r.id === index)
      if (dataEdit) {
        setValue('name', dataEdit?.name)
        setValue('commentId', dataEdit?.commentId)
        setValue('comment', dataEdit?.comment)
        setRatings(dataEdit?.rating)
      }
      onClose()
    } catch (error) {
      console.log('Cancel error', error)
    }
  }, [comments, reviews])

  useEffect(() => {
    if (isEditing) handleSetValueFrom()
  }, [isEditing])

  const onSubmit = useCallback(
    (values: ICommentFrom) => {
      console.log('isEditing---', isEditing)
      const comment: ICommentProduct = {
        ...values,
        id: isEditing ? index : new Date().getTime(),
        rating: ratings,
        isNew: !isExistComment
      }
      if (!isEditing) {
        if (model === 'comment') {
          dispatch(addNewComment(comment))
        } else {
          dispatch(addNewReview(comment))
        }
      } else {
        if (model === 'comment') {
          dispatch(updateComment(comment))
        } else {
          dispatch(updateReview(comment))
        }
      }
      toast.success(`${model === 'comment' ? 'Comment' : 'Review'} ${isEditing ? 'updated' : 'added'} successfully.`)
      onClose()
    },
    [isEditing, model, ratings, isEditingPage]
  )

  return (
    <div
      className={cn(
        xsDown && '!min-w-[320px]',
        'h-fit xs:min-w-[350px] xs:p-4 xs:pt-10 sm:min-w-[400px] sm:p-5 md:min-w-[600px] lg:min-w-[842px] lg:px-14 lg:py-10'
      )}
    >
      <h6 className='font-customSemiBold capitalize xs:text-[26px] sm:text-[28px]'>
        {isEditing ? 'Update' : 'Add'} {model === 'comment' ? 'the press comment' : 'product review'}
      </h6>

      <div className='mt-8 space-y-8'>
        <FormProvider {...addCommentForm}>
          <div className='flex items-center gap-5 xs:flex-col lg:flex-row'>
            <InputField
              fullWidth
              name='name'
              disabled={isEditing && isEditingPage}
              showDataDisable
              label={model === 'comment' ? 'The press’s name' : 'Reviewer’s name'}
              placeholder='Ex: Ruben Dokidis'
            />
            <InputField
              fullWidth
              name='commentId'
              disabled={isEditing && isEditingPage}
              showDataDisable
              label={model === 'comment' ? 'Newsroom' : 'Customer ID'}
              placeholder={model === 'comment' ? 'Ex: Vogue' : 'Ex: 6337339393'}
            />
          </div>
          <TextareaField
            rows={2}
            fullWidth
            name='comment'
            label='Comment'
            placeholder={
              model === 'comment'
                ? '"Critics and connoisseurs alike have lauded this fragrance for its captivating aroma and its ability to leave a lasting impression in any setting."'
                : 'Ex: Dazzling array of products, with something to cater to every need and taste!'
            }
            className='h-[105px]'
          />
        </FormProvider>
        {model === 'review' && (
          <div className='flex items-center gap-[14px]'>
            <p className='font-customSemiBold'>Rate</p>{' '}
            <Rating
              disabled={isEditing && isEditingPage}
              emptyIcon={<StarIcon style={{ opacity: 0.55, fontSize: 32 }} />}
              icon={<StarIcon sx={{ fontSize: 32 }} />}
              value={ratings}
              onChange={(_event, newValue) => newValue !== null && setRatings(newValue)}
            />
          </div>
        )}
      </div>
      <div className='mt-5 flex w-full items-center justify-end gap-5'>
        {isEditing && (
          <Button variant='outline' className='h-[44px]' onClick={handleSetValueFrom}>
            CANCEL
          </Button>
        )}
        <button
          type='button'
          className='flex items-center rounded-[99px] bg-black-main px-[30px] py-[6px] font-semibold uppercase text-white md:text-[18px]'
          onClick={handleSubmit(onSubmit)}
        >
          {isEditing ? 'UPDATE' : 'ADD'} {model === 'comment' ? 'COMMENT' : 'REVIEW'}
          <img src={images.icons.arrow_right_white} alt='' className='ml-2' />
        </button>
      </div>
    </div>
  )
})

export default AddCommentDialog
