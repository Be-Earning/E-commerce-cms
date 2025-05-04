import { toPng } from 'html-to-image'
import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'
import ic_paste from '~/assets/icons/paste.svg'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import { useAppDispatch } from '~/redux/configStore'
import { fetchUserRole2, setActiveWallet } from '~/redux/user/user.slice'
import { convertStringToSeedPhrase } from '~/utils/convert'
import ButtonBottom from './component/ButtonBottom'
import Container from './component/Container'
import ModalSuccess from './component/ModalSuccess'
import UploadQR from './component/UploadQR'
import { Role } from '~/@types/enums'

interface ImportSeedphraseProps {
  onBack: () => void
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const ImportSeedphrase = memo(({ onBack, setIsLoading }: ImportSeedphraseProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const qrRef = useRef<any>(null)

  const [modalSuccess, setModalSuccess] = useState<boolean>(false)
  const [errorInput, setErrorInput] = useState<string>('')
  const [imageToShow, setImageToShow] = useState<string>('')
  const [customSeedphrase, setCustomSeedphrase] = useState<string>('')
  const [prikey, setPriKey] = useState<string>('')
  const [duplicateError, setDuplicateError] = useState<string>('')

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setCustomSeedphrase(value)

    const words = value.split(' ').filter((word) => word.trim() !== '')
    const duplicates = words.filter((word, index) => words.indexOf(word) !== index)

    if (value !== '' && words.length !== 24) {
      setErrorInput('Not enough 24 seed phrases, please check again!')
    } else {
      setErrorInput('')
    }

    if (duplicates.length > 0) {
      setErrorInput('Seed phrase contains duplicate words, please check again!')
    } else {
      setErrorInput('')
    }
  }, [])

  const handlePaste = useCallback(async () => {
    const string = await navigator.clipboard.readText()
    const textConvert = convertStringToSeedPhrase(string)
    const duplicates = textConvert.filter((word, index) => textConvert.indexOf(word) !== index)
    setCustomSeedphrase(textConvert.join(' '))
    if (duplicates.length > 0) {
      setErrorInput('Seed phrase contains duplicate words, please check again!')
    } else {
      setErrorInput('')
    }
  }, [])

  const handleSubmitSP = useCallback(async () => {
    setIsLoading(true)
    if (!customSeedphrase && !imageToShow) {
      toast.error('Please enter seed phrase or upload QR code')
    } else {
      if (customSeedphrase.split(' ').length === 24 && !duplicateError) {
        const res = await window.finSdk.call({ command: 'createWallet', value: { seed: customSeedphrase.split(' ') } })
        if (!res?.success || !res?.data) {
          setIsLoading(false)
          console.log('ressss Create wallet faile', res)
          toast.error('Signin faild! Try again.')
          return
        } else {
          setPriKey(res.data.privateKey)
          const resRole = await dispatch(fetchUserRole2(res.data.address.toLowerCase()))
          console.log('resRoleeeeeeeeeeeeeeeeeeee', resRole)
          if (resRole.payload) {
            if (
              +resRole.payload === Role.ADMIN ||
              +resRole.payload === Role.RETAILER ||
              +resRole.payload === Role.CONTROLLER
            ) {
              dispatch(setActiveWallet(res.data.address.toLowerCase()))
              navigate(PATH_PRIVATE_APP.dashboard)
              toast.success('Signin successfully!')
            } else {
              toast.error('No permission! Wallet address must be Admin or Retailer!')
            }
          } else {
            toast.error('Signin faild! Try again.')
          }
        }
      } else {
        toast.error('Invalid QR seed phrase!')
      }
    }
    setIsLoading(false)
  }, [customSeedphrase, imageToShow, duplicateError])

  useEffect(() => {
    ;(async () => {
      if (qrRef.current !== null && modalSuccess) {
        console.log('generating QR')
        console.log('prikey', prikey)
        try {
          const dataUrl = await toPng(qrRef.current)
          const link = document.createElement('a')
          link.href = dataUrl
          const time = new Date().getTime()
          link.download = `private_key_${time}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } catch (error) {
          toast.error('Error generating QR private key!')
          console.error('Error generating QR code image', error)
        }
      }
    })()
  }, [qrRef, modalSuccess])

  return (
    <>
      <Container className='wrapper-content flex flex-col gap-3 overflow-y-auto pt-5 text-[1.25rem]/[1.5rem] text-[#0D0D0D]'>
        <span className='mb-2 font-customSemiBold text-[1.25rem]/[27.3px]'>Import with Seed Phrase!</span>
        <div className='max-h-[350px] min-h-[180px]'>
          <div className='relative h-[95%] rounded-[8.4px] bg-white p-3'>
            <textarea
              className='h-full w-full text-[1rem]'
              placeholder='Enter 24 seed phrase'
              value={customSeedphrase}
              onChange={handleOnChange}
            />
            {customSeedphrase === '' && (
              <img src={ic_paste} className='absolute right-2 top-2 h-6 w-6' onClick={handlePaste} />
            )}
          </div>
          {errorInput && <div className='h-[18px] text-[0.8rem] text-red-500'>{errorInput}</div>}
        </div>
        <UploadQR imageToShow={imageToShow} setImageToShow={setImageToShow} setCustomSeedphrase={setCustomSeedphrase} />
      </Container>

      <ButtonBottom
        title='Confirm'
        onBack={() => {
          onBack()
          setCustomSeedphrase('')
          setImageToShow('')
          setErrorInput('')
          setDuplicateError('')
        }}
        onNext={handleSubmitSP}
        className='pt-5'
      />

      {prikey !== '' && (
        <div className='opacity-0'>
          <QRCode ref={qrRef} size={188} value={prikey} viewBox={`0 0 188 188`} />
        </div>
      )}

      {modalSuccess && (
        <ModalSuccess
          onClose={() => {
            onBack()
            setImageToShow('')
            setCustomSeedphrase('')
            setErrorInput('')
            setDuplicateError('')
            setModalSuccess(false)
          }}
        />
      )}
    </>
  )
})

export default ImportSeedphrase
