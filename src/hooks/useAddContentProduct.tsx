import { useState, useCallback, useEffect, useRef } from 'react'
import { DialogRef } from '~/components/dialog/Dialog'
import { useAppDispatch } from '~/redux/configStore'
import { setEditing } from '~/redux/product/product.slice'

interface ItemWithId {
  id: number
}

type UseAddContentProductProps<T extends ItemWithId> = {
  items: T[]
  defaultIdsLength: number
}

export function useAddContentProduct<T extends ItemWithId>({ items, defaultIdsLength }: UseAddContentProductProps<T>) {
  const dispatch = useAppDispatch()

  const dialogRef = useRef<DialogRef>(null)

  // const defaultIds = [1, 2, 3]
  const defaultIds = Array.from({ length: defaultIdsLength }).map((_, i) => i + 1)

  const [index, setIndex] = useState<number>(0)
  const [indices, setIndices] = useState<number[]>(defaultIds)

  useEffect(() => {
    const newIndices = Array.from({ length: items.length }, (_, i) => i + 1)

    if (newIndices.length >= defaultIdsLength) {
      setIndices(newIndices)
    } else {
      setIndices(defaultIds)
    }
  }, [items])

  const handleAddItem = useCallback(() => {
    setIndices((prev) => {
      const maxIndex = prev.length > 0 ? Math.max(...prev) : 0
      return [...prev, maxIndex + 1]
    })
  }, [])

  const handleDeleteItem = useCallback(
    (indexToDelete: number) => {
      setIndices((prev) => {
        const newIndices = prev.filter((id) => id !== indexToDelete)
        return newIndices.length >= defaultIds.length ? newIndices.map((_, idx) => idx + 1) : defaultIds
      })
    },
    [setIndices, defaultIds]
  )

  const handleOpenModal = useCallback(
    (index: number, itemData: T | undefined) => {
      setIndex(index)
      dialogRef.current?.open()
      dispatch(setEditing(Boolean(itemData)))
    },
    [dispatch]
  )

  return {
    index,
    indices,
    dialogRef,
    handleAddItem,
    handleDeleteItem,
    handleOpenModal
  }
}
