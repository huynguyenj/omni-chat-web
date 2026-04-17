import ChatLayout from '@/features/chat/layouts/ChatLayout'
import PageLayout from '@/layouts/PageLayout'
import { createBrowserRouter } from 'react-router'
import { ERROR_PATH, PRIVATE_PATH, PUBLIC_PATH } from './path'
import { ROLE } from './roles'
import authLoader from './loader/auth-loader'
import roleLoader from './loader/role-loader'
export const router = createBrowserRouter([
  {
    path: '/admin',
    Component: PageLayout,
    loader: async () => {
      await authLoader()()
      await roleLoader(ROLE.ADMIN)()
      return null
    },
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
    loader: async () => {
      await authLoader()()
      await roleLoader(ROLE.MANAGER)()
      return null
    },
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
    loader: async () => {
      await authLoader()()
      await roleLoader(ROLE.STAFF)()
      return null
    },
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
    lazy: {
      Component: async () => (await import('@/pages/global/LoginPage')).default
    }
  },
  {
    path: ERROR_PATH.FORBIDDEN,
    lazy: {
      Component: async () => (await import('@/pages/error/ForbiddenPage')).default
    }
  }
])