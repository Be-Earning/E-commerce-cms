import { GridColDef } from '@mui/x-data-grid'
import { NavLink } from 'react-router-dom'
import LinkIcon from '~/components/icons/Link'
import { ConverCategory } from '~/utils/covertStatus'
import { formatDateV2 } from '~/utils/format'
import { convertPrice } from '../../utils/convert'
type CustomGridColDef = GridColDef & {
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

const columsProductSold: CustomGridColDef[] = [
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
    headerName: 'POSTED TIME',
    width: 200,
    filterable: false,
    filterComponent: 'DateFilter',
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{formatDateV2(value)}</div>
    }
  },
  {
    field: 'vipPrice',
    headerName: 'VIP PRICE',
    width: 200,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>${convertPrice(value)}</div>
    }
  },
  {
    field: 'memberPrice',
    headerName: 'MEMBER PRICE',
    width: 200,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>${convertPrice(value)}</div>
    }
  },
  {
    field: 'retailPrice',
    headerName: 'RETAIL PRICE',
    width: 200,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>${convertPrice(value)}</div>
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
const columsAgentMangement: CustomGridColDef[] = [
  {
    field: 'fullName',
    headerName: 'AGENT',
    width: 370,
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
    headerName: 'REGISTRATION DATE',
    filterComponent: 'DateFilter',
    width: 200,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{formatDateV2(value)}</div>
    }
  },
  {
    field: 'referredGuests',
    headerName: 'REFERRED GUESTS',
    width: 170,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{value}</div>
    }
  },
  {
    field: 'reveue',
    headerName: 'REVENUE',
    width: 140,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{value}</div>
    }
  },
  {
    field: 'productPosted',
    headerName: 'PRODUCTS POSTED',
    width: 170,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return <div className='text-[20px] font-normal'>{value}</div>
    }
  },
  {
    field: 'productSold',
    headerName: 'PRODUCTS SOLD',
    width: 200,
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
    width: 30,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ value }) => {
      return (
        <div className='flex h-full w-full items-center'>
          <NavLink
            to={`/agent/detail?id=${value}`}
            className='cursor-pointer border-none outline-none focus:outline-none'
          >
            <LinkIcon />
          </NavLink>
        </div>
      )
    }
  }
]
export { columsAgentMangement, columsProductSold }
