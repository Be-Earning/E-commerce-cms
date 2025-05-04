import { scCategory } from '~/@types/enums/category'
import { IProductAttrs, ProductInfo } from '~/@types/models'
import useResponsive from '~/hooks/useResponsive'
import { AttributeItem } from '../attributeItem'

type ProductInOrderProps = {
  product: ProductInfo
}

function ProductInOrder({ product }: ProductInOrderProps) {
  const mdUp = useResponsive('up', 'md')

  const { product: productInfo } = product || {}

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex w-full items-center gap-3'>
          <div
            className={
              '2xs:size-[72px] 2xs:min-w-[72px] xs:size-[72px] xs:min-w-[72px] sm:size-[100px] sm:min-w-[100px] md:size-[120px] md:min-w-[120px]'
            }
          >
            <img
              src={productInfo.params?.images[0]}
              alt={productInfo.params?.name}
              className={`h-full w-full rounded-lg object-cover object-center`}
            />
          </div>
          <div className={`flex w-full flex-col gap-2`}>
            <div className='flex items-center justify-between'>
              <p
                className={`line-clamp-1 text-left font-customSemiBold 2xs:text-[18px]/[18.9px] xs:text-[18px]/[18.9px] sm:text-[24px]/[30px] md:text-[24px]/[30px] lg:text-[24px]/[30px] xl:text-[24px]/[30px]`}
              >
                {productInfo?.params?.name}
              </p>
            </div>
            <div className={`flex w-full flex-col gap-2`}>
              <p
                className={`text-left capitalize text-black-main/[.64] 2xs:text-[14px]/[14.7px] xs:text-[16px]/[16.8px] sm:text-[18px]/[18.9px]`}
              >
                {scCategory[productInfo?.params?.categoryID]}
              </p>
              <AttributeItem isOrderHistory={mdUp} attribute={product.attribute as IProductAttrs[]} />
              <div className='mt-2 flex w-full items-center justify-between 2xs:hidden xs:hidden sm:flex md:flex lg:flex xl:hidden'>
                <p
                  className={`2xs:text-[18px]/[18.9px] xs:text-[18px]/[18.9px] sm:text-[18px]/[18.9px] md:text-[20px]/[22.1px]`}
                >
                  ${(Number(product.priceInOrder) / 10 ** 18).toFixed(2)}{' '}
                  <span
                    className={`text-blackMain/[.64] line-through 2xs:text-right 2xs:text-[16px]/[18.9px] xs:text-right xs:text-[16px]/[18.9px] sm:text-[16px]/[18.9px] md:text-[18px]/[18.9px]`}
                  >
                    ${(Number(product.variant?.priceOptions.retailPrice) / 10 ** 18).toFixed(2)}
                  </span>
                </p>
                <p className='2xs:flex 2xs:text-[18px]/[25px] xs:hidden xs:text-[18px]/[25px] sm:hidden sm:text-[20px]/[21px] md:flex'>
                  x{product.quantityInOrder}
                </p>
                <p
                  className={`2xs:text-[18px]/[18.9px] xs:text-[18px]/[18.9px] sm:text-[18px]/[18.9px] md:text-[20px]/[22.1px]`}
                >
                  ${(Number(product.quantityInOrder) * (Number(product.priceInOrder) / 10 ** 18)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex justify-between 2xs:items-start xs:items-start sm:hidden sm:w-full sm:items-center md:hidden lg:hidden xl:flex`}
        >
          <p className='2xs:flex 2xs:text-[18px]/[25px] xs:hidden xs:text-[18px]/[25px] sm:hidden sm:text-[20px]/[21px] md:flex'>
            {product.quantityInOrder}
          </p>
          <div
            className={`flex justify-between gap-5 2xs:hidden 2xs:w-fit 2xs:flex-col xs:hidden xs:w-fit xs:flex-col sm:hidden sm:flex-row sm:items-center md:flex lg:w-[65%]`}
          >
            <p
              className={`text-nowrap font-customMedium 2xs:text-[18px]/[25px] xs:text-right xs:text-[18px]/[25px] sm:text-left sm:text-[20px]/[21px]`}
            >
              ${(Number(product.priceInOrder) / 10 ** 18).toFixed(2)}{' '}
              <span
                className={`text-black-main/[.64] line-through 2xs:text-right 2xs:text-[14px] xs:text-right xs:text-[14px] sm:text-[20px]`}
              >
                ${(Number(product.variant?.priceOptions.retailPrice) / 10 ** 18).toFixed(2)}
              </span>
            </p>

            <p className={`font-customMedium 2xs:text-[16px]/[16.8px] xs:text-[16px]/[16.8px] sm:text-[20px]/[21px]`}>
              ${(Number(product.quantityInOrder) * (Number(product.priceInOrder) / 10 ** 18)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className='mt-2 flex w-full items-center justify-between 2xs:flex xs:flex sm:hidden md:hidden'>
        <p className={`text-[18px] leading-[18.9px]`}>
          ${(Number(product.priceInOrder) / 10 ** 18).toFixed(2)}{' '}
          <span className={`text-[16px] text-black-main/[.64] line-through 2xs:text-right xs:text-right`}>
            ${(Number(product.variant?.priceOptions.retailPrice) / 10 ** 18).toFixed(2)}
          </span>
        </p>

        <p className='2xs:flex 2xs:text-[18px]/[25px] xs:text-[18px]/[25px] sm:text-[20px]/[21px]'>
          x{product.quantityInOrder}
        </p>

        <p className={`text-[18px] leading-[18.9px]`}>
          ${(Number(product.quantityInOrder) * (Number(product.priceInOrder) / 10 ** 18)).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

export default ProductInOrder
