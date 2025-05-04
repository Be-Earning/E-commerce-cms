import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useMediaQuery } from '@mui/material'
import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FC, MouseEvent, useState } from 'react'
import useInsertMenu from '../../hooks/useInsertMenu'
import { getMenuButtonStyle } from '../../utils'
import { INSERT_IMAGE_COMMAND } from '../../plugins/ImagePlugin'

const InsertMenu: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [editor] = useLexicalComposerContext()
  const open = Boolean(anchorEl)

  const isMdViewport = useMediaQuery('(min-width:960px)')

  const handleClickIconButton = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const { insertMenuItems } = useInsertMenu()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          altText: file.name,
          src: reader.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <Button
        aria-haspopup={anchorEl ? 'true' : undefined}
        aria-controls={anchorEl ? 'insert-more-menu' : undefined}
        onClick={handleClickIconButton}
        size={isMdViewport ? 'large' : 'small'}
        variant='text'
        color='info'
        sx={getMenuButtonStyle({ open, isMdViewport })}
        startIcon={<AddIcon />}
        endIcon={<KeyboardArrowDownIcon sx={{ color: 'grey.600' }} />}
      >
        {isMdViewport ? 'Insert' : null}
      </Button>
      <Menu
        id='insert-more-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'block-format-button',
          role: 'listbox'
        }}
      >
        {insertMenuItems.map((option) => (
          <MenuItem
            role='option'
            key={option.id}
            onClick={() => {
              handleClose()
              if (option.id === 'Image') {
                console.log('go here ???')
                document.getElementById('fileInput')?.click()
              } else {
                option.onClick()
              }
            }}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
      <input id='fileInput' type='file' accept='image/*' style={{ display: 'none' }} onChange={handleFileSelect} />
    </>
  )
}

export default InsertMenu
