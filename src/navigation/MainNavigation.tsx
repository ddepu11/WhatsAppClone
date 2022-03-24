import { NavigationContainer } from '@react-navigation/native'
import { FC, useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { enableScreens } from 'react-native-screens'
enableScreens()
import { useAppDispatch, useAppSelector } from '../../redux/store'
import AppStack from './AppStack'
import AuthStack from './AuthStack'
import { getValueFromLocalStorage } from '../helper'
import {
  fetchUserInfoRequest,
  logInFailed,
  logInSuccess,
} from '../../redux/states/userState'
import { Heading, HStack, Spinner, StatusBar, Text, View } from 'native-base'

const MainNavigation: FC = () => {
  console.log('Rendering Main Navigation')

  const { loggedIn, isLoading } = useAppSelector((state) => state.user.value)
  const dispatch = useAppDispatch()

  useEffect(() => {
    SplashScreen.preventAutoHideAsync()

    getValueFromLocalStorage('userInfo')
      .then((data) => {
        const dataInJSON = JSON.parse(data)

        if (dataInJSON.id) {
          dispatch(logInSuccess({ mobileNumber: dataInJSON.mobileNumber }))

          // console.log('Logged in')
          dispatch(
            fetchUserInfoRequest({ mobileNumber: dataInJSON.mobileNumber })
          )

          SplashScreen.hideAsync()
        } else {
          SplashScreen.hideAsync()
          dispatch(logInFailed())
          // console.log('No one is Logged in!')
        }
      })
      .catch((err: any) => {
        console.warn('An Error occured: ', err.message)
        // console.log('No one is Logged in!')
        dispatch(logInFailed())
        SplashScreen.hideAsync()
      })
  }, [])

  return (
    <NavigationContainer>
      {isLoading ? (
        <View
          flex={1}
          alignItems={'center'}
          justifyContent={'center'}
          backgroundColor={'#E5E5E5'}
        >
          <StatusBar barStyle='dark-content' backgroundColor='#E5E5E5' />

          <HStack mt={'20'} space={2} justifyContent='center'>
            <Spinner accessibilityLabel='Loading please wait' color={'black'} />

            <Heading color='black' fontSize='2xl' fontWeight={500}>
              Loading please wait....
            </Heading>
          </HStack>
        </View>
      ) : (
        <>{loggedIn ? <AppStack /> : <AuthStack />}</>
      )}
    </NavigationContainer>
  )
}

export default MainNavigation
