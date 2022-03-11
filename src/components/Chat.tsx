import { Box, Button, Image, Text } from "native-base";
import { FC, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Routes from "../constants/routes";
import { whenWasTheDocUpdatedOrCreated } from "../helper";

interface Props {
  item: {
    chatId?: string;
    fullName?: string;
    updatedOn: number;
    recentText?: string;
    youHaveRead?: boolean;
    displayPicUrl?: string;
    navigation: any;
    otherPersonId: string;
  };
}

const Chat: FC<Props> = ({
  item: {
    displayPicUrl,
    fullName,
    chatId,
    updatedOn,
    navigation,
    recentText,
    youHaveRead,
    otherPersonId,
  },
}) => {
  const handleChatClick = () => {
    navigation.navigate(Routes.ShowMessageScreen, {
      chatId,
      personName: fullName,
      displayPicUrl: displayPicUrl,
      otherPersonId,
    });
  };

  let lastUpdatedWhen: string = "";

  lastUpdatedWhen = whenWasTheDocUpdatedOrCreated(updatedOn);

  return (
    <TouchableOpacity onPress={handleChatClick}>
      <Box
        flexDirection={"row"}
        bgColor={"#FFFFFF"}
        paddingX={"3"}
        paddingY={"2"}
        mb={"3"}
        borderRadius={"6"}
        shadow={"0.5"}
      >
        <Image
          source={{ uri: displayPicUrl }}
          alt={fullName}
          width={"52"}
          height={"52"}
          borderRadius={14}
        />

        <Box ml={"5"}>
          <Text fontSize={14} fontWeight={500} lineHeight={"23.5"}>
            {fullName}
          </Text>

          <Text
            fontSize={13}
            fontWeight={400}
            lineHeight={"18"}
            opacity={youHaveRead ? "0.5" : "1"}
          >
            {recentText}
          </Text>
        </Box>

        <Box position={"absolute"} right="4" top={3} alignItems="flex-end">
          <Text
            fontWeight={"400"}
            fontSize={"12"}
            lineHeight={"18"}
            opacity={"0.5"}
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
  );
};

export default Chat;
