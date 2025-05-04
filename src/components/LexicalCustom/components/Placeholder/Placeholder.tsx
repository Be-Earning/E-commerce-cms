import Box from '@mui/material/Box'
import { FC } from 'react'
import { PlaceholderProps } from '../../types'

const Placeholder: FC<PlaceholderProps> = ({ className, children }) => {
  return <Box className={className}>{children}</Box>
}

export default Placeholder
