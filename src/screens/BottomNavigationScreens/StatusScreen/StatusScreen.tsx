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
import { TouchableOpacity } from 'react-native'
import StatusScreenHeader from './StatusScreenHeader'

const StatusScreen: FC = () => {
  const statusData = [
    {
      personName: 'Sandra',
      avatarUrl: 'https://i.pravatar.cc/150?img=47',
      createdOn: '20 mins ago',
    },
    {
      personName: 'Muskesh',
      avatarUrl: 'https://i.pravatar.cc/150?img=54',
      createdOn: '10 mins ago',
    },
    {
      personName: 'Mohan',
      avatarUrl: 'https://i.pravatar.cc/150?img=53',
      createdOn: '6 mins ago',
    },
    {
      personName: 'Sohan',
      avatarUrl: 'https://i.pravatar.cc/150?img=52',
      createdOn: '15 mins ago',
    },
    {
      personName: 'Aayush',
      avatarUrl: 'https://i.pravatar.cc/150?img=13',
      createdOn: '2 mins ago',
    },
  ]

  return (
    <View flex={1} bgColor={'#E5E5E5'}>
      <StatusBar barStyle='dark-content' backgroundColor='#E5E5E5' />

      <Center flex={1} justifyContent='flex-start'>
        <StatusScreenHeader />

        <Text
          fontSize={'14'}
          fontWeight={'400'}
          lineHeight={'14'}
          alignSelf='flex-start'
          ml={'5'}
          mt={'5'}
        >
          Recent updates
        </Text>

        {/* People's status */}
        <Box width='90%' height={'73.5%'} mt={3} py={'2'}>
          <FlatList
            data={statusData}
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
                    <Text fontSize={16} fontWeight={400} lineHeight={'23.5'}>
                      {item.personName}
                    </Text>

                    <Text
                      fontSize={13}
                      fontWeight={400}
                      lineHeight={'18'}
                      opacity={'0.5'}
                      mt={'1'}
                    >
                      {item.createdOn}
                    </Text>
                  </Box>
                </Box>
              </TouchableOpacity>
            )}
          />
        </Box>
      </Center>
    </View>
  )
}

export default StatusScreen
