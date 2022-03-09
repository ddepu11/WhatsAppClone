import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  onSnapshot,
  setDoc
} from 'firebase/firestore'
import { Text, View, Center, Button } from 'native-base'
import { FC, useRef, useState } from 'react'
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCView,
  MediaStream,
  mediaDevices,
  EventOnAddStream
} from 'react-native-webrtc'
import { firestoreDB } from '../../../firebaseconfig'
import { useAppSelector } from '../../../redux/store'

const configuration = {
  iceServers: [{ url: 'stun:stun.l.google.com:19302' }]
}

const CameraScreen: FC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [gettingCall, setGettingCall] = useState(false)

  const pc = useRef<RTCPeerConnection>()
  const connecting = useRef(false)

  const { id } = useAppSelector((state) => state.user.value)

  const getStream = async () => {
    let isFront = true

    let sourceInfos = await mediaDevices.enumerateDevices()

    console.warn({ sourceInfos })

    let videoSourceId

    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i]
      if (
        sourceInfo.kind == 'videoinput' &&
        sourceInfo.facing == (isFront ? 'front' : 'environment')
      ) {
        videoSourceId = sourceInfo.deviceId
      }
    }

    // video: {
    //   width: 640,
    //   height: 480,
    //   frameRate: 30,
    //   facingMode: isFront ? 'user' : 'environment',
    //   deviceId: videoSourceId
    // }

    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        facingMode: isFront ? 'user' : 'environment',
        deviceId: videoSourceId
      }
    })

    if (typeof stream !== 'boolean') {
      return stream
    }

    return null
  }

  const setupWebRTC = async () => {
    pc.current = new RTCPeerConnection(configuration)
    const stream = await getStream()

    if (stream) {
      setLocalStream(stream)
      pc.current.addStream(stream)
    }

    pc.current.onaddstream = (event: EventOnAddStream) => {
      setRemoteStream(event.stream)
    }
  }

  const create = async () => {
    console.log('calling')
    connecting.current = true

    await setupWebRTC()

    // Document for the call
    const docRef = doc(firestoreDB, 'calls', 'YN7iVVhlkS7q4M7ZtlDn')

    // Callingto: Fsf20XhhTiDXdsf7CGRq

    // Caller: rL83sp5xhIVbRM7eOOVE
    collectIceCandidate(docRef, 'rL83sp5xhIVbRM7eOOVE', 'Fsf20XhhTiDXdsf7CGRq')

    if (pc.current) {
      const offer = await pc.current.createOffer()
      pc.current.setLocalDescription(offer)

      const cWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp
        }
      }

      setDoc(docRef, cWithOffer)
    }
  }

  const join = async () => {}

  const hangup = async () => {}

  const collectIceCandidate = async (
    docRef: DocumentReference,
    localName: string,
    remoteName: string
  ) => {
    const candidateCollection = collection(docRef, localName)

    if (pc.current) {
      pc.current.onicecandidate = (e) => {
        if (e.candidate) {
          addDoc(candidateCollection, { ...e.candidate })
        }
      }
    }

    onSnapshot(collection(docRef, remoteName), (snapshot) => {
      snapshot.docChanges().forEach((change: any) => {
        console.log(change)
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data())
          pc.current?.addIceCandidate(candidate)
        }
      })
    })
  }

  return (
    <View flex={1}>
      <Center flex={1} justifyContent="center">
        {/* <Text fontSize={'4xl'}>Camera Screen</Text> */}
        {/* <Text mb={'10'} fontSize={'4xl'}>
          Camera{' '}
        </Text> */}

        {gettingCall && (
          <View mb={'10'}>
            <Text>Getting Call</Text>
          </View>
        )}

        {localStream && !remoteStream && (
          <View
            borderWidth={1}
            width={'100%'}
            alignItems={'center'}
            height={'400px'}
            paddingX={'2'}
          >
            <Text fontSize={'25'} mb={5}>
              Only Local Stream
            </Text>
            <RTCView
              streamURL={localStream.toURL()}
              objectFit={'cover'}
              style={{
                position: 'absolute',
                // top: 10,
                bottom: 0,
                width: '100%',
                height: '89%'
              }}
            />
          </View>
        )}

        {localStream && remoteStream && (
          <View
            borderWidth={1}
            width={'100%'}
            alignItems={'center'}
            height={'400px'}
            paddingX={'2'}
            position={'relative'}
          >
            <Text fontSize={'25'}>Local And Remote</Text>
            <RTCView
              streamURL={remoteStream.toURL()}
              objectFit={'cover'}
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                height: '90%'
              }}
            />

            <RTCView
              streamURL={localStream.toURL()}
              objectFit={'cover'}
              style={{
                width: '150',
                height: '150',
                top: 0,
                left: 0,
                position: 'absolute'
              }}
            />
          </View>
        )}

        <Button borderRadius={'2xl'} mt={'10'} onPress={create}>
          Call
        </Button>
      </Center>
    </View>
  )
}

export default CameraScreen
