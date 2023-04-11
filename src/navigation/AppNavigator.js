import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import Playlist from "../screens/Playlist";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="AudioList"
        component={AudioList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-headset-sharp" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="compact-disc" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Playlist"
        component={Playlist}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-music" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
