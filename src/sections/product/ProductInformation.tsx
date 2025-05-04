import { format } from 'date-fns'
import { memo, useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { scCategory } from '~/@types/enums/category'
import { listColors } from '~/assets/mocks/color'
import { CheckSuccessIcon } from '~/components/icons'
import PendingIcon from '~/components/icons/PendingIcon'
import AutoPlayVideo from '~/components/playVideo'
import YouTubeEmbed from '~/components/playVideo/youTubeEmbed'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import useResponsive from '~/hooks/useResponsive'
import { useAppSelector } from '~/redux/configStore'
import { cn } from '~/utils/classNames'
import { isMp4Url, isYouTubeUrl } from '~/utils/covertAndFormatUrl'
import { ConvertStatus } from '~/utils/covertStatus'
import { formatPrice, removeEscapeCharacters } from '~/utils/format'

const ProductInformation = memo(({ isLoadingData }: { isLoadingData: boolean }) => {
  const { id } = useParams()

  const xsDown = useResponsive('down', 'xs')

  const { listProducts } = useAppSelector((s) => s.product)

  const productDetail = listProducts?.find((item) => item.product.id === id)

  const { name, categoryID, description, shippingFee, brandName, images, warranty, videoUrl, expiryTime, isApprove } =
    productDetail?.product.params || {}

  console.log('description---', description)
  console.log('removeEscapeCharacters(description)', removeEscapeCharacters(description))

  // const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showMore, setShowMore] = useState<boolean>(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    if (images) {
      setImageUrls(images)
    }
  }, [images])

  // const handleCropComplete = useCallback(
  //   async (index: number, croppedBlob: Blob[] | null, croppedFileUrl: string) => {
  //     try {
  //       setIsLoading(true)
  //       const newUrls = [...imageUrls]
  //       newUrls[index] = croppedFileUrl
  //       setImageUrls(newUrls)
  //       if (croppedBlob) {
  //         const resUpload = await handlePushFiles(activeWallet, croppedBlob)
  //         console.log('resUploadresUpload---', resUpload)
  //         if (!resUpload.payload) toast.error('Upload image failed!')
  //         if (resUpload.payload) {
  //           newUrls[index] = resUpload.payload as string
  //           const resUploadSC = await sendTransaction(
  //             'updateProductImages',
  //             { _productID: id, _images: resUpload.payload[0] },
  //             'ecom-product',
  //             activeWallet,
  //             'chain'
  //           )
  //           if (!resUploadSC.success) {
  //             setIsLoading(false)
  //             toast.error('Update image failed!')
  //           }
  //           toast.success('Update image successfully!')
  //         }
  //       }
  //     } catch (error) {
  //       console.log('Error updating image', error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   },
  //   [imageUrls, activeWallet, id]
  // )

  const { className } = ConvertStatus(isApprove === true ? 'Approve' : 'Pending')

  return (
    <>
      {/* {isLoading && (
        <div className='fixed bottom-0 left-0 right-0 top-0 z-[2000]'>
          <LoadingScreen />
        </div>
      )} */}

      <section className='flex flex-col gap-8'>
        <div className='flex items-center gap-5 xs:flex-col sm:flex-row'>
          <h1 className='font-customSemiBold xs:text-[24px]/[25px] sm:text-[26px]/[27px] md:text-[28px]/[29px] lg:text-[32px]/[32px]'>
            Product Information
          </h1>
          <div
            className={cn(
              className,
              'flex items-center justify-center gap-2 rounded-[48px] text-black-main/[.64] xs:h-8 xs:px-2 xs:text-[14px]/[14.7px] sm:h-[40px] sm:px-3 sm:text-[16px]/[16.8px] md:h-[44px] md:px-3 md:text-[18px]/[18.9px] lg:h-[48px] lg:px-3 lg:text-[20px]/[20px]'
            )}
          >
            <span>{isApprove ? <CheckSuccessIcon className='size-5' /> : <PendingIcon className='size-5' />}</span>
            {isApprove === true ? 'Approve' : 'Pending'}
          </div>
        </div>

        <div className='grid xs:grid-cols-1 xs:gap-5 sm:grid-cols-1 sm:gap-5 md:grid-cols-1 md:gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-[60px]'>
          <div className='flex flex-col divide-x-0 divide-y divide-solid divide-gray-lighter xs:gap-4 sm:gap-4 md:gap-5 lg:gap-6'>
            <div className='grid grid-cols-5'>
              <span className='text-gray-darker xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                Category
              </span>
              <p className='col-span-4 text-right capitalize text-black-main xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                {scCategory[Number(categoryID)]}
              </p>
            </div>
            <div className='grid grid-cols-5 xs:pt-4 sm:pt-4 md:pt-5 lg:pt-6'>
              <span className='text-nowrap text-gray-darker xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                Name of product
              </span>
              <p className='col-span-4 text-right text-black-main xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                {name}
              </p>
            </div>
            <div className='xs:flex xs:flex-col xs:gap-3 xs:pt-4 sm:flex sm:flex-col sm:gap-3 sm:pt-4 md:flex md:flex-col md:gap-3 md:pt-5 lg:flex lg:flex-col lg:gap-6'>
              <span className='text-gray-darker xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                Description
              </span>
              <div
                className='text-black-main xs:text-left xs:text-[16px]/[22px] sm:text-left sm:text-[16px]/[22px] md:text-left md:text-[17px]/[23px] lg:text-left lg:!text-[18px]/[24px]'
                dangerouslySetInnerHTML={{
                  __html: removeEscapeCharacters(description) || ''
                }}
              />
            </div>
            <div className='xs:flex xs:flex-col xs:gap-3 xs:pt-4 sm:flex sm:flex-col sm:gap-3 sm:pt-4 md:flex md:flex-col md:gap-3 md:pt-5 lg:grid lg:grid-cols-6 lg:pt-6'>
              <span className='col-span-2 text-gray-darker xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                Product Manual
              </span>
              <p className='col-span-4 text-right'>
                <span
                  className={cn(
                    !showMore && 'line-clamp-2 text-right',
                    'text-black-main xs:text-left xs:text-[16px]/[22px] sm:text-left sm:text-[16px]/[22px] md:text-left md:text-[17px]/[23px] lg:text-right lg:text-[18px]/[24px]'
                  )}
                >
                  {warranty} <br className='xs:flex sm:hidden' />
                </span>{' '}
                <NavLink
                  to={''}
                  onClick={() => setShowMore((prev) => !prev)}
                  className='text-right text-blue-main underline xs:pt-3 xs:text-left xs:text-[16px]/[22px] sm:pt-0 sm:text-left sm:text-[16px]/[22px] md:text-left md:text-[17px]/[23px] lg:text-right lg:text-[18px]/[24px]'
                >
                  {!showMore ? 'See more' : 'See less'}
                </NavLink>
              </p>
            </div>
            <div className='grid grid-cols-5 xs:pt-4 sm:pt-4 md:pt-5 lg:pt-6'>
              <span className='text-gray-darker xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                Expiry
              </span>
              <p className='col-span-4 text-right text-black-main xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                {format(Number(expiryTime), 'dd/MM/yyyy')}
              </p>
            </div>
            <div className='grid grid-cols-5 xs:pt-4 sm:pt-4 md:pt-5 lg:pt-6'>
              <span className='text-gray-darker xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                Brand
              </span>
              <p className='col-span-4 text-right text-black-main xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                {brandName}
              </p>
            </div>
            <div className='xs:flex xs:items-center xs:justify-between xs:pt-4 sm:grid sm:grid-cols-5 sm:pt-4 md:pt-5 lg:pt-6'>
              <span className='text-nowrap text-gray-darker xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                Shipping fee
              </span>
              <p className='col-span-4 text-right text-black-main xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                {Number(shippingFee) > 0 ? `$${shippingFee}` : 'Free Shipping'}
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-6 divide-x-0 divide-y divide-solid divide-gray-lighter'>
            <div className='flex w-full flex-col items-end gap-5'>
              <div className='flex w-full justify-between xs:flex-col xs:gap-5 sm:flex-col md:flex-col md:gap-5 lg:gap-5 xl:flex-row xl:gap-0'>
                <div className='flex justify-between xs:w-full xs:items-center sm:w-full sm:items-start lg:w-fit'>
                  <span className='text-gray-darker xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                    Images
                  </span>
                  <NavLink
                    // to={isLoadingData ? '' : PATH_PRIVATE_APP.product.root + `/review/image/${id}`}
                    to={PATH_PRIVATE_APP.product.root + `/review/image/${id}`}
                    className={cn(
                      isLoadingData ? 'text-black-main/[.64]' : 'text-blue-main',
                      'underline xs:flex xs:text-[16px]/[16px] sm:flex sm:text-[16px]/[16px] md:flex md:text-[17px]/[17px] lg:hidden lg:text-[18px]/[18px]'
                    )}
                  >
                    Review
                  </NavLink>
                </div>
                <div className='flex items-center xs:gap-4 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-3'>
                  {imageUrls?.map((img, index) => (
                    <div
                      key={index}
                      className='relative rounded-lg border border-solid border-gray-dark bg-gray-light-2 object-cover'
                    >
                      <div className='overlay absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-end justify-end rounded-lg bg-black-main/[.1]'></div>
                      <img
                        src={img}
                        className={cn(
                          xsDown ? 'xs:w-[90px]' : 'xs:w-[100px]',
                          `aspect-square w-full flex-shrink-0 rounded-lg object-cover object-center sm:w-[100px] md:w-[180px] lg:w-[150px] xl:w-[140px]`
                        )}
                        alt='product'
                      />
                      <div className='absolute left-[-14px] top-[-14px] flex size-7 shrink-0 items-center justify-center rounded-full bg-black-main font-customSemiBold text-[14px]/[14px] text-white'>
                        {index + 1}
                      </div>
                      {/* <CropImage
                        src={img}
                        onCropComplete={(blob, fileUrl) => handleCropComplete(index, blob, fileUrl)}
                        trigger={
                          <div className='absolute bottom-0 right-0 p-2'>
                            <div className='flex cursor-pointer items-center justify-center rounded-sm bg-gray-darker hover:bg-black-main xs:size-6 xs:p-[2px] sm:size-7 sm:p-0'>
                              <EditIcon color='white' className='w-ful h-full' />
                            </div>
                          </div>
                        }
                      /> */}
                    </div>
                  ))}
                </div>
              </div>

              <NavLink
                to={isLoadingData ? '' : PATH_PRIVATE_APP.product.root + `/review/image/${id}`}
                className={cn(
                  isLoadingData ? 'text-black-main/[.64]' : 'text-blue-main',
                  'underline xs:hidden xs:text-[16px]/[16px] sm:hidden sm:text-[16px]/[16px] md:hidden md:text-[17px]/[17px] lg:flex lg:text-[18px]/[18px]'
                )}
              >
                Review
              </NavLink>
            </div>

            <div className='flex justify-between xs:flex-col xs:gap-5 xs:pt-4 sm:flex-col sm:gap-5 sm:pt-4 md:flex-col md:gap-5 md:pt-5 lg:pt-6 xl:flex-row xl:gap-0'>
              <span className='text-gray-darker xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                Video
              </span>
              <div className='w-full overflow-hidden rounded xl:max-w-[445px]'>
                {videoUrl && isYouTubeUrl(String(videoUrl)) && (
                  <YouTubeEmbed title={String(name)} url={String(videoUrl)} />
                )}
                {videoUrl && isMp4Url(videoUrl) && <AutoPlayVideo source={String(videoUrl)} />}
              </div>
            </div>

            <div className='xs:pt-4 sm:pt-4 md:pt-5 lg:pt-6'>
              <p className='text-gray-darker xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'>
                Capacity, Quantity & Price <span className='text-red-main'>*</span>
              </p>
              <div className='w-full pt-4'>
                <div className='flex w-full flex-col xs:gap-4 md:gap-4 lg:gap-4 xl:gap-2'>
                  {productDetail?.variants.map(({ priceOptions, variantID }, index) => (
                    <div
                      className='flex w-full font-customMedium xs:flex-col xs:items-start xs:gap-3 sm:items-center md:items-center md:gap-3 lg:flex-col lg:items-start lg:justify-between lg:gap-3 xl:flex-row xl:items-center xl:gap-5'
                      key={variantID}
                    >
                      {productDetail?.attributes[index].length === 1 ? (
                        productDetail?.attributes[index].map((attriCapa) => (
                          <span
                            key={attriCapa.value}
                            className='block h-7 w-[96px] rounded-[2px] bg-blue-main/30 py-1 text-center text-blue-dark xs:h-[30px] xs:w-[50px] xs:text-[16px]/[16px] sm:text-[16px]/[16px] md:text-[17px]/[17px] lg:text-[18px]/[18px]'
                          >
                            {attriCapa.value}
                          </span>
                        ))
                      ) : (
                        <div className='flex h-6 items-center gap-1 font-customMedium'>
                          {productDetail?.attributes[index]
                            ?.filter((a) => a.key === 'color')
                            .map((attriColor) => (
                              <div
                                key={attriColor.value}
                                className='flex size-6 shrink-0 items-center justify-center rounded-full shadow-avatar'
                                style={{
                                  fontSize: '12px',
                                  backgroundColor: attriColor.value || '#000000',
                                  color:
                                    attriColor.value === '#ffffff' || attriColor.value === '#FFCC00' ? '#000' : '#fff',
                                  transition: 'color 300ms ease-in-out'
                                }}
                              >
                                {listColors?.find((c) => c.value === attriColor.value)?.label}
                              </div>
                            ))}
                          -
                          {productDetail?.attributes[index]
                            ?.filter((a) => a.key === 'size')
                            .map((attriSize) => (
                              <div
                                key={attriSize.value}
                                className='flex size-6 shrink-0 items-center justify-center rounded-full bg-[#C7C7CC] shadow-avatar'
                                style={{
                                  fontSize:
                                    attriSize.value === 'XXS' || attriSize.value === 'XXL' || attriSize.value === '3XL'
                                      ? '10px'
                                      : '12px'
                                }}
                              >
                                {attriSize.value}
                              </div>
                            ))}
                        </div>
                      )}

                      <div className='text-[15px]/[18px] xs:text-wrap xs:text-left sm:text-nowrap sm:text-left md:text-left lg:text-right'>
                        <span className='text-black-main'>VIP: ${formatPrice(Number(priceOptions.vipPrice))} - </span>
                        <span className='text-black-main'>
                          Member: ${formatPrice(Number(priceOptions.memberPrice))} -{' '}
                        </span>
                        <span className='text-black-main'>
                          Retail: ${formatPrice(Number(priceOptions.retailPrice))} -{' '}
                        </span>
                        <span className='text-black-main'>Reward: ${formatPrice(Number(priceOptions.reward))} - </span>
                        <span className='text-black-main'>Quantity: {priceOptions.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
})

export default ProductInformation
