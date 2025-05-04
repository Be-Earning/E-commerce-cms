import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { NavLink, useParams } from 'react-router-dom'
import { EnumListProductType } from '~/@types/enums/list'
import { ICustomerDetail, ProductInfo } from '~/@types/models'
import { QuickFilterButton } from '~/components/button'
import { CloseIcon } from '~/components/icons'
import { PATH_PRIVATE_APP } from '~/constants/paths'
import { useAppSelector } from '~/redux/configStore'
import AgentTableRow from '~/sections/agent/AgentTableRow'
import PersonalAgentProfile from '~/sections/agent/PersonalAgentProfile'
import { sendTransaction } from '~/smartContract/combineSdk'
import { getLocalStorage, setLocalStorage } from '~/utils/localStorage'

const AgentDetail = memo(() => {
  const { id: retailerAddress } = useParams()

  const { activeWallet } = useAppSelector((s) => s.user)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [listProducts, setListProducts] = useState<ProductInfo[]>([])
  const [agentDetail, setAgentDetail] = useState<ICustomerDetail>()

  const productRetailerDataLocal = useMemo(
    () => getLocalStorage(`products_retailer_${retailerAddress}`),
    [retailerAddress]
  )
  const agentInforDataLocal = useMemo(() => getLocalStorage(`infor_retailer_${retailerAddress}`), [retailerAddress])

  const listProductsData: ProductInfo[] = useMemo(
    () => productRetailerDataLocal || listProducts,
    [productRetailerDataLocal, listProducts]
  )
  const agentDetailData: ICustomerDetail = useMemo(
    () => agentInforDataLocal || agentDetail,
    [productRetailerDataLocal, listProducts]
  )

  const getListProductsOfRetailer = useCallback(async () => {
    try {
      setIsLoading(true)
      const [res, resInfor] = await Promise.all([
        sendTransaction(
          'getAllRetailerProductInfo',
          { _retailer: retailerAddress },
          'ecom-product',
          activeWallet,
          'chain',
          'read'
        ),
        sendTransaction('getUserInfo', { _user: retailerAddress }, 'ecom-user', activeWallet, 'chain', 'read')
      ])

      if (res.success && resInfor.success) {
        setListProducts(res.data.productsInfo)
        setAgentDetail(resInfor.data)

        setLocalStorage(`products_retailer_${retailerAddress}`, JSON.stringify(res.data.productsInfo))
        setLocalStorage(`infor_retailer_${retailerAddress}`, JSON.stringify(resInfor.data))
      } else {
        toast.error('Fetch retailer detail failed!')
      }
    } catch (error) {
      console.log('error', error)
      toast.error('An unexpected error occurred while fetching retailer data!')
    } finally {
      setIsLoading(false)
    }
  }, [retailerAddress, activeWallet])

  useEffect(() => {
    getListProductsOfRetailer()
  }, [retailerAddress, activeWallet])

  return (
    <div className='bg-list-agent bg-top bg-no-repeat p-5'>
      <div className='ml-auto flex justify-end'>
        <NavLink to={PATH_PRIVATE_APP.agent.list} className='relative z-[500] flex items-center gap-2 text-white'>
          <CloseIcon className='size-4' color={'white'} />
        </NavLink>
      </div>
      <div className='mt-14 space-y-5 bg-white/[.76] backdrop-blur-[200px]'>
        <div className='flex flex-col gap-5 xs:p-5 sm:p-8 md:p-10 lg:p-20'>
          <PersonalAgentProfile agentDetailWidthAddress={agentDetailData as ICustomerDetail} />
          <div className='mt-16 flex items-center justify-between gap-5'>
            <h2 className='text-nowrap font-customSemiBold capitalize rp-small-title'>Product Information</h2>
            <QuickFilterButton
              status={EnumListProductType.POSTED.toString()}
              totalCount={listProductsData.length}
              active={true}
            />
          </div>

          <AgentTableRow listProducts={listProducts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
})

export default AgentDetail
