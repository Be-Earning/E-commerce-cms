import { Box, Pagination, PaginationItem, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef, GridColumnMenu } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'
import ChevronBottomIcon from '~/assets/icons/chevron-bot.svg'
import useResponsive from '~/hooks/useResponsive'
import NoDataIcon from '../icons/NoDataIcon'
import { CustomerPopover, DatePopover, PricePopover, ProductFilterPopover, StatusPopover } from './customColumnMenu'

type CustomGridColDef = GridColDef & {
  filterComponent?: string
}

interface DataTableProps {
  rows: any[]
  columns: CustomGridColDef[]
  pageSizes: number
  title?: string
  model?: string
  tableHeight?: number
  rowHeight?: number
  hasHeaderTable?: boolean
  isLoading?: boolean
  onRowClick?: (data) => void
}

export default function DataTable({
  rows = [],
  columns = [],
  pageSizes,
  title,
  model = 'orders',
  hasHeaderTable,
  tableHeight,
  rowHeight,
  isLoading,
  onRowClick
}: Readonly<DataTableProps>) {
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filters, setFilters] = useState({})
  const [productFilterAnchorEl, setProductFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [statusFilterAnchorEl, setStatusFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [dateFilterAnchorEl, setDateFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [customerFilterAnchorEl, setCustomerFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [priceFilterAnchorEl, setPriceFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [currentFilterField, setCurrentFilterField] = useState<string | null>(null)

  console.log('filters', filters)

  const lgDown = useResponsive('down', 'lg')
  const mdDown = useResponsive('down', 'md')
  const smDown = useResponsive('down', 'sm')

  // Hide column menu
  function CustomColumnMenu(props) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
          columnMenuColumnsItem: null
        }}
      />
    )
  }

  // Calculate category counts
  // const categoryCounts = useMemo(() => {
  //   return rows.reduce(
  //     (acc, row) => {
  //       acc[row.category] = (acc[row.category] || 0) + 1
  //       return acc
  //     },
  //     {} as Record<string, number>
  //   )
  // }, [rows])

  // Filter rows based on the selected category
  const filteredRows = useMemo(() => {
    if (!selectedCategory) return rows

    return rows
      .filter((row) => {
        if (selectedCategory === 'all' || selectedCategory === 'allStatus') return true
        if (selectedCategory === 'flashSale') return row.isFlashSale
        if (
          selectedCategory === 'newProduct' ||
          selectedCategory === 'newestToOldest' ||
          selectedCategory === 'oldestToNewest'
        )
          return row.createdAt
        if (selectedCategory === 'approve') return row.status === 'Approve'
        if (selectedCategory === 'pending') return row.status === 'Pending'
        if (selectedCategory === 'AtoZ' || selectedCategory === 'ZtoA') return row.fullName
        if (selectedCategory === 'LowestToHighest' || selectedCategory === 'HighestToLowest') return row.vipPrice
        return false
      })
      .sort((a, b) => {
        if (selectedCategory === 'newProduct' || selectedCategory === 'newestToOldest') {
          return +b.createdAt - +a.createdAt
        }
        if (selectedCategory === 'oldestToNewest') {
          return +a.createdAt - +b.createdAt
        }
        if (selectedCategory === 'AtoZ') {
          return a.fullName.localeCompare(b.fullName)
        } else if (selectedCategory === 'ZtoA') {
          return b.fullName.localeCompare(a.fullName)
        }
        if (selectedCategory === 'LowestToHighest') {
          return +a.vipPrice - +b.vipPrice
        }
        if (selectedCategory === 'HighestToLowest') {
          return +b.vipPrice - +a.vipPrice
        }
        return 0
      })
  }, [rows, selectedCategory])

  console.log('filteredRows', filteredRows)

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value
    }))
  }

  const renderFilterComponent = (column) => {
    if (column.filterComponent === 'ProductFilter') {
      return (
        <div onClick={(event) => handleOpenProductFilterPopover(event, column.field)} className='cursor-pointer'>
          <img src={ChevronBottomIcon} alt='chevron-bottom' className='opacity-[.64] xs:size-5 sm:size-6' />
        </div>
      )
    } else if (column.filterComponent === 'StatusFilter') {
      return (
        <div onClick={(event) => handleOpenStatusFilterPopover(event, column.field)} className='cursor-pointer'>
          <img src={ChevronBottomIcon} alt='chevron-bottom' className='opacity-[.64] xs:size-5 sm:size-6' />
        </div>
      )
    } else if (column.filterComponent === 'DateFilter') {
      return (
        <div onClick={(event) => handleOpenDateFilterPopover(event, column.field)} className='cursor-pointer'>
          <img src={ChevronBottomIcon} alt='chevron-bottom' className='opacity-[.64] xs:size-5 sm:size-6' />
        </div>
      )
    } else if (column.filterComponent === 'CustomerFilter') {
      return (
        <div onClick={(event) => handleOpenCustomerFilterPopover(event, column.field)} className='cursor-pointer'>
          <img src={ChevronBottomIcon} alt='chevron-bottom' className='opacity-[.64] xs:size-5 sm:size-6' />
        </div>
      )
    } else if (column.filterComponent === 'PriceFilter') {
      return (
        <div onClick={(event) => handleOpenPriceFilterPopover(event, column.field)} className='cursor-pointer'>
          <img src={ChevronBottomIcon} alt='chevron-bottom' className='opacity-[.64] xs:size-5 sm:size-6' />
        </div>
      )
    }
    return null
  }

  // Open
  const handleOpenProductFilterPopover = (event, field) => {
    setCurrentFilterField(field)
    setProductFilterAnchorEl(event.currentTarget)
  }
  const handleOpenStatusFilterPopover = (event, field) => {
    setCurrentFilterField(field)
    setStatusFilterAnchorEl(event.currentTarget)
  }
  const handleOpenDateFilterPopover = (event, field) => {
    setCurrentFilterField(field)
    setDateFilterAnchorEl(event.currentTarget)
  }
  const handleOpenCustomerFilterPopover = (event, field) => {
    setCurrentFilterField(field)
    setCustomerFilterAnchorEl(event.currentTarget)
  }
  const handleOpenPriceFilterPopover = (event, field) => {
    setCurrentFilterField(field)
    setPriceFilterAnchorEl(event.currentTarget)
  }
  // Close
  const handleCloseProductFilterPopover = () => {
    setProductFilterAnchorEl(null)
    setCurrentFilterField(null)
  }
  const handleCloseStatusFilterPopover = () => {
    setStatusFilterAnchorEl(null)
    setCurrentFilterField(null)
  }
  const handleCloseDateFilterPopover = () => {
    setDateFilterAnchorEl(null)
    setCurrentFilterField(null)
  }
  const handleCloseCustomerFilterPopover = () => {
    setCustomerFilterAnchorEl(null)
    setCurrentFilterField(null)
  }
  const handleClosePriceFilterPopover = () => {
    setPriceFilterAnchorEl(null)
    setCurrentFilterField(null)
  }

  const handleSelectOption = (value) => {
    if (currentFilterField) {
      if (
        value === 'flashSale' ||
        value === 'newProduct' ||
        value === 'all' ||
        value === 'allStatus' ||
        value === 'approve' ||
        value === 'pending' ||
        value === 'newestToOldest' ||
        value === 'oldestToNewest' ||
        value === 'AtoZ' ||
        value === 'ZtoA' ||
        value === 'LowestToHighest' ||
        value === 'HighestToLowest'
      ) {
        setSelectedCategory(value) // Update selected category here
      } else {
        handleFilterChange(currentFilterField, value)
      }
    }
    handleCloseProductFilterPopover()
    handleCloseStatusFilterPopover()
    handleCloseDateFilterPopover()
    handleCloseCustomerFilterPopover()
    handleClosePriceFilterPopover()
  }

  // Ensure page is reset to 1 when the selectedCategory changes
  useEffect(() => {
    setPage(1)
  }, [selectedCategory])

  return (
    <>
      {hasHeaderTable && (
        <div className='mb-[30px] flex items-center justify-between'>
          <h1 className='text-[32px] font-semibold leading-[32px]'>{title}</h1>
        </div>
      )}
      <div style={{ height: tableHeight ? tableHeight : mdDown ? 670 : lgDown ? 720 : 700, width: '100%' }}>
        <StyledDataGrid
          onRowClick={onRowClick}
          loading={isLoading}
          rows={filteredRows.slice((page - 1) * pageSizes, page * pageSizes)}
          columns={columns.map((column) => {
            return {
              ...column,
              renderHeader: () => (
                <div className='flex items-center gap-2'>
                  <span className='text-[#2F373CA3] xs:text-[12px] sm:text-[14px]'>{column.headerName}</span>
                  {renderFilterComponent(column)}
                </div>
              )
            }
          })}
          paginationModel={{ pageSize: pageSizes, page: page - 1 }}
          checkboxSelection={false}
          disableColumnResize
          rowHeight={rowHeight}
          slots={{
            columnMenu: CustomColumnMenu,
            noRowsOverlay: () => (
              <Stack height='100%' alignItems='center' justifyContent='center'>
                <NoDataIcon className='xs:size-[55px] sm:size-[70px]' />
                <p className='text-center font-customMedium leading-[25px] xs:mt-[6px] xs:text-[18px] sm:mt-8 sm:text-[20px] md:mt-[10px] md:text-[22px] lg:text-[24px]'>
                  Currently, there are no {model} available
                </p>
              </Stack>
            ),
            noResultsOverlay: () => (
              <Stack height='100%' alignItems='center' justifyContent='center'>
                <NoDataIcon className='xs:size-[55px] sm:size-[70px]' />
                <p className='text-center font-customMedium leading-[25px] xs:mt-[6px] xs:text-[18px] sm:mt-8 sm:text-[20px] md:mt-[10px] md:text-[22px] lg:text-[24px]'>
                  Currently, there are no {model} available
                </p>
              </Stack>
            )
          }}
        />
        {filteredRows.length === 0 ? null : (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: smDown ? -4 : mdDown ? -4 : -1 }}>
            <Pagination
              count={Math.ceil(filteredRows.length / pageSizes)}
              page={page}
              onChange={handlePageChange}
              variant='outlined'
              shape='rounded'
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  sx={{
                    color: item.selected ? '#1565C0' : 'black',
                    fontWeight: item.selected ? 'bold' : 'normal',
                    backgroundColor: 'transparent',
                    border: 'none',
                    '&.Mui-selected': {
                      backgroundColor: 'transparent'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(21, 101, 192, 0.1)'
                    }
                  }}
                />
              )}
            />
          </Box>
        )}
      </div>

      <ProductFilterPopover
        anchorEl={productFilterAnchorEl}
        onClose={handleCloseProductFilterPopover}
        onSelectOption={handleSelectOption}
      />
      <StatusPopover
        anchorEl={statusFilterAnchorEl}
        onClose={handleCloseStatusFilterPopover}
        onSelectOption={handleSelectOption}
      />
      <DatePopover
        anchorEl={dateFilterAnchorEl}
        onClose={handleCloseDateFilterPopover}
        onSelectOption={handleSelectOption}
      />
      <CustomerPopover
        anchorEl={customerFilterAnchorEl}
        onClose={handleCloseCustomerFilterPopover}
        onSelectOption={handleSelectOption}
      />
      <PricePopover
        anchorEl={priceFilterAnchorEl}
        onClose={handleClosePriceFilterPopover}
        onSelectOption={handleSelectOption}
      />
    </>
  )
}

