import { FC } from 'react'
import SignInScreen from '../screens/SignInScreen'

import OTPScreen from '../screens/OTPScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NavigationParams from '../types/navigationParams'
import Routes from '../constants/routes'

const Stack = createNativeStackNavigator<NavigationParams>()

const AuthStack: FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.SignInScreen}
        component={SignInScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={Routes.OTPScreen}
        component={OTPScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default AuthStack
