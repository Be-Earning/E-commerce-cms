import React, { createContext, useContext, useState } from 'react'

interface ImageDBContextType {
  addImage: (productId: string, imageUrl: string) => void
  getImage: (productId: string) => Promise<string | null>
  updateImage: (productId: string, imageUrl: string) => void
  deleteImage: (productId: string) => void
}

interface ImageDBProviderProps {
  children: React.ReactNode
}

const ImageDBContext = createContext<ImageDBContextType | undefined>(undefined)

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('imageDB', 1)

    request.onerror = () => {
      reject('Error opening database')
    }

    request.onsuccess = (event: any) => {
      resolve(event?.target?.result as IDBDatabase)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'productId' })
      }
    }
  })
}

// Hàm thêm ảnh vào IndexedDB
const addImageToDB = async (productId: string, imageUrl: string) => {
  const db = await openDB()
  const transaction = db.transaction('images', 'readwrite')
  const store = transaction.objectStore('images')
  store.put({ productId, imageUrl })
  return transaction.oncomplete
}

// Hàm lấy ảnh từ IndexedDB
const getImageFromDB = async (productId: string) => {
  const db = await openDB()
  const transaction = db.transaction('images', 'readonly')
  const store = transaction.objectStore('images')
  const request = store.get(productId)
  return new Promise<string | null>((resolve, reject) => {
    request.onsuccess = (event: any) => {
      resolve(event?.target?.result ? (event?.target?.result as any).imageUrl : null)
    }
    request.onerror = reject
  })
}

// Hàm cập nhật ảnh trong IndexedDB
const updateImageInDB = async (productId: string, imageUrl: string) => {
  const db = await openDB()
  const transaction = db.transaction('images', 'readwrite')
  const store = transaction.objectStore('images')
  store.put({ productId, imageUrl })
  return transaction.oncomplete
}

// Hàm xóa ảnh trong IndexedDB
const deleteImageFromDB = async (productId: string) => {
  const db = await openDB()
  const transaction = db.transaction('images', 'readwrite')
  const store = transaction.objectStore('images')
  store.delete(productId)
  return transaction.oncomplete
}

export const ImageDBProvider: React.FC<ImageDBProviderProps> = ({ children }) => {
  const [images, setImages] = useState<Map<string, string>>(new Map())

  const addImage = (productId: string, imageUrl: string) => {
    addImageToDB(productId, imageUrl)
    setImages((prev) => new Map(prev).set(productId, imageUrl))
  }

  const getImage = async (productId: string) => {
    const imageUrl = await getImageFromDB(productId)
    return imageUrl
  }

  const updateImage = (productId: string, imageUrl: string) => {
    updateImageInDB(productId, imageUrl)
    setImages((prev) => {
      const newImages = new Map(prev)
      newImages.set(productId, imageUrl)
      return newImages
    })
  }

  const deleteImage = (productId: string) => {
    deleteImageFromDB(productId)
    setImages((prev) => {
      const newImages = new Map(prev)
      newImages.delete(productId)
      return newImages
    })
  }

  const contextValue = {
    images,
    addImage,
    getImage,
    updateImage,
    deleteImage
  }

  return <ImageDBContext.Provider value={contextValue}>{children}</ImageDBContext.Provider>
}

export const useImageDB = () => {
  const context = useContext(ImageDBContext)
  if (!context) {
    throw new Error('useImageDB must be used within an ImageDBProvider')
  }
  return context
}
