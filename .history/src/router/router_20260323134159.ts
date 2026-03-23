import ChatLayout from '@/features/chat/layouts/ChatLayout'
import PageLayout from '@/layouts/PageLayout'
import { createBrowserRouter } from 'react-router'
import { PRIVATE_PATH, PUBLIC_PATH } from './path'
export const router = createBrowserRouter([
  {
    path: '/',
    Component: PageLayout,
    children: [
      {
        index: true,
        lazy: {
          Component: async () => (await import('@/pages/global/HomePage')).default
        }
      },
      {
        path: '/chat',
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
      //admin path để ở đây
      {
        path: PRIVATE_PATH.ADMIN,
        lazy: {
          Component: async () => (await import('@/pages/admin/AdminDashboard')).default
        }
      },
      {
        path: '/manager',
        lazy: {
          Component: async () => (await import('@/pages/manager/ManagerDashboard')).default
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
  },
  {
    path: PUBLIC_PATH.LOGIN,
    lazy: {
      Component: async () => (await import('@/pages/global/LoginPage')).default
    }
  }
])