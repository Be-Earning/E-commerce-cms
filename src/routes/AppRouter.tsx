import { useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Role } from '~/@types/enums'
import { PATH_AUTH, PATH_ERROR, PATH_PRIVATE_APP } from '~/constants/paths'
import { useAppSelector } from '~/redux/configStore'
import PrivateRouter from './PrivateRouter'
import PublicRouter from './PublicRouter'
import { adminRoutes, publicRoutes, retailerRoutes } from './routes'

function AppRouter() {
  const { userRole } = useAppSelector((s) => s.user)

  const router = useMemo(() => (+userRole === Role.ADMIN ? adminRoutes : retailerRoutes), [userRole])

  return (
    <Routes>
      <Route element={<PrivateRouter />}>
        {router.map((layout) => (
          <Route key={layout.id} path='/' element={layout.layout}>
            <Route index element={<Navigate to={PATH_PRIVATE_APP.dashboard} replace />} />

            {layout.children.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        ))}
      </Route>

      <Route element={<PublicRouter />}>
        <Route index element={<Navigate to={PATH_AUTH.signin.root} replace />} />
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route path='*' element={<Navigate to={PATH_ERROR.notFound} replace />} />
    </Routes>
  )
}

export default AppRouter
