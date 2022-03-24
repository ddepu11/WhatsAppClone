import { Box, Button, Image, Text } from 'native-base'
import { FC, memo } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import {
  FontAwesome,
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { Platform } from 'react-native'
import useShowMessageScreenHeaderLogic from './Logic/useShowMessageScreenHeaderLogic'

interface Props {
  displayPicUrl: string
  personName: string
  otherPersonId: string
  isOnline: boolean | undefined
}

const ShowMessageScreenHeader: FC<Props> = ({
  displayPicUrl,
  personName,
  otherPersonId,
  isOnline,
}) => {
  // console.log('Rendering ShowMessageScreenHeader')

  const {
    handleNavigateBack,
    hanleMakeVideoCall,
    hanleMakeVoiceCall,
    gettingCall,
    areYouTalking,
    handleAnswereCall,
    handleDenyCall,
    handleEndCall,
    makingCall,
    callPicked,
  } = useShowMessageScreenHeaderLogic(otherPersonId)

  return (
    <Box
      width={'100%'}
      bgColor='#FFFFFF'
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      color={'#000000'}
      paddingY={'2.5'}
      pt={Platform.OS === 'ios' ? 12 : 5}
    >
      {/* Visible when you are getting a New call */}
      {gettingCall && (
        <Box
          position={'absolute'}
          zIndex={'2'}
          bottom={'0'}
          right={2}
          top={'0'}
          width={'65%'}
          bgColor={'#65C18C'}
          borderRadius={'5'}
        >
          <Text textAlign={'center'} color={'#FDEFF4'} fontSize={'15'}>
            {personName} is calling
          </Text>

          <Box
            mt={4}
            flexDirection={'row'}
            width={'100%'}
            justifyContent={'center'}
          >
            <Button
              padding={0}
              bgColor={'transparent'}
              mr={10}
              onPress={handleAnswereCall}
            >
              <Feather name='phone-call' size={26} color='black' />
            </Button>

            <Button
              padding={0}
              bgColor={'transparent'}
              onPress={handleDenyCall}
            >
              <MaterialCommunityIcons
                name='phone-cancel'
                size={26}
                color='#FC4F4F'
              />
            </Button>
          </Box>
        </Box>
      )}

      {makingCall && (
        <Box
          position={'absolute'}
          zIndex={'2'}
          bottom={'0'}
          right={2}
          top={'0'}
          width={'60%'}
          bgColor={'#65C18C'}
          borderRadius={'5'}
        >
          <Text textAlign={'center'} color={'#FDEFF4'} fontSize={'15'}>
            Calling to {personName}
          </Text>

          <Box
            mt={4}
            flexDirection={'row'}
            width={'100%'}
            justifyContent={'center'}
          >
            <Button
              padding={0}
              bgColor={'transparent'}
              mr={10}
              onPress={handleEndCall}
            >
              <MaterialIcons name='call-end' size={30} color='#FC4F4F' />
            </Button>
          </Box>
        </Box>
      )}

      {/* Visible when you have picked up call */}
      {areYouTalking && (
        <Box
          position={'absolute'}
          zIndex={'2'}
          bottom={'0'}
          right={2}
          top={'0'}
          width={'50%'}
          bgColor={'#65C18C'}
          borderRadius={'5'}
        >
          <Text textAlign={'center'} color={'#FDEFF4'} fontSize={'15'}>
            You are Talking
          </Text>

          <Box
            mt={4}
            flexDirection={'row'}
            width={'100%'}
            justifyContent={'center'}
          >
            <Button
              padding={0}
              bgColor={'transparent'}
              mr={10}
              onPress={handleEndCall}
            >
              <MaterialIcons name='call-end' size={30} color='#FC4F4F' />
            </Button>
          </Box>
        </Box>
      )}

      {/* Called someone and they picked the call */}
      {callPicked && (
        <Box
          position={'absolute'}
          zIndex={'2'}
          bottom={'0'}
          right={2}
          top={'0'}
          width={'70%'}
          bgColor={'#65C18C'}
          borderRadius={'5'}
        >
          <Text textAlign={'center'} color={'#FDEFF4'} fontSize={'15'}>
            Call picked by {personName}
          </Text>

          <Box
            mt={4}
            flexDirection={'row'}
            width={'100%'}
            justifyContent={'center'}
          >
            <Button
              padding={0}
              bgColor={'transparent'}
              mr={10}
              onPress={handleEndCall}
            >
              <MaterialIcons name='call-end' size={30} color='#FC4F4F' />
            </Button>
          </Box>
        </Box>
      )}

      <Box ml={'3'} flexDirection={'row'} alignItems={'center'}>
        <Button
          padding={0}
          bgColor={'transparent'}
          onPress={handleNavigateBack}
        >
          <AntDesign name='left' size={24} color='black' />
        </Button>

        <Image
          source={{ uri: displayPicUrl }}
          alt={personName}
          width={'36'}
          height={'36'}
          borderRadius={14}
          ml={'4'}
        />

        <Box ml={'5'} borderWidth={'0'}>
          <Text
            fontSize={'16'}
            fontWeight={'700'}
            lineHeight={'23.5'}
            color={'#000000'}
          >
            {personName}
          </Text>

          {isOnline && (
            <Text
              fontWeight={'400'}
              fontSize={'12'}
              lineHeight={'17.63'}
              color={'#000000'}
            >
              Online
            </Text>
          )}
        </Box>
      </Box>

      <Box flexDirection='row' textAlign={'center'} mr={'4'}>
        <Button
          onPress={hanleMakeVoiceCall}
          bgColor={'#F4F4F4'}
          padding={'2'}
          mr='4'
          borderRadius={'2xl'}
        >
          <Ionicons name='call-outline' size={24} color='#284180' />
        </Button>

        <Button
          onPress={hanleMakeVideoCall}
          bgColor={'#F4F4F4'}
          padding={'2'}
          borderRadius={'2xl'}
        >
          <FontAwesome name='video-camera' size={24} color='#284180' />
        </Button>
      </Box>
    </Box>
  )
}

export default memo(ShowMessageScreenHeader)
