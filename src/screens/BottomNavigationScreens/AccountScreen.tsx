import { Button, Center, Text, View } from "native-base";
import { FC } from "react";
import { deleteValueFromLocalStorage } from "../../helper";

const AccountScreen: FC = () => {
  const handleLogOut = async () => {
    console.log("Logging Out!!!");

    try {
      await deleteValueFromLocalStorage("userInfo");

      console.log("Logged Out");
    } catch (err: any) {
      console.log(err.code);
      console.log(err.message);
    }
  };

  return (
    <View flex={1}>
      <Center flex={1} justifyContent="center">
        <Button bgColor={"#444"} onPress={handleLogOut}>
          <Text color={"#f5f2f2"} fontSize={"4xl"}>
            Log Out
          </Text>
        </Button>
      </Center>
    </View>
  );
};

export default AccountScreen;
