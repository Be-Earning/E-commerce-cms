import { yupResolver } from '@hookform/resolvers/yup'
import { getTime } from 'date-fns'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createSearchParams, useLocation, useNavigate, useParams } from 'react-router-dom'
import { OptionSelect, QueryConfig } from '~/@types/common'
import { EnumCommentType, Role } from '~/@types/enums'
import { EnumCategory } from '~/@types/enums/category'
import { IProductCreate, IProductDetail, IProductUpdate, ProductInfo } from '~/@types/models'
import { IProductFrom } from '~/@types/models/form'
import { Button } from '~/components/button'
import { ConfirmDialog } from '~/components/dialog'
import { ConfirmDialogRef } from '~/components/dialog/ConfirmDialog'
import { initialConfig } from '~/components/LexicalCustom/constants'
import { LoadingScreen } from '~/components/loading'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import { SPLIT_KEY } from '~/constants/splitKey'
import useCreateProductInfo from '~/hooks/useCreateProductInfo'
import useHandleFile from '~/hooks/useHandleFile'
import useQueryConfig from '~/hooks/useQueryConfig'
import useResponsive from '~/hooks/useResponsive'
import useValidationForm from '~/hooks/useValidationForm'
import { getListBrands } from '~/redux/brand/brand.slice'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import {
  clearProductReview,
  setListComments,
  setListFAQs,
  setListReviews,
  setProductReview
} from '~/redux/product/product.slice'
import { AddPressComment, AddProductFAQ, AddProductReview, ProductFrom } from '~/sections/product'
import { abiEcomProduct } from '~/smartContract'
import { sendTransaction } from '~/smartContract/combineSdk'
import { cn } from '~/utils/classNames'
import { convertToUnit256, filterAndConvertImageUrlsToHex, multiplyToExponential } from '~/utils/convert'
import { filterNonBase64Urls } from '~/utils/image'
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '~/utils/localStorage'

const listTabs: OptionSelect[] = [
  { value: 'product', label: 'new product post' },
  { value: 'product-sale', label: 'new sale product post' }
]
const listTabsUpdate: OptionSelect[] = [
  { value: 'product', label: 'update product' },
  { value: 'product-sale', label: 'update sale product' }
]

