import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Role } from './@types/enums'
import { LoadingMain } from './components/loading'
import useLogout from './hooks/useLogout'
import { useAppDispatch, useAppSelector } from './redux/configStore'
import { fetchRootPublic } from './redux/root/root.slice'
import AppRouter from './routes/AppRouter'

function App() {
  const dispatch = useAppDispatch()

  const { isFinish } = useAppSelector((s) => s.root)
  const { userRole } = useAppSelector((s) => s.user)
  const [percent, setPercent] = useState<string>('')
  const [loadingSdk, setLoadingSdk] = useState(false)
  const { handleLogout } = useLogout()

  useEffect(() => {
    // setLoadingSdk(true)
    // dispatch(fetchRootPublic())
    // setPercent('100%')

    window.finSdk.init({
      onProgress: (percent: any) => {
        console.log('onProgress', percent)
        setPercent(percent)
      },
      onFinish: async () => {
        setLoadingSdk(true)
        await dispatch(fetchRootPublic())
      },
      onError: (id: any) => {
        console.log('onError', id)
      }
    })
  }, [])

  useEffect(() => {
    if (!isFinish) return
    if (+userRole !== Role.ADMIN && +userRole !== Role.RETAILER) {
      handleLogout()
    }
  }, [isFinish, userRole])

  return (
    <main className='h-full w-full bg-white'>
      {isFinish || loadingSdk ? <AppRouter /> : <LoadingMain isOpen={!isFinish || !loadingSdk} percent={percent} />}

      <Toaster
        position='top-center'
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              border: '0px solid #ffffff',
              color: '#ffffff',
              background: 'linear-gradient(270deg, #5495FC 0%, #31D366 100%)'
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#60EC8E'
            }
          }
        }}
      />
    </main>
  )
}

export default App
