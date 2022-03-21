import {
  Box,
  Button,
  Center,
  Image,
  Input,
  KeyboardAvoidingView,
  Spinner,
  StatusBar,
  Text,
  View,
} from 'native-base'
import { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import * as ImagePicker from 'expo-image-picker'
import {
  Alert,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import Routes from '../constants/routes'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import NavigationParams from '../types/navigationParams'
import {
  fetchUserInfoRequest,
  saveUserInfoRequest,
  updateUserInfoRequest,
} from '../../redux/states/userState'

type Props = NativeStackScreenProps<NavigationParams, Routes.OTPScreen>

const DpAndUserName: FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch()

  const {
    mobileNumber,
    isLoading,
    loggedIn,
    firstName,
    lastName,
    userName,
    displayPic: { fileName, url },
    id,
  } = useAppSelector((state) => state.user.value)

  const [displayPic, setDisplayPic] = useState('')

  const [userInfo, setUserInfo] = useState({
    userName: '',
    firstName: '',
    lastName: '',
  })

  // Fetch user info
  useEffect(() => {
    if (loggedIn && !id) {
      dispatch(fetchUserInfoRequest({ mobileNumber }))
    }
  }, [loggedIn, id])

  // If user info available set it to states
  useEffect(() => {
    setUserInfo({
      firstName,
      lastName,
      userName,
    })

    setDisplayPic(url)
  }, [url, firstName, lastName, userName])

  const [areYouUpdating, setAreYouUpdating] = useState(false)

  useEffect(() => {
    if (
      firstName !== userInfo.firstName ||
      lastName !== userInfo.lastName ||
      userName !== userInfo.userName ||
      url !== displayPic
    ) {
      setAreYouUpdating(true)
    } else {
      setAreYouUpdating(false)
    }
  }, [userInfo.firstName, userInfo.lastName, userInfo.userName])

  const handleImagePick = async () => {
    // No permissions request is necessary for launching the image library

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    })

    if (!result.cancelled) {
      setDisplayPic(result.uri)
    }
  }

  const handleSubmit = (): void => {
    let errorflag = false

    if (!displayPic) {
      Alert.alert('Please select dp!')
      errorflag = true
    }

    if (!userInfo.firstName) {
      Alert.alert("First name can't be empty!")
      errorflag = true
    }

    if (!userInfo.lastName) {
      Alert.alert("Last name can't be empty!")
      errorflag = true
    }

    if (!userInfo.userName) {
      Alert.alert("Username can't be empty!")
      errorflag = true
    }

    if (!errorflag) {
      dispatch(
        saveUserInfoRequest({
          ...userInfo,
          displayPic: displayPic,
          mobileNumber,
        })
      )
      setAreYouUpdating(false)
    }
  }

  const handleUpdate = async () => {
    let errorflag = false

    // if (!displayPic) {
    //   Alert.alert('Please select dp!')
    //   errorflag = true
    // }

    if (!userInfo.firstName) {
      Alert.alert("First name can't be empty!")
      errorflag = true
    }

    if (!userInfo.lastName) {
      Alert.alert("Last name can't be empty!")
      errorflag = true
    }

    if (!userInfo.userName) {
      Alert.alert("Username can't be empty!")
      errorflag = true
    }

    if (!errorflag) {
      if (url !== displayPic) {
        console.log('Update with file')

        const createBlob: Blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest()

          xhr.onload = function () {
            resolve(xhr.response)
          }

          xhr.onerror = function () {
            reject(new TypeError('Network request failed'))
          }

          xhr.responseType = 'blob'
          xhr.open('GET', displayPic, true)
          xhr.send(null)
        })

        dispatch(
          updateUserInfoRequest({
            id,
            ...userInfo,
            displayPic: createBlob,
            oldDisplayPicName: fileName,
            mobileNumber,
          })
        )
      } else {
        console.log('Update')
        dispatch(updateUserInfoRequest({ id, ...userInfo, mobileNumber }))
      }

      setAreYouUpdating(false)
    }
  }

  const handleReset = (): void => {
    setAreYouUpdating(false)

    setUserInfo({
      firstName,
      lastName,
      userName,
    })

    setDisplayPic(url)
  }

  const handleSkip = (): void => {
    navigation.navigate(Routes.BottomNavigationBar)
  }

  const handleFirstName = (firstName: string): void => {
    setUserInfo((prevInfo) => ({ ...prevInfo, firstName }))
  }

  const handleLastName = (lastName: string): void => {
    setUserInfo((prevInfo) => ({ ...prevInfo, lastName }))
  }

  const handleUserName = (userName: string): void => {
    setUserInfo((prevInfo) => ({ ...prevInfo, userName }))
  }

  return (
    <KeyboardAvoidingView
      flex={1}
      color={'#FFFFFF'}
      h={{
        base: '400px',
        lg: 'auto',
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle='dark-content' backgroundColor='#E5E5E5' />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Center
          flex={1}
          justifyContent='space-evenly'
          backgroundColor='#E5E5E5'
        >
          <Text
            color={'#000000'}
            fontSize={'20'}
            fontWeight={'500'}
            lineHeight={'24'}
            mt={0}
            textAlign={'center'}
          >
            Please upload your dp and fill your information
          </Text>

          <Box borderWidth={0} width={'100%'} alignItems='center' mt={0}>
            <Button
              onPress={handleImagePick}
              bgColor='#00000033'
              borderRadius={'full'}
              padding={'0'}
              borderWidth={'4'}
              borderColor={'#59cdb7'}
            >
              {displayPic ? (
                <Image
                  source={{ uri: displayPic }}
                  width={'240'}
                  height={'240'}
                  borderRadius={'full'}
                  alt={'user dp'}
                />
              ) : (
                <Image
                  source={require('../../assets/dummy_user.png')}
                  width={'240'}
                  height={'240'}
                  borderRadius={'full'}
                  alt={'user dp'}
                />
              )}
            </Button>

            {isLoading && (
              <View
                position={'absolute'}
                marginX={'auto'}
                borderRadius={'full'}
                width={'248'}
                height={'248'}
                bgColor={'rgba(51, 51, 51,0.4)'}
                padding={'0'}
                justifyContent={'center'}
              >
                <Spinner size='lg' />
              </View>
            )}
          </Box>

          <Box width={'60%'} mt={'0'}>
            <Input
              mt={0}
              borderColor={'#525252'}
              borderRightRadius={'md'}
              borderWidth={'0.5'}
              fontSize={'md'}
              placeholder='First Name'
              paddingX={'10'}
              onChangeText={handleFirstName}
              value={userInfo.firstName}
            />

            <Input
              mt={4}
              borderColor={'#525252'}
              borderRightRadius={'md'}
              borderWidth={'0.5'}
              fontSize={'md'}
              placeholder='Last Name'
              onChangeText={handleLastName}
              value={userInfo.lastName}
            />

            <Input
              mt={4}
              borderColor={'#525252'}
              borderRightRadius={'md'}
              borderWidth={'0.5'}
              fontSize={'md'}
              placeholder='Username'
              onChangeText={handleUserName}
              value={userInfo.userName}
            />
          </Box>

          <Box width={'60%'} mt={5} mb={'15'}>
            {isLoading ? (
              <Spinner size={'lg'} mt={'0'} />
            ) : (
              <Button
                size={'10'}
                width={'100%'}
                borderRadius={'md'}
                bgColor={'#22C3A6'}
                onPress={id ? handleUpdate : handleSubmit}
                isDisabled={!areYouUpdating && true}
              >
                {id ? 'Update' : 'Submit'}
              </Button>
            )}

            {areYouUpdating && !isLoading && (
              <Button
                size={'10'}
                mt={4}
                width={'100%'}
                borderRadius={'md'}
                bgColor={'#22C3A6'}
                onPress={handleReset}
              >
                Reset
              </Button>
            )}

            {firstName && lastName && userName && url && fileName && (
              <Button
                size={'10'}
                mt={2}
                width={'100%'}
                borderRadius={'md'}
                bgColor={'#22C3A6'}
                onPress={handleSkip}
              >
                Skip
              </Button>
            )}
          </Box>
        </Center>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default DpAndUserName
