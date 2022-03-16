import { Button, Center, Spinner, Text, View } from 'native-base'
import { FC } from 'react'
import { Alert } from 'react-native'
import {
  logOutFailure,
  logOutRequest,
  logOutSuccess,
} from '../../../redux/states/userState'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { deleteValueFromLocalStorage } from '../../helper'

const AccountScreen: FC = () => {
  const dispatch = useAppDispatch()

  const { isLoading, loggedIn } = useAppSelector((state) => state.user.value)

  const handleLogOut = async () => {
    dispatch(logOutRequest())

    try {
      await deleteValueFromLocalStorage('userInfo')

      dispatch(logOutSuccess())

      Alert.alert('Successfully logged out!')
    } catch (err: any) {
      dispatch(logOutFailure())

      console.log(err.code)
      console.log(err.message)
    }
  }

  return (
    <View flex={1}>
      <Center flex={1} justifyContent='center'>
        {loggedIn && !isLoading ? (
          <Button bgColor={'#444'} onPress={handleLogOut}>
            <Text color={'#f5f2f2'} fontSize={'2xl'}>
              Log Out
            </Text>
          </Button>
        ) : (
          <Spinner size={'lg'} />
        )}
      </Center>
    </View>
  )
}

export default AccountScreen
