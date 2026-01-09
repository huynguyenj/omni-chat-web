import ChatLayout from '@/features/chat/layouts/ChatLayout'
import PageLayout from '@/layouts/PageLayout'
import { createBrowserRouter } from 'react-router'
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
      }
    ]
  }
])