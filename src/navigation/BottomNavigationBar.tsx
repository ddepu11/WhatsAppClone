import { View } from 'native-base'
import { FC } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ChatScreen from '../screens/BottomNavigationScreens/ChatScreen/ChatsScreen'
import { Ionicons, Zocial, Feather } from '@expo/vector-icons'
import StatusScreen from '../screens/BottomNavigationScreens/StatusScreen/StatusScreen'
import CameraScreen from '../screens/BottomNavigationScreens/CameraScreen'
import CallScreen from '../screens/BottomNavigationScreens/CallScreen/CallScreen'
import AccountScreen from '../screens/BottomNavigationScreens/AccountScreen'

const BottomNavigationBar: FC = () => {
  const Tab = createBottomTabNavigator()

  return (
    <Tab.Navigator>
      <Tab.Screen
        name='ChatScreen'
        component={ChatScreen}
        options={{
          tabBarStyle: {
            height: 72,
            backgroundColor: '#FFFFFF',
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <Ionicons
                name='chatbubble-ellipses-outline'
                size={30}
                color={focused ? '#08a70d' : '#284180'}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name='StatusScreen'
        component={StatusScreen}
        options={{
          tabBarStyle: {
            height: 72,
            backgroundColor: '#FFFFFF',
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <Zocial
                name='statusnet'
                size={30}
                color={focused ? '#08a70d' : '#284180'}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name='CameraScreen'
        component={CameraScreen}
        options={{
          tabBarStyle: {
            height: 72,
            backgroundColor: '#FFFFFF',
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <Feather
                name='camera'
                size={30}
                color={focused ? '#08a70d' : '#284180'}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name='CallScreen'
        component={CallScreen}
        options={{
          tabBarStyle: {
            height: 72,
            backgroundColor: '#FFFFFF',
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <Ionicons
                name='call-outline'
                size={30}
                color={focused ? '#08a70d' : '#284180'}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name='AccountScreen'
        component={AccountScreen}
        options={{
          tabBarStyle: {
            height: 72,
            backgroundColor: '#FFFFFF',
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <Ionicons
                name='person-outline'
                size={30}
                color={focused ? '#08a70d' : '#284180'}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomNavigationBar
