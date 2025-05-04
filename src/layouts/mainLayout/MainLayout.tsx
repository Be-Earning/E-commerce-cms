import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/header'

const MainLayout = memo(() => {
  return (
    <main className='container h-full min-h-screen bg-gray-light'>
      <Header />
      <Outlet />
    </main>
  )
})

export default MainLayout
