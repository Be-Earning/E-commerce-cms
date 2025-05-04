import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import BorderHorizontalIcon from '@mui/icons-material/BorderHorizontal'
import { LuImagePlus } from 'react-icons/lu'

const useInsertMenu = () => {
  const [editor] = useLexicalComposerContext()

  const insertMenuItems = [
    {
      id: 'Horizontal',
      name: 'Horizontal Rule',
      icon: <BorderHorizontalIcon className='h-6 w-6' />,
      onClick: () => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
    },
    {
      id: 'Image',
      name: 'Insert Image',
      icon: <LuImagePlus size={24} opacity={0.6} />,
      onClick: () => {}
    }
  ]

  return {
    insertMenuItems
  }
}

export default useInsertMenu
