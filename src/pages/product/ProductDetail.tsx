import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { createSearchParams, NavLink, useNavigate, useParams } from 'react-router-dom'
import { EnumCommentType, Role } from '~/@types/enums'
import { IProductDetail } from '~/@types/models'
import { Button } from '~/components/button'
import ConfirmDialog, { ConfirmDialogRef } from '~/components/dialog/ConfirmDialog'
import { CloseIcon } from '~/components/icons'
import { LoadingScreen } from '~/components/loading'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import { adminAcceptProduct, adminRejectProduct, getProductDetails } from '~/contract/functionSmc'
import useResponsive from '~/hooks/useResponsive'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import { getListProducts } from '~/redux/product/product.slice'
import { FAQForProduct, ProductInformation, ProductReview, ThePressComment } from '~/sections/product'
import { cn } from '~/utils/classNames'
import { getLocalStorage, setLocalStorage } from '~/utils/localStorage'
import { smoothScrollToTop } from '~/utils/scroll'

const ProductDetail = memo(() => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const dialogRef = useRef<ConfirmDialogRef>(null)

  const { id } = useParams()

  const xsDowm = useResponsive('down', 'xs')

  const { listProducts } = useAppSelector((s) => s.product)
  const { activeWallet, userRole } = useAppSelector((s) => s.user)

  const productDataLocal = useMemo(() => getLocalStorage(`product_${id}`), [id])

  const isAdmin = useMemo(() => +userRole === Role.ADMIN, [userRole])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false)
  const [actionType, setActionType] = useState<boolean>(false)
  const [data, setData] = useState<IProductDetail | null>({
    _comments: [],
    _rating: { id: '', user: '', rateValue: '', createdAt: '' },
    _rates: [],
    _faqs: [],
    _productPurchaseTrend: [],
    _productTrend: []
  })

  const productDetailInfor = listProducts?.find((item) => item.product.id === id)
  const productDetailData: IProductDetail = useMemo(() => productDataLocal || data, [productDataLocal, data])

  const fetchProductDetails = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getProductDetails(Number(id))
      console.log('res detail', res)
      if (res.success) {
        setData(res.data)
        setLocalStorage(`product_${id}`, JSON.stringify(res.data))
      } else {
        setIsLoading(false)
        toast.error('Fetch product details failed!')
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setIsLoading(false)
    }
  }, [id, activeWallet])

  useEffect(() => {
    fetchProductDetails()
  }, [id, activeWallet])

  const handleRejectProduct = useCallback(async () => {
    try {
      setIsLoadingAction(true)
      const res = await adminRejectProduct(activeWallet, Number(id))
      if (!res.success) {
        setIsLoadingAction(false)
        toast.error('Reject product failed!')
        return
      }
      // navigate(PATH_PRIVATE_APP.product.list)
      await dispatch(getListProducts())
      smoothScrollToTop(1500)
      toast.success('Reject product successfully!')
    } catch (err) {
      console.log('Reject product error: ', err)
      toast.error('Reject product failed!')
    } finally {
      setIsLoadingAction(false)
    }
  }, [id])

  const handleApproveProduct = useCallback(async () => {
    try {
      setIsLoadingAction(true)
      const res = await adminAcceptProduct(activeWallet, Number(id))
      if (!res.success) {
        setIsLoadingAction(false)
        toast.error('Approve product failed!')
        return
      }
      // navigate(PATH_PRIVATE_APP.product.list)
      await dispatch(getListProducts())
      smoothScrollToTop(1500)
      toast.success('Approve product successfully!')
    } catch (err) {
      console.log('Approve product error: ', err)
      toast.error('Approve product failed!')
    } finally {
      setIsLoadingAction(false)
    }
  }, [id])

  return (
    <>
      {isLoadingAction && (
        <div className='fixed bottom-0 left-0 right-0 top-0 z-[2000]'>
          <LoadingScreen />
        </div>
      )}
      <div className={cn(`bg-product-detail bg-top bg-no-repeat xs:p-4 sm:p-4 md:p-5`)}>
        <div className='ml-auto flex justify-end sm:pt-0 md:pt-0 lg:pt-4'>
          <NavLink to={PATH_PRIVATE_APP.product.list} className='xs:size-4 md:size-5 lg:size-6 xl:size-6'>
            <CloseIcon className='aspect-square h-full' color='#ffffff' />
          </NavLink>
        </div>

        <div className='md:8 bg-white/[.76] backdrop-blur-[200px] xs:mt-14 xs:p-3 sm:mt-5 sm:p-5 md:mt-5 lg:mt-10 lg:p-10 xl:px-[98px] xl:py-20'>
          <ProductInformation isLoadingData={isLoading} />

          <div className='mt-20 xs:space-y-10 sm:space-y-[60px] md:space-y-[80px] lg:space-y-[100px]'>
            <ProductReview
              isLoading={isLoading}
              reviews={productDetailData?._comments?.filter((com) => +com.commentType === EnumCommentType.REVIEW)}
            />
            <FAQForProduct isLoading={isLoading} faqs={productDetailData?._faqs} />
            <ThePressComment
              isLoading={isLoading}
              comments={productDetailData?._comments?.filter(
                (com) => +com.commentType === EnumCommentType.PRESSCOMMENT
              )}
            />
          </div>

          {isAdmin && !productDetailInfor?.product.params.isApprove && (
            <div className='flex items-center justify-end gap-5 xs:mt-5 md:mt-5 lg:mt-10 xl:mt-[50px]'>
              <Button
                variant='outline'
                className={cn(xsDowm ? '!h-12 !w-[140px]' : 'h-[56px] xs:w-[159px] sm:w-[216px]', 'rounded-[36px]')}
                onClick={() => {
                  setActionType(false)
                  dialogRef.current?.handleOpen()
                }}
              >
                Reject
              </Button>
              <Button
                className={cn(xsDowm ? '!h-12 !w-[140px]' : 'h-[56px] xs:w-[159px] sm:w-[216px]', 'rounded-[36px]')}
                onClick={() => {
                  setActionType(true)
                  dialogRef.current?.handleOpen()
                }}
              >
                Approve
              </Button>
            </div>
          )}

          {!isAdmin && (
            <Button
              className={cn(xsDowm ? '!h-12 !w-[140px]' : 'h-[56px] xs:w-[159px] sm:w-[216px]', 'rounded-[36px]')}
              onClick={() => {
                navigate({
                  pathname: PATH_PRIVATE_APP.product.root + `/update/${productDetailInfor?.product.id}`,
                  search: createSearchParams({ isEditing: '1' }).toString()
                })
              }}
            >
              Update
            </Button>
          )}

          {/* {isAdmin && (
            <div className='flex items-center justify-end gap-5 xs:mt-5 md:mt-5 lg:mt-10 xl:mt-[50px]'>
              <Button
                variant='outline'
                className={cn(
                  xsDowm ? '!h-12 !w-[140px]' : 'h-[56px] xs:w-[159px] sm:w-[216px]',
                  'rounded-[36px]'
                )}
                onClick={() => {
                  setActionType(false)
                  dialogRef.current?.handleOpen()
                }}
              >
                Reject
              </Button>
              {!productDetailInfor?.product.params.isApprove ? (
                <Button
                  className={cn(
                    xsDowm ? '!h-12 !w-[140px]' : 'h-[56px] xs:w-[159px] sm:w-[216px]',
                    'rounded-[36px]'
                  )}
                  onClick={() => {
                    setActionType(true)
                    dialogRef.current?.handleOpen()
                  }}
                >
                  Approve
                </Button>
              ) : (
                <Button
                  className={cn(
                    xsDowm ? '!h-12 !w-[140px]' : 'h-[56px] xs:w-[159px] sm:w-[216px]',
                    'rounded-[36px]'
                  )}
                  onClick={() => {
                    navigate({
                      pathname: PATH_PRIVATE_APP.product.root + `/update/${productDetailInfor?.product.id}`,
                      search: createSearchParams({ isEditing: '1' }).toString()
                    })
                  }}
                >
                  Update
                </Button>
              )}
            </div>
          )} */}
        </div>
      </div>

      <ConfirmDialog
        ref={dialogRef}
        title={actionType ? 'Confirm Approve Product' : 'Confirm Reject Product'}
        content={`Are you sure you want to ${actionType ? 'approve' : 'reject'} product ${productDetailInfor?.product.params.name}?`}
        onConfirm={actionType ? handleApproveProduct : handleRejectProduct}
      />
    </>
  )
})

export default ProductDetail
