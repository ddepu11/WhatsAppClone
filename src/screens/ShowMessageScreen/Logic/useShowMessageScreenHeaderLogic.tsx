import { useNavigation } from '@react-navigation/native'
import { useAppSelector } from '../../../../redux/store'

const useShowMessageScreenHeaderLogic = (otherPersonId: string) => {
  const navigation = useNavigation()
  const { id } = useAppSelector((state) => state.user.value)

  // useEffect(() => {
  //   console.log(id)
  // }, [])

  const hanleMakeVoice = () => {
    console.log('Calling...')
  }

  const hanleMakeVideoCall = () => {}

  const handleNavigateBack = () => {
    navigation.goBack()
  }

  return {
    hanleMakeVoice,
    hanleMakeVideoCall,
    handleNavigateBack
  }
}

export default useShowMessageScreenHeaderLogic
