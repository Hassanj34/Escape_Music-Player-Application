import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import Playlist from "../screens/Playlist";
import PLayListDetail from "../screens/PlayListDetail";
import ProfileScreen from "../screens/ProfileScreen";
import { Text } from "react-native";
import Icons from "../components/Icons";
import * as Font from "expo-font";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlayListScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlayList" component={Playlist} />
      <Stack.Screen name="PlayListDetail" component={PLayListDetail} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Custom: require("../../assets/fonts/Custom.ttf"),
      });
    };

    loadFonts();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: "black",
        tabBarInactiveBackgroundColor: "black",
        tabBarActiveTintColor: "white",
      }}
    >
      <Tab.Screen
        name="Your Library"
        component={AudioList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icons name="icon-icons8-music-library-96" size={size} color={color} />
          ),
          // headerShown: true,
          // header: () => (
          //   <Text
          //     style={{
          //       textAlign: "center",
          //       fontSize: 25,
          //       fontWeight: "bold",
          //       paddingTop: 20,
          //       // paddingBottom: 30,
          //       color: "white",
          //       // fontFamily: "Lexend-Regular",
          //       backgroundColor: "black",
          //     }}
          //   >
          //     Library
          //   </Text>
          // ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icons name="icon-icons8-music-record-96" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Playlist"
        component={PlayListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icons name="icon-icons8-playlist-96" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icons name="icon-icons8-user-96" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
