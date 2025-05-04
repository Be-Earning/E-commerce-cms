declare global {
  interface Window {
    finSdk: any
  }

  export type FeeType = 'user' | 'sc' | 'commissionSign' | 'read'

  export interface ExecuteSmartContractRequire {
    from?: string
    to: string
    type: string
    functionName: string
    abiData: any[]
    abiEvent?: any
    amount?: string
    value?: string
    gas?: number
    message?: string
    inputArray?: any[]
    inputData?: any
    feeType?: FeeType
    isCall?: boolean
    isReadOnly?: boolean
    timeout?: number
  }
}

export {}
