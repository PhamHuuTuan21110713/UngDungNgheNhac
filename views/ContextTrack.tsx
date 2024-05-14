import { SafeAreaView, StatusBar, Image, ScrollView, StyleSheet, Text, View, Pressable, Touchable, TouchableOpacity,Dimensions, TextInput } from "react-native";
import React, {createContext, useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { getAPI } from "../UsingAPI/CallAPI.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Player = createContext();

const ContextTrack = ({children}:any) => {
    const [currentTrack,setCurrentTrack] = useState(null);
    return (
        <Player.Provider value={{currentTrack,setCurrentTrack}}>
            {children}
        </Player.Provider>
    )
}
export {ContextTrack, Player}