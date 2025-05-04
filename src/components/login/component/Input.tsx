import { memo, useCallback } from 'react'
import ic_delete from '~/assets/icons/close.svg'
import ic_paste from '~/assets/icons/paste.svg'

interface InputProps {
  placeholder: string
  value?: string
  onInputChange: (e: any) => void
}

const Input = memo(({ placeholder, value, onInputChange }: InputProps) => {
  const handlePaste = useCallback(async () => {
    const text = await navigator.clipboard.readText()
    onInputChange({ target: { value: text } })
  }, [])

  const handleRemove = useCallback(async () => {
    onInputChange({ target: { value: '' } })
  }, [])

  return (
    <div className='relative flex w-full items-center rounded-lg bg-[#FFFFFF]'>
      <input
        className='grow rounded-lg bg-transparent p-3 text-[1rem] focus:outline-none'
        placeholder={placeholder}
        value={value}
        onChange={onInputChange}
      />
      {value === '' ? (
        <img src={ic_paste} className='mx-3 h-6 w-6' onClick={handlePaste} />
      ) : (
        <img src={ic_delete} className='mx-3 h-3 w-3 cursor-pointer' onClick={handleRemove} />
      )}
    </div>
  )
})

export default Input
