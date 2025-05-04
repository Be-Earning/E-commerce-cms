import { Navigate, Outlet } from 'react-router-dom'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import { useAppSelector } from '~/redux/configStore'

const PublicRouter = () => {
  const { activeWallet } = useAppSelector((s) => s.user)

  return !activeWallet ? <Outlet /> : <Navigate to={PATH_PRIVATE_APP.dashboard} />
}

export default PublicRouter
