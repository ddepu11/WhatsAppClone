import { FC, useEffect } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NavigationParams from '../types/navigationParams'
import Routes from '../constants/routes'
import BottomNavigationBar from './BottomNavigationBar'
import ShowMessageScreen from '../screens/ShowMessageScreen/ShowMessageScreen'
import DpAndUserName from '../screens/DpAndUserName'
import { useAppSelector } from '../../redux/store'
import AddOptionSlider from '../screens/BottomNavigationScreens/ChatScreen/AddOptionSlider'
import { saveValueInLocalStorage } from '../helper'

const Stack = createNativeStackNavigator<NavigationParams>()

const AppStack: FC = () => {
  const { loggedIn, id, mobileNumber } = useAppSelector(
    state => state.user.value
  )

  useEffect(() => {
    if (id) {
      saveValueInLocalStorage('userInfo', JSON.stringify({ id, mobileNumber }))
    } else {
      saveValueInLocalStorage(
        'userInfo',
        JSON.stringify({ id, mobileNumber: '' })
      )
    }
  }, [id, mobileNumber])

  return (
    <Stack.Navigator>
      {loggedIn && !id && (
        <Stack.Screen
          name={Routes.DpAndUserName}
          component={DpAndUserName}
          options={{ headerShown: false }}
        />
      )}

      <Stack.Screen
        name={Routes.BottomNavigationBar}
        component={BottomNavigationBar}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={Routes.ShowMessageScreen}
        component={ShowMessageScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default AppStack
