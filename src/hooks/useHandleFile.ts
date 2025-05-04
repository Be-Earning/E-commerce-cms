import toast from 'react-hot-toast'
import { sendTransaction } from '~/smartContract/combineSdk'
import { generateFileHash, handleMessageError, splitFileIntoChunks } from '~/utils/convert'

interface FileData {
  fileKey: string
  dataFile: File
  // dataChunk?: { chunkData: string[]; chunkHash: string[] }
}

const useHandleFile = () => {
  const handleGetFile = async (from: string, fileKeys: string[]) => {
    try {
      const result = await sendTransaction('getFilesInfo', { fileKeys: fileKeys }, 'file', from, 'chain', 'read')
      console.log('handleGetFile---getFilesInfo', result)
      const images = result?.data?.infos || []
      const dataFiles = images.map((image, index) => {
        const fileKey = fileKeys[index] || 'Unknown'
        return {
          fileKey,
          dataImage: image
        }
      })

      const allFilesContent: any = []
      console.log('dataFiles----', dataFiles)
      for (const file of dataFiles) {
        const totalChunks = file.dataImage.totalChunks
        let start = 0
        const limit = 10
        const fileParts: string[] = []
        while (start < totalChunks) {
          try {
            let fileChunk = await sendTransaction(
              'downloadFile',
              { fileKey: file.fileKey, start: start, limit: limit },
              'file',
              from,
              'chain',
              'read'
            )
            console.log('downloadFilee-----', fileChunk)
            fileParts.push(...fileChunk.data)
            start += limit
          } catch (chunkError) {
            toast.error(handleMessageError(chunkError))
            return null
          }
        }
        const fileContent = fileParts.join('')
        allFilesContent.push({ ...file, fileContent })
      }
      return { ...result.data, files: allFilesContent }
    } catch (error) {
      toast.error(handleMessageError(error))
    }
  }

  const handlePushFiles = async (from: string, files: any[]) => {
    try {
      console.log('files---', files)
      const currentKey: string[] = []
      const fileInfos: any = []
      const fileNames: any = []

      // Lặp qua từng file trong mảng `files`
      for (let i = 0; i < files.length; i++) {
        console.log('files[i]files[i]--', files[i])
        if (typeof files[i] === 'string') {
          currentKey.push(files[i])
          continue
        }
        const file = files[i]
        const fileName = file.name
        const contentLen = file.size
        const totalChunks = Math.ceil(contentLen / 1024)
        console.log('file---', file)
        const hash = await generateFileHash(file)

        if (totalChunks > 100) {
          toast.error(`The image ${i + 1} is too big!`)
          return
        }

        const timestamp = Date.now()
        const sanitizedFileName = fileName
          .split('.')
          .slice(0, -1)
          .join('.') // Lấy phần tên file trước dấu chấm
          .replace(/\s+/g, '_') // Thay thế khoảng trắng bằng dấu gạch dưới
          .replace(/[^\w\-_.]/g, '') // Loại bỏ các ký tự đặc biệt không hợp lệ

        const fileNameWithTimestamp = `${sanitizedFileName}_${timestamp}.${fileName.split('.').pop() || ''}`
        console.log('fileNameWithTimestamp---', fileNameWithTimestamp)

        // Thêm thông tin file vào mảng `fileInfos`
        fileNames.push(fileNameWithTimestamp)
        fileInfos.push({
          owner: from,
          hash: hash,
          contentLen: contentLen,
          totalChunks: totalChunks,
          expireTime: Math.floor(Date.now() / 1000) + 31536000,
          name: fileNameWithTimestamp,
          ext: fileName.split('.').pop() || '',
          status: 0,
          contentDisposition: '',
          contentID: ''
        })
      }

      const response = await sendTransaction('pushFileInfos', { infos: fileInfos }, 'file', from, 'chain')
      console.log('pushFileInfos---response')
      if (!response || !response.success) {
        console.log('File infos uploaded fail')
        return
      }
      console.log('File infos uploaded successfully:', response.data)

      const fileKeys = await sendTransaction('getFileKeyFromName', { names: fileNames }, 'file', from, 'chain', 'read')
      if (!fileKeys || !fileKeys.success) {
        console.log('getFileKeyFromName fail')
        return
      }
      console.log('fileKeys---', fileKeys)

      if (fileKeys && fileKeys.success) {
        const allKey = [...currentKey, ...fileKeys.data]
        const datas: FileData[] = files.map((file, index) => {
          console.log('filefile---', file)
          if (typeof file !== 'string') {
            const fileKey = allKey[index] || ''

            return {
              fileKey,
              dataFile: file
            }
          }
          return {
            fileKey: file,
            dataFile: ''
          }
        })
        console.log('datas---', datas)
        for (const data of datas) {
          if (!data.dataFile) continue
          console.log('data.dataFile---', data.dataFile)
          const chunks = await splitFileIntoChunks(data.dataFile)
          console.log('chunkschunkschunks---', {
            fileKey: data.fileKey,
            chunkDatas: chunks.chunkData,
            chunkHashes: chunks.chunkHash
          })
          const resUpload = await sendTransaction(
            'uploadChunks',
            {
              fileKey: data.fileKey,
              chunkDatas: chunks.chunkData,
              chunkHashes: chunks.chunkHash
            },
            'file',
            from,
            'chain'
          )
          if (!resUpload || !resUpload.success) {
            toast.error('File upload fail!')
            return
          }
          console.log('File upload completed successfully!')
        }
        return allKey
      }

      return fileKeys?.data
    } catch (error: any) {
      toast.error(handleMessageError(error) || 'File upload failed!')
      console.error(error)
    }
  }

  return {
    handleGetFile,
    handlePushFiles
  }
}

export default useHandleFile
