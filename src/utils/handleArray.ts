import { Capacity, ColorSize } from '~/@types/models'

export const getPagePagination = (items: any[], pageNumber: number, itemsPerPage: number): any[] => {
  const startIndex = (pageNumber - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return items.slice(startIndex, endIndex)
}

export function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffledArray = [...array].sort(() => 0.5 - Math.random())
  return shuffledArray.slice(0, count)
}

export function findAllDuplicateColorSize(arr: ColorSize[]): number[] {
  const duplicatesMap = new Map<string, number[]>()
  const duplicates: number[] = []

  // Lưu chỉ số của các phần tử có cùng color và size
  arr.forEach((item, idx) => {
    const key = `${item.color}-${item.size}`

    if (duplicatesMap.has(key)) {
      // Nếu key đã tồn tại, thêm chỉ số hiện tại vào mảng các chỉ số trùng lặp
      duplicatesMap.get(key)?.push(idx)
    } else {
      // Nếu key chưa tồn tại, tạo mảng mới cho key đó
      duplicatesMap.set(key, [idx])
    }
  })

  // Lọc các nhóm chỉ số có nhiều hơn 1 phần tử
  duplicatesMap.forEach((indices) => {
    if (indices.length > 1) {
      duplicates.push(...indices)
    }
  })

  return duplicates
}
export function findAllDuplicateCapacity(arr: Capacity[]): number[] {
  const duplicatesMap = new Map<string, number[]>()
  const duplicates: number[] = []

  // Lưu chỉ số của các phần tử có cùng color và size
  arr.forEach((item, idx) => {
    const key = `${item.valueCapacity}`

    if (duplicatesMap.has(key)) {
      // Nếu key đã tồn tại, thêm chỉ số hiện tại vào mảng các chỉ số trùng lặp
      duplicatesMap.get(key)?.push(idx)
    } else {
      // Nếu key chưa tồn tại, tạo mảng mới cho key đó
      duplicatesMap.set(key, [idx])
    }
  })

  // Lọc các nhóm chỉ số có nhiều hơn 1 phần tử
  duplicatesMap.forEach((indices) => {
    if (indices.length > 1) {
      duplicates.push(...indices)
    }
  })

  return duplicates
}
