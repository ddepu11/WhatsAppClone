import {
  Box,
  Button,
  Center,
  FlatList,
  Heading,
  HStack,
  Image,
  Input,
  Spinner,
  Text,
  View,
} from 'native-base'
import { FC } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { FontAwesome } from '@expo/vector-icons'

import { firestoreDB } from '../../../../firebaseconfig'

import { useAppSelector } from '../../../../redux/store'
import { RegistredUserFromContacts } from '../../../types/types'

interface Props {
  toggleShowAddOptions: () => void
  registeredUsersFromContactListLoading: boolean
  registeredUsersFromContactList: RegistredUserFromContacts[]
  handleRefreshAllContacts: () => void
}

const AddOptionSlider: FC<Props> = ({
  toggleShowAddOptions,
  registeredUsersFromContactListLoading,
  registeredUsersFromContactList,
  handleRefreshAllContacts,
}) => {
  const { id } = useAppSelector((state) => state.user.value)

  const addThisPersonInChatList = async (userId: string) => {
    try {
      // Check If this contact is already in the chats
      const q = query(
        collection(firestoreDB, 'chats'),
        where('participantIDs', 'array-contains', id)
      )

      const usersSnap = await getDocs(q)

      if (usersSnap.empty) {
        // There are no chats for logged in user

        await addDoc(collection(firestoreDB, 'chats'), {
          participantIDs: [id, userId],
          updatedOn: Date.now(),
        })

        toggleShowAddOptions()

        console.log('There were no chats so created on!')
      } else {
        // Chats are available
        let isThisContactAlreadyInTheChat = false

        usersSnap.forEach((userDoc) => {
          let participantIDs: string[] = userDoc.get('participantIDs')

          if (participantIDs.includes(userId)) {
            isThisContactAlreadyInTheChat = true
          }
        })

        if (!isThisContactAlreadyInTheChat) {
          // Not in current user chat so add him
          await addDoc(collection(firestoreDB, 'chats'), {
            participantIDs: [id, userId],
            updatedOn: Date.now(),
          })

          console.log('Not in the chats!')
          toggleShowAddOptions()
        } else {
          console.log('Already in the chats!')
          toggleShowAddOptions()
        }
      }
    } catch (err: any) {
      console.log(err.code)
      console.log(err.message)
    }
  }

  return (
    <View
      position={'absolute'}
      bgColor={'#FCFBFB'}
      bottom={'0'}
      width={'100%'}
      height={'92%'}
      borderTopRadius={'3xl'}
    >
      <Center
        flex={1}
        borderWidth={0}
        py={5}
        px={5}
        justifyContent={'flex-start'}
      >
        {/* Header */}
        <Box
          width={'100%'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          borderWidth={0}
          padding={'0'}
        >
          <Text fontSize={'20'} fontWeight={'700'} lineHeight={'20'}>
            Create New
          </Text>

          <Button
            onPress={toggleShowAddOptions}
            bgColor={'transparent'}
            padding={'0'}
          >
            <AntDesign name='close' size={30} color='black' />
          </Button>
        </Box>

        {/* Search Box */}

        <Input
          // value={keyword}
          // onChangeText={handleSearchChat}
          width={'100%'}
          color={'#000000'}
          backgroundColor={'#EFEEEE'}
          borderRadius={6}
          mt='8'
          type='text'
          placeholder=' 🔍    Search'
          fontSize={13}
          lineHeight={18}
          fontWeight={400}
          paddingLeft='3'
        />

        <Button
          borderRadius={'6'}
          width={'100%'}
          height={'50'}
          alignSelf={'center'}
          mt={10}
          bgColor={'#22C3A6'}
          justifyContent={'flex-start'}
          // onPress={handleGenerateOTP}
          // isDisabled={mobileNumber.length >= 10 ? false : true}
        >
          <Text
            fontSize={'16'}
            fontWeight={'500'}
            color={'#FFFFFF'}
            lineHeight={'23.5'}
            ml={'2'}
          >
            <Ionicons name='ios-people' size={16} color='#FFFFFF' />
            {'   '}
            New Group
          </Text>
        </Button>

        <Button
          borderRadius={'6'}
          width={'100%'}
          height={'50'}
          alignSelf={'center'}
          mt={4}
          bgColor={'#22C3A6'}
          justifyContent={'flex-start'}
          // onPress={handleGenerateOTP}
          // isDisabled={mobileNumber.length >= 10 ? false : true}
        >
          <Text
            fontSize={'16'}
            fontWeight={'500'}
            color={'#FFFFFF'}
            lineHeight={'23.5'}
            ml={'1'}
          >
            <FontAwesome name='user-plus' size={16} color='#FFFFFF' />
            {'   '}
            New Contact
          </Text>
        </Button>

        {/* All Contacts  */}
        <Box
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'flex-end'}
          // borderWidth={1}
          width={'100%'}
        >
          <Text
            alignSelf={'flex-start'}
            fontWeight={'500'}
            fontSize={'14'}
            lineHeight={'14'}
            mt={'8'}
          >
            {' '}
            All Contacts
          </Text>

          {registeredUsersFromContactListLoading ? (
            <Spinner accessibilityLabel='Loading contacts' color={'black'} />
          ) : (
            <Button
              padding={'0'}
              margin={'0'}
              bgColor='transparent'
              // borderWidth={1}
              mr={'2'}
              onPress={handleRefreshAllContacts}
            >
              <FontAwesome name='refresh' size={24} color='#22C3A6' />
            </Button>
          )}
        </Box>

        <Box width='100%' borderWidth={0} height={'51%'} mt={3}>
          {registeredUsersFromContactListLoading ? (
            <HStack mt={'20'} space={2} justifyContent='center'>
              <Spinner accessibilityLabel='Loading contacts' color={'black'} />
              <Heading color='black' fontSize='lg' fontWeight={500}>
                Loading
              </Heading>
            </HStack>
          ) : (
            <>
              {registeredUsersFromContactList.length === 0 ? (
                <Text
                  mt={10}
                  fontSize={'12'}
                  fontWeight={500}
                  lineHeight={12}
                  color={'#000000'}
                  textAlign={'center'}
                >
                  None of your contact have registered to this app.
                </Text>
              ) : (
                <FlatList
                  data={registeredUsersFromContactList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => addThisPersonInChatList(item.id)}
                    >
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
                          source={{ uri: item.displayPicUrl }}
                          alt={item.fullName}
                          width={'52'}
                          height={'52'}
                          borderRadius={14}
                        />

                        <Box ml={'5'}>
                          <Text
                            fontSize={16}
                            fontWeight={400}
                            lineHeight={'23.5'}
                          >
                            {item.fullName}
                          </Text>

                          <Text
                            fontSize={13}
                            fontWeight={400}
                            lineHeight={'18'}
                            opacity={'0.5'}
                            mt={'1'}
                          >
                            {item.status}
                          </Text>
                        </Box>
                      </Box>
                    </TouchableOpacity>
                  )}
                />
              )}
            </>
          )}
        </Box>
      </Center>
    </View>
  )
}

export default AddOptionSlider
