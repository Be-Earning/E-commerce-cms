import { urlRegex } from '~/constants/urlRegex'

export const convertUrlsToLinks = (text = '') => {
  const words = text?.replace(/[\r\n]+/g, ' ').split(' ')
  const result: JSX.Element[] = []

  words?.forEach((word, index) => {
    if (word !== '') {
      if (urlRegex.test(word)) {
        result.push(
          <a key={index} href={word} className='text-blue-dark' target='_blank'>
            {word}
          </a>
        )
      } else result.push(<span>{word}</span>)
    }
  })

  return result
}

// Hàm kiểm tra xem URL có phải là đường dẫn YouTube hay không
export const isYouTubeUrl = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
  return youtubeRegex.test(url)
}

// Hàm kiểm tra xem URL có đuôi .mp4 hay không
export const isMp4Url = (url) => {
  return url.endsWith('.mp4')
}
