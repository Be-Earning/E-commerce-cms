import { isArray } from 'lodash'
import { FC, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ICustomerDetail } from '~/@types/models'
import useResponsive from '~/hooks/useResponsive'
import { useAppSelector } from '~/redux/configStore'
import { cn } from '~/utils/classNames'
import { formatDateV2, shortCenter, shortenString } from '~/utils/format'

const listMetaWallet = [
  { name: 'Carter Calzoni', address: 'g67d...d45a' },
  { name: 'Michacle Malik', address: 'f68d...df5a' }
]

const visa = {
  cardNumber: '1234 5678 9101 9889',
  cardHolder: 'Leo Lubin',
  expirationDate: '10/24'
}

interface IPersonalProfileProps {
  customerDetailData: ICustomerDetail
}

const PersonalProfile: FC<IPersonalProfileProps> = ({ customerDetailData }) => {
  const { id } = useParams()

  const { listCustomers } = useAppSelector((s) => s.customer)

  const xlDown = useResponsive('down', 'xl')

  const info = useMemo(() => listCustomers.find((item) => item.user === id), [id, listCustomers])

  const personalDataList = useMemo(
    () =>
      info
        ? [
            {
              label: 'ID Customer',
              value: xlDown ? shortCenter(info?.user) : info?.user || '...'
            },
            {
              label: 'Email',
              value: info?.email || '...'
            },
            {
              label: 'Full Name',
              value: info?.fullName || '...'
            },
            {
              label: 'Phone Number',
              value: info?.phoneNumber || '...'
            },
            {
              label: 'Date of Birth',
              value: formatDateV2(Number(info?.dateOfBirth.padEnd(13, '0')))
            },
            {
              label: 'Address',
              value:
                customerDetailData?.addresses.map(
                  (address) =>
                    `${address.detailAddress}, ${address.state}, ${address.city}, ${address.country}, ${address.postalCode}`
                ) || '...'
            },
            {
              label: 'Gender',
              value: info?.gender === '0' ? 'Male' : 'Female'
            },
            {
              label: 'Sign In Date',
              value: formatDateV2(Number(info?.createdAt.padEnd(13, '0')))
            }
          ]
        : [],
    [info, customerDetailData, xlDown]
  )

  return (
    <div className='grid gap-10'>
      <img
        className='rounded-xl object-cover object-center xs:size-[88px] sm:size-[92px] md:size-[100px] lg:size-[110px] xl:size-[120px]'
        src={info?.image || 'https://img.fi.ai/avatar_image/1.png'}
        alt='avatar'
        loading='lazy'
      />

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

export default PersonalProfile
