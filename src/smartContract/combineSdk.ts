import { ERR_MESSAGE } from '~/constants/error'
import { abiEcomInfo, abiEcomOrder, abiEcomProduct, abiEcomUser, abiFile } from '~/smartContract/index'
import { convertErrorMessage, isObjectEmpty } from '~/utils/convert'

interface TransactionResult {
  success: boolean
  message: string
  data: any
}

export type FeeType = 'user' | 'sc' | 'commissionSign' | 'read'

export const sendTransaction = async (
  functionName: string,
  dataInput: any,
  abiType: 'ecom-user' | 'ecom-order' | 'ecom-product' | 'ecom-info' | 'file' = 'ecom-product',
  from?: string,
  server: 'chain' | 'client-full' | 'client-part' = 'chain',
  feeType?: FeeType,
  timeout: number = 30000,
  abiEvent?: any
): Promise<TransactionResult> => {
  console.log('timeout', timeout)
  console.log({ dataInput })

  const { abiAddress, abi } =
    abiType === 'ecom-info'
      ? abiEcomInfo
      : abiType === 'ecom-user'
        ? abiEcomUser
        : abiType === 'ecom-product'
          ? abiEcomProduct
          : abiType === 'ecom-order'
            ? abiEcomOrder
            : abiType === 'file'
              ? abiFile
              : abiEcomProduct

  const generateInput = (abi: any, functionName: string, inputData: any) => {
    const recursiveHandle = (inputArray: any, inputData: any) => {
      console.log({ inputArray })

      return inputArray.map((item) => {
        const { type, components, name } = item

        if (type === 'tuple') {
          return {
            type,
            value: recursiveHandle(components, inputData[name])
          }
        }

        if (type === 'tuple[]') {
          return {
            type,
            value: inputData[name].map((tupleItem) => recursiveHandle(components, tupleItem))
          }
        }

        return {
          type,
          value: inputData[name]
        }
      })
    }

    const match = abi.find(({ type, name }) => type === 'function' && name === functionName)

    if (!match) {
      console.error('Function not found in ABI')
      return []
    }

    const result = recursiveHandle(match.inputs, inputData)
    return result
  }

  const inputArray = generateInput(abi, functionName, dataInput)

  const data = {
    from,
    functionName,
    isCall: true,
    type: 'transaction',
    to: abiAddress,
    feeType: feeType ?? 'user',
    inputArray,
    amount: '0',
    gas: 5000000000,
    abiData: abi,
    server: server ? server : 'chain',
    abiEvent
  }

  console.log('send smartcontract before', functionName, data)
  // await window.finSdk.sendTransaction(data)

  // const timeoutPromise = new Promise<never>((_, reject) =>
  //   setTimeout(() => reject(new Error('Smart contract execution timeout!')), timeout)
  // )

  const sdkCallPromise = new Promise<TransactionResult>(async (resolve, reject) => {
    try {
      const res = (await window.finSdk.sendTransaction(data)) as TransactionResult // Assert the type here
      console.log('send smartcontract after', functionName, res)

      let result: TransactionResult = { success: false, message: '', data: '' }

      if (server === 'client-full') {
        if (!res || isObjectEmpty(res)) {
          console.log(`send smartcontract client full failed`)
          result = {
            success: false,
            message: isObjectEmpty(res) ? ERR_MESSAGE.TIMEOUT_RES : convertErrorMessage(res.message) || '',
            data: ''
          }
          throw new Error(result.message)
        } else {
          result = { success: true, message: '', data: res?.[''] ? res?.[''] : res }
        }
      } else {
        if (!res.success || !res || isObjectEmpty(res)) {
          console.log(`send smartcontract ${server} failed`)
          result = {
            success: false,
            message: isObjectEmpty(res) ? ERR_MESSAGE.TIMEOUT_RES : convertErrorMessage(res.message) || '',
            data: ''
          }
          throw new Error(result.message) // Throw error if result is invalid
        } else {
          result = {
            success: true,
            message: '',
            data: res.data.returnValue?.[''] ? res.data.returnValue?.[''] : res.data.returnValue
          }
        }
      }

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })

  return Promise.race([sdkCallPromise])
}
