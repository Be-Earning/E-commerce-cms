import { GridColDef } from '@mui/x-data-grid'
import { cn } from '~/utils/classNames'
import { ConvertStatus } from '~/utils/covertStatus'

export const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, filterable: false, sortable: false, disableColumnMenu: true },
  {
    field: 'image',
    headerName: 'Image',
    width: 100,
    filterable: false,
    sortable: false,
    disableColumnMenu: false,
    renderCell: ({ value }) => (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <img src={value} alt='Profile' style={{ width: '40px', height: '40px' }} />
      </div>
    )
  },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 130,
    filterable: false,
    sortable: true,
    disableColumnMenu: false
  },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'timeToAdd',
    headerName: 'TIME TO ADD',
    width: 200
  },
  {
    field: 'status',
    headerName: 'status',
    width: 180,
    renderCell: ({ value }) => {
      const { status, className } = ConvertStatus(value)

      return (
        <div className='flex h-full items-center'>
          <div
            className={cn(
              className,
              'text-center',
              'flex items-center justify-center',
              'px-2 py-1',
              'text-sm',
              'size-[20px] h-[36px] w-[114px] rounded-[5px] leading-none'
            )}
          >
            {status}
          </div>
        </div>
      )
    }
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (_, row) => `${row.firstName || ''} ${row.lastName || ''}`
  }
]

export const rows = [
  {
    id: 1,
    image:
      'https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg',
    lastName: 'Snow',
    firstName: 'Jon',
    timeToAdd: '10/09/2024, 20:09:09',
    status: '0', // Existing status
    category: 'purchases' // New field for filtering
  },
  {
    id: 2,
    image:
      'https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg',
    lastName: 'Lannister',
    firstName: 'Cersei',
    timeToAdd: '10/09/2024, 20:09:09',
    status: '1', // Existing status
    category: 'cart' // New field for filtering
  },
  {
    id: 3,
    image:
      'https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg',
    lastName: 'Lannister',
    firstName: 'Jaime',
    timeToAdd: '10/09/2024, 20:09:09',
    status: '2', // Existing status
    category: 'wishlist' // New field for filtering
  },
  {
    id: 4,
    image:
      'https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg',
    lastName: 'Stark',
    firstName: 'Arya',
    timeToAdd: '10/09/2024, 20:09:09',
    status: '0', // Existing status
    category: 'purchases' // New field for filtering
  },
  {
    id: 5,
    image:
      'https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg',
    lastName: 'Targaryen',
    firstName: 'Daenerys',
    timeToAdd: '10/09/2024, 20:09:09',
    status: '3', // Existing status
    category: 'cart' // New field for filtering
  },
  {
    id: 6,
    image:
      'https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg',
    lastName: 'Melisandre',
    firstName: null,
    timeToAdd: '10/09/2024, 20:09:09',
    status: '4', // Existing status
    category: 'wishlist' // New field for filtering
  },
  {
    id: 7,
    image:
      'https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg',
    lastName: 'Clifford',
    firstName: 'Ferrara',
    timeToAdd: '10/09/2024, 20:09:09',
    status: '0', // Existing status
    category: 'purchases' // New field for filtering
  },
  {
    id: 8,
    image:
      'https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg',
    lastName: 'Frances',
    firstName: 'Rossini',
    timeToAdd: '10/09/2024, 20:09:09',
    status: '0', // Existing status
    category: 'purchases' // New field for filtering
  },
  {
    id: 9,
    image:
      'https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg',
    lastName: 'Roxie',
    firstName: 'Harvey',
    timeToAdd: '10/09/2024, 20:09:09',
    status: '0', // Existing status
    category: 'wishlist' // New field for filtering
  },
  {
    id: 10,
    image:
      'https://imgv3.fotor.com/images/side/ai-generate-watercolor-fairy-from-text-with-Fotor-ai-image-generator.jpg',
    lastName: 'Roxie',
    firstName: 'Harvey',
    timeToAdd: '10/09/2024, 20:09:09',
    status: '0', // Existing status
    category: 'wishlist' // New field for filtering
  }
]
