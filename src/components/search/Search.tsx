import _ from 'lodash'
import * as React from 'react'
import IconSearch from '~/components/icons/SearchIcon'
import { cn } from '~/utils/classNames'

interface ISearchProps {
  placeHolder?: string
  onSearch?: (value: string) => void
  className?: string
}

const Search: React.FunctionComponent<ISearchProps> = ({ placeHolder = 'Search ID...', onSearch, className }) => {
  const handleOnSearch = _.debounce((value: string) => {
    if (onSearch) {
      onSearch(value)
    }
  }, 400)

  return (
    <div className={cn('relative h-full w-full xl:max-w-sm', className)}>
      <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center gap-2 ps-3'>
        <IconSearch className='size-4' />
        <div className='h-1/2 w-[1px] bg-gray-lighter' />
      </div>
      <input
        type='search'
        id='default-search'
        className={cn(
          'block w-full rounded-lg border border-gray-300 px-3 py-2.5 ps-12 text-sm text-gray-900 shadow-1xl xs:h-10 sm:h-11 md:h-12'
        )}
        placeholder={placeHolder}
        required
        onChange={(e) => handleOnSearch(e.target.value)}
      />
    </div>
  )
}

export default Search
