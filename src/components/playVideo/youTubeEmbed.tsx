const extractVideoId = (url: string) => {
  const urlObj = new URL(url)

  // https://youtube.com/shorts/bL2svHrirv4?si=ejTpfCsc7JdRUdRe
  // Kiểm tra xem URL có phải là YouTube Shorts hay không
  if (
    (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') &&
    urlObj.pathname.startsWith('/shorts/')
  ) {
    return urlObj.pathname.split('/shorts/')[1]
  }

  // Mặc định lấy ID từ tham số 'v'
  return urlObj.searchParams.get('v')
}
interface IYouTubeEmbedProps {
  url: string
  title: string
}

const YouTubeEmbed: React.FunctionComponent<IYouTubeEmbedProps> = ({ url, title }) => {
  if (!url) {
    return <div></div>
  }
  const videoId = extractVideoId(url)

  if (!videoId) {
    return <div></div>
  }

  return (
    <div className='relative h-[250px] w-full overflow-hidden'>
      <iframe
        className='youtube-embed aspect-auto h-full w-full'
        src={`https://www.youtube.com/embed/${videoId}?playlist=${videoId}&autoplay=1&modestbranding=1&rel=0&mute=1&loop=1&controls=0&fs=0&showinfo=0`}
        title={title}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default YouTubeEmbed
