import { Box, Image, Text, useTypeahead, View } from 'native-base'
import { FC } from 'react'
import { whenWasTheDocUpdatedOrCreated } from '../helper'

interface Props {
  picURL: string | undefined
  createdOn: number
}

const MessageWithImageSent: FC<Props> = ({ picURL, createdOn }) => {
  let lastUpdatedWhen: string

  lastUpdatedWhen = whenWasTheDocUpdatedOrCreated(createdOn)
  return (
    <View
      bgColor={'#22C3A6'}
      borderRadius={'12'}
      borderBottomRightRadius={'0'}
      paddingX={4}
      paddingY={3}
      alignSelf={'flex-end'}
      mt={10}
      mr={5}
    >
      <Box flexDirection={'row'}>
        <Image
          source={{ uri: picURL }}
          alt="random image"
          width={200}
          height={250}
          mr={2}
        />

        {/* <Box>
          <Image
            source={{ uri: 'https://picsum.photos/130' }}
            alt="random image"
            width={126}
            height={82}
            mb={'1'}
          />

          <Image
            source={{ uri: 'https://picsum.photos/130' }}
            alt="random image"
            width={126}
            height={55}
            // opacity={'0.4'}
          />
          <View
            position={'absolute'}
            bottom={0}
            right={0}
            bgColor={'rgba(0,0,0,0.4)'}
            width={'126'}
            height={'55'}
            justifyContent="center"
            alignItems="center"
          >
            <Text
              color={'#FFFFFF'}
              fontWeight={700}
              fontSize={12}
              lineHeight={18}
            >
              +12
            </Text>
          </View>
        </Box> */}
      </Box>

      <View
        position={'absolute'}
        right={'-1.5'}
        bottom={'-2.8'}
        width={'3'}
        height={'3'}
        backgroundColor={'#22C3A6'}
        borderTopRightRadius={'20'}
        borderBottomLeftRadius={'20'}
        style={{
          transform: [{ rotateY: '0deg' }, { rotateX: '50deg' }]
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

export default MessageWithImageSent
