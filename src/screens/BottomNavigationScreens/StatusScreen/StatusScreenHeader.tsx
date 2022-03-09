import { Box, Button, Image, Text, View } from 'native-base'
import { FC } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'

const StatusScreenHeader: FC = () => {
  return (
    <View width={'100%'} alignItems="center">
      <Box
        width="100%"
        alignItems={'center'}
        bgColor="#E5E5E5"
        flexDirection={'row'}
        color={'#000000'}
        paddingY={'3'}
        mt="2"
      >
        <Text fontWeight={'700'} fontSize={'22'} lineHeight={'24'} ml={5}>
          Status
        </Text>

        <Box
          position={'absolute'}
          right="4"
          textAlign={'center'}
          flexDirection="row"
        >
          <Button
            //   onPress={hanleMakeVideoCall}
            bgColor={'transparent'}
            padding={'0'}
            borderRadius={'2xl'}
          >
            <Entypo name="magnifying-glass" size={30} color="#284180" />
          </Button>
        </Box>
      </Box>

      <Box
        borderRadius={'5'}
        py={'3'}
        bgColor={'#22C3A6'}
        width="90%"
        flexDirection={'row'}
        mt="3"
      >
        <Image
          source={{ uri: 'https://i.pravatar.cc/300' }}
          alt={'name'}
          width={'52'}
          height={'52'}
          borderRadius={14}
          ml={'4'}
        />

        <Box ml={'5'}>
          <Text
            fontSize={'18'}
            fontWeight={'500'}
            lineHeight={'23.5'}
            color={'#FFFFFF'}
            mt="1"
          >
            My Status
          </Text>

          <Text
            fontWeight={'400'}
            fontSize={'12'}
            lineHeight={'18'}
            color={'#FFFFFF'}
            mt="1"
          >
            Add to my status
          </Text>
        </Box>

        <Box position={'absolute'} top="5" right="4" flexDirection="row">
          <Button
            // onPress={hanleAttachImages}
            bgColor={'#FFFFFF'}
            padding={'2'}
            borderRadius={'2xl'}
            mr={4}
          >
            <FontAwesome name="camera" size={21} color="#284180" />
          </Button>

          <Button
            // onPress={hanleAttachImages}
            bgColor={'#FFFFFF'}
            padding={'2'}
            borderRadius={'2xl'}
          >
            <MaterialIcons name="edit" size={21} color="#284180" />
          </Button>
        </Box>
      </Box>
    </View>
  )
}

export default StatusScreenHeader
