import { memo } from 'react'
import OceanEffect from '~/components/loading/OceanEffect'
import Login from '~/components/login'

const SignIn = memo(() => {
  return (
    <div className='relative'>
      <div className='absolute inset-0 z-10'>
        <OceanEffect />
      </div>
      <div className='absolute inset-0 z-50 flex h-screen w-full p-5'>
        <div className='mx-auto my-auto min-h-[500px] rounded-3xl border-[2px] border-solid border-white/[.76] bg-white/[.76] p-5 pt-0 backdrop-blur-3xl xs:h-[95%] xs:w-[95%] sm:h-[90%] sm:w-[80%] md:h-[80%] lg:h-[80%] lg:w-[60%] xl:h-[700px]'>
          <div className='h-full overflow-hidden'>
            <Login />
          </div>
        </div>
      </div>
    </div>
  )
})

export default SignIn
