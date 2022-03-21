import { Spinner, Text, View } from 'native-base'
import { FC } from 'react'

const SpinnerComponent: FC<{ message: string }> = ({ message }) => {
  return (
    <View
      bgColor={'#22C3A6'}
      width={'267'}
      borderRadius={'12'}
      borderBottomRightRadius={'0'}
      paddingX={3}
      paddingY={2}
      alignSelf={'flex-end'}
      my={3}
      mr={5}
      flexDirection={'row'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Spinner size={'sm'} my={'1'} color={'#373636'} />

      <Text
        ml={'2'}
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

      {/* <Text
        position={'absolute'}
        bottom={'-20'}
        right={'-02'}
        fontWeight={'500'}
        fontSize={'10'}
        lineHeight={'18'}
        color={'rgba(0, 0, 0,0.4)'}
      >
        {lastUpdatedWhen}
      </Text> */}
    </View>
  )
}

export default SpinnerComponent
