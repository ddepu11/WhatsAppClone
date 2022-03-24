import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  Text,
  View,
  Image,
  Center,
  Box,
  Input,
  Select,
  CheckIcon,
  Button,
  StatusBar,
  Spinner,
} from 'native-base'
import { FC, useEffect, useRef, useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import Routes from '../constants/routes'
import NavigationParams from '../types/navigationParams'
import { ApplicationVerifier, PhoneAuthProvider } from 'firebase/auth'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { app, auth } from '../../firebaseconfig'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import {
  userLoadingEnds,
  userLoadingStarts,
} from '../../redux/states/userState'

const Icon = require('../../assets/Icon2.png')

type Props = NativeStackScreenProps<NavigationParams, Routes.SignInScreen>

const SignInScreen: FC<Props> = ({ navigation }) => {
  // const dispatch = useAppDispatch()

  const recaptchaVerifierRef = useRef<FirebaseRecaptchaVerifierModal>(null)

  const [countryCode, setCountryCode] = useState('+91')

  const [mobileNumber, setMobileNumber] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateOTP = async () => {
    setIsLoading(true)

    try {
      const phoneProvider = new PhoneAuthProvider(auth)

      const verificationId = await phoneProvider.verifyPhoneNumber(
        `${countryCode}${mobileNumber}`,
        recaptchaVerifierRef.current as ApplicationVerifier
      )

      navigation.navigate(Routes.OTPScreen, {
        verificationId,
        mobileNumber,
        countryCode,
      })
    } catch (err: any) {
      setIsLoading(false)

      Alert.alert(err.message)
    }
  }

  const handleMobileNumber = (mobileNumber: string): void => {
    setMobileNumber(mobileNumber)
  }

  const handleCountryCode = (countryCode: string): void => {
    setCountryCode(countryCode)
  }

  useEffect(() => {
    auth.languageCode = 'en'
  }, [])

  // const { isLoading } = useAppSelector((state) => state.user.value)

  return (
    <View flex={1}>
      <StatusBar barStyle='dark-content' backgroundColor='#ececec' />

      {/* Captha */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifierRef}
        firebaseConfig={app.options}
        title='Prove you are human!'
        cancelLabel='Close'
        // attemptInvisibleVerification={true}
      />

      <Center flex={1} justifyContent='space-evenly'>
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
            Welcome
          </Text>

          <Text fontWeight={'400'} color={'#000000'} fontSize={'14'} mt={2}>
            Sign In to continue
          </Text>
        </View>

        <View style={styles.otpAndConditions}>
          <Box style={styles.inputs}>
            <Select
              selectedValue={countryCode}
              minWidth='18'
              accessibilityLabel='Choose Country Code'
              _selectedItem={{
                bg: 'blue.300',
                endIcon: <CheckIcon size='5' />,
              }}
              mt={1}
              onValueChange={handleCountryCode}
              width={'16'}
              borderWidth={'0'}
              fontSize={'14'}
              fontWeight={'400'}
              lineHeight={'16.8'}
            >
              <Select.Item label='+1' value='+45' />
              <Select.Item label='+91' value='+91' />
              <Select.Item label='+92' value='+92' />
              <Select.Item label='+10' value='+10' />
              <Select.Item label='+12' value='+12' />
              <Select.Item label='+56' value='+56' />
              <Select.Item label='+45' value='+45' />
            </Select>

            <Input
              mx='3'
              placeholder='Mobile Number'
              w='72%'
              maxWidth='300px'
              borderWidth={'0'}
              value={mobileNumber}
              keyboardType={'phone-pad'}
              onChangeText={handleMobileNumber}
              // ref={mobileInput}
              fontSize={'14'}
              fontWeight={'400'}
            />
          </Box>

          {isLoading ? (
            <Spinner size={'lg'} mt={'10'} />
          ) : (
            <Button
              borderRadius={'6'}
              width={'75%'}
              alignSelf={'center'}
              mt={60}
              bgColor={'#22C3A6'}
              p={3}
              onPress={handleGenerateOTP}
              isDisabled={mobileNumber.length === 10 ? false : true}
            >
              <Text
                fontSize={'14'}
                fontWeight={'700'}
                color={'#FFFFFF'}
                lineHeight={'20.56'}
              >
                Generate OTP
              </Text>
            </Button>
          )}

          <Text
            width={'75%'}
            fontSize={'12'}
            fontWeight={'500'}
            lineHeight={'24'}
            mt={7}
            textAlign='center'
            alignSelf={'center'}
          >
            By continuing, you agree to our{' '}
            <Text color={'#22C3A6'} underline={true}>
              Terms of service
            </Text>{' '}
            and
            <Text color={'#22C3A6'} underline={true}>
              {' '}
              Privacy Policy
            </Text>
          </Text>
        </View>
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
    // borderColor: 'red',
    // borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    // marginTop: -100
  },

  otpAndConditions: {
    width: '100%',
    // marginTop: -100
  },

  inputs: {
    borderColor: 'rgba(0, 0, 0,0.2)',
    borderBottomWidth: 1,
    width: '75%',
    flexDirection: 'row',
    alignSelf: 'center',
  },
})

export default SignInScreen
