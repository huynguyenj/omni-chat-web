import { CiChat1 } from 'react-icons/ci'
import type { IconType } from 'react-icons/lib'
import { IoDocumentTextOutline } from 'react-icons/io5'

type NavbarItemType = {
  name: string,
  icon: IconType
}
export const navbarItems: NavbarItemType[] = [
  { name: 'Chat', icon: CiChat1 },
  { name: 'Claims', icon: IoDocumentTextOutline }
]