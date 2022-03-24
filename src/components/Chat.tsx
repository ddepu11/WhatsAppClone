import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Box, Image, Text, View } from 'native-base'
import { FC, useMemo, memo } from 'react'
import { TouchableOpacity } from 'react-native'
import Routes from '../constants/routes'
import { whenWasTheDocUpdatedOrCreated } from '../helper'
import NavigationParams from '../types/navigationParams'

interface Props {
  chatId: string
  fullName: string
  updatedOn: number
  recentText?: string
  youHaveRead?: boolean
  displayPicUrl: string
  otherPersonId: string
}

const Chat: FC<Props> = ({
  displayPicUrl,
  fullName,
  chatId,
  updatedOn,
  recentText,
  youHaveRead,
  otherPersonId,
}) => {
  const navigation = useNavigation<NavigationProp<NavigationParams>>()

  const handleChatClick = () => {
    navigation.navigate(Routes.ShowMessageScreen, {
      chatId,
      personName: fullName,
      displayPicUrl: displayPicUrl,
      otherPersonId,
    })
  }

  let lastUpdatedWhen: string = ''

  lastUpdatedWhen = useMemo(
    () => whenWasTheDocUpdatedOrCreated(updatedOn),
    [updatedOn]
  )

  return (
    <View flex={1}>
      <TouchableOpacity onPress={handleChatClick}>
        <Box
          flexDirection={'row'}
          bgColor={'#FFFFFF'}
          paddingX={'3'}
          paddingY={'2'}
          mb={'3'}
          borderRadius={'6'}
          shadow={'0.5'}
        >
          <Image
            source={{ uri: displayPicUrl }}
            alt={fullName}
            width={'52'}
            height={'52'}
            borderRadius={14}
          />

          <Box ml={'5'}>
            <Text fontSize={14} fontWeight={500} lineHeight={'23.5'}>
              {fullName}
            </Text>

            <Text
              fontSize={13}
              fontWeight={400}
              lineHeight={'18'}
              opacity={youHaveRead ? '0.5' : '1'}
            >
              {recentText}
            </Text>
          </Box>

          <Box position={'absolute'} right='4' top={3} alignItems='flex-end'>
            <Text
              fontWeight={'400'}
              fontSize={'12'}
              lineHeight={'18'}
              opacity={'0.5'}
            >
              {lastUpdatedWhen}
            </Text>

            {/* {!youHaveRead && (
            <Button
              mt="2"
              padding={0}
              style={{ backgroundColor: '#22C3A6' }}
              borderRadius={'6'}
            >
              <Text
                color={'#FFFFFF'}
                fontWeight={'600'}
                fontSize={'11'}
                lineHeight={'12'}
                paddingX={'1.5'}
                paddingY={'1'}
              >
                {10}
              </Text>
            </Button>
          )} */}
          </Box>
        </Box>
      </TouchableOpacity>
    </View>
  )
}

const areEqual = (prevProps: Props, nextProps: Props) => {
  const { chatId } = nextProps
  const { chatId: prevChatId } = prevProps

  /*if the props are equal, it won't update*/
  const isSelectedEqual = chatId === prevChatId

  return isSelectedEqual
}

export default memo(Chat, areEqual)
