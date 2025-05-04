import { memo } from 'react'
import { Outlet } from 'react-router-dom'

const SimpleLayout = memo(() => {
  return (
    <main className='container'>
      <Outlet />
    </main>
  )
})

export default SimpleLayout
