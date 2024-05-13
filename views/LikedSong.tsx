import { SafeAreaView, StatusBar, Image, ScrollView, StyleSheet, Text, View, Pressable, Touchable, TouchableOpacity,Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { getAPI } from "../UsingAPI/CallAPI.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

function  LikedSong(): React.JSX.Element {
    return(
        <View>
            <Text>LikedSong</Text>
        </View>
    )
}

export default LikedSong;