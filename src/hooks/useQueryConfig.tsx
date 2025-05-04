import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
//
import useQueryParams from '~/hooks/useQueryParams'
import { ListConfig } from '~/@types/common'

export type QueryConfig = {
  [key in keyof ListConfig]: string
}

function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy(
    {
      creaetProductType: queryParams.creaetProductType,
      productId: queryParams.productId,
      isEditing: queryParams.isEditing
    },
    isUndefined
  )
  return queryConfig
}

export default useQueryConfig
