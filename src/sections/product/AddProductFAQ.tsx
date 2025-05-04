import { memo } from 'react'
import { IFAQProduct } from '~/@types/models'
import { BoxContent, SectionLayout } from '~/components/addContentProduct'
import { Dialog } from '~/components/dialog'
import { useAddContentProduct } from '~/hooks/useAddContentProduct'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import AddFAQDialog from './AddFAQDialog'
import { deleteFAQ, setEditing } from '~/redux/product/product.slice'

const placeholderContent = [
  {
    title: 'Ex: What is the main scent of this cologne?',
    content:
      'A: The main scent of this cologne is a refreshing blend of citrus and lavender, complemented by subtle notes of sandalwood and musk. This combination creates a vibrant yet sophisticated fragrance that is both invigorating and long-lasting.'
  },
  {
    title: 'Ex: When is this cologne most suitable? ',
    content:
      'A: The deeper notes of sandalwood and musk add a touch of sophistication, making it suitable for evening outings and formal events.  Its balanced and not overpowering fragrance makes it a great choice for the office or business meetings.'
  },
  {
    title: 'Ex: What are the key features of this cologne?',
    content:
      'A: A refreshing blend of citrus and lavender, enhanced with notes of sandalwood and musk for a sophisticated and long-lasting fragrance.'
  }
]

const AddProductFAQ = memo(({ isLoadingData }: { isLoadingData: boolean }) => {
  const dispatch = useAppDispatch()
  const { faqs } = useAppSelector((s) => s.product)

  console.log('faqs---', faqs)

  const {
    index,
    indices: faqsIdx,
    dialogRef,
    handleAddItem: handleAddFaq,
    handleDeleteItem: handleDeleteFaq,
    handleOpenModal
  } = useAddContentProduct<IFAQProduct>({
    items: faqs,
    defaultIdsLength: 3
  })

  return (
    <>
      <SectionLayout title='FAQ for product' actionContent='FAQ' onClick={handleAddFaq}>
        {faqsIdx.map((index, idx) => {
          const content = placeholderContent[index % placeholderContent.length]
          const faqData = faqs[idx]
          return (
            <BoxContent
              key={index}
              index={index}
              model='faq'
              isLoadingData={isLoadingData}
              placeholder={content.title}
              placeholderChild={content.content}
              content={
                faqData && (
                  <p className='font-customMedium text-[18px]/[26px]'>
                    Question: {faqData?.question}; <br />
                    Answer: {faqData?.answer}
                  </p>
                )
              }
              onOpenModal={() => {
                if (faqData) {
                  handleOpenModal(faqData.id, faqData)
                } else {
                  dialogRef.current?.open()
                  dispatch(setEditing(false))
                }
              }}
              onDelete={() => {
                handleDeleteFaq(idx)
                dispatch(deleteFAQ(faqData.id))
              }}
            />
          )
        })}
      </SectionLayout>

      <Dialog ref={dialogRef} className='xs:w-full sm:w-fit'>
        <AddFAQDialog index={index} onClose={() => dialogRef.current?.close()} />
      </Dialog>
    </>
  )
})

export default AddProductFAQ
