import { TextareaAutosize } from '@mui/material'
import React, { useState } from 'react'
import { DialogCustom } from '../dialog'
import { InputField, TextareaField } from '../form'
import { FormProvider, useForm } from 'react-hook-form'

interface CommentInputProps {
  index: number
  fullFillData: any
  onOpenModal: () => void
}

interface ReviewComponentProps {
  title: string
}

const CommentInput: React.FC<CommentInputProps> = ({ index, fullFillData, onOpenModal }) => {
  const combinedValue = fullFillData
    ? `Review's name: ${fullFillData.name}\nID: ${fullFillData.customerId}\nComment: ${fullFillData.comment}`
    : ''
  return (
    <div className='mb-2 flex items-center pl-[10px]'>
      <div className='relative flex-1'>
        <span className='absolute left-[-18px] top-[45%] mr-2 flex h-[36px] w-[36px] translate-y-[-50%] items-center justify-center rounded-full bg-black-main text-[18px] font-semibold text-white'>
          {index}
        </span>
        <TextareaAutosize
          placeholder="The press's name, Newsroom, Comment, ..."
          style={{
            width: '100%',
            borderRadius: '14px',
            border: '1px solid #D1D1D6', // Tailwind's gray-950 equivalent
            padding: '15px 20px',
            outline: 'none',
            resize: 'none',
            fontSize: '18px',
            fontWeight: 400,
            background: 'white'
          }}
          disabled
          className='focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
          value={combinedValue}
        />
        <button
          type='button'
          className='absolute right-[30px] top-[45%] translate-y-[-50%] text-[24px] text-[#007AFF]'
          onClick={onOpenModal}
        >
          +
        </button>
      </div>
    </div>
  )
}

const ReviewComponentChild = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const createProductForm = useForm<any>({
    mode: 'onBlur'
  })

  const handleSubmit = (data: any) => {
    onSubmit(data)
  }

  return (
    <FormProvider {...createProductForm}>
      <form onSubmit={createProductForm.handleSubmit(handleSubmit)}>
        <div className='mt-[10px] md:mt-[20px]'>
          <h2 className='mb-2 text-lg font-bold md:mb-4'>
            <div className='md:flex md:gap-6'>
              <InputField fullWidth name='name' label='Name of product' placeholder='Ex: Ruben Dkidis' />
              <InputField fullWidth name='customerId' label='Customer ID' placeholder='Ex: 6227339393' />
            </div>
            <TextareaField fullWidth name='comment' label='Comment' placeholder='Ex: This is a great product' />
            <div>Rate</div>
          </h2>
        </div>
      </form>
    </FormProvider>
  )
}

const ReviewComponent = ({ title }: ReviewComponentProps) => {
  const [reviews, setReviews] = useState<number[]>([1, 2, 3])
  const [reviewed, setReviewed] = useState<{ [key: number]: any }>({})
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)

  const addComment = () => {
    setReviews([...reviews, reviews.length + 1])
  }

  const openModal = (index: number) => {
    setCurrentIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentIndex(null)
  }

  const handleFormSubmit = (data: any) => {
    if (currentIndex !== null) {
      setReviewed((prev) => ({ ...prev, [currentIndex]: data }))
    }
  }

  return (
    <div className='p-4'>
      <h2 className='mb-4 text-lg font-bold'>{title}</h2>
      {reviews.map((index) => (
        <CommentInput key={index} index={index} onOpenModal={() => openModal(index)} fullFillData={reviewed[index]} />
      ))}
      <button type='button' className='mt-2 text-blue-500 hover:underline' onClick={addComment}>
        * More comment
      </button>

      {/* Modal */}
      {isModalOpen && (
        <DialogCustom
          open={isModalOpen}
          onClose={closeModal}
          title='add product review'
          variant='horizontal'
          titleButton='add review'
        >
          <ReviewComponentChild onSubmit={handleFormSubmit} />
        </DialogCustom>
      )}
    </div>
  )
}

export default ReviewComponent
