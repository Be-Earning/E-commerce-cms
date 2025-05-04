/* eslint-disable no-var */
/* eslint-disable no-useless-escape */
import Web3 from 'web3'
import CryptoJS from 'crypto-js'
import { keccak256, solidityPacked } from 'ethers'
import BigNumber from 'bignumber.js'

export const emptyBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000'

export function binaryToString(binaryStr: string): string {
  // Chia chuỗi nhị phân thành các đoạn 8-bit
  const chars = binaryStr.match(/.{1,8}/g)
  if (!chars) return '' // Nếu không có chuỗi nào thì trả về chuỗi rỗng

  // Chuyển đổi mỗi đoạn 8-bit thành ký tự ASCII
  return chars.map((char) => String.fromCharCode(parseInt(char, 2))).join('')
}

export const hexToUtf8 = (hex: string): string => {
  hex = hex.replace(/\s+/g, '')

  if (hex.length % 2 !== 0) {
    // throw new Error('Invalid hex string')
  }

  let bytes: number[] = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16))
  }

  let utf8String = new TextDecoder('utf-8').decode(new Uint8Array(bytes))
  return utf8String
}

export const utf8ToHex = (utf8String: string): string => {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(utf8String)

  let hexString = ''
  for (const byte of bytes) {
    hexString += byte.toString(16).padStart(2, '0')
  }

  return hexString
}

