import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import ClearIcon from '@mui/icons-material/Clear'
import CodeIcon from '@mui/icons-material/Code'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import RedoIcon from '@mui/icons-material/Redo'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import UndoIcon from '@mui/icons-material/Undo'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import { FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND } from 'lexical'
import { FC } from 'react'
import useColorPicker from '../../hooks/useColorPicker'
import useCustomCommands from '../../hooks/useCustomCommands'
import useEditorToolbar from '../../hooks/useEditorToolbar'
import '../../styles/EditorTheme.css'
import { ToolbarProps } from '../../types'
import { getActiveBtnStyle } from '../../utils'
import AlignMenu from '../AlignMenu'
import BlockFormatMenu from '../BlockFormatMenu'
import ColorPicker from '../ColorPicker'
import FormatTextMenu from '../FormatTextMenu'
import InsertMenu from '../InsertMenu'
import useStyles from './styles'

const Toolbar: FC<ToolbarProps> = ({ editable }) => {
  const classes = useStyles()
  const [editor] = useLexicalComposerContext()
  const { hasFormat, isEditorEmpty, blockType, clearFormatting } = useEditorToolbar()

  const { clearEditorContent } = useCustomCommands()

  const handleClearEditorContent = () => {
    if (confirm("Are you sure you want to clear out the editor's content?")) clearEditorContent()
  }

  const { onFontColorSelect, onBgColorSelect } = useColorPicker()

  if (!editable) return null

  return (
    <Stack direction='row' gap={1} className={classes.root}>
      <Tooltip title='Undo (Ctrl + Z)'>
        <IconButton size='small' onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
          <UndoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Redo (Ctrl + Y)'>
        <IconButton size='small' onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
          <RedoIcon />
        </IconButton>
      </Tooltip>
      <Divider orientation='vertical' flexItem />
      <BlockFormatMenu blockType={blockType} />
      <Divider orientation='vertical' flexItem />
      <Tooltip title='Bold (Ctrl + B)'>
        <IconButton
          size='small'
          sx={getActiveBtnStyle(hasFormat.bold)}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        >
          <FormatBoldIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Italic (Ctrl + I)'>
        <IconButton
          size='small'
          sx={getActiveBtnStyle(hasFormat.italic)}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        >
          <FormatItalicIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Underline (Ctrl + U)'>
        <IconButton
          size='small'
          sx={getActiveBtnStyle(hasFormat.underline)}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        >
          <FormatUnderlinedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Strikethrough'>
        <IconButton
          size='small'
          sx={getActiveBtnStyle(hasFormat.strikethrough)}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        >
          <StrikethroughSIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Insert code block'>
        <IconButton
          size='small'
          sx={getActiveBtnStyle(hasFormat.code)}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        >
          <CodeIcon />
        </IconButton>
      </Tooltip>
      <ColorPicker
        key='color-picker'
        title='Font color'
        onChange={(color) => onFontColorSelect(color)}
        icon={<ColorLensIcon />}
      />
      <ColorPicker
        key='bg-color-picker'
        title='Background color'
        onChange={(color) => onBgColorSelect(color)}
        icon={<FormatColorFillIcon />}
      />
      <Divider orientation='vertical' flexItem />
      <FormatTextMenu hasFormat={hasFormat} />
      <Divider orientation='vertical' flexItem />
      <InsertMenu />
      <Divider orientation='vertical' flexItem />
      <AlignMenu />
      <Divider orientation='vertical' flexItem />
      <Tooltip title='Clear editor'>
        <IconButton size='small' disabled={isEditorEmpty} onClick={handleClearEditorContent}>
          <ClearIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Clear formatting'>
        <IconButton size='small' onClick={clearFormatting}>
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}

export default Toolbar
