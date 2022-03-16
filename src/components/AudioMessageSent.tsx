import { Box, Button, Text, View } from 'native-base'
import { FC, useState } from 'react'
import { whenWasTheDocUpdatedOrCreated } from '../helper'
import { Audio } from 'expo-av'

interface Props {
  audioURL: string | undefined
  createdOn: number
}

const AudioMessageSent: FC<Props> = ({ audioURL, createdOn }) => {
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
    if (sound) {
      setIsPlaying(false)
      sound.stopAsync()
    }
  }

  return (
    <View
      bgColor={'#22C3A6'}
      width={'267'}
      borderRadius={'12'}
      borderBottomRightRadius={'0'}
      paddingX={3}
      paddingY={3}
      alignSelf={'flex-end'}
      mt={10}
      mr={5}
    >
      <Box
        width={'100%'}
        // justifyContent={'flex-start'}
        // alignItems={'flex-start'}
      >
        <Text
          color={'#FFFFFF'}
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
            bgColor={loading ? 'transparent' : '#e6e2e2'}
            padding={'0.5'}
            borderRadius={'lg'}
            width={'76'}
            onPress={playSound}
            disabled={loading}
          >
            <Text color={loading ? '#f2f2f2' : '#3e3e3e'} fontSize={'15'}>
              {loading ? 'Loading...' : 'Play'}
            </Text>
          </Button>
        ) : (
          <Button
            // ml={4}
            mt={2}
            bgColor={'#3a3535'}
            padding={'0.5'}
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
        right={'-1.5'}
        bottom={'-2.3'}
        width={'3'}
        height={'3'}
        backgroundColor={'#22C3A6'}
        borderBottomLeftRadius={'20'}
        borderTopRightRadius={'20'}
        style={{
          transform: [{ rotateY: '0deg' }, { rotateX: '50deg' }],
        }}
      />

      <Text
        position={'absolute'}
        bottom={'-20'}
        right={'-02'}
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

export default AudioMessageSent
