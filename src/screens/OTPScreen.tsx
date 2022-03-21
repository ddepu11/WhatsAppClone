import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import {
  ApplicationVerifier,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth'
import {
  Box,
  Button,
  Center,
  Image,
  Input,
  Spinner,
  StatusBar,
  Text,
  View,
} from 'native-base'
import { FC, useRef, useState } from 'react'
import { Alert, StyleSheet, TextInput } from 'react-native'
import { app, auth } from '../../firebaseconfig'
import {
  logInFailed,
  logInSuccess,
  userLoadingStarts,
} from '../../redux/states/userState'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import Routes from '../constants/routes'
import NavigationParams from '../types/navigationParams'

const Icon = require('../../assets/Icon2.png')

type Props = NativeStackScreenProps<NavigationParams, Routes.OTPScreen>

const OTPScreen: FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch()

  const digit1 = useRef<TextInput>(null)
  const digit2 = useRef<TextInput>(null)

  const digit3 = useRef<TextInput>(null)
  const digit4 = useRef<TextInput>(null)
  const digit5 = useRef<TextInput>(null)
  const digit6 = useRef<TextInput>(null)

  const recaptchaVerifierRef = useRef<FirebaseRecaptchaVerifierModal>(null)

  const [OTP, setOTP] = useState({
    digit1: '',
    digit2: '',
    digit3: '',
    digit4: '',
    digit5: '',
    digit6: '',
  })

  const [resendLoading, setResendLoading] = useState(false)

  let { verificationId, mobileNumber, countryCode } = route.params

  const handleSubmitOTP = async () => {
    dispatch(userLoadingStarts())

    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        `${OTP.digit1}${OTP.digit2}${OTP.digit3}${OTP.digit4}${OTP.digit5}${OTP.digit6}`
      )

      await signInWithCredential(auth, credential)

      Alert.alert('Phone authentication successful 👍')

      dispatch(logInSuccess({ mobileNumber: `${mobileNumber}` }))
    } catch (err: any) {
      dispatch(logInFailed())

      navigation.navigate(Routes.SignInScreen)
    }
  }

  const handleResendOTP = async () => {
    setResendLoading(true)

    try {
      const phoneProvider = new PhoneAuthProvider(auth)

      verificationId = await phoneProvider.verifyPhoneNumber(
        `${countryCode}${mobileNumber}`,
        recaptchaVerifierRef.current as ApplicationVerifier
      )

      setResendLoading(false)
    } catch (err: any) {
      setResendLoading(false)

      Alert.alert(err.message)
    }
  }

  const handleDigit1 = (digit1: string): void => {
    if (digit1 !== '') {
      digit2.current?.focus()
    }

    setOTP((prevOTP) => ({ ...prevOTP, digit1 }))
  }

  const handleDigit2 = (digit2: string): void => {
    if (digit2 !== '') {
      digit3.current?.focus()
    }

    setOTP((prevOTP) => ({ ...prevOTP, digit2 }))
  }

  const handleDigit3 = (digit3: string): void => {
    if (digit3 !== '') {
      digit4.current?.focus()
    }

    setOTP((prevOTP) => ({ ...prevOTP, digit3 }))
  }

  const handleDigit4 = (digit4: string): void => {
    if (digit4 !== '') {
      digit5.current?.focus()
    }
    setOTP((prevOTP) => ({ ...prevOTP, digit4 }))
  }

  const handleDigit5 = (digit5: string): void => {
    if (digit5 !== '') {
      digit6.current?.focus()
    }

    setOTP((prevOTP) => ({ ...prevOTP, digit5 }))
  }

  const handleDigit6 = (digit6: string): void => {
    setOTP((prevOTP) => ({ ...prevOTP, digit6 }))
  }

  const { isLoading } = useAppSelector((state) => state.user.value)

  return (
    <View flex={1} color={'#FFFFFF'}>
      <StatusBar barStyle='dark-content' backgroundColor='#ececec' />

      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifierRef}
        firebaseConfig={app.options}
        title='Prove you are human!'
        cancelLabel='Close'
        // attemptInvisibleVerification={true}
      />
      <Center flex={1} justifyContent='center'>
        <View style={styles.topBackground}></View>

        <View style={styles.welcome}>
          <Image source={Icon} alt='App Icon' width={'80px'} height={'80px'} />

          <Text
            color={'#000000'}
            fontSize={'24'}
            fontWeight={'500'}
            lineHeight={'24'}
            mt={5}
          >
            OTP Varification
          </Text>

          <Text
            fontWeight={'400'}
            color={'#555555'}
            lineHeight={'24'}
            fontSize={'14'}
            mt={2}
            width={'70%'}
            textAlign='center'
          >
            Enter OTP code sent to your mobile number {countryCode}
            {mobileNumber}
          </Text>
        </View>

        <Box>
          <Box
            width={'75%'}
            // borderWidth={'1'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Input
              borderWidth={'0'}
              borderBottomWidth={'0.5'}
              borderColor={'#000000'}
              keyboardType={'phone-pad'}
              fontSize={'14'}
              maxLength={1}
              paddingLeft={'15'}
              width={'10'}
              ref={digit1}
              value={OTP.digit1}
              onChangeText={handleDigit1}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === 'Backspace') {
                  digit1.current?.focus()
                }
              }}
              // onFocus={e => {
              //   if (OTP.digit1 !== '') {
              //     digit2.current?.focus()
              //   }
              // }}
            />

            <Input
              borderWidth={'0'}
              borderBottomWidth={'0.5'}
              borderColor={'#000000'}
              keyboardType={'phone-pad'}
              fontSize={'14'}
              maxLength={1}
              paddingLeft={'15'}
              width={'10'}
              ref={digit2}
              value={OTP.digit2}
              onChangeText={handleDigit2}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === 'Backspace') {
                  digit1.current?.focus()
                }
              }}
            />

            <Input
              borderWidth={'0'}
              borderBottomWidth={'0.5'}
              borderColor={'#000000'}
              keyboardType={'phone-pad'}
              fontSize={'14'}
              maxLength={1}
              paddingLeft={'15'}
              width={'10'}
              ref={digit3}
              value={OTP.digit3}
              onChangeText={handleDigit3}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === 'Backspace') {
                  digit2.current?.focus()
                }
              }}
            />

            <Input
              borderWidth={'0'}
              borderBottomWidth={'0.5'}
              borderColor={'#000000'}
              keyboardType={'phone-pad'}
              fontSize={'14'}
              maxLength={1}
              paddingLeft={'15'}
              width={'10'}
              ref={digit4}
              value={OTP.digit4}
              onChangeText={handleDigit4}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === 'Backspace') {
                  digit3.current?.focus()
                }
              }}
            />

            <Input
              borderWidth={'0'}
              borderBottomWidth={'0.5'}
              borderColor={'#000000'}
              keyboardType={'phone-pad'}
              fontSize={'14'}
              maxLength={1}
              paddingLeft={'15'}
              width={'10'}
              ref={digit5}
              value={OTP.digit5}
              onChangeText={handleDigit5}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === 'Backspace') {
                  digit4.current?.focus()
                }
              }}
            />
            <Input
              borderWidth={'0'}
              borderBottomWidth={'0.5'}
              borderColor={'#000000'}
              keyboardType={'phone-pad'}
              fontSize={'14'}
              maxLength={1}
              paddingLeft={'15'}
              width={'10'}
              ref={digit6}
              value={OTP.digit6}
              onChangeText={handleDigit6}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === 'Backspace') {
                  digit5.current?.focus()
                }
              }}
            />
          </Box>

          {resendLoading ? (
            <Spinner
              mr={'7'}
              marginTop={'5'}
              alignSelf={'flex-end'}
              size={'sm'}
              mt={'10'}
            />
          ) : (
            <Text
              alignSelf={'flex-end'}
              color={'#22C3A6'}
              size={'12'}
              fontWeight={'700'}
              lineHeight={'24'}
              mr={'7'}
              mt={'5'}
              onPress={handleResendOTP}
            >
              Resend
            </Text>
          )}
        </Box>

        {isLoading ? (
          <Spinner size={'lg'} mt={'10'} />
        ) : (
          <Button
            borderRadius={'6'}
            width={'75%'}
            alignSelf={'center'}
            mt={10}
            p={3}
            bgColor={'#22C3A6'}
            onPress={handleSubmitOTP}
            isDisabled={
              OTP.digit1 !== '' &&
              OTP.digit2 !== '' &&
              OTP.digit3 !== '' &&
              OTP.digit4 !== '' &&
              OTP.digit5 !== '' &&
              OTP.digit6 !== ''
                ? false
                : true
            }
          >
            <Text
              fontSize={'14'}
              fontWeight={'700'}
              color={'#FFFFFF'}
              lineHeight={'20.56'}
            >
              Submit
            </Text>
          </Button>
        )}
      </Center>
    </View>
  )
}

const styles = StyleSheet.create({
  topBackground: {
    backgroundColor: '#ececec',
    width: 600,
    height: 600,
    borderRadius: 100 / 0.1,
    position: 'absolute',
    top: -200,
  },

  welcome: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 70,
  },
})

export default OTPScreen
