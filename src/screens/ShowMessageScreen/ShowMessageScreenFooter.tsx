import { Box, Button, Input, Text, View } from 'native-base'
import { FC } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import EmojiPicker from 'rn-emoji-keyboard'
import useShowMessageScreenFooterLogic from './Logic/useShowMessageScreenFooterLogic'
import { FontAwesome5 } from '@expo/vector-icons'
import { Platform } from 'react-native'

interface Props {
  chatId: string
}

const ShowMessageScreenFooter: FC<Props> = ({ chatId }) => {
  const {
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
  } = useShowMessageScreenFooterLogic({
    chatId
  })

  return (
    <View
      alignItems={'center'}
      position="absolute"
      bottom={0}
      width={'100%'}
      bgColor={'#FFFFFF'}
      pb={Platform.OS === 'ios' ? 4 : 'auto'}
    >
      {audio && !areYouRecording && (
        <Box
          width={'100%'}
          height={'60'}
          bgColor={'#22C3A6'}
          borderTopRadius={'md'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Button
            bgColor={'#333'}
            padding={'1'}
            borderRadius={'lg'}
            width={'70'}
            onPress={playRecordedAudio}
          >
            <Text color={'#ffffff'} fontSize={'15'}>
              Play
            </Text>
          </Button>

          <Button
            ml={4}
            bgColor={'#333'}
            padding={'1'}
            borderRadius={'lg'}
            width={'70'}
            onPress={handleStopPlayingAudio}
          >
            <Text color={'#ffffff'} fontSize={'15'}>
              Stop
            </Text>
          </Button>

          <Button
            ml={4}
            bgColor={'#333'}
            padding={'1'}
            borderRadius={'lg'}
            width={'70'}
            onPress={handleCancelAttachAudio}
          >
            <Text color={'#ffffff'} fontSize={'15'}>
              Cancel
            </Text>
          </Button>

          <Button
            ml={4}
            bgColor={'#333'}
            padding={'1'}
            borderRadius={'lg'}
            width={'70'}
            onPress={handleSendAudio}
          >
            <Text color={'#ffffff'} fontSize={'15'}>
              Send
            </Text>
          </Button>
        </Box>
      )}

      {/* Actual foooter */}
      <Box
        borderTopRadius={'10'}
        flexDirection={'row'}
        width={'100%'}
        paddingY={2}
        alignItems={'center'}
        paddingLeft={'5'}
      >
        <Button
          bgColor={'transparent'}
          padding="0"
          onPress={() => setIsEmojiKeyboardOpen(true)}
        >
          <Text fontSize={22}>🙂</Text>
        </Button>

        <Input
          fontWeight={400}
          fontSize={14}
          lineHeight={18}
          placeholder="Type a message"
          type={'text'}
          value={message}
          onChangeText={handleTypeMessage}
          bgColor={'transparent'}
          borderWidth={0}
          width={'60%'}
          color={'#000000'}
          ml={'2'}
        />

        {/* Footer's far  right */}
        {message.length > 0 ? (
          <Button
            bgColor={'#22C3A6'}
            padding={'2'}
            mr="4"
            borderRadius={'12'}
            position={'absolute'}
            right="1.5"
            onPress={hanleSendMessage}
          >
            <AntDesign name="arrowright" size={24} color="#FFFFFF" />
          </Button>
        ) : (
          <Box
            position={'absolute'}
            right="1.5"
            flexDirection={'row'}
            alignItems={'center'}
          >
            <Button
              bgColor={'transparent'}
              padding={'2'}
              mr="1"
              borderRadius={'2xl'}
              onPress={hanleAttachDocs}
            >
              <MaterialCommunityIcons
                name="paperclip"
                size={24}
                color="#284180"
              />
            </Button>

            <Button
              onPress={hanleAttachImages}
              bgColor={'transparent'}
              padding={'2'}
              borderRadius={'2xl'}
            >
              <FontAwesome name="camera" size={24} color="#284180" />
            </Button>

            {areYouRecording ? (
              <Button
                onPress={hanleStopAudioRecording}
                bgColor={'transparent'}
                padding={'2'}
                borderRadius={'2xl'}
              >
                <FontAwesome5 name="stop-circle" size={24} color="#cd2121" />
              </Button>
            ) : (
              <Button
                onPress={hanleRecordAudio}
                bgColor={'transparent'}
                padding={'2'}
                borderRadius={'2xl'}
              >
                <Feather name="mic" size={24} color="#284180" />
              </Button>
            )}
          </Box>
        )}

        <EmojiPicker
          containerStyles={{ position: 'relative' }}
          onEmojiSelected={handlePickEmoji}
          open={isEmojiKeyboardOpen}
          onClose={() => {
            setIsEmojiKeyboardOpen(false)
          }}
        />
      </Box>
    </View>
  )
}

export default ShowMessageScreenFooter
