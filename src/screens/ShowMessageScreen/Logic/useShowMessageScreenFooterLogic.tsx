import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import EmojiPicker from 'rn-emoji-keyboard'
import * as ImagePicker from 'expo-image-picker'
import { Audio } from 'expo-av'
import { firebaseStorage, firestoreDB } from '../../../../firebaseconfig'
import { useAppDispatch, useAppSelector } from '../../../../redux/store'
import { EmojiType } from 'rn-emoji-keyboard/lib/typescript/types'
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable
} from 'firebase/storage'
import {
  messageSendFailure,
  messageSendRequest
} from '../../../../redux/states/messagesState'
import { Recording } from 'expo-av/build/Audio'

interface Props {
  chatId: string
}

const useShowMessageScreenFooterLogic = ({ chatId }: Props) => {
  const dispatch = useAppDispatch()
  const [message, setMessage] = useState('')

  const [recording, setRecording] = useState<Recording>()

  const [audio, setAudio] =
    useState<{ sound: Audio.Sound; duration: boolean; file: string | null }>()

  const [areYouRecording, setAreYouRecording] = useState(false)

  const { id } = useAppSelector((state) => state.user.value)
  const [isEmojiKeyboardOpen, setIsEmojiKeyboardOpen] = useState(false)

  const handleTypeMessage = (message: string) => {
    setMessage(message)
  }

  const hanleAttachDocs = () => {
    console.log('hanleAttachDocs')
  }

  const hanleAttachImages = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [5, 6],
        quality: 1
      })

      if (result && !result.cancelled) {
        const picURI = result.uri

        dispatch(messageSendRequest())

        const img = await fetch(picURI)
        const picBlob = await img.blob()

        const picName = `message_${Math.floor(
          Math.random() * Date.now()
        )}_.${picBlob.type.slice(6)}`

        const storageRef = ref(firebaseStorage, `chats/${chatId}/${picName}`)

        const uploadTask = uploadBytesResumable(storageRef, picBlob)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100

            console.log('Upload is ' + progress + '% done')

            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
            }
          },
          (err: any) => {
            console.log(err.code)
            console.log(err.message)
            console.log(err)

            dispatch(messageSendFailure())
          },
          async () => {
            // Handle successful uploads on complete
            const picURL = await getDownloadURL(storageRef)

            await addDoc(collection(firestoreDB, 'chats', chatId, 'messages'), {
              createdOn: Date.now(),
              picURL,
              userId: id
            })

            const chatRef = doc(firestoreDB, 'chats', chatId)

            await updateDoc(chatRef, {
              updatedOn: Date.now()
            })
          }
        )
      }
    } catch (err: any) {
      console.log(err.code)
      console.log(err.message)

      dispatch(messageSendFailure())
    }
  }

  const hanleSendMessage = async () => {
    try {
      await addDoc(collection(firestoreDB, 'chats', chatId, 'messages'), {
        createdOn: Date.now(),
        text: message,
        userId: id
      })

      setMessage('')

      const chatRef = doc(firestoreDB, 'chats', chatId)

      await updateDoc(chatRef, {
        updatedOn: Date.now()
      })
    } catch (err: any) {
      console.log(err.code)
      console.log(err.message)
      setMessage('')
    }
  }

  const handlePickEmoji = (emojiObject: EmojiType) => {
    setMessage((message) => `${message}${emojiObject.emoji}`)
  }

  // $$$$$$$$$$$$$$ Handling Audio ################

  const hanleRecordAudio = async () => {
    setAreYouRecording(true)

    try {
      console.log('Requesting permissions..')

      await Audio.requestPermissionsAsync()

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      })

      console.log('Starting recording..')

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      )

      setRecording(recording)

      console.log('Recording started')
    } catch (err) {
      setAreYouRecording(false)
      setAudio(undefined)
      console.error('Failed to start recording', err)
    }
  }

  const hanleStopAudioRecording = async () => {
    setAreYouRecording(false)

    console.log('Stopping recording..')

    setRecording(undefined)

    if (recording) {
      await recording.stopAndUnloadAsync()
      const { sound, status } = await recording.createNewLoadedSoundAsync()

      setAudio({ sound, duration: status.isLoaded, file: recording.getURI() })

      console.log('Recording stopped and stored')
    } else {
      setAudio(undefined)
    }
  }

  const playRecordedAudio = () => {
    if (audio) {
      audio.sound.playAsync()
    }
  }

  const handleStopPlayingAudio = () => {
    if (audio) {
      audio.sound.stopAsync()
    }
  }

  const handleCancelAttachAudio = () => {
    setAudio(undefined)
    setAreYouRecording(false)
    setRecording(undefined)
  }

  const handleSendAudio = async () => {
    dispatch(messageSendRequest())

    const audioFile = audio?.file
    const subStrings = audioFile?.split('.')
    let fileFormate: string = ''

    if (subStrings) {
      fileFormate = subStrings[subStrings?.length - 1]
    }

    try {
      const audioName = `audio_message_${Math.floor(
        Math.random() * Date.now()
      )}.${fileFormate}`

      const storageRef = ref(firebaseStorage, `chats/${chatId}/${audioName}`)

      const img = await fetch(audioFile as string)
      const audioBlob = await img.blob()

      setAreYouRecording(false)
      setAudio(undefined)
      setRecording(undefined)

      await uploadBytes(storageRef, audioBlob)

      const audioURL: string = await getDownloadURL(storageRef)

      await addDoc(collection(firestoreDB, 'chats', chatId, 'messages'), {
        createdOn: Date.now(),
        audioURL,
        userId: id
      })

      const chatRef = doc(firestoreDB, 'chats', chatId)

      await updateDoc(chatRef, {
        updatedOn: Date.now()
      })
    } catch (err: any) {
      dispatch(messageSendFailure())
      console.log(err.code)
      console.log(err.message)

      setAudio(undefined)
      setAreYouRecording(false)
      setRecording(undefined)
    }
  }

  // useEffect(() => {
  //   console.log({ chatId })
  // }, [])

  return {
    message,
    setMessage,
    handleTypeMessage,
    hanleAttachDocs,
    hanleAttachImages,
    hanleRecordAudio,
    hanleSendMessage,
    EmojiPicker,
    handlePickEmoji,
    isEmojiKeyboardOpen,
    setIsEmojiKeyboardOpen,
    areYouRecording,
    hanleStopAudioRecording,
    audio,
    playRecordedAudio,
    handleStopPlayingAudio,
    handleCancelAttachAudio,
    handleSendAudio
  }
}

export default useShowMessageScreenFooterLogic
