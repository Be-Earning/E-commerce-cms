import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { QueryConfig } from '~/@types/common'
import { Role } from '~/@types/enums'
import { ICommentProduct, IFAQProduct, IProductCreate, IProductParams, IProductUpdate } from '~/@types/models'
import images from '~/assets'
import { faqPO5 } from '~/assets/mocks/faqPO5'
import { IconButton } from '~/components/iconButton'
import { ArrowRightIcon } from '~/components/icons'
import { LoadingScreen } from '~/components/loading'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import useCreateProductInfo from '~/hooks/useCreateProductInfo'
import useHandleFile from '~/hooks/useHandleFile'
import useQueryParams from '~/hooks/useQueryParams'
import useResponsive from '~/hooks/useResponsive'
import { FooterEcom } from '~/layouts/components/footerEcom'
import { getListBrands } from '~/redux/brand/brand.slice'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import { clearProductReview } from '~/redux/product/product.slice'
import {
  BannerSection,
  ChartSection,
  CommentSection,
  FaqProductSection,
  FaqSection,
  ModelProductSection,
  ReviewSection
} from '~/sections/productReview'
import { abiEcomProduct } from '~/smartContract'
import { sendTransaction } from '~/smartContract/combineSdk'
import { cn } from '~/utils/classNames'
import { base64ToFile } from '~/utils/convert'
import { removeLocalStorage } from '~/utils/localStorage'

