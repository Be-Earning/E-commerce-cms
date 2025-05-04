import { memo, useMemo, useState, useCallback } from 'react'
import { ProductInfo } from '~/@types/models'
import { ChevronLeft, ChevronRight } from '~/components/icons'
import NoDataIcon from '~/components/icons/NoDataIcon'
import { ProductSerachPurchase } from '~/components/productSerachPurchase'
import { useAppSelector } from '~/redux/configStore'
import { cn } from '~/utils/classNames'
import { getPagePagination } from '~/utils/handleArray'

const listFilters = [
  {
    label: 'Search',
    value: 'search'
  },
  {
    label: 'Purchase',
    value: 'purchase'
  }
]

const ListProductSearch = memo(() => {
  const { listProducts, listBestSeller, listProductViewCount } = useAppSelector((s) => s.product)

  const [tabActive, setTabActive] = useState<string>('search')
  const [currentPage, setCurrentPage] = useState<number>(1)

  const listProductRender = useMemo(() => {
    let listProductMap: ProductInfo[] = []

    if (listProducts.length > 0) {
      if (tabActive === 'search') {
        listProducts?.forEach((product) => {
          listProductViewCount._productIds?.forEach((id, index) => {
            if (product.product.id === id) {
              listProductMap.push({
                ...product,
                productCount: +listProductViewCount?._productCount?.[index],
                timestamp: +listProductViewCount?._time?.[index]
              })
            }
          })
        })
      } else {
        listProducts?.forEach((product) => {
          listBestSeller?.forEach((item) => {
            if (product.product.id === item.productID) {
              listProductMap.push({
                ...product,
                sold: +item?.sold,
                timestamp: +item?.timestamp
              })
            }
          })
        })
      }
    }

    return listProductMap
  }, [listProducts, listBestSeller, listProductViewCount, tabActive])

  const listProductPagination = useMemo(
    () => getPagePagination(listProductRender, currentPage, 4),
    [listProductRender, currentPage]
  )

  const totalPages = useMemo(() => Math.ceil(listProductRender.length / 4), [listProductRender])

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }, [currentPage])

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }, [currentPage, totalPages])

  console.log('listProductPagination', listProductPagination)

  return (
    <div className='h-[310px] w-full rounded-[18px] bg-white/[.88] p-3 px-4 shadow-popover-custom backdrop-blur-[80px]'>
      <div className='flex items-center justify-between'>
        <div className='relative h-[36px] w-[236px] rounded-lg bg-[#D9D9D9]/[.22]'>
          <div className='relative z-20 flex h-full items-center'>
            {listFilters.map((i) => (
              <div
                key={i.value}
                onClick={() => setTabActive(i.value)}
                className={`flex h-full w-1/2 cursor-pointer items-center justify-center ${
                  tabActive === i.value ? 'font-customSemiBold text-white' : 'font-customMedium text-black-main'
                } transition-all duration-1000 ease-in-out`}
              >
                {i.label}
              </div>
            ))}
          </div>
          <span
            className={cn(
              'absolute top-1/2 z-10 h-8 w-[116px] -translate-y-1/2 transform rounded-md bg-ln-green-blue-to-r transition-all duration-1000 ease-in-out',
              tabActive === 'search' ? 'left-[2px]' : 'left-1/2'
            )}
          />
        </div>
        <div className='flex items-center gap-2'>
          <button className='cursor-pointer' onClick={handlePreviousPage}>
            <ChevronLeft className={`size-6 ${currentPage === 1 ? 'cursor-default opacity-[.64]' : 'opacity-100'}`} />
          </button>
          <button className='cursor-pointer' onClick={handleNextPage}>
            <ChevronRight
              className={`size-6 ${currentPage === totalPages ? 'cursor-default opacity-[.64]' : 'opacity-100'}`}
            />
          </button>
        </div>
      </div>

      <div className='mt-3 flex h-full w-full flex-col gap-3 px-[2px]'>
        {listProductPagination?.length > 0 ? (
          listProductPagination?.map((product, index) => (
            <ProductSerachPurchase key={index} product={product} isProductSearch={tabActive === 'search'} />
          ))
        ) : (
          <div className='flex h-full w-full flex-col items-center justify-center'>
            <NoDataIcon className='size-8' />
            <p className='text-black-main/[.76]'>No product found</p>
          </div>
        )}
      </div>
    </div>
  )
})

export default ListProductSearch
