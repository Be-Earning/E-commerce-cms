import { yupResolver } from '@hookform/resolvers/yup'
import { FC, memo, useCallback, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { IFAQProduct, IProductDetail } from '~/@types/models'
import { IFAQFrom } from '~/@types/models/form'
import images from '~/assets'
import { Button } from '~/components/button'
import { InputField, TextareaField } from '~/components/form'
import useResponsive from '~/hooks/useResponsive'
import useValidationForm from '~/hooks/useValidationForm'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import { addNewFAQ, updateFAQ } from '~/redux/product/product.slice'
import { cn } from '~/utils/classNames'
import { getLocalStorage } from '~/utils/localStorage'

interface AddFAQDialogProps {
  index: number
  onClose: () => void
}

const AddFAQDialog: FC<AddFAQDialogProps> = memo(({ index, onClose }) => {
  const { id: productId } = useParams()

  const xsDown = useResponsive('down', 'xs')

  const dispatch = useAppDispatch()

  const { isEditing, faqs } = useAppSelector((s) => s.product)

  const { schemaAddFAQ } = useValidationForm()

  const productDataLocal: IProductDetail = useMemo(() => getLocalStorage(`product_${productId}`), [productId])

  const isExistFAQ = useMemo(
    () => productDataLocal?._faqs.some((faq) => +faq.id === Number(index)),
    [index, productDataLocal]
  )

  console.log('isExistFAQ', isExistFAQ)

  const addCommentForm = useForm<IFAQFrom>({
    resolver: yupResolver(schemaAddFAQ),
    mode: 'onBlur'
  })

  const { handleSubmit, setValue } = addCommentForm

  const handleSetValueFrom = useCallback(() => {
    const dataEdit = faqs.find((f) => f.id === index)
    if (dataEdit) {
      setValue('question', dataEdit?.question)
      setValue('answer', dataEdit?.answer)
    }
  }, [faqs])

  useEffect(() => {
    if (isEditing) handleSetValueFrom()
  }, [isEditing])

  const onSubmit = useCallback(
    (values: IFAQFrom) => {
      const faq: IFAQProduct = {
        ...values,
        id: isEditing ? index : new Date().getTime(),
        isNew: !isExistFAQ
      }
      if (!isEditing) {
        dispatch(addNewFAQ(faq))
      } else {
        dispatch(updateFAQ(faq))
      }
      toast.success(`FAQ ${isEditing ? 'updated' : 'added'} successfully.`)
      onClose()
    },
    [isEditing]
  )

  return (
    <div
      className={cn(
        xsDown && '!min-w-[320px]',
        'h-fit xs:min-w-[350px] xs:p-4 xs:pt-10 sm:min-w-[400px] sm:p-5 md:min-w-[600px] lg:min-w-[842px] lg:px-14 lg:py-10'
      )}
    >
      <h6 className='font-customSemiBold capitalize xs:text-[26px] sm:text-[28px]'>
        {!isEditing ? 'Add' : 'Update'} FAQ For Product
      </h6>

      <div className='mt-8 space-y-8'>
        <FormProvider {...addCommentForm}>
          <InputField
            fullWidth
            name='question'
            label='Question'
            placeholder='Ex: What is the main scent of this cologne?'
          />
          <TextareaField
            rows={2}
            fullWidth
            name='answer'
            label='Answer'
            placeholder='Ex: The main scent of this cologne is a refreshing blend of citrus and lavender, complemented by subtle notes of sandalwood and musk. This combination creates a vibrant yet sophisticated fragrance that is both invigorating and long-lasting.'
            className='h-[105px]'
          />
        </FormProvider>
      </div>
      <div className='mt-5 flex w-full justify-end gap-5'>
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
          {isEditing ? 'UPDATE' : 'ADD'} FAQ
          <img src={images.icons.arrow_right_white} alt='' className='ml-2' />
        </button>
      </div>
    </div>
  )
})

export default AddFAQDialog