const StyledDataGrid = styled(DataGrid)(() => ({
  '&.MuiDataGrid-root': {
    borderWidth: '1px !important',
    borderStyle: 'solid !important',
    borderColor: 'rgba(224, 224, 224, 1) !important',
    borderRadius: 'var(--unstable_DataGrid-radius) !important',
    border: 'none !important' // Hide the border
  },
  '& .MuiDataGrid-cell': {
    border: 'none',
    outline: 'none',

    '&:focus-within': {
      outline: 'none' // Remove focus outline for child elements
    }
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none'
  },
  '& .MuiDataGrid-row': {
    marginTop: '10px',
    borderRadius: '8px'
  },
  '& .MuiDataGrid-row--borderBottom': {
    borderTop: '1px solid rgba(224, 224, 224, 1)',
    outline: 'none', // Remove focus outline
    backgroundColor: 'transparent !important' // Set the background color of the header
  },
  '& .MuiDataGrid-footerContainer': {
    display: 'none'
  },
  '& .MuiDataGrid-filler > div': {
    borderTop: 'none'
  },
  '& .MuiDataGrid-sortIcon': {
    display: 'none'
  },
  '& .MuiDataGrid-scrollbar': {
    '&::-webkit-scrollbar': {
      height: '0px', // Set the height for the horizontal scroll bar
      width: '0' // Set the width for the vertical scroll bar
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555'
    }
  },
  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
    outline: 'none' // Remove focus outline
  }
}))
