import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import Stack from '@mui/material/Stack'
import { useEffect } from 'react'
import Placeholder from '../components/Placeholder'
import Toolbar from '../components/Toolbar'
import { initialConfig } from '../constants'
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin'
import ImagesPlugin from '../plugins/ImagePlugin'
import LocalStoragePlugin from '../plugins/LocalStoragePlugin'
import useStyles from './styles'

interface RichTextEditorProps {
  onChange: (editorState) => void
}

// Hook chỉ có thể gọi trong function component
const RichTextEditor = ({ onChange }: RichTextEditorProps) => {
  const classes = useStyles()

  return (
    <Stack className={classes.container}>
      <Toolbar editable />
      <RichTextPlugin
        contentEditable={<ContentEditable className={classes.contentEditable} />}
        placeholder={<Placeholder className={classes.placeholder}>Enter some rich text...</Placeholder>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <CodeHighlightPlugin />
      <MyOnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <LocalStoragePlugin namespace={initialConfig.namespace} />
      <ListPlugin />
      <HorizontalRulePlugin />
      <CheckListPlugin />
      <ImagesPlugin />
    </Stack>
  )
}

export default RichTextEditor

function MyOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState)
    })
  }, [editor, onChange])
  return null
}
