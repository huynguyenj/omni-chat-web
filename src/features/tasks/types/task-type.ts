export type AnalysisTaskType = {
  totalDoneTask: number
  totalCreateOrder: number
  afferageResolveTime: number
  staffPerformance: number
}

export type IntentType = {
  id: string
  typeName: string
  description: string
}

export type TaskType = {
  id: string
  intentTypeName: string
  status: string
  createdAt: string
}