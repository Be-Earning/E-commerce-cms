import React, { useEffect, useState } from 'react'
import { DateRangePickerFilter } from '~/components/datePickerFilter'
import Search from '~/components/search/Search'
import DataTable from '~/components/table'
import FilterLayout from '~/layouts/components/filter'
import { columsAgentMangement } from '~/sections/agent/agentModel'
import { customerRows } from '~/assets/mocks/dataMock'

interface IAgentManagementProps {}

const AgentManagement: React.FunctionComponent<IAgentManagementProps> = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState<{
    from: Date | null
    to: Date | null
  }>({ from: null, to: null })
  const [filteredProducts, setFilteredProducts] = useState(customerRows)
  // Format the data for the DataGrid

  useEffect(() => {
    let filtered = customerRows

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter((customer) => customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Lọc theo khoảng ngày
    if (dateRange.from) {
      const fromDate = dateRange.from instanceof Date ? dateRange.from : new Date(dateRange.from)
      const toDate = dateRange.to ? (dateRange.to instanceof Date ? dateRange.to : new Date(dateRange.to)) : new Date()

      filtered = filtered.filter((customer) => {
        const customerDate = new Date(Number(customer.createdAt)) // Chuyển đổi từ Unix timestamp sang Date

        // So sánh chỉ ngày, bỏ qua thời gian
        const customerDay = customerDate.setHours(0, 0, 0, 0)
        const fromDay = fromDate.setHours(0, 0, 0, 0)
        const toDay = toDate.setHours(0, 0, 0, 0)

        return customerDay >= fromDay && customerDay <= toDay
      })
    }

    setFilteredProducts(filtered)
  }, [searchTerm, dateRange])

  // Filter by search term
  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }
  const handleDateRangeChange = (range) => {
    setDateRange(range)
  }
  return (
    <>
      <FilterLayout title='Agent Management'>
        <Search onSearch={(value) => handleSearch(value)} placeHolder='Search By Name ...' />
        <DateRangePickerFilter onConfirm={(value) => handleDateRangeChange(value)} />
      </FilterLayout>
      <DataTable
        rows={filteredProducts}
        columns={columsAgentMangement}
        pageSizes={5}
        title=''
        rowHeight={80}
        hasHeaderTable={false}
      />
    </>
  )
}

export default AgentManagement
