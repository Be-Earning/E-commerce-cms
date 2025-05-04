import { memo, useState } from 'react'
import { LoadingScreen } from '../loading'
import AnimationPage from './component/AnimationPage'
import ImportPrivateKey from './ImportPrivateKey'
import ImportSeedphrase from './ImportSeedphrase'
import LoginHome from './LoginHome'
import { cn } from '~/utils/classNames'

const Login = memo(() => {
  const [step, setStep] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <>
      {isLoading && (
        <div className='fixed bottom-0 left-0 right-0 top-0 z-[2000]'>
          <LoadingScreen />
        </div>
      )}

      <div className='relative flex h-full w-full justify-end'>
        <div
          className={cn('relative flex h-full w-full overflow-hidden', step === 1 && 'pt-0')}
          onClick={(e) => e.stopPropagation()}
        >
          <AnimationPage isVisble={step === 1} className={step === 1 ? 'flex' : 'hidden'} homePage={true}>
            <LoginHome setStep={setStep} />
          </AnimationPage>
          <AnimationPage isVisble={step === 2} className={step === 2 ? 'flex' : 'hidden'}>
            <ImportSeedphrase onBack={() => setStep(1)} setIsLoading={setIsLoading} />
          </AnimationPage>
          <AnimationPage isVisble={step === 3} className={step === 3 ? 'flex' : 'hidden'}>
            <ImportPrivateKey onBack={() => setStep(1)} setIsLoading={setIsLoading} />
          </AnimationPage>
        </div>
      </div>
    </>
  )
})

export default Login
