import jsQR from 'jsqr'
import React, { Dispatch, memo, SetStateAction, useCallback } from 'react'
import toast from 'react-hot-toast'
import { SaveIcon } from '~/components/icons'
import { convertStringToSeedPhrase } from '~/utils/convert'

type UploadQRProps = {
  hideOr?: boolean
  imageToShow: string
  setImageToShow: Dispatch<SetStateAction<string>>
  setCustomSeedphrase?: Dispatch<SetStateAction<string>>
  setPriKey?: Dispatch<SetStateAction<string>>
}

const UploadQR = memo(({ hideOr, imageToShow, setImageToShow, setCustomSeedphrase, setPriKey }: UploadQRProps) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('The uploaded file is not an image. Please upload a valid image file.')
      return
    }

    setImageToShow(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onloadend = (event) => {
      const img = new Image()
      img.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const context = canvas.getContext('2d')
        context?.drawImage(img, 0, 0)
        const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)
        if (imageData) {
          const code = jsQR(imageData.data, imageData.width, imageData.height)
          if (code?.data) {
            if (setCustomSeedphrase) {
              const codeConvert = convertStringToSeedPhrase(code.data)
              const duplicates = codeConvert.filter((word, index) => codeConvert.indexOf(word) !== index)
              if (duplicates.length === 0 && codeConvert.length === 24) {
                setCustomSeedphrase(codeConvert.join(' '))
              } else {
                toast.error('Invalid QR seed phrase!')
              }
            } else if (setPriKey) {
              setPriKey(code.data)
            }
          } else {
            toast.error('No QR code found!')
          }
        } else {
          console.error('Failed to get image data!')
        }
      }

      if (typeof event.target?.result === 'string') {
        img.src = event.target.result
      } else {
        console.error('FileReader result is not a string')
      }
    }
    reader.readAsDataURL(file)
  }, [])

  return (
    <div className='flex h-fit w-full flex-1 flex-col items-center gap-3'>
      {!hideOr && (
        <div className='flex items-center gap-2'>
          <div className='bg-black/[.10] h-[1px] w-[67px]' />
          <p className='font-customSemiBold text-[16px]/[26px] tracking-[1%]'>OR</p>
          <div className='bg-black/[.10] h-[1px] w-[67px]' />
        </div>
      )}

      <div className='border-blackMain/[.22] flex w-full flex-col items-center gap-3 rounded-[8.4px] border-[2px] border-dotted p-3'>
        <div className='flex min-h-[200px] p-3'>
          {imageToShow ? (
            <div className='size-[200px] rounded-lg bg-white p-2'>
              <img src={imageToShow} alt='imageToShow' className='size-full object-cover object-center' />
            </div>
          ) : (
            <div className='flex flex-1 flex-col items-center justify-center'>
              <SaveIcon />
              <p className='font-customMedium text-[16px]/[27.3px] tracking-[1%]'>Input with QR code</p>
            </div>
          )}
        </div>

        <div className='flex w-full items-center gap-1 text-[14px] tracking-[1%]'>
          <button className='border-blackMain h-[33px] w-full rounded border-[1px] border-solid transition-all duration-150 ease-in-out hover:scale-[102%]'>
            Scan QR code
          </button>
          <div className='relative h-[33px] w-full transition-all duration-150 ease-in-out hover:scale-[102%]'>
            <button className='border-blackMain size-full rounded border-[1px] border-solid'>Upload image</button>
            <input
              key={imageToShow}
              type='file'
              className='absolute inset-0 cursor-pointer opacity-0'
              accept='image/*'
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

export default UploadQR
