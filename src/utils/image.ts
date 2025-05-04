export function filterImageUrls(urls: string[]): string[] {
  // const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'] // Define valid image extensions

  return urls.filter((url) => {
    // Check if the URL contains 'blob:' or lacks a valid image extension
    // return !url.startsWith('blob:') && validExtensions.some((ext) => url.endsWith(ext))
    return !url.startsWith('blob:')
  })
}

export function filterNonBase64Urls(urls: string[]): string[] {
  return urls.filter((url) => {
    // Loại bỏ các URL bắt đầu bằng 'data:image' (base64)
    return !url.startsWith('data:image')
  })
}

export const createFileFromUrl = async (imageUrl: string) => {
  try {
    // Fetch hình ảnh từ URL
    const response = await fetch(imageUrl)
    const blob = await response.blob()

    // Lấy tên file từ URL
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]

    // Thông tin bổ sung cho đối tượng File
    const file = new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now() // Thời gian hiện tại
    })

    // Tạo đối tượng có đường dẫn và thông tin bổ sung
    const fileObject = {
      path: `./${fileName}`, // Đường dẫn tương đối
      relativePath: `./${fileName}`, // Đường dẫn tương đối
      lastModified: file.lastModified,
      lastModifiedDate: new Date(file.lastModified),
      name: file.name,
      size: file.size,
      type: file.type,
      webkitRelativePath: ''
    }

    console.log(fileObject)

    return fileObject
  } catch (error) {
    console.error('Error fetching image:', error)
  }
}
