import { FC } from 'react'

interface IFilterLayoutProps {
  title: string
  children: React.ReactNode
}

const FilterLayout: FC<IFilterLayoutProps> = ({ title, children }) => {
  return (
    <div className='flex w-full justify-between xs:mb-3 xs:flex-col xs:items-start xs:gap-3 sm:mb-3 sm:flex-col sm:gap-4 md:mb-3 md:flex-col md:gap-5 lg:mb-6 lg:flex-col xl:flex-row xl:items-center'>
      <h1 className='rp-title'>{title}</h1>
      <div className='flex flex-grow gap-2 xs:w-full xs:justify-start xl:w-fit xl:justify-end'>{children}</div>
    </div>
  )
}

export default FilterLayout
