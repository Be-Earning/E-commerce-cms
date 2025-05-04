import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const usePasteFromClipboard = () => {
  const [clipboardContent, setClipboardContent] = useState<string>('')

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setClipboardContent(text)
      toast.success('Pasted from clipboard')
    } catch (err) {
      toast.error('Failed to paste content from clipboard')
      console.error('Error reading clipboard: ', err)
    }
  }
  useEffect(() => {
    // Reset clipboard content after processing
    if (clipboardContent) {
      setClipboardContent('')
    }
  }, [clipboardContent])

  return { clipboardContent, pasteFromClipboard }
}
export default usePasteFromClipboard