const ProductReview = memo(() => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const queryParams: QueryConfig = useQueryParams()

  // const smDown = useResponsive('down', 'sm')
  // const mdDown = useResponsive('down', 'md')
  const lgDown = useResponsive('down', 'lg')

  const { handlePushFiles } = useHandleFile()
  const { handleCreateProductInfor, handleEditProductInfor } = useCreateProductInfo()

  const { activeWallet, userRole } = useAppSelector((s) => s.user)
  const { productReview, comments, faqs, reviews } = useAppSelector((s) => s.product)

  const [scrolledTo100, setScrolledTo100] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const isRetailer = useMemo(() => +userRole === Role.RETAILER, [userRole])
  const isEditingProduct = useMemo(() => Number(queryParams.isEditing) === 1, [queryParams.isEditing])

  console.log('productReview---', productReview)

  useEffect(() => {
    const handleScroll = () => {
      setScrolledTo100(window.scrollY >= 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const base64ArrayToFiles = (base64Array: string[], fileNamePrefix: string): File[] => {
    return base64Array.map((base64, index) => {
      return base64ToFile(base64, `${fileNamePrefix}-${index + 1}.png`)
    })
  }

  const handleCreateProduct = useCallback(async () => {
    if (productReview) {
      console.log('productReview---', productReview)
      setLoading(true)
      try {
        const base64Array = productReview?.params.images
        const fileNamePrefix = 'image'
        const fileArray = base64ArrayToFiles(base64Array, fileNamePrefix)

        let res
        if (fileArray.length > 0) {
          console.log('---', fileArray)
          res = await handlePushFiles(activeWallet, fileArray)
          console.log('upload images RESSSS', res)
          if (!res) {
            toast.error('Upload images failed!')
            return
          }
        }

        const listImages = res

        const productParams: IProductCreate = {
          ...productReview,
          params: {
            ...productReview?.params,
            images: listImages
          }
        }
        const resCreate = await sendTransaction(
          'createProduct',
          productParams,
          'ecom-product',
          activeWallet,
          'chain',
          'user',
          10000,
          abiEcomProduct.abi.find((a) => a.name === 'eCreateProduct')
        )
        if (!resCreate.success)
          toast.error(resCreate.message ? resCreate.message : 'Creaete product failed! Try again.')
        console.log('createProduct infor', resCreate)
        if (resCreate.success) {
          const resCommentFaq = await handleCreateProductInfor(Number(resCreate.data?.id))
          if (resCommentFaq) {
            toast.success('Create products successfully')
            navigate(PATH_PRIVATE_APP.product.list)
            dispatch(clearProductReview())
            dispatch(getListBrands())
          }
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.log('error', error)
      } finally {
        setLoading(false)
      }
    }
  }, [productReview, comments, faqs, reviews])

  const handleUpdateProduct = useCallback(async () => {
    if (productReview) {
      setLoading(true)
      try {
        console.log('productReview---image', productReview?.params.images)
        const base64Array = productReview?.params.images
        const fileNamePrefix = 'image'
        const fileArray = base64ArrayToFiles(base64Array, fileNamePrefix)
        let res
        if (fileArray.length > 0) {
          console.log('---', fileArray)
          res = await handlePushFiles(activeWallet, fileArray)
          console.log('upload images RESSSS', res)
          if (!res) {
            toast.error('Upload images failed!')
            return
          }
        }
        const listImages = res
        const productParams: IProductUpdate = {
          _productID: Number(queryParams.productId),
          ...productReview,
          params: {
            ...productReview?.params,
            images: listImages
          }
        }

        const resUpdate = await sendTransaction('updateProduct', productParams, 'ecom-product', activeWallet, 'chain')
        if (!resUpdate.success) {
          toast.error(resUpdate.message ? resUpdate.message : 'Update product failed! Try again.')
        }

        console.log('UpdateProduct infor', resUpdate)
        if (resUpdate.success) {
          let resCommentFaq: any
          if (!isRetailer) {
            resCommentFaq = await handleEditProductInfor(Number(queryParams.productId))
          } else {
            resCommentFaq = true
          }
          if (resCommentFaq) {
            toast.success('Update products successfully')
            removeLocalStorage(`product_${queryParams.productId}`)
            navigate(PATH_PRIVATE_APP.product.list)
            dispatch(clearProductReview())
          }
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.log('Product create error', error)
      } finally {
        setLoading(false)
      }
    }
  }, [comments, faqs, reviews, activeWallet, queryParams.productId])

  return (
    <>
      {loading && (
        <div className='fixed bottom-0 left-0 right-0 top-0 z-[2000]'>
          <LoadingScreen />
        </div>
      )}

      <div className='mx-auto max-w-[1440px] overflow-hidden'>
        <div
          className={cn(
            `fixed top-0 z-[100] w-full max-w-[1440px]`,
            scrolledTo100 && 'bg-white/[.12] shadow-header backdrop-blur-2xl'
          )}
        >
          <div className='flex w-full items-center justify-between xs:p-[10px] sm:p-4 md:p-4 lg:p-5'>
            <IconButton
              title='Back'
              color='white'
              className='bg-greyMain'
              size={lgDown ? '44' : '48'}
              onClick={() => window.history.back()}
            >
              <img
                src={images.icons.arrow_left}
                alt='icon-arrow-left'
                className='xs:size-5 sm:size-6 md:size-7 lg:size-8'
              />
            </IconButton>
            <IconButton
              color='white'
              size={lgDown ? '44' : '48'}
              className='!bg-black-main text-white'
              leftTitle={isEditingProduct ? 'Update' : 'Create'}
              onClick={isEditingProduct ? handleUpdateProduct : handleCreateProduct}
            >
              <ArrowRightIcon color='white' className='xs:size-5 sm:size-6 md:size-7 lg:size-8' />
            </IconButton>
          </div>
        </div>

        <BannerSection product={productReview as IProductCreate} purchases={23678} trend={1040} />

        <ChartSection searchTrend={[]} purchases={[]} />

        <ModelProductSection product={productReview?.params as IProductParams} />

        <ReviewSection />

        <div className='pt-5'>
          <FaqProductSection faq={faqs as IFAQProduct[]} />
        </div>

        <CommentSection image={productReview?.params?.images?.[0] as string} comments={comments as ICommentProduct[]} />

        <div className='pt-5'>
          <FaqSection faqP05={faqPO5} />
        </div>

        <FooterEcom />
      </div>
    </>
  )
})

export default ProductReview
