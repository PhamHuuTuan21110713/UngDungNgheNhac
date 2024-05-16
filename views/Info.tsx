import { SafeAreaView, StatusBar, Image, ScrollView, StyleSheet, Text, View, Pressable, Touchable, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { getAPI } from "../UsingAPI/CallAPI.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";


function Info(): React.JSX.Element {
    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={{ flex: 1 }}>
                <LinearGradient colors={['#ADD8E6', '#000000']} style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerText}>Cá nhân</Text>
                        </View>
                        <View style={styles.headerIcon}>
                            <Image source={require("../icons/setting.png")}
                                resizeMode='contain' style={{ marginLeft: 10, width: 25, height: 25, tintColor: "#FFFFFF" }} />
                            <Image source={require("../icons/bell.png")}
                                resizeMode='contain' style={{ marginLeft: 10, width: 25, height: 25, tintColor: "#FFFFFF" }} />
                            <Image source={require("../icons/search.png")}
                                resizeMode='contain' style={{ marginLeft: 10, width: 25, height: 25, tintColor: "#FFFFFF" }} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10, padding: 10 }}>
                        <Image source={require("../icons/setting.png")}
                            resizeMode='contain' style={styles.avatar} />
                        <Text style={styles.nameText}>
                            Bui Trong Tri
                        </Text>
                    </View>
                </LinearGradient>
            </View>
            <View style={{ flex: 2 }}>
                <Text style={[styles.headerText, { padding: 10 }]}>Nghệ sĩ ưa thích</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                </ScrollView>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15
    },
    headerText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
    nameText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        padding: 20,
    },
    headerIcon: {
        flexDirection: 'row',
        marginLeft: 20
    },
    avatar: {
        paddingBottom: 10,
        width: 80,
        height: 80,
        borderRadius: 60,
        resizeMode: 'cover'
    }
})
export default Info;