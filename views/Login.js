import { StyleSheet, Text, View, SafeAreaView, StatusBar, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
// import {LinearGradient} from 'expo-linear-gradient';
import * as AppAuth from 'expo-app-auth';
import { authorize  } from 'react-native-app-auth';
import { useNavigation } from "@react-navigation/native";

export default Login = () => {
    const navigation = useNavigation();
    useEffect(()=> {
        const checkTokenValidity = async ()=> {
            const accessToken = await AsyncStorage.getItem("token");
            const expirationDate = await AsyncStorage.getItem("expirationDate");
            console.log("Token: ",accessToken);
            console.log("expirationDate: ",expirationDate)
            if(accessToken && expirationDate) {
                const currTime = Date.now();
                if(currTime < parseInt(expirationDate)) {
                    navigation.replace("Main");
                } else {
                    AsyncStorage.removeItem("token");
                    AsyncStorage.removeItem("expirationDate");
                }
            }
        }
        checkTokenValidity();
    },[])
    async function logIn() {

        const config = {
            issuer: "https://accounts.spotify.com",
            clientId: "02b869f8d6934d8a91762da9c4bcdc2e",
            redirectUrl: "spodyfy-ungdungnghenhac://callback",
            clientSecret: "a2390e7185a94d93a9e31dc73c59ad68",
            scopes: [
                "user-read-email",
                "user-library-read",
                "user-read-recently-played",
                "user-top-read",
                "playlist-read-private",
                "playlist-read-collaborative",
                "playlist-modify-public"
            ]
        };

        try {
            const result = await authorize(config);
            console.log(result)
            if (result.accessToken) {
                
               const expirationDate = new Date(result.accessTokenExpirationDate).getTime();
               AsyncStorage.setItem("token",result.accessToken);
               AsyncStorage.setItem("expirationDate", expirationDate.toString());
               navigation.navigate("Main");
            } else {
                console.log("No access token");
            }
        } catch (error) {
            console.error("Failed to authenticate", error);
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={"black"} />
            <SafeAreaView style={[style.areaStyle]}>
                <View style={{ backgroundColor: "black", alignItems: "center", justifyContent: "flex-end", flex: 2 }}>
                    <LinearGradient colors={["#F87275", "#c24f83"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ width: 200, height: 200, borderRadius: 200, justifyContent: "center", alignItems: "center" }}>
                        <Image source={require("../logo/logo.png")} resizeMode="cover" style={{ width: "100%", height: "100%", tintColor: "#fff" }} />
                    </LinearGradient>
                    <Text style={[style.textLogo]}>Spody5</Text>
                    <Text style={{ color: "#d9d9d9" }}>Rersian Music Portal</Text>
                </View>
                <View style={{ width: "100%", alignItems: "center", marginTop: 50, paddingHorizontal: 30, flex: 1 }}>
                    <TouchableOpacity
                        onPress={logIn}
                        style={[style.loginButton]}>
                        <LinearGradient colors={["#F87275", "#c24f83"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Text style={[{ color: "#fff", fontSize: 20, fontWeight: "500" }]}>Start</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>

    )
}
const style = StyleSheet.create({
    areaStyle: {
        backgroundColor: "black",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    textLogo: {
        color: "#fff",
        fontSize: 40,
        fontWeight: "900",

    },
    loginButton: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 50,
        overflow: "hidden",
        borderRadius: 40
    }
})