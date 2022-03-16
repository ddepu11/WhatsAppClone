import {
  Box,
  Button,
  Center,
  FlatList,
  Image,
  StatusBar,
  Text,
  View,
} from 'native-base'
import { FC } from 'react'
import { Entypo } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'

const CallScreen: FC = () => {
  const callLogData = [
    {
      personName: 'Mohan',
      avatarUrl: 'https://i.pravatar.cc/150?img=51',
      callStatus: 'Missed',
      timestamp: '01:20 AM',
      callType: 'video',
    },
    {
      personName: 'Sohan',
      avatarUrl: 'https://i.pravatar.cc/150?img=50',
      callStatus: 'Outgoing',
      timestamp: '04:16 AM',
      callType: 'audio',
    },
    {
      personName: 'Rohan',
      avatarUrl: 'https://i.pravatar.cc/150?img=52',
      callStatus: 'Incoming',
      timestamp: '09:04 AM',
      callType: 'video',
    },
    {
      personName: 'Aayush',
      avatarUrl: 'https://i.pravatar.cc/150?img=53',
      callStatus: 'Missed',
      timestamp: '10:12 AM',
      callType: 'audio',
    },
    {
      personName: 'Rohan',
      avatarUrl: 'https://i.pravatar.cc/150?img=54',
      callStatus: 'Outgoing',
      timestamp: '12:00 AM',
      callType: 'video',
    },
  ]

  return (
    <View flex={1} bgColor={'#E5E5E5'}>
      <StatusBar barStyle='dark-content' backgroundColor='#E5E5E5' />

      <Center flex={1} justifyContent='flex-start'>
        <Box
          width='100%'
          alignItems={'center'}
          bgColor='#E5E5E5'
          flexDirection={'row'}
          color={'#000000'}
          paddingY={'3'}
          mt='2'
        >
          <Text fontWeight={'700'} fontSize={'22'} lineHeight={'24'} ml={5}>
            Calls
          </Text>

          <Box
            position={'absolute'}
            right='4'
            textAlign={'center'}
            flexDirection='row'
          >
            <Button
              //   onPress={hanleMakeVideoCall}
              bgColor={'transparent'}
              padding={'0'}
              borderRadius={'2xl'}
            >
              <Entypo name='magnifying-glass' size={30} color='#284180' />
            </Button>
          </Box>
        </Box>

        {/* Call Logs */}

        <Box width='90%' height={'90%'} mt={3} py={'2'}>
          <FlatList
            data={callLogData}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <Box
                  flexDirection={'row'}
                  bgColor={'#FFFFFF'}
                  paddingX={'3'}
                  paddingY={'2'}
                  mb={'3'}
                  borderRadius={'6'}
                  shadow={'0.5'}
                >
                  <Image
                    source={{ uri: item.avatarUrl }}
                    alt={item.personName}
                    width={'52'}
                    height={'52'}
                    borderRadius={14}
                  />

                  <Box ml={'5'}>
                    <Text
                      color={
                        item.callStatus === 'Missed' ? '#F27953' : '#000000'
                      }
                      fontSize={16}
                      fontWeight={400}
                      lineHeight={'23.5'}
                    >
                      {item.personName}
                    </Text>

                    <Text
                      fontSize={13}
                      fontWeight={400}
                      lineHeight={'18'}
                      opacity={'0.5'}
                      mt={'1'}
                    >
                      {item.callType === 'video' && (
                        <FontAwesome5 name='video' size={11} color='black' />
                      )}

                      {item.callType === 'audio' && (
                        <Ionicons name='call' size={11} color='black' />
                      )}
                      {'  '}
                      {item.callStatus}
                    </Text>
                  </Box>

                  <Text
                    fontWeight={400}
                    fontSize={12}
                    lineHeight={18}
                    position={'absolute'}
                    right={'3'}
                    top='4'
                  >
                    {item.timestamp}
                  </Text>
                </Box>
              </TouchableOpacity>
            )}
          />
        </Box>
      </Center>
    </View>
  )
}

export default CallScreen
