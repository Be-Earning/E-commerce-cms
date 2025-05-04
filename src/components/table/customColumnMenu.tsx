import { Popover } from '@mui/material'
import React, { useState } from 'react'
import { CheckIcon } from '../icons'

interface ProductFilterPopoverProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  onSelectOption: (value: string) => void
}
interface StatusPopoverProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  onSelectOption: (value: string) => void
}
interface DateProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  onSelectOption: (value: string) => void
}

const ProductFilterPopover: React.FC<ProductFilterPopoverProps> = ({ anchorEl, onClose, onSelectOption }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const open = Boolean(anchorEl)

  const handleSelectOption = (value: string) => {
    setSelectedOption(value)
    onSelectOption(value)
  }

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: -17,
        horizontal: 'center'
      }}
    >
      <div className='left-5 flex w-[216px] flex-col divide-x-0 divide-y divide-solid divide-gray-calendar rounded-xl border border-solid border-gray-main bg-white'>
        <button
          className={`flex h-11 w-full items-center justify-between px-3 ${selectedOption === 'all' ? 'bg-gray-100/[.7]' : ''}`}
          onClick={() => handleSelectOption('all')}
        >
          <span>All Products</span>
          {selectedOption === 'all' && <CheckIcon className='size-[20px]' />}
        </button>

        <button
          className={`flex h-11 w-full items-center justify-between px-3 ${selectedOption === 'flashSale' ? 'bg-gray-100/[.7]' : ''}`}
          onClick={() => handleSelectOption('flashSale')}
        >
          <span>Flash Sale</span>
          {selectedOption === 'flashSale' && <CheckIcon className='size-[20px]' />}
        </button>
        <button
          className={`flex h-11 w-full items-center justify-between px-3 ${selectedOption === 'newProduct' ? 'bg-gray-100/[.7]' : ''}`}
          onClick={() => handleSelectOption('newProduct')}
        >
          <span>New Product</span>
          {selectedOption === 'newProduct' && <CheckIcon className='size-[20px]' />}
        </button>
      </div>
    </Popover>
  )
}

const StatusPopover: React.FC<StatusPopoverProps> = ({ anchorEl, onClose, onSelectOption }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const open = Boolean(anchorEl)

  const handleSelectOption = (value: string) => {
    setSelectedOption(value)
    onSelectOption(value)
  }

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: -17,
        horizontal: 'center'
      }}
    >
      <div className='left-5 flex w-[216px] flex-col divide-x-0 divide-y divide-solid divide-gray-calendar border border-solid border-gray-main bg-white'>
        <button
          className={`flex h-11 w-full items-center justify-between px-3 ${selectedOption === 'allStatus' ? 'bg-gray-100/[.7]' : ''}`}
          onClick={() => handleSelectOption('allStatus')}
        >
          <span>All Status</span>
          {selectedOption === 'allStatus' && <CheckIcon className='size-[20px]' />}
        </button>
        <button
          className={`flex h-11 w-full items-center justify-between px-3 ${selectedOption === 'pending' ? 'bg-gray-100/[.7]' : ''}`}
          onClick={() => handleSelectOption('pending')}
        >
          <span>Pending</span>
          {selectedOption === 'pending' && <CheckIcon className='size-[20px]' />}
        </button>
        <button
          className={`flex h-11 w-full items-center justify-between px-3 ${selectedOption === 'approve' ? 'bg-gray-100/[.7]' : ''}`}
          onClick={() => handleSelectOption('approve')}
        >
          <span>Approve</span>
          {selectedOption === 'approve' && <CheckIcon className='size-[20px]' />}
        </button>
      </div>
    </Popover>
  )
}

const DatePopover: React.FC<DateProps> = ({ anchorEl, onClose, onSelectOption }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const open = Boolean(anchorEl)

  const handleSelectOption = (value: string) => {
    setSelectedOption(value)
    onSelectOption(value)
  }

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: -17,
        horizontal: 'center'
      }}
    >
      <div className='left-5 flex w-[216px] flex-col divide-x-0 divide-y divide-solid divide-gray-calendar border border-solid border-gray-main bg-white'>
        <button
          className={`flex h-11 w-full items-center justify-between px-3 ${selectedOption === 'newestToOldest' ? 'bg-gray-100/[.7]' : ''}`}
          onClick={() => handleSelectOption('newestToOldest')}
        >
          <span>Newest To Oldest</span>
          {selectedOption === 'newestToOldest' && <CheckIcon className='size-[20px]-[20px]' />}
        </button>
        <button
          className={`flex h-11 w-full items-center justify-between px-3 ${selectedOption === 'oldestToNewest' ? 'bg-gray-100/[.7]' : ''}`}
          onClick={() => handleSelectOption('oldestToNewest')}
        >
          <span>Oldest To Newest</span>
          {selectedOption === 'oldestToNewest' && <CheckIcon className='size-[20px]-[20px]' />}
        </button>
      </div>
    </Popover>
  )
}

const CustomerPopover: React.FC<DateProps> = ({ anchorEl, onClose, onSelectOption }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const open = Boolean(anchorEl)

  const handleSelectOption = (value: string) => {
    setSelectedOption(value)
    onSelectOption(value)
  }

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: -17,
        horizontal: 'center'
      }}
    >
      <div className='left-5 flex w-[230px] flex-col divide-x-0 divide-y divide-solid divide-gray-calendar'>
        <button
          className={`flex w-full items-center justify-between px-[20px] py-3 font-normal ${selectedOption === 'AtoZ' ? 'bg-gray-100' : ''}`}
          onClick={() => handleSelectOption('AtoZ')}
        >
          <span>A to Z</span>
          {selectedOption === 'AtoZ' && <CheckIcon className='h-[20px] w-[20px]' />}
        </button>
        <button
          className={`flex w-full items-center justify-between px-[20px] py-3 font-normal ${selectedOption === 'ZtoA' ? 'bg-gray-100' : ''}`}
          onClick={() => handleSelectOption('ZtoA')}
        >
          <span>Z to A</span>
          {selectedOption === 'ZtoA' && <CheckIcon className='h-[20px] w-[20px]' />}
        </button>
      </div>
    </Popover>
  )
}

const PricePopover: React.FC<DateProps> = ({ anchorEl, onClose, onSelectOption }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const open = Boolean(anchorEl)

  const handleSelectOption = (value: string) => {
    setSelectedOption(value)
    onSelectOption(value)
  }

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: -17,
        horizontal: 'center'
      }}
    >
      <div className='left-5 flex w-[230px] flex-col divide-x-0 divide-y divide-solid divide-gray-calendar'>
        <button
          className={`flex w-full items-center justify-between px-[20px] py-3 font-normal ${selectedOption === 'LowestToHighest' ? 'bg-gray-100' : ''}`}
          onClick={() => handleSelectOption('LowestToHighest')}
        >
          <span>Lowest to Highest</span>
          {selectedOption === 'LowestToHighest' && <CheckIcon className='h-[20px] w-[20px]' />}
        </button>
        <button
          className={`flex w-full items-center justify-between px-[20px] py-3 font-normal ${selectedOption === 'HighestToLowest' ? 'bg-gray-100' : ''}`}
          onClick={() => handleSelectOption('HighestToLowest')}
        >
          <span>Highest to Lowest</span>
          {selectedOption === 'HighestToLowest' && <CheckIcon className='h-[20px] w-[20px]' />}
        </button>
      </div>
    </Popover>
  )
}

export { DatePopover, StatusPopover, ProductFilterPopover, CustomerPopover, PricePopover }
