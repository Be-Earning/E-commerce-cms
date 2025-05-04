import React, { useEffect, useRef, useState } from 'react'
import ReactCrop, { Crop, PercentCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import IconNoImage from '~/components/icons/NoImage'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'

interface ImageCropperProps {
  src?: string
  hideChangeImages?: boolean
  onCropComplete?: (croppedImage: Blob[] | null, fileUrl: string) => void
  trigger?: React.ReactNode
}
/**
 *
 * @param src is source of image
 * @param onCropComplete is function handle crop image, return blob and fileUrl
 * @param trigger is trigger to open dialog crop image, default is Button
 * @example:
 * ```tsx
 * <ImageCropper src={imageCrop} onCropComplete={(blob, fileUrl) => console.log(blob, fileUrl)} />
 * ```
 */

const ImageCropper: React.FC<ImageCropperProps> = ({ src, hideChangeImages = false, onCropComplete, trigger }) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(src)
  const [crop, setCrop] = useState<Crop | PercentCrop>({
    unit: '%',
    x: 0,
    y: 0,
    width: 100,
    height: 100
  })
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (src) {
      fetchImageAsDataURL(src)
    }
  }, [src])

  const fetchImageAsDataURL = async (url: string) => {
    console.log('urlurl---', url)
    setSelectedImage(url)
    // try {
    //   const img = new Image()
    //   img.src = url
    //   img.crossOrigin = 'Anonymous'

    //   img.onload = () => {
    //     const canvas = document.createElement('canvas')
    //     canvas.width = img.width
    //     canvas.height = img.height

    //     const ctx = canvas.getContext('2d')
    //     console.log('onload complete')
    //     if (ctx) {
    //       ctx.drawImage(img, 0, 0)
    //       const dataURL = canvas.toDataURL('image/png')
    //       setSelectedImage(dataURL)
    //     }
    //   }

    //   img.onerror = (error) => {
    //     console.error('Error loading image:', error)
    //     setSelectedImage(url)
    //   }
    // } catch (error) {
    //   console.error('Error fetching image:', error)
    // }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const initialCrop: Crop = {
      unit: 'px',
      width: width,
      height: height,
      x: 0,
      y: 0
    }
    setCrop(initialCrop)
    setCompletedCrop(initialCrop)
  }

  const getCroppedImg = () => {
    if (!completedCrop || !imageRef.current || !canvasRef.current) return

    const image = imageRef.current
    const canvas = canvasRef.current
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.width = completedCrop.width!
    canvas.height = completedCrop.height!

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    )

    const base64Image = canvas.toDataURL('image/png')

    const byteString = atob(base64Image.split(',')[1])
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uint8Array = new Uint8Array(arrayBuffer)

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i)
    }

    const blob = new Blob([uint8Array], { type: 'image/png' })
    const file = new File([blob], 'image-product.png', { type: 'image/png' })

    if (onCropComplete) {
      onCropComplete([file], base64Image)
    }

    setIsDialogOpen(false)
  }

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChangeImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline' onClick={() => setIsDialogOpen(true)}>
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className='h-fit bg-white/[.76] backdrop-blur-xl xs:w-[95%] sm:w-[95%] md:w-[95%] lg:max-w-[60%] xl:max-w-[50%]'
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className='flex flex-col items-center gap-4 py-[50px]'>
          <div className='flex-1'>
            {selectedImage ? (
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                keepSelection
                className='max-h-[300px] 2xl:max-h-[400px]'
              >
                <img src={selectedImage} ref={imageRef} onLoad={onImageLoad} alt='Source' className='object-contain' />
              </ReactCrop>
            ) : (
              <div className='flex flex-col items-center gap-5'>
                <IconNoImage className='h-[200px] w-[200px]' />
                <span>Image is not available, please make sure your image is working or upload another image</span>
              </div>
            )}
          </div>
          <div className='flex flex-shrink-0 flex-col gap-4'>
            <input type='file' accept='image/*' onChange={onImageChange} className='hidden' ref={fileInputRef} />

            {!hideChangeImages && (
              <span
                className='block cursor-pointer text-center text-black-main underline hover:no-underline'
                onClick={handleChangeImageClick}
              >
                Change image
              </span>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <button
              onClick={getCroppedImg}
              className={`mx-auto h-12 w-[150px] rounded-[24px] px-3 py-1 ${
                completedCrop ? 'bg-black-main text-white' : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
              disabled={!completedCrop}
            >
              Save
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageCropper
