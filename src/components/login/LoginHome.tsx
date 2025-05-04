import { Dispatch, memo, SetStateAction, useState } from 'react'
import ic_block from '~/assets/icons/blockChain.svg'
import ic_pk from '~/assets/icons/priKey.svg'
import Anime from './component/Anime'
import ButtonLogin from './component/ButtonLogin'
import Container from './component/Container'
import { cn } from '~/utils/classNames'

interface LoginHomeProps {
  setStep: Dispatch<SetStateAction<number>>
}

const LoginHome = memo(({ setStep }: LoginHomeProps) => {
  const [tab, setTab] = useState<number>(0)

  return (
    <>
      <div className='relative flex w-full text-[24px]/[26px] text-[#0D0D0D]/[.64]'>
        <button
          className={cn(
            tab === 0 && 'w-full text-center font-customSemiBold text-[#0D0D0D]',
            'h-[68px] w-1/2 text-center'
          )}
          onClick={() => setTab(0)}
        >
          Import an <br className='xs:flex sm:hidden' /> existing wallet
        </button>
        <span className={cn('absolute bottom-0 left-0 h-[1px] w-full bg-[#0D0D0D]/[.44]')}></span>
        <span
          className={cn('absolute bottom-[-0.5px] h-[2px] w-full', tab === 0 ? 'left-0' : 'left-1/2')}
          style={{ background: 'linear-gradient(270deg, #5495FC 0%, #31D366 100%)', transition: 'left 0.8s' }}
        ></span>
      </div>

      <Container>
        <Anime isOpen={tab === 0} className={tab !== 0 ? 'hidden' : 'block'}>
          <div className='mt-5 w-full'>
            <div className='mt-2 text-[18px]/[24px] text-[#0D0D0D]/[.64]'>
              Import an existing wallet to quickly access and manage your funds for seamless shopping.
            </div>
          </div>
          <div className='mt-5 flex flex-col gap-3'>
            <ButtonLogin
              icon={ic_block}
              content='Import with Seed Phrase'
              onClick={() => {
                setStep(2)
              }}
            />

            <ButtonLogin
              icon={ic_pk}
              content={'Import with Private Key'}
              onClick={() => {
                setStep(3)
              }}
            />
          </div>
        </Anime>
      </Container>
    </>
  )
})

export default LoginHome
