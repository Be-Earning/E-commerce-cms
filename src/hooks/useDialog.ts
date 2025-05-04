import { useCallback, useState } from 'react'

function useDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOpen = useCallback(() => {
    setIsOpen(!isOpen)
  }, [])

  return { handleOpen, setIsOpen, isOpen }
}

export default useDialog
