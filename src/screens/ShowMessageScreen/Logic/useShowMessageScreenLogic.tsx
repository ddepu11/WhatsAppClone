import { useEffect, useState } from 'react'
import firestore, {
  collection,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore'
import { firestoreDB } from '../../../../firebaseconfig'
import { useAppDispatch, useAppSelector } from '../../../../redux/store'
import { messageSendSuccess } from '../../../../redux/states/messagesState'

interface MessageInterface {
  createdOn: number
  text?: string
  picURL?: string
  audioURL?: string
  userId: string
}

const useShowMessageScreenLogic = (chatId: string) => {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const [fetchMessageLoading, setFetchMessageLoading] = useState(true)

  const { id } = useAppSelector(state => state.user.value)
  const { sendMessageLoading } = useAppSelector(state => state.messages.value)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const q = query(
      collection(firestoreDB, 'chats', chatId, 'messages'),
      orderBy('createdOn', 'asc')
    )

    let unsubscribe: firestore.Unsubscribe

    unsubscribe = onSnapshot(q, messageSnap => {
      const newMessages: any[] = []

      let index = 0

      messageSnap.forEach(messageDoc => {
        newMessages.push(messageDoc.data())

        if (messageSnap.size - 1 === index) {
          setFetchMessageLoading(false)
          setMessages(newMessages)
          dispatch(messageSendSuccess())
        }

        index = index + 1
      })

      // When there are no messages
      if (messageSnap.empty) {
        setFetchMessageLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return { messages, id, sendMessageLoading, fetchMessageLoading }
}

export default useShowMessageScreenLogic
