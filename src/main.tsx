import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import 'react-day-picker/dist/style.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import 'swiper/css'
import 'swiper/css/effect-creative'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { store } from '~/redux/configStore.ts'
import App from './App.tsx'
import './index.scss'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { initialConfig } from './components/LexicalCustom/constants.tsx'
import { ImageDBProvider } from './context/ImageContext.tsx'

const rawContent = localStorage.getItem(initialConfig.namespace)

let safeEditorState: string | undefined = undefined

if (rawContent) {
  try {
    const parsed = JSON.parse(rawContent)
    if (parsed?.root?.children?.length > 0) {
      safeEditorState = rawContent
    }
  } catch (e) {
    console.warn('Invalid editorState in localStorage:', e)
  }
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Provider store={store}>
      <LexicalComposer initialConfig={{ ...initialConfig, editorState: safeEditorState }}>
        <ImageDBProvider>
          <App />
        </ImageDBProvider>
      </LexicalComposer>
    </Provider>
  </HashRouter>
)
