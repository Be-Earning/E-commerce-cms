export interface MetanodeWallet {
  name: string
  wallet: string
}
interface PersonInfor {
  metanodeWallet: MetanodeWallet[]
  visa: string
  status: number
  avatar: string
}

export interface PersonalWithWalletInfo extends PersonInfor {
  IDNumber: string
  email: string
  agentName: string
  phoneNumber: string
  registrationDate: string
  referredGuests: number
  address: string
  revenue: string
}

export interface PersonalWithPaymentInfo extends PersonInfor {
  IDCustomer: string
  email: string
  fullName: string
  phoneNumber: string
  dateOfBirth: string
  address: string[]
  gender: number
  signInDate: string
}
