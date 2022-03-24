import { Text, View } from 'native-base'
import { FC, memo, useMemo } from 'react'
import { whenWasTheDocUpdatedOrCreated } from '../helper'

interface Props {
  message: string | undefined
  createdOn: number
}

const TextMessageSent: FC<Props> = ({ message, createdOn }) => {
  let lastUpdatedWhen: string

  lastUpdatedWhen = useMemo(
    () => whenWasTheDocUpdatedOrCreated(createdOn),
    [createdOn]
  )

  return (
    <View
      bgColor={'#22C3A6'}
      width={'267'}
      borderRadius={'12'}
      borderBottomRightRadius={'0'}
      paddingX={3}
      paddingY={3}
      alignSelf={'flex-end'}
      mt={5}
      mr={5}
      mb={5}
    >
      <Text
        color={'#FFFFFF'}
        fontWeight={400}
        fontSize={'14'}
        lineHeight={'18'}
      >
        {message}
      </Text>

      <View
        position={'absolute'}
        right={'-1.5'}
        bottom={'-2.3'}
        width={'3'}
        height={'3'}
        backgroundColor={'#22C3A6'}
        borderBottomLeftRadius={'20'}
        borderTopRightRadius={'20'}
        style={{
          transform: [{ rotateY: '0deg' }, { rotateX: '50deg' }],
        }}
      />

      <Text
        position={'absolute'}
        bottom={'-20'}
        right={'-02'}
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

export default memo(TextMessageSent)