export async function filterAndConvertImageUrlsToHex(items: string[]): Promise<string[]> {
  const imageUrls = items.filter((item) => item.startsWith('http://') || item.startsWith('https://'))

  const hexStrings = await Promise.all(
    imageUrls.map(async (url) => {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to fetch: ${url}`)
      const buffer = await response.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    })
  )

  return hexStrings
}

export const convertToHex = (bigNumber: string): string => {
  const bigIntValue = BigInt(bigNumber)
  let hexString = bigIntValue.toString(16).toUpperCase()
  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString
  }
  return hexString
}

export function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function hexToBase64(hexString: string, mimeType: string): string {
  const binaryString =
    hexString
      .match(/.{1,2}/g)
      ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
      .join('') || ''

  const base64String = btoa(binaryString)

  return `data:${mimeType};base64,${base64String}`
}

export const stringToBase64 = (str: string): string => {
  const encoder = new TextEncoder()
  const encoded = encoder.encode(str)
  return btoa(String.fromCharCode(...encoded))
}

export const base64ToString = (base64: string): string => {
  const binaryString = atob(base64)
  const binaryLen = binaryString.length
  const bytes = new Uint8Array(binaryLen)
  for (let i = 0; i < binaryLen; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}
export function getMimeType(hexString: string): string {
  const header = hexString.substring(0, 8)

  if (header.startsWith('89504e47')) return 'image/png'

  if (header.startsWith('ffd8ff')) return 'image/jpeg'

  if (header.startsWith('47494638')) return 'image/gif'

  return 'image/png'
}

export const capitalizeFirstLetter = (input: string): string => {
  if (!input) return input
  return input.charAt(0).toUpperCase() + input.slice(1)
}

export const convertErrorMessage = (input: string): string => {
  try {
    // 1. Thử tìm kiếm và xử lý chuỗi JSON trước
    const jsonStartIndex = input.lastIndexOf('{')
    if (jsonStartIndex !== -1) {
      // Tách lấy phần JSON từ vị trí bắt đầu của `{` đến cuối chuỗi
      let jsonString = input.slice(jsonStartIndex)

      // Loại bỏ các ký tự không hợp lệ ở trước và sau chuỗi JSON
      jsonString = jsonString.replace(/^[^{]+|[^}]+$/g, '')

      try {
        const parsedJson = JSON.parse(jsonString)
        if (parsedJson.message) {
          return capitalizeFirstLetter(parsedJson.message)
        }
      } catch (error) {
        console.log('Error parsing JSON:', error)
      }
    }

    // 2. Nếu không có JSON hoặc parse JSON thất bại, tìm đoạn chuỗi ASCII có thể đọc được
    const regex = /[\x20-\x7E]{3,}$/
    const match = input.match(regex)

    if (match) {
      return capitalizeFirstLetter(match[0])
    } else {
      console.log('Readable error message not found in the input string.')
      return ''
    }
  } catch (error) {
    console.log('Error processing the input string:', error)
    return ''
  }
}

export const convertStringToSeedPhrase = (str: any) => {
  var rules = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    I: 9,
    J: 10,
    K: 11,
    L: 12,
    M: 13,
    N: 14,
    O: 15,
    P: 16,
    Q: 17,
    R: 18,
    S: 19,
    T: 20,
    U: 21,
    V: 22,
    W: 23,
    X: 24,
    Y: 25,
    Z: 26,
    a: 27,
    b: 28,
    c: 29,
    d: 30,
    e: 31,
    f: 32,
    g: 33,
    h: 34,
    i: 35,
    j: 36,
    k: 37,
    l: 38,
    m: 39,
    n: 40,
    o: 41,
    p: 42,
    q: 43,
    r: 44,
    s: 45,
    t: 46,
    u: 47,
    v: 48,
    w: 49,
    x: 50,
    y: 51,
    z: 52
  }
  var arr: any[] = []
  var start = 0
  var string = str.substring(5)
  while (arr.length < 24) {
    const firtLetter = string.substr(start, 1)
    var subLen = rules[firtLetter]
    const seed = string.substr(start + 1, subLen)
    arr.push(seed)
    start = start + subLen + 1
  }
  return arr
}

export const isObjectEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export function isObject(value: any) {
  return typeof value === 'object' && value !== null
}

export const convertToUnit256 = (num: any): string => {
  const web3 = new Web3()
  const numberUnit256 = web3.eth.abi.encodeParameter('uint256', num.toString())
  return numberUnit256
}

export const isByteString = (value: string): boolean => {
  return typeof value === 'string' && /^[0-9a-fA-F]+$/.test(value)
}

export const convertBytesToString = (num: any): string => {
  const web3 = new Web3()
  const numberUnit256 = web3.eth.abi.decodeParameter('string', num.toString()) as string
  return numberUnit256
}

export const convertStringsToBytes = (strings: string): string => {
  const web3 = new Web3()
  return web3.utils.asciiToHex(strings)
}

export const convertPrice = (price: number): string => {
  return (price / Math.pow(10, 6)).toString()
}

export const handleMessageError = (error: any): string => {
  // Kiểm tra các trường hợp phổ biến để lấy thông điệp lỗi
  if (typeof error === 'string') return error
  return (
    error?.data?.description || // Trường hợp có mô tả lỗi trong `data.description`
    error?.response?.data?.message || // Trường hợp có thông điệp trong `response.data.message`
    error?.message || // Trường hợp có thông điệp lỗi trong `message`
    JSON.stringify(error) // Trả về đối tượng lỗi dưới dạng chuỗi JSON nếu không tìm thấy thông điệp lỗi
  )
}

export const generateFileHash = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result as ArrayBuffer)
      const hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex)
      resolve(hash)
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

export function computeChunkHash(lastChunkHash: string, chunkData: Uint8Array): string {
  let encodedData: string
  if (!lastChunkHash || lastChunkHash === '0x') {
    // Giao dịch đầu tiên: chỉ sử dụng chunkData
    console.log('lần 1 ===> ')
    encodedData = solidityPacked(['bytes32', 'bytes'], [emptyBytes32, chunkData])
  } else {
    // Giao dịch sau: nối lastChunkHash vào chunkData
    console.log('lần tiếp theo ===> ')
    encodedData = solidityPacked(['bytes32', 'bytes'], [lastChunkHash, chunkData])
  }
  return keccak256(encodedData)
}

export function splitFileIntoChunks(file: File): Promise<{ chunkData: string[]; chunkHash: string[] }> {
  return new Promise((resolve, reject) => {
    const chunkDataList: string[] = [] // Tạo mảng cho chunkData
    const chunkHashList: string[] = [] // Tạo mảng cho chunkHash
    const reader = new FileReader()

    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const arrayBuffer = event.target.result // Đọc file dưới dạng ArrayBuffer
        const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer) // Chuyển thành Uint8Array

        const chunkSize = 1024
        let lastChunkHash = '0x'

        // Tách file thành các chunk và tính toán hash cho từng chunk
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize) // Cắt một chunk

          // Tính toán hash cho chunk
          const chunkHash = computeChunkHash(lastChunkHash, chunk)
          lastChunkHash = chunkHash // Cập nhật hash của chunk hiện tại

          // Chuyển chunk thành string và lưu vào mảng chunkDataList
          const chunkData = Array.from(chunk)
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('')
          chunkDataList.push(chunkData)
          chunkHashList.push(chunkHash) // Thêm hash vào mảng chunkHashList
        }

        console.log(`Final file hash: ${lastChunkHash}`)
        resolve({ chunkData: chunkDataList, chunkHash: chunkHashList }) // Trả về cả 2 mảng chunkData và chunkHash
      }
    }

    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file) // Bắt đầu đọc file dưới dạng ArrayBuffer
  })
}

export const convertBlobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, { type: blob.type })
}

export const base64ToFile = (base64: string, fileName: string): File => {
  const [prefix, base64String] = base64.split(',')
  console.log('prefix', prefix)
  const byteString = atob(base64String)

  const arrayBuffer = new ArrayBuffer(byteString.length)
  const uint8Array = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i)
  }

  const blob = new Blob([uint8Array], { type: 'image/png' })
  const file = new File([blob], fileName, { type: 'image/png' })

  return file
}

export function convertExponentialToDecimal(numberInput) {
  let numStr = String(numberInput)
  let sign = ''

  if (numStr.charAt(0) === '-') {
    sign = '-'
    numStr = numStr.substring(1)
  }

  const [base, exponent] = numStr.split(/[eE]/)

  if (!exponent) return sign + numStr

  const decimalSeparator = (1.1).toLocaleString().substring(1, 2)
  const [leftPart, rightPart = ''] = base.split(decimalSeparator)
  const expValue = parseInt(exponent, 10)

  let result

  if (expValue > 0) {
    const rightPadding = Math.max(expValue - rightPart.length, 0)
    const rightExpanded = rightPart + '0'.repeat(rightPadding)
    result = leftPart + rightExpanded.slice(0, expValue) + decimalSeparator + rightExpanded.slice(expValue)
    if (result.endsWith(decimalSeparator)) result = result.slice(0, -1)
  } else {
    const leftPadding = Math.max(Math.abs(expValue) - leftPart.length, 0)
    const leftExpanded = '0'.repeat(leftPadding) + leftPart
    result = leftExpanded.slice(0, expValue) + decimalSeparator + leftExpanded.slice(expValue) + rightPart

    if (result.startsWith(decimalSeparator)) result = '0' + result
  }
  return sign + result
}

export const multiplyToExponential = (value?: string | number, decimalPlaces = 6): string => {
  if (!value) return ''
  const result = new BigNumber(value).multipliedBy(new BigNumber(`1e${decimalPlaces}`))
  return convertExponentialToDecimal(result.toString())
}

export const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result) // Trả về chuỗi Base64
      } else {
        reject(new Error('Failed to convert Blob to Base64'))
      }
    }

    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(blob) // Đọc Blob dưới dạng Base64
  })
}

export const isHexString = (str: string): boolean => {
  const hexRegex = /^[0-9A-Fa-f]+$/

  // Check if the string matches the hex pattern and if the length is even
  return hexRegex.test(str) && str.length % 2 === 0
}
