import { useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { EnumCommentType, Role } from '~/@types/enums'
import { SPLIT_KEY } from '~/constants/splitKey'
import { useAppSelector } from '~/redux/configStore'
import { sendTransaction } from '~/smartContract/combineSdk'

function useCreateProductInfo() {
  const { activeWallet, userRole } = useAppSelector((s) => s.user)
  const { comments, reviews, faqs } = useAppSelector((s) => s.product)

  const isController = useMemo(() => +userRole === Role.CONTROLLER, [userRole])

  const handleCreateProductInfor = useCallback(
    async (productId: number) => {
      try {
        const res = await sendTransaction(
          'createComments',
          {
            _productID: productId,
            params: [
              ...comments.map((comment) => ({
                commentType: EnumCommentType.PRESSCOMMENT,
                content: comment.comment,
                name: `${comment.name}${SPLIT_KEY.COMMENT}${comment.commentId}`,
                rate: 0
              })),
              ...reviews.map((review) => ({
                commentType: EnumCommentType.REVIEW,
                content: review.comment,
                name: `${review.name}${SPLIT_KEY.COMMENT}${review.commentId}`,
                rate: review.rating
              }))
            ]
          },
          'ecom-product',
          activeWallet,
          'chain'
        )
        let resFAQ: any
        if (isController) {
          resFAQ = await sendTransaction(
            'createFAQsProduct',
            {
              _productID: productId,
              params: faqs.map((faq) => ({ title: faq.question, content: faq.answer }))
            },
            'ecom-product',
            activeWallet
          )
        } else {
          resFAQ = { success: true }
        }

        console.log('handleCreateProductInfor---res', res)
        console.log('handleCreateProductInfor---resFAQ', resFAQ)
        if (res.success && resFAQ.success) return true
        if (!res.success) toast.error('Create review and comment for products failed!')
        if (!resFAQ.success) toast.error('Create faq for products failed!')
        await sendTransaction('deleteProduct', { _productID: productId }, 'ecom-product', activeWallet)
        return false
      } catch (error) {
        toast.error('Create product comment and faqs fail!!')
        await sendTransaction('deleteProduct', { _productID: productId }, 'ecom-product', activeWallet)
        return false
      }
    },
    [comments, reviews, faqs, activeWallet, isController]
  )

  const handleEditProductInfor = useCallback(
    async (productId: number) => {
      try {
        console.log('params----faqs-', [
          ...comments
            .filter((com) => !com.isNew)
            .map((comment) => ({
              commentID: comment.id,
              content: comment.comment
            })),
          ...reviews
            .filter((review) => !review.isNew)
            .map((review) => ({
              commentID: review.id,
              content: review.comment
            }))
        ])
        const res = await sendTransaction(
          'editComments',
          {
            params: [
              ...comments
                .filter((com) => !com.isNew)
                .map((comment) => ({
                  commentID: comment.id,
                  content: comment.comment
                })),
              ...reviews
                .filter((review) => !review.isNew)
                .map((review) => ({
                  commentID: review.id,
                  content: review.comment
                }))
            ]
          },
          'ecom-product',
          activeWallet,
          'chain'
        )
        console.log(
          'params----faqs-',
          faqs.filter((f) => !f.isNew).map((faq) => ({ faqID: faq.id, title: faq.question, content: faq.answer }))
        )
        const resFAQ = await sendTransaction(
          'editFAQProducts',
          {
            params: faqs
              .filter((f) => !f.isNew)
              .map((faq) => ({ faqID: faq.id, title: faq.question, content: faq.answer }))
          },
          'ecom-product',
          activeWallet
        )
        const listNewComments = [
          ...comments
            .filter((com) => com.isNew)
            .map((comment) => ({
              commentType: EnumCommentType.PRESSCOMMENT,
              content: comment.comment,
              name: `${comment.name}${SPLIT_KEY.COMMENT}${comment.commentId}`,
              rate: 0
            })),
          ...reviews
            .filter((review) => review.isNew)
            .map((review) => ({
              commentType: EnumCommentType.REVIEW,
              content: review.comment,
              name: `${review.name}${SPLIT_KEY.COMMENT}${review.commentId}`,
              rate: review.rating
            }))
        ]
        const listNewFaqs = faqs.filter((f) => f.isNew).map((faq) => ({ title: faq.question, content: faq.answer }))

        if (listNewComments.length > 0) {
          const resNewCom = await sendTransaction(
            'createComments',
            {
              _productID: productId,
              params: listNewComments
            },
            'ecom-product',
            activeWallet,
            'chain'
          )
          if (!resNewCom.success) toast.error('Create review and comment for products failed!')
        }
        if (listNewFaqs.length > 0 && isController) {
          const resNewFaq = await sendTransaction(
            'createFAQsProduct',
            {
              _productID: productId,
              params: listNewFaqs
            },
            'ecom-product',
            activeWallet,
            'chain'
          )
          if (!resNewFaq.success) toast.error('Create faq for products failed!')
        }
        if (res.success && resFAQ.success) return true

        if (!res.success) toast.error('Update review and comment for products failed!')
        if (!resFAQ.success) toast.error('Update faq for products failed!')
        return false
      } catch (error) {
        toast.error('Update product comment and faqs')
        return false
      }
    },
    [comments, reviews, faqs, activeWallet]
  )

  return { handleCreateProductInfor, handleEditProductInfor }
}

export default useCreateProductInfo
