import { FC, useEffect, useRef, useState } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NavigationParams from "../types/navigationParams";
import Routes from "../constants/routes";
import BottomNavigationBar from "./BottomNavigationBar";
import ShowMessageScreen from "../screens/ShowMessageScreen/ShowMessageScreen";
import DpAndUserName from "../screens/DpAndUserName";
import { useAppSelector } from "../../redux/store";
import AddOptionSlider from "../screens/BottomNavigationScreens/ChatScreen/AddOptionSlider";
import { saveValueInLocalStorage } from "../helper";
import { AppState, AppStateStatus } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { firestoreDB } from "../../firebaseconfig";

const Stack = createNativeStackNavigator<NavigationParams>();

const AppStack: FC = () => {
  const { loggedIn, id, mobileNumber } = useAppSelector(
    (state) => state.user.value
  );

  useEffect(() => {
    if (id) {
      saveValueInLocalStorage("userInfo", JSON.stringify({ id, mobileNumber }));
    } else {
      saveValueInLocalStorage(
        "userInfo",
        JSON.stringify({ id, mobileNumber: "" })
      );
    }
  }, [id, mobileNumber]);

  useEffect(() => {
    if (id) {
      AppState.addEventListener("change", _handleAppStateChange);
    }

    return () => {
      if (id) {
        AppState.removeEventListener("change", _handleAppStateChange);
      }
    };
  }, [id]);

  const _handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const userDocFef = doc(firestoreDB, "users", id);

    if (nextAppState === "active") {
      console.log("Online");

      if (id && loggedIn) {
        await updateDoc(userDocFef, {
          isOnline: true,
        });
      }
    }

    if (nextAppState === "background") {
      console.log("Offline");

      if (id && loggedIn) {
        await updateDoc(userDocFef, {
          isOnline: false,
        });
      }
    }
  };

  return (
    <Stack.Navigator>
      {loggedIn && !id && (
        <Stack.Screen
          name={Routes.DpAndUserName}
          component={DpAndUserName}
          options={{ headerShown: false }}
        />
      )}

      <Stack.Screen
        name={Routes.BottomNavigationBar}
        component={BottomNavigationBar}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={Routes.ShowMessageScreen}
        component={ShowMessageScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
