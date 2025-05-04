import toast from 'react-hot-toast'
import { CoreResponse, Seed } from './core.type'

export const sendCommand = async (command: string, value?: any) => {
  try {
    const res = await window.finSdk.call({ command, value })
    return res
  } catch (error: any) {
    toast.error(error)
  }
}

export const getSeed = async (language = 'english'): Promise<CoreResponse<Seed>> =>
  await sendCommand('getSeed', { language })

export const getAllWallets = async (): Promise<CoreResponse<any[]>> => await sendCommand('getAllWallets')

export const getPrivateKey = async (address: string): Promise<CoreResponse<string>> =>
  await sendCommand('getPrivateKey', { address })

export const createWallet = async (seed: string[]): Promise<CoreResponse<any>> =>
  await sendCommand('createWallet', { seed })

export const createWalletFromPrivateKey = async (privateKey: string): Promise<CoreResponse<any>> =>
  await sendCommand('createWalletFromPrivateKey', { privateKey })

export const removeWalletByAddress = async (address: string): Promise<CoreResponse<any>> =>
  await sendCommand('removeWalletByAddress', { address })
