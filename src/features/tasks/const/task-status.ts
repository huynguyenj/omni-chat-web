
type TaskStatusType = {
  name: string
  tagVariant: 'success' | 'primary' | 'warn' | 'default' | 'gray' | 'danger'
}
export const TASK_STATUS: Record<string, TaskStatusType> = {
  New: {
    name: 'Mới',
    tagVariant: 'default'
  },
  InProgress: {
    name: 'Đang thực hiện',
    tagVariant: 'primary'
  },
  PendingReassign: {
    name: 'Đang chuyển hướng',
    tagVariant: 'warn'
  },
  Reassign: {
    name: 'Phân công lại',
    tagVariant: 'warn'
  },
  Done: {
    name: 'Hoàn thành',
    tagVariant: 'success'
  },
  Cancelled: {
    name: 'Đã hủy',
    tagVariant: 'danger'
  },
  Closed: {
    name: 'Đã đóng',
    tagVariant: 'gray'
  }
}