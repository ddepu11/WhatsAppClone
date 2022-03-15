import { FC, useRef } from "react";
import {
  Box,
  Center,
  IScrollViewProps,
  ScrollView,
  Spinner,
  StatusBar,
  Text,
  View,
} from "native-base";
import Routes from "../../constants/routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import NavigationParams from "../../types/navigationParams";
import TextMessageSent from "../../components/TextMessageSent";
import TextMessageReceived from "../../components/TextMessageReceived";
import ShowMessageScreenHeader from "./ShowMessageScreenHeader";
import ShowMessageScreenFooter from "./ShowMessageScreenFooter";
import useShowMessageScreenLogic from "./Logic/useShowMessageScreenLogic";
import MessageWithImageReceived from "../../components/MessageWithImageReceived";
import MessageWithImageSent from "../../components/MessageWithImageSent";
import MessageSpinner from "../../components/Spinner";
import AudioMessageSent from "../../components/AudioMessageSent";
import AudioMessageReceived from "../../components/AudioMessageReceived";
import { ScrollViewProps } from "react-native";

type Props = NativeStackScreenProps<NavigationParams, Routes.ShowMessageScreen>;

type ScrollViewRef = IScrollViewProps & {
  scrollToEnd: (options?: { animated: boolean }) => void;
};

const ShowMessageScreen: FC<Props> = ({ route }) => {
  const { displayPicUrl, personName, chatId, otherPersonId } = route.params;

  const {
    messages,
    id,
    sendMessageLoading,
    fetchMessageLoading,
    otherPersonOnfo,
  } = useShowMessageScreenLogic(chatId, otherPersonId);

  const scrollViewRef = useRef<ScrollViewRef>();

  return (
    <View flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Center flex={1} justifyContent="flex-start">
        <ShowMessageScreenHeader
          displayPicUrl={displayPicUrl}
          personName={personName}
          otherPersonId={otherPersonId}
          isOnline={otherPersonOnfo?.isOnline}
        />

        {/* Messages Box */}
        {messages.length > 0 && (
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={(w, h) => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }
            }}
            bgColor={"#E5E5E5"}
            width={"100%"}
            _contentContainerStyle={{ paddingBottom: "20" }}
          >
            {messages.map(({ createdOn, userId, text, picURL, audioURL }) => {
              if (userId === id) {
                if (!text && picURL) {
                  return (
                    <MessageWithImageSent
                      key={createdOn}
                      picURL={picURL}
                      createdOn={createdOn}
                    />
                  );
                } else if (!text && audioURL) {
                  return (
                    <AudioMessageSent
                      key={createdOn}
                      audioURL={audioURL}
                      createdOn={createdOn}
                    />
                  );
                } else {
                  return (
                    <TextMessageSent
                      key={createdOn}
                      message={text}
                      createdOn={createdOn}
                    />
                  );
                }
              } else {
                if (!text && picURL) {
                  return (
                    <MessageWithImageReceived
                      key={createdOn}
                      picURL={picURL}
                      createdOn={createdOn}
                    />
                  );
                } else if (!text && audioURL) {
                  return (
                    <AudioMessageReceived
                      key={createdOn}
                      audioURL={audioURL}
                      createdOn={createdOn}
                    />
                  );
                } else {
                  return (
                    <TextMessageReceived
                      key={createdOn}
                      message={text}
                      createdOn={createdOn}
                    />
                  );
                }
              }
            })}

            {sendMessageLoading && (
              <MessageSpinner message={"Sending message..."} />
            )}
          </ScrollView>
        )}

        {fetchMessageLoading && (
          <Box bgColor={"#E5E5E5"} width={"100%"} height={"86%"}>
            <Spinner size={"lg"} mt={"100"} color={"#373636"} />
            <Text textAlign={"center"} mt={"5"} fontSize={"15"}>
              Loading messages....
            </Text>
          </Box>
        )}

        {messages.length === 0 && !fetchMessageLoading && (
          <Box bgColor={"#E5E5E5"} width={"100%"} height={"86%"}>
            <Text textAlign={"center"} mt={"5"} fontSize={"15"}>
              There are no messages
            </Text>
          </Box>
        )}

        <ShowMessageScreenFooter chatId={chatId} />
      </Center>
    </View>
  );
};

export default ShowMessageScreen;
