import { memo, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EnumCommentType } from '~/@types/enums'
import { ICommentProductDetail, IProductDetail, ProductInfo } from '~/@types/models'
import images from '~/assets'
import { IconButton } from '~/components/iconButton'
import useResponsive from '~/hooks/useResponsive'
import { useAppSelector } from '~/redux/configStore'
import { BannerSection, CommentSection, ModelProductSection } from '~/sections/productReviewImage'
import { cn } from '~/utils/classNames'
import { getLocalStorage } from '~/utils/localStorage'

const EditProductImagePage = memo(() => {
  const { id: productId } = useParams()

  const lgDown = useResponsive('down', 'lg')

  const { listProducts } = useAppSelector((s) => s.product)

  const productDetail = useMemo(
    () => listProducts?.find((item) => item.product.id === productId),
    [listProducts, productId]
  )

  const productDataLocal: IProductDetail = useMemo(() => getLocalStorage(`product_${productId}`), [productId])

  const [scrolledTo100, setScrolledTo100] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolledTo100(window.scrollY >= 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='mx-auto max-w-[1440px] overflow-hidden pb-20'>
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
        </div>
      </div>

      <BannerSection product={productDetail as ProductInfo} purchases={23678} trend={1040} />

      <ModelProductSection product={productDetail as ProductInfo} />

      <CommentSection
        image={productDetail?.product.params?.images?.[0] as string}
        comments={
          productDataLocal?._comments?.filter(
            (com) => +com.commentType === EnumCommentType.PRESSCOMMENT
          ) as ICommentProductDetail[]
        }
      />
    </div>
  )
})

export default EditProductImagePage
