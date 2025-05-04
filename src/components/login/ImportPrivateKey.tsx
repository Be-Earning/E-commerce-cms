import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Role } from '~/@types/enums'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import { useAppDispatch } from '~/redux/configStore'
import { fetchUserRole2, setActiveWallet } from '~/redux/user/user.slice'
import ButtonBottom from './component/ButtonBottom'
import Container from './component/Container'
import Input from './component/Input'
import ModalSuccess from './component/ModalSuccess'
import UploadQR from './component/UploadQR'

interface ImportPrivateKeyProps {
  onBack: () => void
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const ImportPrivateKey = memo(({ onBack, setIsLoading }: ImportPrivateKeyProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [priKey, setPriKey] = useState<string>('')
  const [imageToShow, setImageToShow] = useState<string>('')
  const [modalSuccess, setModalSuccess] = useState<boolean>(false)

  const handleImportPK = useCallback(async () => {
    setIsLoading(true)
    if (!priKey && !imageToShow) {
      toast.error('Please enter private key or upload QR code')
    } else {
      const res: any = await window.finSdk.call({
        command: 'createWalletFromPrivateKey',
        value: { privateKey: priKey }
      })
      console.log('res---', res)
      if ((!res.success && res.data && res.code.includes('60')) || res.success) {
        const resRole = await dispatch(fetchUserRole2(res.data.address.toLowerCase()))
        console.log('resRoleeeeeeeeeeeeeeeeeeee', resRole)
        if (resRole && resRole.payload) {
          console.log('go herererer ?')
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
          toast.error(res.message)
        }
      } else {
        setIsLoading(false)
        toast.error(res.message)
        return
      }
    }
    setIsLoading(false)
  }, [priKey, imageToShow])

  return (
    <>
      <Container className='wrapper-content flex flex-col gap-3 overflow-y-auto pt-5 text-[1.25rem]/[1.5rem] text-[#0D0D0D]'>
        <span className='font-customSemiBold text-[1.25rem]/[1.5rem]'>Import with Private Key!</span>
        <Input
          placeholder='Enter private key'
          value={priKey}
          onInputChange={(e) => {
            setPriKey(e.target.value)
            setImageToShow('')
          }}
        />

        <UploadQR imageToShow={imageToShow} setImageToShow={setImageToShow} setPriKey={setPriKey} />
      </Container>

      <ButtonBottom title='Confirm' className='pt-5' onBack={() => onBack()} onNext={handleImportPK} />

      {modalSuccess && (
        <ModalSuccess
          onClose={() => {
            onBack()
            setPriKey('')
            setImageToShow('')
            setModalSuccess(false)
          }}
        />
      )}
    </>
  )
})

export default ImportPrivateKey
