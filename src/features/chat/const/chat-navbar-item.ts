import { CiChat1 } from 'react-icons/ci'
import type { IconType } from 'react-icons/lib'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { IoChatbubbleOutline } from 'react-icons/io5'
import { RiGroupLine } from 'react-icons/ri'

type NavbarItemType = {
  name: string,
  icon: IconType
}
export const navbarItems: NavbarItemType[] = [
  { name: 'Chat', icon: CiChat1 },
  { name: 'Claims', icon: IoDocumentTextOutline }
]

export const messageItem: NavbarItemType[] = [
  { name: 'Messenger', icon: IoChatbubbleOutline },
  { name: 'Team chat', icon: RiGroupLine }
]