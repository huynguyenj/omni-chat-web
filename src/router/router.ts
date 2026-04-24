import ChatLayout from '@/features/chat/layouts/ChatLayout'
import PageLayout from '@/layouts/PageLayout'
import { createBrowserRouter } from 'react-router'
import { ERROR_PATH, PRIVATE_PATH, PUBLIC_PATH } from './path'
import { ROLE } from './roles'
import { guestLoader } from './loader/guest-loader'
import protectedRole from './loader/protectedRole'
export const router = createBrowserRouter([
  {
    path: '/admin',
    Component: PageLayout,
    loader: protectedRole(ROLE.ADMIN),
    children: [
      {
        path: PRIVATE_PATH.ADMIN,
        index: true,
        lazy: {
          Component: async () => (await import('@/pages/admin/AdminDashboard')).default
        }
      }
    ]
  },
  {
    path: '/manager',
    Component: PageLayout,
    loader: protectedRole(ROLE.MANAGER),
    children: [
      {
        path: PRIVATE_PATH.MANAGER,
        index: true,
        lazy: {
          Component: async () => (await import('@/pages/manager/ManagerDashboard')).default
        }
      }
    ]
  },
  {
    path: '/staff',
    Component: PageLayout,
    loader: protectedRole(ROLE.STAFF),
    children: [
      {
        path: PRIVATE_PATH.CHAT,
        Component: ChatLayout,
        children: [
          {
            index: true,
            lazy: {
              Component: async () => (await import('@/pages/staff/ChatPage')).default
            }
          }
        ]
      },
      {
        path: PRIVATE_PATH.CLAIM,
        lazy: {
          Component: async () => (await import('@/pages/staff/ClaimPage')).default
        }
      },
      {
        path: PRIVATE_PATH.TASK,
        lazy: {
          Component: async () => (await import('@/pages/staff/TaskPage')).default
        }
      }
    ]
  },

  {
    path: PUBLIC_PATH.LOGIN,
    loader: guestLoader(),
    lazy: {
      Component: async () => (await import('@/pages/global/LoginPage')).default
    }
  },
  {
    path: ERROR_PATH.FORBIDDEN,
    lazy: {
      Component: async () => (await import('@/pages/error/ForbiddenPage')).default
    }
  },
  {
    path: PUBLIC_PATH.PRODUCT,
    lazy: {
      Component: async () => (await import('@/pages/global/ProductPage')).default
    }
  },
  {
    path: PUBLIC_PATH.CUSTOMER_FORM,
    lazy: {
      Component: async () => (await import('@/pages/global/CustomerFormPage')).default
    }
  },
  {
    path: PUBLIC_PATH.PAYMENT_STAtUS,
    lazy: {
      Component: async () => (await import('@/pages/global/PaymentPage')).default
    }
  }
])