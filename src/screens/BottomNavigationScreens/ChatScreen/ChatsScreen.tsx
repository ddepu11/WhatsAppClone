import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Image,
  Input,
  Spinner,
  StatusBar,
  Text,
  View,
} from 'native-base'
import { FC } from 'react'
import { Platform } from 'react-native'
import Chat from '../../../components/Chat'
import Routes from '../../../constants/routes'
import NavigationParams from '../../../types/navigationParams'
import AddOptionSlider from './AddOptionSlider'
import useChatsScreenLogic from './logic/useChatsScreenLogic'
import { RecyclerListView } from 'recyclerlistview'

type Props = NativeStackScreenProps<NavigationParams, Routes.SignInScreen>

const ChatScreen: FC<Props> = ({ navigation }) => {
  console.log('Rendering chat screen')

  const {
    handleSearchChat,
    keyword,
    toggleShowAddOptions,
    showAddOptions,
    registeredUsersFromContactList,
    handleRefreshAllContacts,
    chats,
    rowRenderer,
    layoutProvider,
  } = useChatsScreenLogic()

  return (
    <View
      flex={1}
      backgroundColor={'#E5E5E5'}
      pt={Platform.OS === 'ios' ? 8 : 'auto'}
    >
      <StatusBar barStyle='dark-content' backgroundColor='#E5E5E5' />

      <Center flex={1} justifyContent='flex-start'>
        <Box
          // borderWidth={1}
          width={'100%'}
          paddingX='5'
          paddingY='0'
          mt='5'
          flexDirection={'row'}
          justifyContent='space-between'
          alignItems={'center'}
        >
          <Text fontSize={'20'} fontWeight={700} lineHeight={'20'}>
            Chats
          </Text>

          <Button
            bgColor={'transparent'}
            borderWidth={0}
            padding={'0'}
            onPress={toggleShowAddOptions}
            borderRadius={'full'}
          >
            <Image
              source={require('../../../../assets/plus_icon.png')}
              alt='asssas'
              width={34}
              height={34}
            />
          </Button>
        </Box>

        <Input
          value={keyword}
          onChangeText={handleSearchChat}
          width={'91%'}
          borderWidth={0}
          borderColor='#333'
          backgroundColor={'#EFEEEE'}
          borderRadius={6}
          mt='5'
          type='text'
          placeholder=' 🔍    Search'
          fontSize={13}
          lineHeight={18}
          fontWeight={400}
          paddingLeft='5'
        />

        <Box mt={5} width='91%'>
          {chats.loading ? (
            <HStack mt={'20'} space={2} justifyContent='center'>
              <Spinner accessibilityLabel='Loading chats' color={'black'} />

              <Heading color='black' fontSize='lg' fontWeight={500}>
                Loading Chats
              </Heading>
            </HStack>
          ) : (
            <>
              {chats.data && chats.data.getSize() > 0 ? (
                <RecyclerListView
                  layoutProvider={layoutProvider.current}
                  dataProvider={chats.data}
                  rowRenderer={rowRenderer}
                  style={{ minHeight: 1, minWidth: 1 }}
                />
              ) : (
                <Box mt={16} alignItems={'center'}>
                  <Image
                    source={require('../../../../assets/No_Chats.png')}
                    alt='Sorry no chats!'
                    width={'168'}
                    height={'116'}
                  />

                  <Text
                    mt={10}
                    fontSize={'18'}
                    fontWeight={700}
                    lineHeight={20}
                    color={'#000000'}
                  >
                    You have no messages
                  </Text>

                  <Text
                    mt={4}
                    fontSize={'14'}
                    fontWeight={400}
                    lineHeight={20}
                    color={'#000000'}
                  >
                    Lorem Ipsum is simply dummy text of the
                  </Text>
                </Box>
              )}
            </>
          )}
        </Box>
      </Center>

      {showAddOptions && (
        <AddOptionSlider
          handleRefreshAllContacts={handleRefreshAllContacts}
          registeredUsersFromContactListLoading={
            registeredUsersFromContactList.loading
          }
          toggleShowAddOptions={toggleShowAddOptions}
          registeredUsersFromContactList={registeredUsersFromContactList.data}
        />
      )}
    </View>
  )
}

export default ChatScreen
