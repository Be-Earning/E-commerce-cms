import { format } from 'date-fns'
import { memo } from 'react'
import { ProductInfo } from '~/@types/models'
import { formatLocaleString } from '~/utils/format'

type ProductSerachPurchaseProps = { product: ProductInfo; isProductSearch?: boolean }

const ProductSerachPurchase = memo(({ product, isProductSearch }: ProductSerachPurchaseProps) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex min-w-[220px] max-w-[250px] items-center gap-3'>
        <img
          src={
            product.product.params.images?.[0]
              ? product.product.params.images?.[0]
              : 'https://img.fi.ai/ecommerce/assets/images/no-image.jpg'
          }
          alt='product-img'
          className='size-[50px] min-w-[50px] flex-shrink-0 rounded-md object-cover object-center shadow-avatar'
        />
        <h5 className='font-customSemiBold xs:text-[16px]/[16.8px] sm:text-[17px]/[17.8px] md:text-[18px]/[18.9px]'>
          {product.product.params.name}
        </h5>
      </div>

      <p className='min-w-[120px] text-nowrap text-[16px]/[16.8px] text-black-main/[.64]'>
        {formatLocaleString(isProductSearch ? product.productCount : product.sold)}{' '}
        {isProductSearch ? 'views' : 'purchases'}
      </p>

      <p className='text-[16px]/[16.8px] text-black-main/[.64]'>{format(product.timestamp || 0, 'hh:mm:ss')}</p>
    </div>
  )
})

export default ProductSerachPurchase
