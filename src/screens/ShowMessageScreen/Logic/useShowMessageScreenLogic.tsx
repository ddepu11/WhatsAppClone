import { useEffect, useRef, useState } from 'react'
import firestore, {
  collection,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { firestoreDB } from '../../../../firebaseconfig'
import { useAppDispatch, useAppSelector } from '../../../../redux/store'
import { messageSendSuccess } from '../../../../redux/states/messagesState'
import { userState } from '../../../../redux/types/types'

interface MessageInterface {
  createdOn: number
  text?: string
  picURL?: string
  audioURL?: string
  userId: string
}

const useShowMessageScreenLogic = (chatId: string, otherPersonId: string) => {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const [fetchMessageLoading, setFetchMessageLoading] = useState(true)
  const [otherPersonOnfo, setOtherPersonOnfo] = useState<
    { isOnline: boolean } | undefined
  >(undefined)

  const { id } = useAppSelector((state) => state.user.value)
  const { sendMessageLoading } = useAppSelector((state) => state.messages.value)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const q = query(
      collection(firestoreDB, 'chats', chatId, 'messages'),
      orderBy('createdOn', 'asc')
    )

    let unsubscribe: firestore.Unsubscribe

    unsubscribe = onSnapshot(q, (messageSnap) => {
      const newMessages: any[] = []

      let index = 0

      messageSnap.forEach((messageDoc) => {
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

  // Fetch Other person details
  useEffect(() => {
    const unsub = onSnapshot(
      doc(firestoreDB, 'users', otherPersonId),
      (doc) => {
        let isOnline = doc.get('isOnline')

        setOtherPersonOnfo({ isOnline })
      }
    )

    return () => {
      unsub()
    }
  }, [])

  return {
    messages,
    id,
    sendMessageLoading,
    fetchMessageLoading,
    otherPersonOnfo,
  }
}

export default useShowMessageScreenLogic
