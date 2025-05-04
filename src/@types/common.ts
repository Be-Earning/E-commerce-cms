export interface OptionSelect {
  value: any
  label: string
}

export type QueryConfig = {
  [key in keyof ListConfig]: string
}

export interface ListConfig {
  creaetProductType?: 'product' | 'product-sale'
  productId?: number
  isEditing?: 0 | 1
}

export type FeeType = 'user' | 'sc' | 'commissionSign' | 'read'
export type Server = 'chain' | 'client-full' | 'client-part'
export interface ExecuteSmartContractRequire {
  from: string
  to: string
  relateAddress?: string[]
  functionName: string
  abiData: any[]
  value?: string
  gas?: string
  message?: string
  inputArray?: any[]
  inputData?: any
  feeType?: FeeType
  server?: Server
  isCall?: boolean
  isReadOnly?: boolean
}
