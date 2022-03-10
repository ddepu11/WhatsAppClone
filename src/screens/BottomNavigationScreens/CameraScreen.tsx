import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { Text, View, Center, Button } from "native-base";
import { FC } from "react";

const CameraScreen: FC = () => {
  return (
    <View flex={1}>
      <Center flex={1} justifyContent="center">
        <Text fontSize={"4xl"}>Camera Screen</Text>
        <Text mb={"10"} fontSize={"4xl"}>
          Camera{" "}
        </Text>

        <Button borderRadius={"2xl"} mt={"10"}>
          Call
        </Button>
      </Center>
    </View>
  );
};

export default CameraScreen;
