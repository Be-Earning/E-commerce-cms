import { X } from 'lucide-react'
import React, {
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { FaPlus } from 'react-icons/fa6'
import { useOnClickOutside } from 'usehooks-ts'
import { statusUploadCode } from '~/@types/enums/fileUpload'
import ImageCropper from '~/components/cropImage/cropImage'
import CopyIcon from '~/components/icons/CopyIcon'
import CropIcon from '~/components/icons/CropIcon'
import SwapIcon from '~/components/icons/SwapIcon'
import OverflowTooltip from '~/components/overflowTooltip'
import { isValidImageUrl } from '~/constants/urlRegex'
import usePasteFromClipboard from '~/hooks/useClipBoard'
import useResponsive from '~/hooks/useResponsive'
import { convertUrlsToLinks } from '~/utils/covertAndFormatUrl'
import { bytesToImageUrl } from '~/redux/product/product.slice'
import { cn } from '~/utils/classNames'
import { convertBlobToBase64 } from '~/utils/convert'

interface ImageUploaderProps {
  maxImages?: number
  onCompleteUpload: (links: string[], blobs: Blob[]) => void
}

export interface ImageUploaderRef {
  setImageUrls: Dispatch<SetStateAction<string[]>>
  setImageBlobs: Dispatch<SetStateAction<Blob[] | any[]>>
  setTexts: Dispatch<SetStateAction<string[]>>
}

const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(({ maxImages = 3, onCompleteUpload }, ref) => {
  const inputRef = useRef(null)
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const xsDown = useResponsive('down', 'xs')

  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageBlobs, setImageBlobs] = useState<Blob[] | any[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [texts, setTexts] = useState<string[]>([])
  const [showListLink, setShowListLink] = useState<boolean>(false)
  const [swapIndex, setSwapIndex] = useState<number>(0)

  useImperativeHandle(ref, () => ({
    setImageUrls,
    setImageBlobs,
    setTexts
  }))

  const { clipboardContent, pasteFromClipboard } = usePasteFromClipboard()

  const isMaxImages = useMemo(() => imageUrls.length >= maxImages, [imageUrls, maxImages])

  useOnClickOutside(inputRef, () => {
    setShowListLink(false)
  })

  useEffect(() => {
    if (clipboardContent) setInputValue(clipboardContent)
  }, [clipboardContent])

  const handlePaste = useCallback(() => {
    if (!isMaxImages) pasteFromClipboard()
  }, [isMaxImages])

  // This function is called when the user presses Enter after pasting a URL
  const handleUrlInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue && !isMaxImages) {
      if (isValidImageUrl(inputValue)) {
        // if (imageUrls.includes(inputValue)) {
        //   toast.error('This image URL has already been added.')
        // } else {
        setTexts((prev) => [...prev, inputValue])
        setImageUrls((prev) => [...prev, inputValue].slice(0, maxImages))
        onCompleteUpload([...imageUrls, inputValue], imageBlobs)
        // }
      } else {
        setTexts((prev) => [...prev, inputValue])
        toast.error('Invalid image URL.')
      }
      setInputValue('')
    }
  }

  // Utility function to convert ArrayBuffer to Hex string
  const arrayBufferToHex = (buffer: ArrayBuffer) => {
    const byteArray = new Uint8Array(buffer)
    return Array.from(byteArray)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  }

  const handleDrop = async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    console.log('acceptedFiles-----', acceptedFiles)

    if (acceptedFiles.length > 0 && imageUrls.length < maxImages) {
      const validImages = acceptedFiles.filter((file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024)

      const newBlobs = validImages.map((file) => file) // Giữ lại các file gốc dưới dạng blob

      // Chuyển đổi các file hình ảnh thành base64
      const newUrls = await Promise.all(
        validImages.map(async (file) => {
          console.log('filefilefile--', file)
          const fileKey = file.name
          let base64Image = fileKey
          try {
            const fileContent = await readFileAsArrayBuffer(file)
            const hexString = arrayBufferToHex(fileContent)
            const { blob } = bytesToImageUrl(hexString)
            if (blob instanceof Blob) {
              base64Image = await convertBlobToBase64(blob)
            }
          } catch (error) {
            console.error('Error during conversion:', error)
          }
          return base64Image
        })
      )

      console.log('validImages---', validImages)

      if (validImages.length > 0) {
        setImageBlobs((prev) => [...prev, ...newBlobs].slice(0, maxImages))
        setImageUrls((prev) => [...prev, ...newUrls].slice(0, maxImages))
        onCompleteUpload([...imageUrls, ...newUrls], [...imageBlobs, ...newBlobs])
      }

      if (validImages.length < acceptedFiles.length) {
        const invalidFiles = acceptedFiles.filter(
          (file) => !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024
        )
        invalidFiles.forEach((file) => {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`Không thể tải lên ${file.name}: Kích thước tệp phải nhỏ hơn 5MB`)
          } else {
            toast.error(`${file.name} không phải là hình ảnh và không được tải lên.`)
          }
        })
      }
    }

    // Xử lý các file bị từ chối (thông báo lỗi)
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        console.log('errors:', errors)
        if (errors[0].message === statusUploadCode.FILE_TOO_LANRGE) {
          toast.error(`Không thể tải lên ${file.name}: Kích thước tệp phải nhỏ hơn 5MB`)
        } else if (errors[0].message === statusUploadCode.TOO_MANY_FILES) {
          toast.error(`Không thể tải lên ${file.name}: Số lượng tệp tối đa là ${maxImages}`)
        } else {
          toast.error(`Không thể tải lên ${file.name}: ${errors.map((e) => e.message).join(', ')}`)
        }
      })
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
      'image/svg+xml': []
    },
    onDrop: handleDrop,
    maxFiles: maxImages - imageUrls.length,
    maxSize: 5242880,
    multiple: true
  })

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'))
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file) // Read the file as ArrayBuffer
    })
  }

  const removeImage = (index: number) => {
    const newUrls = [...imageUrls]
    const newBlobs = [...imageBlobs]
    console.log('imageBlobs---', imageBlobs)
    newUrls.splice(index, 1)
    newBlobs.splice(index, 1)
    console.log('newBlobs--', newBlobs)
    setImageUrls(newUrls)
    setImageBlobs(newBlobs)
    onCompleteUpload(newUrls, newBlobs)

    const textIndex = texts.findIndex((text) => text === imageUrls[index])
    if (textIndex !== -1) {
      removeText(textIndex)
    }
  }

  const removeText = (index: number) => {
    const textToRemove = texts[index]
    const urlIndex = imageUrls.indexOf(textToRemove)

    if (urlIndex !== -1) {
      const newUrls = [...imageUrls]
      const newBlobs = [...imageBlobs]
      newUrls.splice(urlIndex, 1)
      newBlobs.splice(urlIndex, 1)

      setImageUrls(newUrls)
      setImageBlobs(newBlobs)
      onCompleteUpload(newUrls, newBlobs)
    }

    const newTexts = [...texts]
    newTexts.splice(index, 1)
    setTexts(newTexts)
  }

  const handleCropComplete = (index: number, croppedBlob: Blob[] | null, croppedFileUrl: string) => {
    console.log('run here ??')
    const newUrls = [...imageUrls]
    const newBlobs = [...imageBlobs]

    if (croppedBlob && croppedBlob.length > 0) {
      newBlobs[index] = croppedBlob[0]
    }

    newUrls[index] = croppedFileUrl
    setImageUrls(newUrls)
    setImageBlobs(newBlobs)

    onCompleteUpload(newUrls, newBlobs)
  }

  const handleSwapClick = (index: number) => {
    // Store the index of the image to be swapped
    setSwapIndex(index)
    // Trigger the hidden file input
    hiddenFileInput.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check if the file size is smaller than 5MB (5 * 1024 * 1024 bytes)
      if (file.size <= 5 * 1024 * 1024) {
        console.log('file.size', file.size)
        // Replace the current image with the newly selected one
        const newBlob = file
        const newUrl = URL.createObjectURL(file)

        const newUrls = [...imageUrls]
        const newBlobs = [...imageBlobs]
        newUrls[swapIndex] = newUrl
        newBlobs[swapIndex] = newBlob

        setImageUrls(newUrls)
        setImageBlobs(newBlobs)

        onCompleteUpload(newUrls, newBlobs)
      } else {
        toast.error(`Failed to upload ${file.name}: File size must be less than 5MB`)
      }
    }
  }

  console.log('imageUrls----', imageUrls)
  console.log('imageBlobs', imageBlobs)

  return (
    <div
      className={cn(
        xsDown ? 'p-2' : 'p-4',
        'flex w-full flex-col overflow-hidden rounded-[16px] border border-solid border-gray-border pt-0 text-gray-darker'
      )}
    >
      <div className='relative flex items-center gap-2' ref={inputRef}>
        <input
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleUrlInput}
          placeholder='Enter image link...'
          className={`relative h-[52px] flex-1 border-0 border-b-2 border-solid border-gray-dark bg-transparent pr-10 text-black-main placeholder:text-gray-darker`}
          onClick={() => setShowListLink(true)}
        />
        {texts.length > 0 && showListLink && (
          <div className='list-link absolute z-[100] max-h-[130px] w-full translate-y-[78%] overflow-y-auto rounded-b-xl bg-white/[.75] pb-4 shadow-3xl backdrop-blur-3xl'>
            <div className='mt-2'>
              <ul className='flex list-disc flex-col gap-[17px] px-2'>
                {texts.map((text, index) => (
                  <li key={index} className='flex items-center justify-between'>
                    <OverflowTooltip width='100%' content={text}>
                      <span className='overflow-hidden text-ellipsis text-nowrap'>{convertUrlsToLinks(text)}</span>
                    </OverflowTooltip>
                    <button
                      onClick={() => removeText(index)}
                      className='flex size-4 items-center justify-center rounded-full bg-black-main p-1 text-lg'
                    >
                      <X className='size-4 text-white' />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <button
          onClick={handlePaste}
          className='absolute right-[8px] disabled:cursor-not-allowed'
          disabled={isMaxImages || inputValue !== ''}
        >
          <CopyIcon />
        </button>
      </div>
      <div className={cn('grid grid-cols-3 items-center gap-2 overflow-hidden pt-5 lg:grid-cols-4 lg:gap-5')}>
        {Array.from({ length: maxImages }).map((_, index) =>
          imageUrls[index] ? (
            <div
              key={imageUrls[index] + index}
              className={cn(
                xsDown && '!size-[84px]',
                'image-preview relative flex items-center justify-center rounded-xl border-2 border-solid border-gray-light xs:size-[94px] sm:size-24 lg:size-[100px] xl:size-[120px]'
              )}
            >
              <img
                src={imageUrls[index]}
                alt={`Uploaded ${index + 1}`}
                className='h-full w-full rounded-xl object-cover brightness-90'
              />
              <button
                onClick={() => removeImage(index)}
                className='absolute right-[-10px] top-[-10px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-black-main p-1 text-lg'
              >
                <X className='h-[20px] w-[20px] text-white' />
              </button>
              <div className='absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-5'>
                <ImageCropper
                  src={imageUrls[index]}
                  onCropComplete={(blob, fileUrl) => handleCropComplete(index, blob, fileUrl)}
                  trigger={
                    <button className='flex h-6 w-6 items-center justify-center rounded bg-gray-darker'>
                      <CropIcon className='h-4 w-4' />
                    </button>
                  }
                />

                <button
                  onClick={() => handleSwapClick(index)}
                  className='flex h-6 w-6 items-center justify-center rounded bg-gray-darker'
                >
                  <SwapIcon className='h-4 w-4' />
                </button>
                <input
                  type='file'
                  ref={hiddenFileInput}
                  onChange={handleFileChange}
                  className='hidden'
                  accept='image/*'
                />
              </div>
            </div>
          ) : (
            <div
              key={`empty-${index}`}
              {...getRootProps({ onClick: () => inputRefs.current[index]?.click() })}
              className={cn(
                xsDown && '!size-[84px]',
                'relative flex cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-dashed border-gray-border xs:mx-auto xs:size-[94px] sm:size-24 lg:size-[100px] xl:size-[120px]'
              )}
            >
              <input
                {...getInputProps()}
                ref={(el) => (inputRefs.current[index] = el)} // Gán ref cho từng input
                className='hidden'
                accept='image/*'
              />
              <div className='text-center'>
                <FaPlus className='size-4' />
              </div>
            </div>
          )
        )}

        <p
          className={`col-span-3 text-black-main/[.44] xs:text-center sm:text-center md:text-center lg:col-span-1 lg:text-left`}
        >
          or upload <br className='xs:hidden sm:hidden md:hidden lg:flex' /> image here
        </p>
      </div>
    </div>
  )
})

export default ImageUploader
