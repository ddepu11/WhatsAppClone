type RegistredUserFromContacts = {
  id: string
  fullName: string | undefined
  status: string
  displayPicUrl: string
  mobileNumber: string
}

type ChatType = {
  participantIDs?: string[]
  updatedOn: number
  fullName: string
  displayPicUrl: string
  chatId: string
  otherPersonId: string
}

export { RegistredUserFromContacts, ChatType }
