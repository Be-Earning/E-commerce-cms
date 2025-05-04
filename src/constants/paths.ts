import { path, pathRoot } from '~/utils/path'

const ROOTS_ERROR = '/error'
const ROOTS_AUTH = '/auth'
const ROOTS_CUSTOMER = '/customer'
const ROOTS_PRODUCT = '/product'
const ROOTS_ORDER = '/order'
const ROOTS_AGENT = '/agent'

export const PATH_ERROR = {
  noPermission: path(ROOTS_ERROR, '/403'),
  notFound: path(ROOTS_ERROR, '/404'),
  serverError: path(ROOTS_ERROR, '/500')
}

export const PATH_AUTH = {
  root: pathRoot(ROOTS_AUTH),
  signup: {
    root: path(ROOTS_AUTH, '/signup'),
    createWallet: path(ROOTS_AUTH, '/creaet-wallet'),
    information: path(ROOTS_AUTH, '/signup/information')
  },
  signin: {
    root: path(ROOTS_AUTH, '/signin'),
    seedphrase: path(ROOTS_AUTH, '/signin/seedphrase'),
    privateKey: path(ROOTS_AUTH, '/signin/private-key')
  }
}

export const PATH_PRIVATE_APP = {
  dashboard: '/dashboard',
  product: {
    root: ROOTS_PRODUCT,
    list: `${ROOTS_PRODUCT}s`,
    add: path(ROOTS_PRODUCT, '/add'),
    update: path(ROOTS_PRODUCT, '/update/:id'),
    review: path(ROOTS_PRODUCT, '/review'),
    reviewImage: path(ROOTS_PRODUCT, '/review/image/:id'),
    detail: path(ROOTS_PRODUCT, '/detail/:id')
  },
  order: {
    root: ROOTS_ORDER,
    list: `${ROOTS_ORDER}s`
  },
  customer: {
    root: ROOTS_CUSTOMER,
    list: `${ROOTS_CUSTOMER}s`,
    detail: path(ROOTS_CUSTOMER, '/detail/:id')
  },
  agent: {
    root: ROOTS_AGENT,
    list: `${ROOTS_AGENT}s`,
    detail: path(ROOTS_AGENT, '/detail/:id')
  }
}
