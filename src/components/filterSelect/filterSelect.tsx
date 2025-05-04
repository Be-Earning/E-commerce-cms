import * as React from 'react'
import { isDesktop } from 'react-device-detect'
import IconFilter from '~/components/icons/FilterIcon'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { cn } from '~/utils/classNames'

interface IFilterSelectProps {
  placeholder?: string
  option: {
    value: string
    label: string
  }[]
  icon?: React.ReactNode
  triggerClassName?: string
  noDefaultIcon?: boolean
  hasFilterText?: boolean
  onChange?: (value: string) => void
}
/**
 * Filter component custom
 * @param {string} placeholder - Placeholder for select
 * @param {object[]} option - List option for select
 * @param {React.ReactNode} icon - Icon for select
 * @param {string} triggerClassName - Classname for trigger
 * @param {boolean} noDefaultIcon - No default icon, if true, icon will not be shown
 * @param {boolean} hasFilterText - Show filter text, if true, filter text will be shown
 * @param {function} onChange - Callback when value change
 * @returns {React.ReactNode} FilterSelect component
 *
 * @example
 * ```tsx
 * <FilterSelect
 *   placeholder="Select an option"
 *   option={[
 *     { value: "option1", label: "Option 1" },
 *     { value: "option2", label: "Option 2" },
 *     { value: "option3", label: "Option 3" },
 *   ]}
 *   icon={<IconFilter />}
 *   triggerClassName="custom-trigger"
 *   noDefaultIcon={false}
 *   hasFilterText={true}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
const FilterSelect: React.FunctionComponent<IFilterSelectProps> = ({
  placeholder,
  option,
  icon,
  triggerClassName,
  noDefaultIcon,
  hasFilterText,
  onChange
}) => {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <Select
      onValueChange={(value) => {
        setValue(value)
        onChange && onChange(value)
      }}
    >
      <SelectTrigger
        className={`w-[50px] rounded-lg 2xs:!w-10 xs:flex xs:h-10 xs:w-10 xs:flex-shrink-0 xs:items-center xs:justify-center sm:h-11 md:h-12 lg:w-[250px] ${cn(icon || !noDefaultIcon ? 'sm:ps-12' : '', 'sm:min-w-[200px]', triggerClassName)}`}
      >
        {!noDefaultIcon && (
          <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center gap-2 xs:ps-2 sm:ps-3'>
            {icon}
            {!noDefaultIcon && !icon && <IconFilter className='h-6 w-6 lg:h-4 lg:w-4' />}
            <div className='h-1/2 w-[1px] bg-gray-lighter xs:hidden lg:flex'></div>
          </div>
        )}
        {value && hasFilterText && (
          <p className='text-[16px] text-black-main xs:hidden sm:flex'>
            Filter: {option.find((otp) => otp.value === value)?.label}
          </p>
        )}
        {value && !hasFilterText && (
          <p className='text-nowrap text-[16px] text-black-main xs:hidden sm:flex'>
            {option.find((otp) => otp.value === value)?.label}
          </p>
        )}
        {!value && isDesktop && <SelectValue placeholder={placeholder} className='xs:hidden sm:flex' />}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {option.map((otp) => (
            <SelectItem key={otp.value} value={otp.value} className='p-[12px]'>
              {otp.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default FilterSelect
