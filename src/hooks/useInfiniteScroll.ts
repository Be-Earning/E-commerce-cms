import { useCallback, useEffect, useState } from 'react'
import { IOrder } from '~/@types/models'
interface IUseInfiniteScroll {
  items: IOrder[]
  query?: Element | string | null
  itemsPerPage: number
}

/**
 * 
 * @param items Mảng dữ liệu ban đầu
 * @param query Element cần thực hiện sự kiện cuộn trang
 * @param itemsPerPage Số lượng item hiển thị mỗi lần cuộn
 * @returns 
 *  - itemsData: Mảng dữ liệu hiển thị
 *  - startIndex: Index của mục đầu tiên được hiển thị
 *  - hasMoreData: Kiểm tra xem còn dữ liệu để tải thêm không
 *  @example
 * ```tsx
 * 
 *   const { itemsData } = useInfiniteScroll({
      items: itemsDataGallery,
      itemsPerPage: 10,
      query: document.querySelector('.order-content')
    });
 * ```
 * 
 */
const useInfiniteScroll = ({ items, query, itemsPerPage = 1 }: IUseInfiniteScroll) => {
  const [startIndex, setStartIndex] = useState(0) // Index của mục đầu tiên được hiển thị
  const [hasMoreData, setHasMoreData] = useState(true) // Kiểm tra xem còn dữ liệu để tải thêm không

  // Xử lý sự kiện cuộn trang
  const handleScroll = useCallback(() => {
    if (typeof query === 'object' && query instanceof Element) {
      const element = query as HTMLElement
      const bottom = Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight
      if (bottom && hasMoreData) {
        setStartIndex((prevIndex) => prevIndex + itemsPerPage)
      }
    } else {
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
      if (bottom && hasMoreData) {
        setStartIndex((prevIndex) => prevIndex + itemsPerPage)
      }
    }
  }, [query, hasMoreData, itemsPerPage, setStartIndex])

  // Kiểm tra xem có dữ liệu để tải thêm không
  useEffect(() => {
    // Điều kiện để kiểm tra xem còn dữ liệu không
    if (items.length <= startIndex + itemsPerPage) {
      setHasMoreData(false)
    } else {
      setHasMoreData(true)
    }
  }, [startIndex, items, items.length])

  useEffect(() => {
    if (query && typeof query !== 'string') {
      const element = query as HTMLElement
      element.addEventListener('scroll', handleScroll)
      return () => {
        element.removeEventListener('scroll', handleScroll)
      }
    } else {
      window.addEventListener('scroll', handleScroll)
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll, query])

  return {
    itemsData: items.slice(0, startIndex + itemsPerPage),
    startIndex,
    hasMoreData
  }
}

export default useInfiniteScroll
