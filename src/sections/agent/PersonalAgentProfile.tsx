import { isArray } from 'lodash'
import { FC, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ICustomerDetail } from '~/@types/models'
import images from '~/assets'
import { Badge } from '~/components/ui/badge'
import useResponsive from '~/hooks/useResponsive'
import { useAppSelector } from '~/redux/configStore'
import { cn } from '~/utils/classNames'
import { formatDateV2, formatLocaleString, shortCenter, shortenString } from '~/utils/format'

const listMetaWallet = [
  { name: 'Carter Calzoni', address: 'g67d...d45a' },
  { name: 'Michacle Malik', address: 'f68d...df5a' }
]

const visa = {
  cardNumber: '1234 5678 9101 9889',
  cardHolder: 'Leo Lubin',
  expirationDate: '10/24'
}

interface IPersonalAgentProfileProps {
  agentDetailWidthAddress: ICustomerDetail
}

const PersonalAgentProfile: FC<IPersonalAgentProfileProps> = ({ agentDetailWidthAddress }) => {
  const { id: retailerAddress } = useParams()

  const { listCustomers } = useAppSelector((s) => s.customer)

  const xlDown = useResponsive('down', 'xl')

  const agentDetail = useMemo(
    () => listCustomers.find((item) => item.user === retailerAddress),
    [listCustomers, retailerAddress]
  )

  const personalDataList = agentDetail
    ? [
        {
          label: 'ID Customer',
          value: xlDown ? shortCenter(agentDetail?.user) : agentDetail?.user || '...'
        },
        {
          label: 'Email',
          value: agentDetail.email || '...'
        },
        {
          label: "Agent's Name",
          value: agentDetail.fullName || '...'
        },
        {
          label: 'Phone Number',
          value: agentDetail.phoneNumber || '...'
        },
        {
          label: 'Registration date',
          value: formatDateV2(Number(agentDetail.createdAt) * 1000)
        },

        {
          label: 'RefReferred guests',
          value: 140
        },
        {
          label: 'Address',
          value:
            agentDetailWidthAddress?.addresses.map(
              (address) =>
                `${address.detailAddress}, ${address.state}, ${address.city}, ${address.country}, ${address.postalCode}`
            ) || '...'
        },
        {
          label: 'Revenue',
          value: formatLocaleString(1700)
        }
      ]
    : []

  if (!agentDetail) return null
  return (
    <div className='grid gap-10'>
      <div className='flex items-end gap-4'>
        <img
          loading='lazy'
          alt='avatar'
          className='rounded-xl object-cover object-center xs:size-[88px] sm:size-[92px] md:size-[100px] lg:size-[110px] xl:size-[120px]'
          src={agentDetail?.image || images.logo.logo_e_commerce}
        />
        <Badge variant='success'>
          <p className='font-customMedium text-[20px]/[21px]'>Active</p>
        </Badge>
      </div>

      <div className='grid gap-6 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:gap-x-10 lg:gap-x-[60px]'>
        {personalDataList.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex justify-between gap-6 border-0 border-b border-solid border-gray-lighter pb-6',
              item.label === 'Address' && isArray(item.value) ? 'row-span-3' : 'items-center'
            )}
          >
            <div className='text-gray-darker rp-md-text'>{item.label}</div>
            <div className={cn('rp-md-text', isArray(item.value) ? 'flex flex-col gap-2' : '')}>
              {isArray(item.value) ? item.value.map((item) => <span key={item}>{item}</span>) : item.value}
            </div>
          </div>
        ))}
      </div>

      <div className='mt-10 w-full'>
        <h2 className='pb-[30px] font-customSemiBold capitalize rp-small-title'>Payment Method</h2>
        <div className='flex w-full items-start xs:flex-col xs:gap-6 sm:flex-col sm:gap-6 md:flex-col md:gap-6 lg:flex-row lg:gap-[60px]'>
          <div className='flex w-full justify-between border-0 border-b border-solid border-gray-lighter pb-6'>
            <div className='text-gray-darker rp-md-text'>Metanode wallet</div>
            <div className='space-y-6'>
              {listMetaWallet?.map((item, index) => (
                <div key={index} className='text-right rp-md-text'>
                  {item.name} {shortenString(item.address)}
                </div>
              ))}
            </div>
          </div>
          <div className='flex w-full items-center justify-between border-0 border-b border-solid border-gray-lighter pb-6'>
            <div className='text-gray-darker rp-md-text'>Visa</div>
            <div className='rp-md-text'>
              {visa?.cardHolder} {shortenString(visa?.cardNumber)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalAgentProfile
