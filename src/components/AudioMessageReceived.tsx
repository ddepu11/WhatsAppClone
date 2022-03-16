import { Box, Button, Text, View } from 'native-base'
import { FC, useState } from 'react'
import { whenWasTheDocUpdatedOrCreated } from '../helper'
import { Audio, AVPlaybackStatus } from 'expo-av'

interface Props {
  audioURL: string | undefined
  createdOn: number
}

const AudioMessageReceived: FC<Props> = ({ audioURL, createdOn }) => {
  let lastUpdatedWhen: string

  lastUpdatedWhen = whenWasTheDocUpdatedOrCreated(createdOn)

  const [sound, setSound] = useState<Audio.Sound>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  async function playSound() {
    setLoading(true)

    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: audioURL as string,
      })

      setSound(sound)

      const status = await sound.getStatusAsync()

      if (status.isLoaded) {
        setLoading(false)

        setTimeout(() => {
          setIsPlaying(false)
        }, status.durationMillis)
      }

      await sound.playAsync()

      setIsPlaying(true)
    } catch (err: any) {
      setIsPlaying(false)
      setLoading(false)

      console.log(err.code)
      console.log(err.message)
    }
  }

  const handleStopPlayingAudio = () => {
    console.log()
    if (sound) {
      setIsPlaying(false)
      sound.stopAsync()
    }
  }

  return (
    <View
      bgColor={'#FFFFFF'}
      width={'267'}
      borderRadius={'12'}
      borderBottomLeftRadius={'0'}
      paddingX={3}
      paddingY={3}
      alignSelf={'flex-start'}
      mt={10}
      ml={5}
    >
      <Box width={'100%'}>
        <Text
          color={'#373737'}
          fontWeight={400}
          fontSize={'14'}
          lineHeight={'14'}
        >
          Audio message
        </Text>

        {!isPlaying ? (
          <Button
            // ml={4}
            mt={2}
            bgColor={loading ? 'transparent' : '#464040'}
            padding={'1'}
            borderRadius={'lg'}
            width={'76'}
            onPress={playSound}
          >
            <Text color={loading ? '#333' : '#ffffff'} fontSize={'15'}>
              {loading ? 'Loading...' : 'Play'}
            </Text>
          </Button>
        ) : (
          <Button
            // ml={4}
            mt={2}
            bgColor={'#3a3535'}
            padding={'1'}
            borderRadius={'lg'}
            width={'76'}
            onPress={handleStopPlayingAudio}
          >
            <Text color={'#ffffff'} fontSize={'15'}>
              Stop
            </Text>
          </Button>
        )}
      </Box>

      <View
        position={'absolute'}
        left={'-2.3'}
        bottom={'-2.8'}
        width={'3'}
        height={'3'}
        // backgroundColor={'#000'}
        backgroundColor={'#FFFFFF'}
        borderTopRightRadius={'20'}
        borderBottomLeftRadius={'20'}
        style={{
          transform: [{ rotateY: '180deg' }, { rotateX: '50deg' }],
        }}
      />

      <Text
        position={'absolute'}
        bottom={'-20'}
        left={'-02'}
        fontWeight={'500'}
        fontSize={'10'}
        lineHeight={'18'}
        color={'rgba(0, 0, 0,0.4)'}
      >
        {lastUpdatedWhen}
      </Text>
    </View>
  )
}

export default AudioMessageReceived
