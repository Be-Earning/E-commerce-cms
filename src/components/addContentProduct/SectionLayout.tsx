import { FC, memo } from 'react'

interface SectionLayoutProps {
  title: string
  children: React.ReactNode
  actionContent: string
  onClick: () => void
}

const SectionLayout: FC<SectionLayoutProps> = memo(({ title, children, actionContent, onClick }) => {
  return (
    <div className='xs:space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6'>
      <h5 className='font-customSemiBold capitalize xs:text-[22px]/[22px] sm:text-[24px]/[24px] md:text-[28px]/[28px] lg:text-[32px]/[32px]'>
        {title} <span className='text-red-dark'>*</span>
      </h5>
      {children}
      <button className='mt-4' onClick={onClick}>
        <p className='text-blue-dark xs:text-[16px] sm:text-[17px] md:text-[17px] lg:text-[18px]/[26px]'>
          + <span className='underline'>More {actionContent}</span>
        </p>
      </button>
    </div>
  )
})

export default SectionLayout
