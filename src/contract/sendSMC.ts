import { abi, toAddress } from './abi'

interface TransactionResult<T> {
  success: boolean
  message: string
  data: T
}

export type SmcType = {
  abiType: keyof typeof abi
}

export const sendSMC = async <T>(
  input: Omit<ExecuteSmartContractRequire, 'abiData' | 'type' | 'to'> & SmcType
): Promise<TransactionResult<T>> => {
  const { from = '', abiType, feeType, functionName, inputData, value, gas, ...allInput } = input

  const abiData = abi[abiType]

  const generateInput = (abi: any, functionName: string, inputData: any) => {
    const recursiveHandle = (inputArray: any, inputData: any) => {
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
    console.log('result: ', result)
    return result
  }

  const inputArray = generateInput(abiData, functionName, inputData)

  const data: ExecuteSmartContractRequire = {
    ...allInput,
    from,
    to: toAddress[abiType],
    abiData: abiData.filter((item) => item.type === 'function' && item.name === functionName),
    inputArray,
    functionName,
    isCall: true,
    gas: gas || 100000,
    amount: value || '0',
    type: 'transaction',
    feeType: feeType ?? 'user',
    isReadOnly: feeType === 'read'
  }

  console.log('------ Ecom send smartcontarct before ------', functionName, data)

  // const timeoutPromise = new Promise<never>((_, reject) =>
  //   setTimeout(() => reject(new Error('Smart contract execution timeout!')), timeout)
  // )

  const sdkCallPromise = new Promise<TransactionResult<T>>((resolve, reject) => {
    window.finSdk
      .sendTransaction(data)
      .then((res: TransactionResult<T>) => {
        console.log('------ Ecom send smartcontarct after ------', functionName, res)
        const result: TransactionResult<T> = {
          ...res,
          data: (res?.data as any)?.returnValue?.[''] ?? (res?.data as any)?.returnValue ?? res?.data ?? ('' as T)
        }
        resolve(result)
      })
      .catch((error: any) => reject(error))
  })
  return Promise.race([sdkCallPromise])
}
