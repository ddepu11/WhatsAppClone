import { NavigationContainer } from '@react-navigation/native'
import { FC, useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import AppStack from './AppStack'
import AuthStack from './AuthStack'
import { getValueFromLocalStorage } from '../helper'
import {
  fetchUserInfoRequest,
  logInSuccess,
} from '../../redux/states/userState'

const MainNavigation: FC = () => {
  const { loggedIn } = useAppSelector((state) => state.user.value)
  const dispatch = useAppDispatch()

  useEffect(() => {
    SplashScreen.preventAutoHideAsync()

    getValueFromLocalStorage('userInfo')
      .then((data) => {
        const dataInJSON = JSON.parse(data)

        if (dataInJSON.id) {
          dispatch(logInSuccess({ mobileNumber: dataInJSON.mobileNumber }))

          // Already logged in
          console.log('Logged in')
          dispatch(
            fetchUserInfoRequest({ mobileNumber: dataInJSON.mobileNumber })
          )
        } else {
          // Not logged in
          console.log('No one is Logged in!')
        }

        SplashScreen.hideAsync()
      })
      .catch((err: any) => {
        console.log('An Error occured: ', err.message)
        console.log('No one is Logged in!')

        SplashScreen.hideAsync()
      })
  }, [])

  return (
    <NavigationContainer>
      {loggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default MainNavigation