const CreateProduct = memo(() => {
  const { id: productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()

  const dialogRef = useRef<ConfirmDialogRef>(null)

  const xsDowm = useResponsive('down', 'xs')
  const smDowm = useResponsive('down', 'sm')

  const queryConfig: QueryConfig = useQueryConfig()
  const { schemaProduct } = useValidationForm()
  const { handleCreateProductInfor, handleEditProductInfor } = useCreateProductInfo()
  const { handlePushFiles } = useHandleFile()

  const { activeWallet, userRole } = useAppSelector((s) => s.user)
  const { comments, faqs, reviews, productReview, listProducts } = useAppSelector((s) => s.product)

  const isRetailer = useMemo(() => +userRole === Role.RETAILER, [userRole])
  const isEditingProduct = useMemo(() => Number(queryConfig.isEditing) === 1, [queryConfig.isEditing])

  const productToUpdate = useMemo(
    () => listProducts.find((product) => product.product.id === String(productId)),
    [productId]
  )

  console.log('productToUpdate----', productToUpdate)
  const productDataLocal = useMemo(() => getLocalStorage(`product_${productId}`), [productId])

  const [imgLinks, setImgLinks] = useState<string[] | Blob[]>([])
  const [imgBlobs, setImgBlobs] = useState<Blob[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false)
  // const [isController, setIsController] = useState<boolean>(false)
  const [idxError, setIdxError] = useState<number[]>([])
  // const { getController } = useCheckRole()

  const createProductForm = useForm<IProductFrom>({
    defaultValues: {
      variantType: 'orther',
      isFreeShipping: 0,
      colorSize: [{ color: '#000000', size: 'S' }],
      capacities: [{ valueCapacity: 10 }],
      prices: [{}]
    },
    mode: 'onBlur',
    resolver: yupResolver(schemaProduct)
  })

  const {
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    reset,
    formState: { errors }
  } = createProductForm

  const isFreeShipping = watch('isFreeShipping')
  const variantType = watch('variantType')
  const shippingFee = watch('shippingFee')
  const capacities = watch('capacities')

  console.log('forrm errors ===>', errors)

  useEffect(() => {
    if (pathname === PATH_PRIVATE_APP.product.add && !productReview) {
      reset()
      setValue('variantType', 'orther')
    }
  }, [pathname, productReview])

  useEffect(() => {
    if (!isEditingProduct) return
    if (!productReview && productToUpdate) {
      ;(async () => {
        setIsLoadingData(true)
        let productCommentFaq: IProductDetail = productDataLocal || {
          _comments: [],
          _rating: [],
          _faqs: []
        }
        console.log('productDataLocal---', productDataLocal)
        if (!productDataLocal) {
          const res = await sendTransaction(
            'getProductDetails',
            { _productID: Number(productId) },
            'ecom-product',
            activeWallet,
            'chain',
            'read'
          )

          if (res.success && res.data) {
            productCommentFaq = res.data
            setLocalStorage(`product_${productId}`, productCommentFaq)
            console.log('productCommentFaq', productCommentFaq)
          }
        }
        if (productCommentFaq) {
          dispatch(
            setListComments(
              productCommentFaq._comments
                .filter((c) => +c.commentType === EnumCommentType.PRESSCOMMENT)
                .map((comment) => ({
                  id: +comment.id,
                  comment: comment.message,
                  name: comment.name.split(SPLIT_KEY.COMMENT)[0],
                  commentId: comment.name.split(SPLIT_KEY.COMMENT)[1],
                  rating: 0,
                  isNew: false
                }))
            )
          )
          dispatch(
            setListReviews(
              productCommentFaq._comments
                .filter((c) => +c.commentType === EnumCommentType.REVIEW)
                .map((comment, index) => ({
                  id: +comment.id,
                  comment: comment.message,
                  name: comment.name.split(SPLIT_KEY.COMMENT)[0],
                  commentId: comment.name.split(SPLIT_KEY.COMMENT)[1],
                  rating:
                    +productCommentFaq._rates?.[
                      index +
                        productCommentFaq._comments.filter((c) => +c.commentType === EnumCommentType.PRESSCOMMENT)
                          .length
                    ],
                  isNew: false
                }))
            )
          )
          dispatch(
            setListFAQs(
              productCommentFaq._faqs.map((faq) => ({
                id: +faq.id,
                answer: faq.content,
                question: faq.title,
                isNew: false
              }))
            )
          )
        }
        setIsLoadingData(false)
      })()
    }
  }, [productDataLocal, productId, activeWallet, productReview, productToUpdate])

  useEffect(() => {
    if (!queryConfig.creaetProductType) {
      navigate({
        pathname: !isEditingProduct
          ? PATH_PRIVATE_APP.product.add
          : PATH_PRIVATE_APP.product.root + `/update/${productId}`,
        search: createSearchParams({ ...queryConfig, creaetProductType: 'product' }).toString()
      })
    }
  }, [queryConfig, productId])

  // const getUserController = useCallback(async () => {
  //   try {
  //     console.log('activeWallet---', activeWallet)
  //     const isController = await getController(activeWallet)
  //     console.log('isController---', isController)
  //     setIsController(true)
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // }, [activeWallet])

  useEffect(() => {
    if (variantType === 'orther' || !variantType) {
      setValue('capacities', [{ valueCapacity: 100 }])
    } else {
      setValue('capacities', capacities || [{ valueCapacity: 0 }])
    }
    // getUserController()
  }, [])

  // useEffect(() => {
  //   if (isProductReviewSet) return
  //   if (String(categoryID) === EnumCategory.FASHION) {
  //     setValue('capacities', [{ valueCapacity: 100 }])
  //     setValue('colorSize', [{ color: '#000000', size: 'S' }])
  //   } else {
  //     if (variantType === 'orther') {
  //       setValue('capacities', [{ valueCapacity: 100 }])
  //     } else {
  //       setValue('capacities', [{ valueCapacity: 0 }])
  //     }
  //     setValue('colorSize', [{ color: '#000000', size: 'S' }])
  //   }
  // }, [categoryID, variantType, isProductReviewSet])

  useEffect(() => {
    if (Number(isFreeShipping) === 0) {
      setValue('shippingFee', 100)
      clearErrors('shippingFee')
    } else {
      setValue('shippingFee', shippingFee || 0)
    }
  }, [isFreeShipping])

  useEffect(() => {
    if (productReview) {
      setImgLinks(productReview.params.images)
      setValue('name', productReview.params.name)
      setValue('categoryID', productReview.params.categoryID)
      setValue('description', productReview.params.description)
      setValue(
        'shippingFee',
        +productReview.params.shippingFee === 0 ? 100 : +multiplyToExponential(productReview.params.shippingFee, -18)
      )
      setValue('brandName', productReview.params.brandName)
      setValue('warranty', productReview.params.warranty)
      setValue('videoUrl', productReview.params.videoUrl)
      setValue('expiryTime', new Date(productReview.params.expiryTime))
      setValue('isFreeShipping', +productReview.params.shippingFee === 0 ? 0 : 1)
      setValue(
        'variantType',
        productReview._variants?.[0].attrs?.find((attr) => attr.key === 'capacities')?.value
          ? String(productReview._variants?.[0].attrs?.find((attr) => attr.key === 'capacities')?.value).replace(
              /[0-9]/g,
              ''
            )
          : 'orther'
      )

      if (productReview._variants && productReview._variants.length > 0) {
        const capacities = productReview._variants.map((variant) => ({
          valueCapacity: productReview._variants?.[0].attrs?.find((attr) => attr.key === 'capacities')?.value
            ? parseInt(String(variant.attrs?.find((attr) => attr.key === 'capacities')?.value).replace(/\D/g, ''), 10)
            : 100
        }))
        const colorSize = productReview._variants.map((variant) => ({
          color: variant.attrs.find((attr) => attr.key === 'color')?.value || '',
          size: variant.attrs.find((attr) => attr.key === 'size')?.value || ''
        }))
        const prices = productReview._variants.map((variant) => ({
          reward: variant.priceOptions.reward,
          retailPrice: +multiplyToExponential(variant.priceOptions.retailPrice, -18),
          vipPrice: +multiplyToExponential(variant.priceOptions.vipPrice, -18),
          memberPrice: +multiplyToExponential(variant.priceOptions.memberPrice, -18),
          // retailPrice: variant.priceOptions.retailPrice / 10 ** 18,
          // memberPrice: variant.priceOptions.memberPrice / 10 ** 18,
          // vipPrice: variant.priceOptions.vipPrice / 10 ** 18,
          quantity: variant.priceOptions.quantity
        }))

        if (productReview.params.categoryID.toString() !== EnumCategory.FASHION) {
          setValue('capacities', capacities)
          setValue('colorSize', [])
        } else {
          setValue('colorSize', colorSize)
          setValue('capacities', [])
        }
        setValue('prices', prices)
      }
    }
  }, [productReview, setValue])

  const resetDataUpdate = useCallback(() => {
    if (productToUpdate) {
      // Set basic product information
      setImgLinks(productToUpdate.product.params.images.map((img) => img))
      setValue('name', productToUpdate.product.params.name)
      setValue('categoryID', Number(productToUpdate.product.params.categoryID))
      setValue('description', productToUpdate.product.params.description)
      setValue(
        'shippingFee',
        +multiplyToExponential(productToUpdate.product.params.shippingFee, -18) === 0
          ? 100
          : +multiplyToExponential(productToUpdate.product.params.shippingFee, -18)
      )
      setValue('brandName', productToUpdate.product.params.brandName)
      setValue('warranty', productToUpdate.product.params.warranty)
      setValue('videoUrl', productToUpdate.product.params.videoUrl)
      setValue('expiryTime', new Date(+productToUpdate.product.params.expiryTime))
      setValue('isFreeShipping', Number(productToUpdate.product.params.shippingFee) === 0 ? 0 : 1)
      setValue(
        'variantType',
        productToUpdate.attributes?.[0]?.find((attr) => attr.key === 'capacities')?.value
          ? String(productToUpdate.attributes?.[0]?.find((attr) => attr.key === 'capacities')?.value).replace(
              /[0-9]/g,
              ''
            )
          : 'orther'
      )

      // Set attributes and variants
      if (productToUpdate.variants && productToUpdate.variants.length > 0) {
        // Extract capacities
        const capacities = productToUpdate.attributes
          .filter((attrGroup) => attrGroup.some((attr) => attr.key.includes('capacities')))
          .flatMap((attrGroup) =>
            attrGroup
              .filter((attr) => attr.key.includes('capacities'))
              .map((attr) => ({
                valueCapacity: productToUpdate.attributes?.[0]?.find((attr) => attr.key === 'capacities')?.value
                  ? parseInt(attr.value.replace(/\D/g, ''), 10)
                  : 100
              }))
          )

        console.log('capacities', capacities)

        // Extract color and size attributes
        const colorSize: { color: string; size: string }[] = productToUpdate.attributes.map((attrGroup) => {
          const colorAttr = attrGroup.find((attr) => attr.key.includes('color'))
          const sizeAttr = attrGroup.find((attr) => attr.key.includes('size'))
          return {
            color: colorAttr?.value || '',
            size: sizeAttr?.value || ''
          }
        })

        // Extract prices
        const prices = productToUpdate.variants.map((variant) => ({
          retailPrice: Number(variant.priceOptions.retailPrice) / 10 ** 18,
          reward: Number(variant.priceOptions.reward),
          memberPrice: Number(variant.priceOptions.memberPrice) / 10 ** 18,
          vipPrice: variant.priceOptions.vipPrice ? Number(variant.priceOptions.vipPrice) / 10 ** 18 : 0,
          quantity: Number(variant.priceOptions.quantity)
        }))

        // Update state based on category
        if (productToUpdate.product.params.categoryID.toString() !== EnumCategory.FASHION) {
          setValue('capacities', capacities)
          setValue('colorSize', [])
        } else {
          setValue('colorSize', colorSize)
          setValue('capacities', [])
        }
        setValue('prices', prices)
      }
    }
  }, [productToUpdate])

  useEffect(() => {
    if (!isEditingProduct) return
    if (!productReview && productToUpdate) {
      resetDataUpdate()
    }
  }, [productReview, productToUpdate, isEditingProduct, setValue])

  const handleCreateProductPreview = useCallback(
    async (values: IProductFrom) => {
      console.log('imgLinks-imgBlobs', imgLinks, imgBlobs)
      if (idxError?.length > 0) toast.error('Duplicate variant!')
      if (imgLinks.length < 3) toast.error('Please enter image link or upload 3 images of product!')
      if (comments.length < 4) toast.error('Must have at least 4 comments!')
      if (!isRetailer) {
        if (faqs.length < 3) toast.error('Must have at least 3 faqs!')
      }
      if (reviews.length < 3) toast.error('Must have at least 3 reviews!')
      if (!isRetailer) {
        if (idxError?.length > 0 || imgLinks.length < 3 || comments.length < 4 || faqs.length < 3 || reviews.length < 3)
          return
      } else {
        if (idxError?.length > 0 || imgLinks.length < 3 || comments.length < 4 || reviews.length < 3) return
      }
      setIsLoading(true)
      try {
        const listImages = imgLinks.map((link) => {
          if (typeof link !== 'string') return ''
          return link
        })
        const newProduct: IProductCreate = {
          params: {
            name: values.name,
            categoryID: values.categoryID,
            description: values.description,
            retailPrice: multiplyToExponential(values.prices[0]?.retailPrice, 18),
            vipPrice: multiplyToExponential(values.prices[0]?.vipPrice, 18),
            memberPrice: multiplyToExponential(values.prices[0]?.memberPrice, 18),
            reward: values.prices[0]?.reward,
            quantity: values.prices[0]?.quantity,
            capacity:
              values.variantType === 'orther' && values.categoryID.toString() !== EnumCategory.FASHION
                ? []
                : [values.capacities[0]?.valueCapacity],
            size:
              values.variantType === 'orther' && values.categoryID.toString() === EnumCategory.FASHION
                ? [values.colorSize[0]?.size]
                : [],
            color:
              values.variantType === 'orther' && values.categoryID.toString() === EnumCategory.FASHION
                ? [values.colorSize[0]?.color]
                : [],
            shippingFee:
              Number(isFreeShipping) === 0 || isFreeShipping === 0
                ? '0'
                : multiplyToExponential(values.shippingFee, 18),
            retailer: activeWallet as string,
            brandName: values.brandName,
            warranty: values.warranty,
            isFlashSale: queryConfig.creaetProductType === 'product-sale' ? true : false,
            images: listImages,
            videoUrl: values.videoUrl || '',
            boostTime: isEditingProduct ? Number(productToUpdate?.product.params.boostTime) : 0,
            expiryTime: getTime(values.expiryTime),
            activateTime: isEditingProduct ? Number(productToUpdate?.product.params.activateTime) : 0,
            isMultipleDiscount: false,
            isApprove: isEditingProduct ? (productToUpdate?.product.params.isApprove as boolean) : false,
            sold: isEditingProduct ? Number(productToUpdate?.product.params.sold) : 0
          },
          _variants: values.prices.map((price, index) => ({
            variantID: convertToUnit256(Math.floor(Math.random() * 1000)),
            attrs:
              values.variantType === 'orther' && values.categoryID.toString() === EnumCategory.FASHION
                ? [
                    {
                      id: convertToUnit256(Math.floor(Math.random() * 2000)),
                      key: 'color',
                      value: values.colorSize[index]?.color
                    },
                    {
                      id: convertToUnit256(Math.floor(Math.random() * 2000)),
                      key: 'size',
                      value: values.colorSize[index]?.size
                    }
                  ]
                : values.variantType === 'orther' && values.categoryID.toString() !== EnumCategory.FASHION
                  ? []
                  : [
                      {
                        id: convertToUnit256(Math.floor(Math.random() * 3000)),
                        key: 'capacities',
                        value: `${values.capacities[index]?.valueCapacity}${values.variantType}`
                      }
                    ],
            priceOptions: {
              retailPrice: multiplyToExponential(price.retailPrice, 18),
              vipPrice: multiplyToExponential(price.vipPrice, 18),
              memberPrice: multiplyToExponential(price.memberPrice, 18),
              reward: price.reward,
              quantity: price.quantity
            }
          }))
        }
        dispatch(setProductReview(newProduct))
        navigate({
          pathname: PATH_PRIVATE_APP.product.review,
          search: createSearchParams({
            productId: isEditingProduct ? `${productId}` : '0',
            isEditing: queryConfig.isEditing ? queryConfig.isEditing : '0'
          }).toString()
        })
      } catch (error) {
        console.log('Product review error', error)
      } finally {
        setIsLoading(false)
      }
    },
    [
      imgLinks,
      idxError,
      comments,
      faqs,
      reviews,
      isFreeShipping,
      imgBlobs,
      activeWallet,
      isEditingProduct,
      productToUpdate,
      queryConfig.creaetProductType
    ]
  )

  const handleCreateProduct = useCallback(
    async (values: IProductFrom) => {
      console.log('imgLinks-imgBlobs', imgLinks, imgBlobs)
      if (idxError?.length > 0) toast.error('Duplicate variant!')
      if (imgLinks.length < 3) toast.error('Please enter image link or upload 3 images of product!')
      if (comments.length < 4) toast.error('Must have at least 4 comments!')
      if (!isRetailer) {
        if (faqs.length < 3) toast.error('Must have at least 3 faqs!')
      }
      if (reviews.length < 3) toast.error('Must have at least 3 reviews!')
      if (!isRetailer) {
        if (idxError?.length > 0 || imgLinks.length < 3 || comments.length < 4 || faqs.length < 3 || reviews.length < 3)
          return
      } else {
        if (idxError?.length > 0 || imgLinks.length < 3 || comments.length < 4 || reviews.length < 3) return
      }
      setIsLoading(true)
      try {
        let res: any
        if (imgBlobs.length > 0) {
          console.log('---', imgBlobs)
          res = await handlePushFiles(activeWallet, imgBlobs)
          console.log('upload images RESSSS', res)
          if (!res) {
            toast.error('Upload images failed!')
            return
          }
        }
        // const listImages = res
        let imgLinksToBytes: string[] = []
        if (imgLinks.length > 0) {
          imgLinksToBytes = await filterAndConvertImageUrlsToHex(imgLinks as string[])
        }
        const listImages =
          imgBlobs.length > 0
            ? filterNonBase64Urls([...(imgLinksToBytes as string[]), ...(res as string[])])
            : filterNonBase64Urls([...(imgLinksToBytes as string[])])

        const newProduct: IProductCreate = {
          params: {
            name: values.name,
            categoryID: values.categoryID,
            description: values.description,
            retailPrice: multiplyToExponential(values.prices[0]?.retailPrice, 18),
            vipPrice: multiplyToExponential(values.prices[0]?.vipPrice, 18),
            memberPrice: multiplyToExponential(values.prices[0]?.memberPrice, 18),
            reward: values.prices[0]?.reward,
            quantity: values.prices[0]?.quantity,
            capacity:
              values.variantType === 'orther' && values.categoryID.toString() !== EnumCategory.FASHION
                ? []
                : [values.capacities[0]?.valueCapacity],
            size:
              values.variantType === 'orther' && values.categoryID.toString() === EnumCategory.FASHION
                ? [values.colorSize[0]?.size]
                : [],
            color:
              values.variantType === 'orther' && values.categoryID.toString() === EnumCategory.FASHION
                ? [values.colorSize[0]?.color]
                : [],
            shippingFee:
              Number(isFreeShipping) === 0 || isFreeShipping === 0
                ? '0'
                : multiplyToExponential(values.shippingFee, 18),
            retailer: activeWallet as string,
            brandName: values.brandName,
            warranty: values.warranty,
            isFlashSale: queryConfig.creaetProductType === 'product-sale' ? true : false,
            images: listImages,
            videoUrl: values.videoUrl || '',
            boostTime: isEditingProduct ? Number(productToUpdate?.product.params.boostTime) : 0,
            expiryTime: getTime(values.expiryTime),
            activateTime: isEditingProduct ? Number(productToUpdate?.product.params.activateTime) : 0,
            isMultipleDiscount: false,
            isApprove: isEditingProduct ? (productToUpdate?.product.params.isApprove as boolean) : false,
            sold: isEditingProduct ? Number(productToUpdate?.product.params.sold) : 0
          },
          _variants: values.prices.map((price, index) => ({
            variantID: convertToUnit256(Math.floor(Math.random() * 1000)),
            attrs:
              values.variantType === 'orther' && values.categoryID.toString() === EnumCategory.FASHION
                ? [
                    {
                      id: convertToUnit256(Math.floor(Math.random() * 2000)),
                      key: 'color',
                      value: values.colorSize[index]?.color
                    },
                    {
                      id: convertToUnit256(Math.floor(Math.random() * 2000)),
                      key: 'size',
                      value: values.colorSize[index]?.size
                    }
                  ]
                : values.variantType === 'orther' && values.categoryID.toString() !== EnumCategory.FASHION
                  ? []
                  : [
                      {
                        id: convertToUnit256(Math.floor(Math.random() * 3000)),
                        key: 'capacities',
                        value: `${values.capacities[index]?.valueCapacity}${values.variantType}`
                      }
                    ],
            priceOptions: {
              retailPrice: multiplyToExponential(price.retailPrice, 18),
              vipPrice: multiplyToExponential(price.vipPrice, 18),
              memberPrice: multiplyToExponential(price.memberPrice, 18),
              reward: price.reward,
              quantity: price.quantity
            }
          }))
        }
        console.log('DEBUG createProduct 1')
        const resCreate = await sendTransaction(
          'createProduct',
          newProduct,
          'ecom-product',
          activeWallet,
          'chain',
          'user',
          10000,
          abiEcomProduct.abi.find((a) => a.name === 'eCreateProduct')
        )
        if (!resCreate.success) {
          console.log('resCreate.message', resCreate.message)
          toast.error(resCreate.message ? resCreate.message : 'Creaete product failed! Try again.')
        }
        console.log('createProduct infor', resCreate)
        if (resCreate.success) {
          const resCommentFaq = await handleCreateProductInfor(Number(resCreate.data?.id))
          if (resCommentFaq) {
            toast.success('Create products successfully')
            navigate(PATH_PRIVATE_APP.product.list)
            dispatch(clearProductReview())
            dispatch(getListBrands())
            localStorage.removeItem(initialConfig.namespace)
          }
        } else {
          setIsLoading(false)
        }
      } catch (error: any) {
        console.log('Product create error', error)
        toast.error(error.message || 'Creaete product failed! Try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [
      imgLinks,
      idxError,
      comments,
      faqs,
      reviews,
      isFreeShipping,
      imgBlobs,
      activeWallet,
      isEditingProduct,
      queryConfig.creaetProductType,
      isRetailer
    ]
  )

  const handleUpdateProduct = useCallback(
    async (values: IProductFrom) => {
      console.log('values---', values)
      console.log('imgLinks-imgBlobs', imgLinks, imgBlobs)
      if (idxError?.length > 0) toast.error('Duplicate variant!')
      if (imgLinks.length < 3) toast.error('Please enter image link or upload 3 images of product!')
      if (!isRetailer) {
        if (comments.length < 4) toast.error('Must have at least 4 comments!')
        if (faqs.length < 3) toast.error('Must have at least 3 faqs!')
        if (reviews.length < 3) toast.error('Must have at least 3 reviews!')
      }
      if (!isRetailer) {
        if (idxError?.length > 0 || imgLinks.length < 3 || comments.length < 4 || faqs.length < 3 || reviews.length < 3)
          return
      } else {
        if (idxError?.length > 0 || imgLinks.length < 3) return
      }
      setIsLoading(true)
      try {
        let res
        let listImages
        if (imgBlobs.length > 0) {
          console.log('---', imgBlobs)
          res = await handlePushFiles(activeWallet, imgBlobs)
          console.log('upload images RESSSS', res)
          listImages = res
          if (!res) {
            toast.error('Upload images failed!')
            return
          }
        } else {
          res = productToUpdate?.product?.params.fileKey
          listImages = res
        }
        console.log('listImages', listImages)
        const newProduct: IProductUpdate = {
          _productID: Number(productId),
          params: {
            name: values.name,
            categoryID: values.categoryID,
            description: values.description,
            retailPrice: multiplyToExponential(values.prices[0]?.retailPrice, 18),
            vipPrice: multiplyToExponential(values.prices[0]?.vipPrice, 18),
            memberPrice: multiplyToExponential(values.prices[0]?.memberPrice, 18),
            reward: values.prices[0]?.reward,
            quantity: values.prices[0]?.quantity,
            capacity:
              values.variantType === 'orther' && values.categoryID.toString() !== EnumCategory.FASHION
                ? []
                : [values.capacities[0]?.valueCapacity],
            size:
              values.variantType === 'orther' && values.categoryID.toString() === EnumCategory.FASHION
                ? [values.colorSize[0]?.size]
                : [],
            color:
              values.variantType === 'orther' && values.categoryID.toString() === EnumCategory.FASHION
                ? [values.colorSize[0]?.color]
                : [],
            shippingFee:
              Number(isFreeShipping) === 0 || isFreeShipping === 0
                ? '0'
                : multiplyToExponential(values.shippingFee, 18),
            retailer: activeWallet as string,
            brandName: values.brandName,
            warranty: values.warranty,
            isFlashSale: queryConfig.creaetProductType === 'product-sale' ? true : false,
            images: listImages,
            videoUrl: values.videoUrl || '',
            boostTime: isEditingProduct ? Number(productToUpdate?.product.params.boostTime) : 0,
            expiryTime: getTime(values.expiryTime),
            activateTime: isEditingProduct ? Number(productToUpdate?.product.params.activateTime) : 0,
            isMultipleDiscount: false,
            isApprove: isEditingProduct ? (productToUpdate?.product.params.isApprove as boolean) : false,
            sold: isEditingProduct ? Number(productToUpdate?.product.params.sold) : 0
          },
          _variants: values.prices.map((price, index) => ({
            variantID: convertToUnit256(Math.floor(Math.random() * 1000)),
            attrs:
              values.variantType === 'orther' && values.categoryID.toString() === EnumCategory.FASHION
                ? [
                    {
                      id: convertToUnit256(Math.floor(Math.random() * 2000)),
                      key: 'color',
                      value: values.colorSize[index]?.color
                    },
                    {
                      id: convertToUnit256(Math.floor(Math.random() * 2000)),
                      key: 'size',
                      value: values.colorSize[index]?.size
                    }
                  ]
                : values.variantType === 'orther' && values.categoryID.toString() !== EnumCategory.FASHION
                  ? []
                  : [
                      {
                        id: convertToUnit256(Math.floor(Math.random() * 3000)),
                        key: 'capacities',
                        value: `${values.capacities[index]?.valueCapacity}${values.variantType}`
                      }
                    ],
            priceOptions: {
              retailPrice: multiplyToExponential(price.retailPrice, 18),
              vipPrice: multiplyToExponential(price.vipPrice, 18),
              memberPrice: multiplyToExponential(price.memberPrice, 18),
              reward: price.reward,
              quantity: price.quantity
            }
          }))
        }

        console.log('newProduct----', newProduct)

        const resUpdate = await sendTransaction('updateProduct', newProduct, 'ecom-product', activeWallet)
        if (!resUpdate.success) {
          toast.error(resUpdate.message ? resUpdate.message : 'Update product failed! Try again.')
        }

        console.log('UpdateProduct infor', resUpdate)
        if (resUpdate.success) {
          let resCommentFaq: any
          if (!isRetailer) {
            resCommentFaq = await handleEditProductInfor(Number(productId))
          } else {
            resCommentFaq = true
          }
          if (resCommentFaq) {
            toast.success('Update products successfully')
            removeLocalStorage(`product_${productId}`)
            navigate(PATH_PRIVATE_APP.product.list)
            dispatch(clearProductReview())
          }
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.log('Product create error', error)
      } finally {
        setIsLoading(false)
      }
    },
    [
      imgLinks,
      idxError,
      productId,
      comments,
      faqs,
      reviews,
      isFreeShipping,
      imgBlobs,
      activeWallet,
      productToUpdate,
      queryConfig.creaetProductType,
      isRetailer
    ]
  )

  const handleTest = async () => {
    if (imgBlobs.length > 0) {
      const res = await handlePushFiles(activeWallet, imgBlobs)
      console.log('upload images RESSSS', res)
      if (!res || !res.payload) {
        toast.error('Upload images failed!')
        return
      }
    }
  }

  const handleUploadComplete = useCallback((link: string[] | Blob[], blob: Blob[]) => {
    console.log('linkkk: ---', link)
    console.log('blob----:', blob)
    setImgLinks(link)
    setImgBlobs(blob)
  }, [])

  console.log('imgLinks----', imgLinks)
  console.log('imgBlobs----', imgBlobs)

  return (
    <>
      {isLoading && (
        <div className='fixed bottom-0 left-0 right-0 top-0 z-[2000]'>
          <LoadingScreen />
        </div>
      )}

      <div className='overflow-hidden bg-dashboard-retailer bg-top bg-no-repeat px-5 xs:pt-[72px] sm:pt-[72px] md:pt-[80px] lg:pt-[88px]'>
        <div className='relative w-full bg-white/[.64] 2xs:h-[50px] xs:h-[42px] sm:h-[52px] md:h-[58px] lg:h-[65px] xl:h-[70px]'>
          <div className='relative z-20 flex h-full items-center'>
            {(isEditingProduct ? listTabsUpdate : listTabs).map((option) => (
              <div
                key={option.value}
                onClick={() =>
                  navigate({
                    search: createSearchParams({ ...queryConfig, creaetProductType: option.value }).toString()
                  })
                }
                className={cn(
                  `flex h-full w-1/2 cursor-pointer items-center justify-center text-center font-customSemiBold uppercase transition-all duration-1000 ease-in-out xs:text-[14px] sm:text-[15px] md:text-[18px] lg:text-[19px] xl:text-[20px]/[63.33px]`,
                  queryConfig.creaetProductType === option.value ? 'text-white' : 'text-black-main'
                )}
              >
                {option.label}
              </div>
            ))}
          </div>
          <span
            className={cn(
              'absolute top-1/2 z-10 w-1/2 -translate-y-1/2 transform bg-black-main transition-all duration-1000 ease-in-out xs:h-[42px] sm:h-[52px] md:h-[58px] lg:h-[65px] xl:h-[70px]',
              queryConfig.creaetProductType === 'product' ? 'left-0' : 'left-1/2'
            )}
          />
        </div>

        <div className='bg-white/[.76] backdrop-blur-[200px] xs:px-3 xs:py-7 sm:px-4 sm:py-8 xl:px-[98px] xl:py-[60px]'>
          <h1 className='font-customSemiBold capitalize xs:text-[22px] sm:text-[25px] md:text-[28px] lg:text-[30px] xl:text-[32px]/[32px]'>
            {isEditingProduct && 'update'} product information
          </h1>

          <div className='w-full xs:mt-[-10] xs:space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-[56px]'>
            <FormProvider {...createProductForm}>
              <ProductFrom
                idxError={idxError}
                setIdxError={setIdxError}
                handleUploadComplete={handleUploadComplete}
                productToUpdate={productToUpdate as ProductInfo}
              />
            </FormProvider>
            {/* {isController && (
              <> */}
            {!isEditingProduct && (
              <>
                <div className='h-[1px] w-full bg-black-default' />
                <AddProductReview isLoadingData={isLoadingData} />
                {!isRetailer && (
                  <>
                    <div className='h-[1px] w-full bg-black-default' />
                    <AddProductFAQ isLoadingData={isLoadingData} />
                  </>
                )}
                <div className='h-[1px] w-full bg-black-default' />
                <AddPressComment isLoadingData={isLoadingData} />
              </>
            )}

            <div className='flex items-center xs:flex-col xs:justify-center xs:gap-3 sm:flex-row sm:justify-end sm:gap-5'>
              <div className='flex items-center xs:w-full xs:gap-3 sm:w-fit sm:gap-5'>
                <Button
                  fullWidth={smDowm}
                  variant='outline'
                  className={xsDowm ? '!h-12 !w-full' : 'xs:w-full sm:w-[165px]'}
                  onClick={() => {
                    isEditingProduct ? resetDataUpdate() : dialogRef.current?.handleOpen()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth={smDowm}
                  variant='outline'
                  className={xsDowm ? '!h-12 !w-full' : 'xs:w-full sm:w-[165px]'}
                  onClick={handleSubmit(handleCreateProductPreview)}
                >
                  Review
                </Button>
              </div>
              <Button
                fullWidth={smDowm}
                className={xsDowm ? '!h-12 !w-full' : 'xs:w-full sm:w-[165px]'}
                onClick={handleSubmit(isEditingProduct ? handleUpdateProduct : handleCreateProduct)}
              >
                {isEditingProduct ? 'Update' : 'Create'}
              </Button>
            </div>
            <Button
              fullWidth={smDowm}
              variant='outline'
              className={xsDowm ? '!h-12 !w-full' : 'xs:w-full sm:w-[165px]'}
              onClick={handleTest}
            >
              Test
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        ref={dialogRef}
        title='Cancel Create'
        content={`Are you sure you want to cancel create new product?`}
        onConfirm={() => navigate(PATH_PRIVATE_APP.product.list)}
      />
    </>
  )
})

export default CreateProduct
