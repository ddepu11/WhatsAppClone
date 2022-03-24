import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import * as Contacts from 'expo-contacts'
import { DataProvider, LayoutProvider } from 'recyclerlistview'
import { firestoreDB } from '../../../../../firebaseconfig'
import { useAppSelector } from '../../../../../redux/store'
import { ChatType, RegistredUserFromContacts } from '../../../../types/types'
import { Dimensions } from 'react-native'
import Chat from '../../../../components/Chat'

const ChatsScreenLogic = () => {
  const { id, mobileNumber } = useAppSelector((state) => state.user.value)

  // Loading States
  // const [
  //   registeredUsersFromContactListLoading,
  //   setRegisteredUsersFromContactListLoading,
  // ] = useState(true)

  const [keyword, setKeyword] = useState('')
  const [showAddOptions, setShowAddOptions] = useState(false)

  const [chats, setChats] = useState<{
    data: DataProvider | undefined
    loading: boolean
  }>({
    data: undefined,
    loading: true,
  })

  const contactList = useRef<any[]>([])
  const layoutProvider = useRef<any>()

  const [registeredUsersFromContactList, setRegisteredUsersFromContactList] =
    useState<{
      data: RegistredUserFromContacts[] | undefined
      loading: boolean
    }>({ data: undefined, loading: true })

  // Fetching info of Registered Users From Contact List
  useEffect(() => {
    let setTimeOutIds: any = 0

    const newRegisteredUsersFromContactList: RegistredUserFromContacts[] = []

    const fetchRegisteredUsers = async (
      mobileNumber: string | undefined,
      fullName: string | undefined
    ) => {
      const usersRef = collection(firestoreDB, 'users')

      // Create a query against the collection.
      const q = query(usersRef, where('mobileNumber', '==', mobileNumber))

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const { status, mobileNumber, displayPic } = doc.data()

          newRegisteredUsersFromContactList.push({
            id: doc.id,
            fullName,
            displayPicUrl: displayPic.url,
            mobileNumber,
            status,
          })

          // setRegisteredUsersFromContactList((prevState) => [
          //   ...prevState,
          //   {
          //     id: doc.id,
          //     fullName,
          //     displayPicUrl: displayPic.url,
          //     mobileNumber,
          //     status,
          //   },
          // ])
        })
      }
    }

    if (registeredUsersFromContactList.data === undefined) {
      // setRegisteredUsersFromContactListLoading(true)

      ;(async () => {
        const { status } = await Contacts.requestPermissionsAsync()

        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
          })

          if (data.length > 0) {
            // Mapping contacts, removing duplicates,
            const contacts = [
              ...data
                .map(({ firstName, lastName, phoneNumbers }) => {
                  let number: string | undefined
                  let fullName: string | undefined

                  if (phoneNumbers && phoneNumbers[0].number) {
                    number = phoneNumbers[0].number
                      ?.replace(/[(|)| |\|+|-]/g, '')
                      .trim()

                    if (number && number.length === 12) {
                      number = number?.slice(2)
                    }
                  }

                  if (firstName && firstName !== 'undefined') {
                    fullName = `${firstName}`
                  }

                  if (lastName && lastName !== 'undefined') {
                    fullName = `${firstName} ${lastName}`
                  }

                  if (
                    firstName &&
                    firstName === 'undefined' &&
                    lastName &&
                    lastName === 'undefined'
                  ) {
                    fullName = number
                  }

                  let obj: {
                    fullName: string | undefined
                    number: string | undefined
                  } = { fullName, number }

                  return obj
                })
                .filter(({ fullName, number }) => {
                  if (number?.length !== 10) {
                    return false
                  } else if (!number) {
                    return false
                  } else if (number === mobileNumber) {
                    return false
                  } else if (number && number.length < 10) {
                    return false
                  } else {
                    return true
                  }
                })
                .reduce((mapOfContacts, currentContact) => {
                  return mapOfContacts.set(
                    currentContact.number,
                    currentContact
                  )
                }, new Map())
                .values(),
            ]

            contactList.current = contacts

            // Checking if the contacts are registered to our app or not
            for (let index = 1; index <= contacts.length; index++) {
              setTimeOutIds = setTimeout(() => {
                const contact: {
                  fullName: string | undefined
                  number: string | undefined
                } = contacts[index - 1]

                if (contact && contact.number) {
                  if (contact.number?.length === 10) {
                    fetchRegisteredUsers(contact.number, contact.fullName)
                  }
                } else {
                  console.log('Number not available in this contact')
                }

                // At the end of the contacts
                if (index === contacts.length) {
                  setRegisteredUsersFromContactList({
                    data: newRegisteredUsersFromContactList,
                    loading: false,
                  })

                  // setRegisteredUsersFromContactListLoading(false)
                }
              }, index * 200)
            }
          } else {
            console.log('There are no contacts in your mobile!')
            setRegisteredUsersFromContactList({
              data: undefined,
              loading: false,
            })
          }
        } else {
          console.log('Permission denied')
          setRegisteredUsersFromContactList({
            data: undefined,
            loading: false,
          })
        }
      })()
    }

    return () => {
      while (setTimeOutIds) {
        clearTimeout(setTimeOutIds)
        setTimeOutIds = setTimeOutIds - 1
      }
    }
  }, [])

  // Fetching Chats
  useEffect(() => {
    const q = query(
      collection(firestoreDB, 'chats'),
      where('participantIDs', 'array-contains', id)
    )

    let unsubscribe = onSnapshot(q, (snap) => {
      const allChats: ChatType[] = []

      let index = 0

      if (snap.empty) {
        setChats({
          data: undefined,
          loading: false,
        })
      }

      snap.forEach(async (chatDocument) => {
        // There are two id in  participantIDs array one is
        // current user and other is the person i am talking to
        const participantIDs: string[] = chatDocument.get('participantIDs')
        const otherPersonId: string = participantIDs.filter(
          (item) => item !== id
        )[0]

        // Get Other persons image
        const docRef = doc(firestoreDB, 'users', otherPersonId)
        const userDocSnap = await getDoc(docRef)

        const mobileNumber: string = userDocSnap.get('mobileNumber')
        const displayPic: { url: string } = userDocSnap.get('displayPic')

        const person = contactList.current.filter(
          ({ number }) => number === mobileNumber
        )[0]

        if (person) {
          allChats.push({
            ...chatDocument.data(),
            updatedOn: chatDocument.get('updatedOn'),
            fullName: person.fullName,
            displayPicUrl: displayPic.url,
            chatId: chatDocument.id,
            otherPersonId,
          })
        }

        if (snap.size - 1 === index) {
          let dataProvider = new DataProvider((r1, r2) => {
            return r1.chatId !== r2.chatId
          })

          setChats({
            data: dataProvider.cloneWithRows(allChats),
            loading: false,
          })
        }

        index = index + 1
      })
    })

    let { width } = Dimensions.get('window')

    layoutProvider.current = new LayoutProvider(
      (index) => {
        return 0
      },
      (type, dim) => {
        switch (type) {
          case 0:
            dim.width = width
            dim.height = 80
            break

          default:
            dim.width = 0
            dim.height = 0
        }
      }
    )

    return () => {
      unsubscribe && unsubscribe()
    }
  }, [])

  const rowRenderer = (type: any, data: any) => {
    return <Chat {...data} />
  }

  const handleRefreshAllContacts = () => {
    setRegisteredUsersFromContactList((prevState) => {
      return { ...prevState, loading: true }
    })

    const contacts = contactList.current

    const newRegisteredContacts: RegistredUserFromContacts[] = []

    const fetchRegisteredUsers = async (
      mobileNumber: string | undefined,
      fullName: string | undefined
    ) => {
      const usersRef = collection(firestoreDB, 'users')

      // Create a query against the collection.
      const q = query(usersRef, where('mobileNumber', '==', mobileNumber))

      try {
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const { status, mobileNumber, displayPic } = doc.data()

            newRegisteredContacts.push({
              id: doc.id,
              fullName,
              displayPicUrl: displayPic.url,
              mobileNumber,
              status,
            })
          })
        }
      } catch (err: any) {
        console.log(err.code)
        console.log(err.message)
      }
    }

    for (let index = 1; index <= contacts.length; index++) {
      setTimeout(async () => {
        const contact: {
          fullName: string | undefined
          number: string | undefined
        } = contacts[index - 1]

        if (contact && contact.number) {
          await fetchRegisteredUsers(contact.number, contact.fullName)
        } else {
          console.log('Number not available in this contact')
        }

        // At the end of the contacts
        if (index === contacts.length) {
          setRegisteredUsersFromContactList({
            data: newRegisteredContacts,
            loading: false,
          })
        }
      }, index * 200)
    }

    if (contacts.length === 0) {
      setRegisteredUsersFromContactList({
        data: undefined,
        loading: false,
      })
    }
  }

  const toggleShowAddOptions = (): void => {
    setShowAddOptions((prevState) => !prevState)
  }

  const handleSearchChat = (keyword: string): void => {
    setKeyword(keyword)
  }

  return {
    keyword,
    handleSearchChat,
    chats,
    showAddOptions,
    setShowAddOptions,
    toggleShowAddOptions,
    registeredUsersFromContactList,
    setRegisteredUsersFromContactList,
    handleRefreshAllContacts,
    rowRenderer,
    layoutProvider,
  }
}

export default ChatsScreenLogic
