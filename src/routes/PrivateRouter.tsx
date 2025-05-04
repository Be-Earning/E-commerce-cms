import { Navigate, Outlet } from 'react-router-dom'
import { PATH_AUTH } from '~/constants/paths'
import { useAppSelector } from '~/redux/configStore'

const PrivateRouter = () => {
  const { activeWallet } = useAppSelector((s) => s.user)

  // useEffect(() => {
  //   if (!(+userRole === Role.ADMIN || +userRole === Role.RETAILER)) {
  //     dispatch(clearActiveWallet())
  //     navigate(PATH_AUTH.signin.root)
  //     toast.error('No Permission Sign in')
  //   }
  // }, [userRole])

  return activeWallet ? <Outlet /> : <Navigate to={PATH_AUTH.signin.root} />
}

export default PrivateRouter
