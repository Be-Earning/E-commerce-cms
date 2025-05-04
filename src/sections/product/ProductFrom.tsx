import { InfoIcon } from 'lucide-react'
import { Dispatch, FC, memo, SetStateAction, useCallback, useEffect, useMemo, useRef } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import toast from 'react-hot-toast'
import { OptionSelect, QueryConfig } from '~/@types/common'
import { EnumCategory } from '~/@types/enums/category'
import { ICategory, ProductInfo } from '~/@types/models'
import { listColors } from '~/assets/mocks/color'
import { listSizes } from '~/assets/mocks/size'
import {
  DatePickerField,
  InputField,
  RadioGroupField,
  SelectAttributeField,
  SelectField,
  TextareaField
} from '~/components/form'
import { CalendarIcon, CloseIcon, CopyIcon } from '~/components/icons'
import RichTextEditor from '~/components/LexicalCustom/pages/RichTextEditor'
import ImageUploader, { ImageUploaderRef } from '~/components/uploadImage/uploadImage'
import useQueryConfig from '~/hooks/useQueryConfig'
import useResponsive from '~/hooks/useResponsive'
import { useAppSelector } from '~/redux/configStore'
import { cn } from '~/utils/classNames'
import { findAllDuplicateCapacity, findAllDuplicateColorSize } from '~/utils/handleArray'

const listTabs: OptionSelect[] = [
  {
    value: 'ml',
    label: 'ML'
  },
  {
    value: 'g',
    label: 'G'
  },
  {
    value: 'orther',
    label: '--'
  }
]

interface ProductFromProps {
  handleUploadComplete: (link: string[] | Blob[], blob: Blob[]) => void
  setIdxError: Dispatch<SetStateAction<number[]>>
  idxError: number[]
  productToUpdate: ProductInfo
}

