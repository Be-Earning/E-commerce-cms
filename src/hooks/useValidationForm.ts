import * as yup from 'yup'
import { VALIDATION_CONTENT } from '~/constants/validationContent'

function useValidationForm() {
  const schemaProduct = yup.object().shape({
    name: yup.string().required('Name is required').max(100, 'Name can be at most 100 characters'),
    // .matches(/^[a-zA-Z0-9\s]+$/, 'Name cannot contain special characters'),
    categoryID: yup.number().required('Category is required').typeError('Category is required'),
    description: yup.string().required('Description is required'),
    // .matches(/^[a-zA-Z0-9\s]+$/, 'Description cannot contain special characters'),
    shippingFee: yup
      .number()
      .required('Shipping fee must be a number')
      .moreThan(0, 'Shipping fee must be greater than 0')
      .typeError('Shipping fee must be a number'),
    brandName: yup.string().required('Brand name is required'),
    // .matches(/^[a-zA-Z0-9\s]+$/, 'Brand name cannot contain special characters'),
    warranty: yup.string().required('Warranty is required').max(300, 'Warranty can be at most 300 characters'),
    // .matches(/^[a-zA-Z0-9\s]+$/, 'Warranty cannot contain special characters'),
    videoUrl: yup.string().url('Invalid URL format'),
    expiryTime: yup.date().required('Expiry time is required').typeError('Expiry time is required'),
    colorSize: yup
      .array()
      .of(
        yup.object().shape({
          color: yup.string().required('Is required'),
          size: yup.string().required('Is required')
        })
      )
      .required('At least one color and size are required'),
    capacities: yup
      .array()
      .of(
        yup.object().shape({
          valueCapacity: yup
            .number()
            .required('Is required')
            .moreThan(0, 'Must be greater than 0')
            .typeError('Must be a number')
        })
      )
      .required('At least one capacity is required'),
    prices: yup
      .array()
      .of(
        yup.object().shape({
          retailPrice: yup
            .number()
            .required('Is required')
            .moreThan(0, 'Must be greater than 0')
            .typeError('Must be a number'),
          reward: yup
            .number()
            .required('Is required')
            .moreThan(0, 'Must be greater than 0')
            .typeError('Must be a number'),
          memberPrice: yup
            .number()
            .required('Is required')
            .moreThan(0, 'Must be greater than 0')
            .typeError('Must be a number'),
          vipPrice: yup
            .number()
            .required('Is required')
            .moreThan(0, 'Must be greater than 0')
            .typeError('Must be a number'),
          quantity: yup
            .number()
            .required('Is required')
            .moreThan(0, 'Must be greater than 0')
            .typeError('Must be a number')
        })
      )
      .required('At least one price is required')
  })

  const schemaAddReview = yup.object({
    name: yup.string().required(VALIDATION_CONTENT.REQUIRED('reviewer’s name')),
    comment: yup.string().required(VALIDATION_CONTENT.REQUIRED('comment')),
    commentId: yup.string().required(VALIDATION_CONTENT.REQUIRED('customer ID'))
  })

  const schemaAddComment = yup.object({
    name: yup.string().required(VALIDATION_CONTENT.REQUIRED('the press’s name')),
    comment: yup.string().required(VALIDATION_CONTENT.REQUIRED('comment')),
    commentId: yup.string().required(VALIDATION_CONTENT.REQUIRED('newsroom'))
  })

  const schemaAddFAQ = yup.object({
    question: yup.string().required(VALIDATION_CONTENT.REQUIRED('question')),
    answer: yup.string().required(VALIDATION_CONTENT.REQUIRED('answer'))
  })

  return {
    schemaProduct,
    schemaAddFAQ,
    schemaAddReview,
    schemaAddComment
  }
}

export default useValidationForm
