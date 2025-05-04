import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { LOCAL_STORAGE } from '~/constants/localStorage'
import { PATH_AUTH } from '~/constants/paths'
import { removeWalletByAddress } from '~/core'
import { useAppDispatch, useAppSelector } from '~/redux/configStore'
import { clearActiveWallet, deleteProfile } from '~/redux/user/user.slice'
import { removeLocalStorage } from '~/utils/localStorage'

const useLogout = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { activeWallet } = useAppSelector((s) => s.user)

  const handleLogout = useCallback(async () => {
    try {
      await removeWalletByAddress(activeWallet)
      navigate(PATH_AUTH.signin.root)
      dispatch(clearActiveWallet())
      dispatch(deleteProfile())
      removeLocalStorage(LOCAL_STORAGE.USER_INFO)
    } catch (error) {
      console.log('removeWalletByAddress error', error)
      toast.error('Logout failed!')
    }
  }, [])

  return {
    handleLogout
  }
}

export default useLogout
