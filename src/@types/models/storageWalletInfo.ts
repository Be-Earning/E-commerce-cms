export interface WalletInfo {
  address: string
  name: string
  email: string
  phone: string
  balance?: string
  cardType?: string
}

export interface AllWalletInfo {
  [key: string]: WalletInfo
}
