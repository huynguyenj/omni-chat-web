export type ClaimCategory = {
      id: string
      typeName: string
}

export type ClaimCreation = {
      description: string
      reason: string
      staffId: string
      claimTypeId: string
      conversationId: string | null
}

export type ClaimType = {
      id: string
      claimType: string
      submitDate: string
      status: 'Pending' | 'Approve' | 'Rejected'
      description: string
      reason: string
    }