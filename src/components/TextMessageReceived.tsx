import { Text, View } from 'native-base'
import { FC } from 'react'
import { whenWasTheDocUpdatedOrCreated } from '../helper'

interface Props {
  message: string | undefined
  createdOn: number
}

const TextMessageReceived: FC<Props> = ({ message, createdOn }) => {
  let lastUpdatedWhen: string

  lastUpdatedWhen = whenWasTheDocUpdatedOrCreated(createdOn)

  return (
    <View
      bgColor={'#FFFFFF'}
      width={'267'}
      // height={'75'}
      borderRadius={'12'}
      borderBottomLeftRadius={'0'}
      paddingX={3}
      paddingY={3}
      alignSelf={'flex-start'}
      mt={5}
      ml={5}
      mb={5}
    >
      <Text
        color={'#000000'}
        fontWeight={400}
        fontSize={'14'}
        lineHeight={'18'}
      >
        {message}
      </Text>

      <View
        position={'absolute'}
        left={'-2.3'}
        bottom={'-2.8'}
        width={'3'}
        height={'3'}
        // backgroundColor={'#000'}
        backgroundColor={'#FFFFFF'}
        borderTopRightRadius={'20'}
        borderBottomLeftRadius={'20'}
        style={{
          transform: [{ rotateY: '180deg' }, { rotateX: '50deg' }],
        }}
      />

      <Text
        position={'absolute'}
        bottom={'-20'}
        left={'-02'}
        fontWeight={'500'}
        fontSize={'10'}
        lineHeight={'18'}
        color={'rgba(0, 0, 0,0.4)'}
      >
        {lastUpdatedWhen}
      </Text>
    </View>
  )
}

export default TextMessageReceived
