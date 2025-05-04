import { memo } from 'react'
import images from '~/assets'
import './styles.scss'

const GlobalWarranty = memo(() => {
  return (
    <div className='background-image relative flex h-[300px] w-[454px] flex-col items-center gap-5 rounded-[32px] bg-white/[.44] p-10 shadow-6xl backdrop-blur-2xl'>
      <h5 className='font-customBold text-[32px] capitalize'>global warranty</h5>
      <img src={images.icons.global_warranty} alt='global-warranty' className='size-[104px]' />
      {[
        'absolute top-[35%] right-[16%]',
        'absolute top-[40%] left-[22.2%]',
        'absolute bottom-[20%] left-[9%]',
        'absolute bottom-[18%] right-[9.5%]',
        'absolute bottom-[10%] right-[40%]'
      ].map((item, index) => (
        <div key={index} className={`absolute ${item} bg-rg-blue-green size-3 shrink-0 rounded-full`} />
      ))}
    </div>
  )
})

export default GlobalWarranty
