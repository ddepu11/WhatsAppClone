import { Box, Button, Image, Text } from "native-base";
import { FC } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Platform } from "react-native";
import useShowMessageScreenHeaderLogic from "./Logic/useShowMessageScreenHeaderLogic";

interface Props {
  displayPicUrl: string;
  personName: string;
  otherPersonId: string;
}

const ShowMessageScreenHeader: FC<Props> = ({
  displayPicUrl,
  personName,
  otherPersonId,
}) => {
  const { handleNavigateBack, hanleMakeVideoCall, hanleMakeVoice } =
    useShowMessageScreenHeaderLogic(otherPersonId);

  return (
    <Box
      width={"100%"}
      bgColor="#FFFFFF"
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      color={"#000000"}
      paddingY={"4"}
      pt={Platform.OS === "ios" ? 12 : 5}
    >
      <Box ml={"3"} flexDirection={"row"} alignItems={"center"}>
        <Button
          padding={0}
          bgColor={"transparent"}
          onPress={handleNavigateBack}
        >
          <AntDesign name="left" size={24} color="black" />
        </Button>

        <Image
          source={{ uri: displayPicUrl }}
          alt={personName}
          width={"36"}
          height={"36"}
          borderRadius={14}
          ml={"4"}
        />

        <Text
          fontSize={"16"}
          fontWeight={"700"}
          lineHeight={"23.5"}
          color={"#000000"}
          ml={"5"}
        >
          {personName}
        </Text>
        {/* <Text
          fontWeight={'400'}
          fontSize={'12'}
          lineHeight={'17.63'}
          color={'#000000'}
        >
          Online
        </Text> */}
      </Box>

      <Box flexDirection="row" textAlign={"center"} mr={"4"}>
        <Button
          onPress={hanleMakeVoice}
          bgColor={"#F4F4F4"}
          padding={"2"}
          mr="4"
          borderRadius={"2xl"}
        >
          <Ionicons name="call-outline" size={24} color="#284180" />
        </Button>

        <Button
          onPress={hanleMakeVideoCall}
          bgColor={"#F4F4F4"}
          padding={"2"}
          borderRadius={"2xl"}
        >
          <FontAwesome name="video-camera" size={24} color="#284180" />
        </Button>
      </Box>
    </Box>
  );
};

export default ShowMessageScreenHeader;
