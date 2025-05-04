import { Switch } from '@headlessui/react'
import { memo } from 'react'

type SwitchButtonProps = { label?: string; isChecked?: boolean; handleOnChange?: () => void }

const SwitchButton = memo(({ isChecked, handleOnChange }: SwitchButtonProps) => {
  return (
    <Switch
      checked={isChecked}
      onChange={handleOnChange}
      className='group relative flex xs:h-7 sm:h-8 xs:w-[40px] sm:w-[56px] cursor-pointer rounded-full bg-[#CCCCCE] p-1 transition-colors duration-200 ease-in-out shadow-avatar data-[checked]:bg-white'
    >
      <span
        aria-hidden='true'
        className='pointer-events-none inline-block xs:size-5 sm:size-6 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-6 group-data-[checked]:bg-greenMain'
      />
    </Switch>
  )
})

export default SwitchButton
