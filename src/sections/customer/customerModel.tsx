import { GridColDef } from '@mui/x-data-grid'
import { NavLink } from 'react-router-dom'
import LinkIcon from '~/components/icons/Link'
import { ConverCategory } from '~/utils/covertStatus'
import { formatDateV2 } from '~/utils/format'

export type CustomGridColDef = GridColDef & {
  filterComponent?: string
}
// const orderDetail = {
//   orderId: '747hhdGhh639',
//   paymentMethod: 'Credit Card',
//   discount: '10%',
//   dateOfOrder: '26/08/2024',
//   estimatedDelivery: '30/08/2024',
//   shippingFee: '$5.00',
//   totalPrice: 120.0
// }

const columsItemInCart: CustomGridColDef[] = [
  {
    field: 'productName',
    headerName: 'PRODUCT',
    width: 350,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value, row }) => {
      return (
        <div className='flex h-full items-center gap-[20px]'>
          <div className='flex h-full items-center justify-center'>
            <img
              src='https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg'
              alt='Profile'
              style={{ width: '80px', height: '80px', borderRadius: '10px' }}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='text-[24px] font-semibold leading-[25px]'>{value}</div>
            <div className='text[#0D0D0DA3] text-[18px] font-normal leading-[19px]'>
              {ConverCategory(row.categoryID)}
            </div>
          </div>
        </div>
      )
    }
  },
  {
    field: 'createdAt',
    headerName: 'TIME TO ADD',
    width: 300,
    filterable: false,
    filterComponent: 'DateFilter',
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{formatDateV2(value)}</div>
    }
  },
  {
    field: 'price',
    headerName: 'PRICE',
    width: 300,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{value}</div>
    }
  },
  {
    field: 'Quantity',
    headerName: 'QUANTITY',
    width: 100,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{value}</div>
    }
  },
  {
    field: 'total',
    headerName: 'TOTAL',
    width: 150,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{value}</div>
    }
  }
]
const columsItemInWishList: CustomGridColDef[] = [
  {
    field: 'productName',
    headerName: 'PRODUCT',
    width: 350,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value, row }) => {
      return (
        <div className='flex h-full items-center gap-[20px]'>
          <div className='flex h-full items-center justify-center'>
            <img
              src='https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg'
              alt='Profile'
              style={{ width: '80px', height: '80px', borderRadius: '10px' }}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='text-[24px] font-semibold leading-[25px]'>{value}</div>
            <div className='text[#0D0D0DA3] text-[18px] font-normal leading-[19px]'>
              {ConverCategory(row.categoryID)}
            </div>
          </div>
        </div>
      )
    }
  },
  {
    field: 'createdAt',
    headerName: 'TIME TO ADD',
    width: 300,
    filterable: false,
    filterComponent: 'DateFilter',
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{formatDateV2(value)}</div>
    }
  },
  {
    field: 'price',
    headerName: 'PRICE',
    width: 300,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{value}</div>
    }
  },
  {
    field: 'Quantity',
    headerName: 'QUANTITY',
    width: 100,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{value}</div>
    }
  }
]
const columsCustomerMangement: CustomGridColDef[] = [
  {
    field: 'fullName',
    headerName: 'CUSTOMER',
    width: 400,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    filterComponent: 'CustomerFilter',
    renderCell: ({ value, row }) => {
      return (
        <div className='flex h-full items-center gap-[20px]'>
          <div className='flex h-full items-center justify-center'>
            <img
              src='https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg'
              alt='Profile'
              style={{ width: '80px', height: '80px', borderRadius: '10px' }}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='text-[24px] font-semibold leading-[25px]'>{value}</div>
            <div className='text[#0D0D0DA3] text-[18px] font-normal leading-[19px]'>ID: {row.id}</div>
          </div>
        </div>
      )
    }
  },
  {
    field: 'createdAt',
    headerName: 'SIGN IN DATE',
    filterComponent: 'DateFilter',
    width: 250,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{formatDateV2(value)}</div>
    }
  },
  {
    field: 'wallets',
    headerName: 'WALLET',
    width: 250,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{value.length > 10 ? value.length : `0${value.length}`}</div>
    }
  },
  {
    field: 'purchase',
    headerName: 'PURCHASES',
    width: 250,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{value}</div>
    }
  },
  {
    field: 'user',
    headerName: '',
    width: 100,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return (
        <div className='flex h-full w-full items-center'>
          <NavLink
            to={`/customer/detail?id=${value}`}
            className='cursor-pointer border-none outline-none focus:outline-none'
          >
            <LinkIcon />
          </NavLink>
        </div>
      )
    }
  }
]
export { columsCustomerMangement, columsItemInCart, columsItemInWishList }
