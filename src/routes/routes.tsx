import { PATH_AUTH, PATH_PRIVATE_APP } from '~/constants/paths'
import { MainLayout } from '~/layouts/mainLayout'
import { SimpleLayout } from '~/layouts/simpleLayout'
import { ListAgents } from '~/pages/agent'
import AgentDetail from '~/pages/agent/AgentDetail'
import { SignIn } from '~/pages/auth'
import { CustomerDetail, ListCustomers } from '~/pages/customer'
import { Dashboard } from '~/pages/dashboard'
import { ListOrders } from '~/pages/order'
import { CreateProduct, EditProductImagePage, ListProducts, ProductDetail, ProductReview } from '~/pages/product'

export const privateRoutes = [
  {
    id: 1,
    layout: <MainLayout />,
    children: [
      {
        index: true,
        path: PATH_PRIVATE_APP.dashboard,
        element: <Dashboard />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.list,
        element: <ListProducts />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.order.list,
        element: <ListOrders />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.customer.list,
        element: <ListCustomers />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.customer.detail,
        element: <CustomerDetail />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.agent.detail,
        element: <AgentDetail />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.agent.list,
        element: <ListCustomers />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.add,
        element: <CreateProduct />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.update,
        element: <CreateProduct />
      }
    ]
  },
  {
    id: 2,
    layout: <SimpleLayout />,
    children: [
      {
        index: false,
        path: PATH_PRIVATE_APP.product.review,
        element: <ProductReview />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.detail,
        element: <ProductDetail />
      }
    ]
  }
]

export const adminRoutes = [
  {
    id: 1,
    layout: <MainLayout />,
    children: [
      {
        index: true,
        path: PATH_PRIVATE_APP.dashboard,
        element: <Dashboard />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.list,
        element: <ListProducts />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.order.list,
        element: <ListOrders />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.customer.list,
        element: <ListCustomers />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.customer.detail,
        element: <CustomerDetail />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.agent.detail,
        element: <AgentDetail />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.agent.list,
        element: <ListAgents />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.add,
        element: <CreateProduct />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.update,
        element: <CreateProduct />
      }
    ]
  },
  {
    id: 2,
    layout: <SimpleLayout />,
    children: [
      {
        index: false,
        path: PATH_PRIVATE_APP.product.review,
        element: <ProductReview />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.detail,
        element: <ProductDetail />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.reviewImage,
        element: <EditProductImagePage />
      }
    ]
  }
]

export const retailerRoutes = [
  {
    id: 1,
    layout: <MainLayout />,
    children: [
      {
        index: true,
        path: PATH_PRIVATE_APP.dashboard,
        element: <Dashboard />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.list,
        element: <ListProducts />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.order.list,
        element: <ListOrders />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.customer.list,
        element: <ListCustomers />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.customer.detail,
        element: <CustomerDetail />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.add,
        element: <CreateProduct />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.update,
        element: <CreateProduct />
      }
    ]
  },
  {
    id: 2,
    layout: <SimpleLayout />,
    children: [
      {
        index: false,
        path: PATH_PRIVATE_APP.product.review,
        element: <ProductReview />
      },
      {
        index: false,
        path: PATH_PRIVATE_APP.product.detail,
        element: <ProductDetail />
      }
    ]
  }
]

export const publicRoutes = [
  {
    index: true,
    path: PATH_AUTH.signin.root,
    element: <SignIn />
  }
]
