import { isEmpty } from 'lodash'
import toast from 'react-hot-toast'
import { LOCAL_STORAGE } from '~/constants/localStorage'
import { getUserRole, mController } from '~/contract/functionSmc'
import { setLocalStorage } from '~/utils/localStorage'

const useCheckRole = () => {
  const getRole = async (address: string) => {
    try {
      const res = await getUserRole(address)
      if (!res.success) {
        if (res.message) toast.error(res.message)
        return false
      }
      if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.USER_ROLE, res.data)
      return res.data || null
    } catch (error) {
      console.log('Error fetchUserRole', error)
      return false
    }
  }

  const getController = async (address: string) => {
    try {
      const res = await mController(address)
      if (!res.success) {
        if (res.message) toast.error(res.message)
        return false
      }
      if (res.data && !isEmpty(res.data)) setLocalStorage(LOCAL_STORAGE.USER_CONTROLER, res.data)
      return res.data || null
    } catch (error) {
      console.log('getController fails', error)
      return false
    }
  }
  return {
    getRole,
    getController
  }
}

export default useCheckRole