const ProductFrom: FC<ProductFromProps> = memo(({ idxError, setIdxError, handleUploadComplete, productToUpdate }) => {
  const uploadImgRef = useRef<ImageUploaderRef>(null)
  // const [htmlRaw, setHtmlRaw] = useState('')

  const xsDown = useResponsive('down', '3xs')
  const smDown = useResponsive('down', 'sm')

  const queryConfig: QueryConfig = useQueryConfig()

  const { listBrands } = useAppSelector((s) => s.brand)
  const { listCategories } = useAppSelector((s) => s.category)
  const { productReview } = useAppSelector((s) => s.product)

  const isEditingProduct = useMemo(() => Number(queryConfig.isEditing) === 1, [queryConfig.isEditing])

  const {
    control,
    watch,
    getValues,
    setValue,
    clearErrors,
    formState: { errors }
  } = useFormContext()

  console.log('errors in form', errors)

  const { fields: fieldsColorSize, remove: removeColorSize } = useFieldArray({ control, name: 'colorSize' })
  const { fields: fieldsCapacities, remove: removeCapacities } = useFieldArray({ control, name: 'capacities' })
  const { fields: fieldsPrices, remove: removePrices } = useFieldArray({ control, name: 'prices' })

  const description = watch('description')
  const categoryID = watch('categoryID')
  const brandName = watch('brandName')
  const variantType = watch('variantType')
  const isFreeShipping = watch('isFreeShipping')
  const colorSizeWatch = watch('colorSize')
  const capacitiesWatch = watch('capacities')
  const colorSize = getValues('colorSize')
  const capacities = getValues('capacities')
  const prices = getValues('prices')

  console.log('description', description)

  const categoryOptions = useMemo(
    () => listCategories.map((category: ICategory) => ({ label: category.name, value: category.id })),
    [listCategories]
  )
  const brandOptions = useMemo(() => listBrands?.map((brand: string) => ({ label: brand, value: brand })), [listBrands])

  // console.log('productReview---', productReview)

  useEffect(() => {
    if (productReview) {
      uploadImgRef.current?.setImageUrls(productReview.params.images)
      uploadImgRef.current?.setImageBlobs(productReview.params.fileKey ? productReview.params.fileKey : [])
      uploadImgRef.current?.setTexts(productReview.params.images)
    }
  }, [productReview])

  useEffect(() => {
    if (!isEditingProduct) return
    if (!productReview && productToUpdate) {
      const imgLinks = productToUpdate.product.params.images
      uploadImgRef.current?.setImageUrls(imgLinks)
      uploadImgRef.current?.setImageBlobs(productToUpdate.product.params.fileKey || [])
      uploadImgRef.current?.setTexts(imgLinks)
    }
  }, [productReview])

  useEffect(() => {
    if (String(categoryID) === EnumCategory.FASHION) {
      const ressult = findAllDuplicateColorSize([...colorSizeWatch])
      setIdxError(ressult)
    } else {
      const ressult = findAllDuplicateCapacity([...capacitiesWatch])
      setIdxError(ressult)
    }
  }, [categoryID, JSON.stringify(colorSizeWatch), JSON.stringify(capacitiesWatch)])

  const handleAddNewRow = useCallback(() => {
    if (!categoryID || String(categoryID) === '') {
      toast('Please select category before add more attribute!', {
        icon: <InfoIcon color='#5495FC' />
      })
    } else {
      if (String(categoryID) === EnumCategory.FASHION) {
        setValue('colorSize', [...(colorSize || []), { color: '#000000', size: 'S' }])
      } else {
        setValue('capacities', [...(capacities || []), { valueCapacity: '' }])
      }
      setValue('prices', [
        ...(prices || []),
        { retailPrice: '', reward: '', memberPrice: '', vipPrice: '', quantity: '' }
      ])
    }
  }, [categoryID, colorSize, capacities, prices])

  const handleDeleteRow = useCallback(
    (index: number) => {
      if (String(categoryID) === EnumCategory.FASHION) {
        removeColorSize(index)
      } else {
        removeCapacities(index)
      }
      removePrices(index)
    },
    [categoryID]
  )

  const changeCategory = useCallback(
    (value: string) => {
      setIdxError([])
      setValue('prices', [{ retailPrice: '', reward: '', memberPrice: '', vipPrice: '', quantity: '' }])
      if (value === EnumCategory.FASHION) {
        setValue('colorSize', [{ color: '#000000', size: 'S' }])
        setValue('variantType', 'orther')
      } else {
        if (variantType === 'orther') {
          setValue('capacities', [{ valueCapacity: 10 }])
        } else {
          setValue('capacities', [{ valueCapacity: '' }])
        }
      }
    },
    [variantType]
  )

  const handleChange = (editorState) => {
    const editorStateJSON = editorState.toJSON()
    let htmlContent = ''
    const root = editorStateJSON.root
    if (root && root.children) {
      root.children.forEach((child) => {
        // Xử lý các phần tử paragraph
        if (child.type === 'paragraph' && child.children) {
          child.children.forEach((textChild) => {
            if (textChild.type === 'extended-text') {
              let textContent = textChild.text
              let style = textChild.style || ''
              let format = textChild.format || 0

              // Bắt đầu với văn bản gốc
              let htmlText = textContent

              // Kiểm tra các kiểu định dạng và thêm thẻ HTML tương ứng
              if (format & 1) {
                htmlText = `<strong>${htmlText}</strong>`
              }
              if (format & 2) {
                htmlText = `<em>${htmlText}</em>`
              }
              if (format & 4) {
                htmlText = `<del>${htmlText}</del>`
              }
              if (format & 8) {
                htmlText = `<u>${htmlText}</u>`
              }
              if (format & 16) {
                htmlText = `<code>${htmlText}</code>`
              }
              if (format & 32) {
                htmlText = `<sub>${htmlText}</sub>`
              }
              if (format & 64) {
                htmlText = `<sup>${htmlText}</sup>`
              }
              if (format & 128) {
                htmlText = `<mark>${htmlText}</mark>`
              }

              // Thêm style nếu có
              if (style) {
                htmlText = `<span style="${style}">${htmlText}</span>`
              }

              // Thêm văn bản đã chuyển đổi vào nội dung HTML
              htmlContent += htmlText
            } else if (textChild.type === 'image' && textChild.src) {
              let imageUrl = textChild.src
              let altText = textChild.altText || ''
              let maxWidth = textChild.maxWidth || 500

              // Thêm thẻ <img> với src và altText
              htmlContent += `<img src="${imageUrl}" alt="${altText}" style="max-width: ${maxWidth}px;" />`

              // Nếu có caption, xử lý và thêm vào sau ảnh
              if (
                textChild.caption &&
                textChild.caption.editorState &&
                textChild.caption.editorState.root.children.length > 0
              ) {
                let captionText = ''
                textChild.caption.editorState.root.children.forEach((captionChild) => {
                  if (captionChild.type === 'extended-text' && captionChild.text) {
                    captionText += captionChild.text
                  }
                })

                if (captionText) {
                  htmlContent += `<figcaption>${captionText}</figcaption>`
                }
              }
              htmlContent += '<br />'
            }
          })

          htmlContent += '<br />'
        } else if (child.type === 'linebreak') {
          htmlContent += '<br />'
        }
      })
    }

    console.log('htmlContenthtmlContent---', htmlContent)
    setValue('description', htmlContent)
  }

  return (
    <div className='flex flex-col gap-8 xs:mt-4 sm:mt-6 md:mt-8'>
      <div className='flex xs:flex-col xs:gap-6 sm:flex-col sm:gap-8 md:flex-row md:gap-4 lg:gap-10'>
        <SelectField
          required
          fullWidth
          name='categoryID'
          label='Category'
          placeholder='Select category'
          options={categoryOptions}
          value={categoryID}
          disabled={isEditingProduct}
          changeCategory={changeCategory}
        />
        <InputField required fullWidth name='name' label='Name of product' placeholder='Ex: Abc vitamin' />
      </div>
      <div className='flex w-full xs:flex-col xs:gap-6 sm:flex-col sm:gap-8 md:flex-row md:gap-4 lg:gap-10'>
        <div className='flex w-full flex-col justify-between xs:gap-6 sm:gap-8 xl:gap-[60px]'>
          <InputField
            classNameLabel={'!text-[18px]/[26px]'}
            required
            fullWidth
            name='videoUrl'
            label='Video'
            placeholder='Enter a link video ...'
            className={'pr-12'}
            rightIcon={
              <button
                className='mt-[6px] cursor-pointer'
                onClick={async () => {
                  const string = await navigator.clipboard.readText()
                  setValue('videoUrl', string)
                  clearErrors('videoUrl')
                }}
              >
                <CopyIcon />
              </button>
            }
          />
          <SelectField
            required
            fullWidth
            showInput
            name='brandName'
            label='Brand'
            placeholder='Select or type your brand'
            options={brandOptions}
            value={brandName}
          />
        </div>

        <div className='flex w-full flex-col items-start gap-2'>
          <p className='font-customSemiBold text-[18px]'>
            Product images <span className='font-customRegular text-[#8E8E93]'>(including 3 pictures)</span>{' '}
            <span className='text-red-main'>*</span>
          </p>
          <ImageUploader ref={uploadImgRef} onCompleteUpload={handleUploadComplete} />
        </div>
      </div>

      <>
        <div
          className={cn(
            `scroll-bar-small w-full bg-transparent px-5 py-2 transition-colors duration-300 ease-in-out`,
            'rounded-[16px] border-[1px] border-solid border-gray-border focus:ring-[1px] focus:ring-black-main/[.30]'
          )}
        >
          <RichTextEditor onChange={handleChange} />
        </div>
        {errors?.description?.message && (
          <div className='left-0 top-full mt-1 min-h-[18px]'>
            <p className='ml-2 text-nowrap text-red-500 xs:text-[13px] sm:text-[14px]'>
              {errors?.description?.message as string}
            </p>
          </div>
        )}
      </>

      <div className='relative'>
        <TextareaField
          rows={4}
          required
          fullWidth
          name='warranty'
          label='Product Manual'
          placeholder='Enter your product manual ...'
          className='pb-[58px]'
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 81% 100%, 0 100%)' }}
        />
        <div className='absolute bottom-0 right-0 rounded-tl-[24px] border-0 border-l border-t border-solid border-gray-border pl-2 pt-2'>
          <DatePickerField
            fullWidth
            size='small'
            variant='outline'
            name='expiryTime'
            placeholder='Expiry'
            rightIcon={<CalendarIcon />}
            className='w-[260px] rounded-none rounded-br-2xl rounded-tl-2xl focus:ring-0'
          />
        </div>
      </div>
      <div
        className={cn(
          'flex items-center xs:flex-col xs:gap-8 sm:flex-col sm:gap-8 md:flex-col md:gap-5 lg:flex-row lg:gap-10'
        )}
      >
        <div className={cn('flex w-full flex-col gap-3')}>
          <label className={`font-customSemiBold capitalize xs:text-[18px] sm:text-[20px]/[18px]`}>
            Shipping Fee <span className='text-red-main'>*</span>
          </label>
          <div
            className={cn(
              xsDown && '!flex-col',
              'flex w-full justify-between gap-5 2xs:flex-col xs:flex-row xs:items-end sm:items-center'
            )}
          >
            <RadioGroupField
              name='isFreeShipping'
              options={[
                {
                  value: 0,
                  label: <p className='text-nowrap font-customMedium text-[18px]'>Free Shipping</p>
                },
                {
                  value: 1,
                  label: <p className='text-nowrap font-customMedium text-[18px]'>Shipping Fee</p>
                }
              ]}
            />
            <div className={cn('xs:!w-full md:w-fit')}>
              <InputField
                name='shippingFee'
                placeholder='00'
                disabled={+isFreeShipping === 0 || isFreeShipping === 0 || !isFreeShipping}
                rightIcon={<p className='font-customSemiBold text-[18px] leading-none'>$</p>}
                width={'xs:!w-full md:!w-[240px] lg:!w-[180px]'}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-10 flex w-full'>
        <div
          className={cn(
            xsDown && '!flex-col !items-start',
            'flex w-full items-center xs:flex-row xs:justify-between xs:gap-4 sm:flex-nowrap md:gap-10'
          )}
        >
          <label className={`text-nowrap font-customSemiBold capitalize xs:text-[18px] sm:text-[20px]/[18px]`}>
            {categoryID !== EnumCategory.FASHION && `Capacity${!smDown ? ',' : ''}`} {!smDown && 'Quantity'} & Price{' '}
            <span className='text-red-main'>*</span>
          </label>

          {String(categoryID) !== EnumCategory.FASHION && (
            <Controller
              control={control}
              name='variantType'
              render={({ field }) => (
                <div
                  className={cn(
                    xsDown && '!w-full',
                    'relative h-10 rounded-[20px] bg-[#E5E5EA] xs:w-[144px] sm:w-[180px]'
                  )}
                >
                  <div className='relative z-20 flex h-full items-center'>
                    {listTabs.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          field.onChange(option.value)
                          if (option.value !== 'orther') {
                            setValue('capacities', [{ valueCapacity: '' }])
                          } else {
                            setValue('capacities', [{ valueCapacity: 10 }])
                          }
                        }}
                        className={cn(
                          xsDown && '!w-1/3',
                          `flex h-full cursor-pointer items-center justify-center rounded-[20px] font-customSemiBold uppercase leading-none transition-all duration-300 ease-in-out xs:w-12 xs:text-[16px] sm:w-[60px] sm:text-[18px]`,
                          field.value === option.value ? 'text-white' : 'text-black-main'
                        )}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                  <span
                    className={cn(
                      'absolute top-1/2 z-10 h-10 w-1/3 -translate-y-1/2 transform rounded-[20px] bg-black-main transition-all duration-300 ease-in-out',
                      field.value === 'ml' ? 'left-0' : field.value === 'g' ? 'left-1/3' : 'left-2/3'
                    )}
                  />
                </div>
              )}
            />
          )}
        </div>
      </div>

      <div
        className={cn(
          String(categoryID) === EnumCategory.FASHION || xsDown ? 'xs:flex-col' : 'xs:flex-row',
          'mt-5 flex justify-between gap-7 xs:items-start sm:flex-row md:flex-row md:items-start lg:flex-row lg:items-start xl:flex-row xl:items-start 2xl:flex-row 2xl:items-center'
        )}
      >
        {String(categoryID) === EnumCategory.FASHION ? (
          <div className='flex flex-col gap-5'>
            {fieldsColorSize.map((item, index) => (
              <div key={item.id} className='min-h-[93.6px] md:min-h-[225px] lg:min-h-[166px] 2xl:min-h-[93.6px]'>
                <div className='flex w-full items-end gap-4 lg:items-start 2xl:pt-2'>
                  <SelectAttributeField
                    index={index}
                    label='Color'
                    model='color'
                    name={`colorSize.${index}.color`}
                    options={listColors}
                  />
                  <SelectAttributeField
                    index={index}
                    label='Size'
                    model='size'
                    name={`colorSize.${index}.size`}
                    options={listSizes}
                  />
                </div>
                {idxError.includes(index) && (
                  <div className='min-h-[18px]'>
                    <p className='ml-2 text-red-500 xs:text-[13px] sm:text-[14px]'>Duplicate color size</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col gap-5'>
            {fieldsCapacities.map((item, index) => (
              <div key={item.id} className='pt-2 xs:h-[62px] sm:h-[95px] md:h-[220px] lg:h-[166px] 2xl:h-[95px]'>
                <InputField
                  noStyle
                  name={`capacities.${index}.valueCapacity`}
                  placeholder='00'
                  rightIcon={
                    <p className='mb-1 font-customSemiBold text-[18px] leading-none'>
                      {variantType === 'orther' ? '' : variantType}
                    </p>
                  }
                  width='w-[60px]'
                  className='w-full pr-6'
                  disabled={variantType === 'orther'}
                />
                {idxError.includes(index) && (
                  <div className='min-h-[18px]'>
                    <p className='text-red-500 xs:text-[13px] sm:text-[14px]'>Duplicate capacity</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className='flex flex-col gap-5 xs:w-full sm:w-fit'>
          {fieldsPrices.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'flex xs:flex-col xs:items-end xs:gap-5 sm:flex-row sm:items-center sm:gap-5 md:flex-row md:flex-wrap md:items-start md:gap-3 lg:flex-row lg:flex-wrap lg:items-start lg:gap-5 xl:flex-row xl:flex-wrap xl:items-center 2xl:flex-row 2xl:flex-nowrap 2xl:items-center',
                'relative rounded-[14px] border border-solid border-gray-border p-5'
              )}
            >
              <div className={cn(String(categoryID) === EnumCategory.FASHION && smDown && 'w-full', 'flex gap-3')}>
                <p
                  className={cn(
                    String(categoryID) === EnumCategory.FASHION && smDown ? 'xs:min-w-[75px]' : 'xs:w-fit',
                    'pt-3 font-customMedium text-[18px]/[26px] sm:w-fit md:w-[75px] lg:w-[75px] xl:w-[75px] 2xl:w-fit'
                  )}
                >
                  Retail
                </p>
                <div className={cn(String(categoryID) === EnumCategory.FASHION && smDown && 'w-full')}>
                  <InputField
                    name={`prices.${index}.retailPrice`}
                    placeholder='00'
                    // disabled={String(categoryID) === EnumCategory.FASHION ? false : variantType === 'orther'}
                    width={
                      String(categoryID) === EnumCategory.FASHION && smDown
                        ? '!w-full'
                        : String(categoryID) === EnumCategory.FASHION
                          ? '!w-[115px]'
                          : '!w-[140px]'
                    }
                    rightIcon={<p className='font-customSemiBold text-[18px] leading-none'>$</p>}
                  />
                </div>
              </div>
              <div className={cn(String(categoryID) === EnumCategory.FASHION && smDown && 'w-full', 'flex gap-3')}>
                <p
                  className={cn(
                    String(categoryID) === EnumCategory.FASHION && smDown ? 'xs:min-w-[75px]' : 'xs:w-fit',
                    'pt-3 font-customMedium text-[18px]/[26px] sm:w-fit md:w-[75px] lg:w-[75px] xl:w-[75px] 2xl:w-fit'
                  )}
                >
                  Reward
                </p>
                <div className={cn(String(categoryID) === EnumCategory.FASHION && smDown && 'w-full')}>
                  <InputField
                    name={`prices.${index}.reward`}
                    placeholder='00'
                    // disabled={String(categoryID) === EnumCategory.FASHION ? false : variantType === 'orther'}
                    width={
                      String(categoryID) === EnumCategory.FASHION && smDown
                        ? '!w-full'
                        : String(categoryID) === EnumCategory.FASHION
                          ? '!w-[115px]'
                          : '!w-[140px]'
                    }
                    rightIcon={<p className='font-customSemiBold text-[18px] leading-none'>$</p>}
                  />
                </div>
              </div>
              <div className={cn(String(categoryID) === EnumCategory.FASHION && smDown && 'w-full', 'flex gap-3')}>
                <p
                  className={cn(
                    String(categoryID) === EnumCategory.FASHION && smDown ? 'xs:min-w-[75px]' : 'xs:w-fit',
                    'pt-3 font-customMedium text-[18px]/[26px] sm:w-fit md:w-[75px] lg:w-[75px] xl:w-[75px] 2xl:w-fit'
                  )}
                >
                  Member
                </p>
                <div className={cn(String(categoryID) === EnumCategory.FASHION && smDown && 'w-full')}>
                  <InputField
                    name={`prices.${index}.memberPrice`}
                    placeholder='00'
                    // disabled={String(categoryID) === EnumCategory.FASHION ? false : variantType === 'orther'}
                    width={
                      String(categoryID) === EnumCategory.FASHION && smDown
                        ? '!w-full'
                        : String(categoryID) === EnumCategory.FASHION
                          ? '!w-[115px]'
                          : '!w-[140px]'
                    }
                    rightIcon={<p className='font-customSemiBold text-[18px] leading-none'>$</p>}
                  />
                </div>
              </div>
              <div className={cn(String(categoryID) === EnumCategory.FASHION && smDown && 'w-full', 'flex gap-3')}>
                <p
                  className={cn(
                    String(categoryID) === EnumCategory.FASHION && smDown ? 'xs:min-w-[75px]' : 'xs:w-fit',
                    'pt-3 font-customMedium text-[18px]/[26px] sm:w-fit md:w-[75px] lg:w-[75px] xl:w-[75px] 2xl:w-fit'
                  )}
                >
                  VIP
                </p>
                <div className={cn(String(categoryID) === EnumCategory.FASHION && smDown && 'w-full')}>
                  <InputField
                    name={`prices.${index}.vipPrice`}
                    placeholder='00'
                    // disabled={String(categoryID) === EnumCategory.FASHION ? false : variantType === 'orther'}
                    width={
                      String(categoryID) === EnumCategory.FASHION && smDown
                        ? '!w-full'
                        : String(categoryID) === EnumCategory.FASHION
                          ? '!w-[115px]'
                          : '!w-[140px]'
                    }
                    rightIcon={<p className='font-customSemiBold text-[18px] leading-none'>$</p>}
                  />
                </div>
              </div>
              <div className={cn(String(categoryID) === EnumCategory.FASHION && smDown && 'w-full', 'flex gap-3')}>
                <p
                  className={cn(
                    String(categoryID) === EnumCategory.FASHION && smDown ? 'xs:min-w-[75px]' : 'xs:w-fit',
                    'pt-3 font-customMedium text-[18px]/[26px] sm:w-fit md:w-[75px] lg:w-[75px] xl:w-[75px] 2xl:w-fit'
                  )}
                >
                  Quantity
                </p>
                <div className={cn(String(categoryID) === EnumCategory.FASHION && smDown && 'w-full')}>
                  <InputField
                    name={`prices.${index}.quantity`}
                    placeholder='00'
                    // disabled={String(categoryID) === EnumCategory.FASHION ? false : variantType === 'orther'}
                    width={
                      String(categoryID) === EnumCategory.FASHION && smDown
                        ? '!w-full'
                        : String(categoryID) === EnumCategory.FASHION
                          ? '!w-[115px]'
                          : '!w-[140px]'
                    }
                    rightIcon={<p className='-mr-3 mb-1 font-customSemiBold text-[18px] leading-none'>items</p>}
                    className='pr-14'
                  />
                </div>
              </div>

              {prices.length > 1 && (
                <button
                  className='absolute -top-2 right-5 flex size-5 shrink-0 items-center justify-center rounded-full bg-black-main'
                  onClick={() => handleDeleteRow(index)}
                >
                  <CloseIcon color='white' className='size-2' />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {!(String(categoryID) !== EnumCategory.FASHION && variantType === 'orther') && (
        <div className='mt-5 w-full'>
          <button onClick={handleAddNewRow}>
            <p className='text-nowrap text-blue-dark'>
              + <span className='underline'>More capacity</span>
            </p>
          </button>
        </div>
      )}
    </div>
  )
})

export default ProductFrom
