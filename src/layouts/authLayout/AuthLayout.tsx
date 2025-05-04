import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import OceanEffect from '~/components/loading/OceanEffect'

const AuthLayout = memo(() => {
  return (
    <div className='relative'>
      <div className='absolute inset-0 z-10'>
        <OceanEffect />
      </div>
      <div className='absolute inset-0 z-50 flex h-screen w-full'>
        <div className='mx-auto my-auto h-[600px] w-[40%] rounded-3xl border-[2px] border-solid border-white/[.76] bg-white/[.76] p-10 pt-0 backdrop-blur-3xl'>
          <Outlet />
        </div>
      </div>
    </div>
  )
})

export default AuthLayout
