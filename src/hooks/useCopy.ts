import toast from 'react-hot-toast'

const useCopy = () => {
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied')
    } catch (error) {
      toast.error('Copy failed!')
      console.log('Error copying text: ', error)
    }
  }

  return {
    copyToClipboard
  }
}

export default useCopy
