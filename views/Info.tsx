import { SafeAreaView, StatusBar, Image, ScrollView, StyleSheet, Text, View, Pressable, Touchable, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { getAPI } from "../UsingAPI/CallAPI.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";


function Info(): React.JSX.Element {
    const [userProfile, setUserProfile] = useState();
    const navigation: any = useNavigation();

    useEffect(() => {
        const getInfo = async () => {
            const accessToken = await AsyncStorage.getItem("token");
            console.log("Token-getProfile: ", accessToken);

            const url_user = "https://api.spotify.com/v1/me";
            const config_user = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            try {
                const data_user = await getAPI(url_user, config_user);
                setUserProfile(data_user);
            }
            catch (err: any) {
                console.log(err.message);
            }
        }
        getInfo();
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={{ flex: 1 }}>
                <View>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate("Profile"); }}>
                        <Image source={require("../icons/back-button.png")}
                            resizeMode='contain' style={{ marginLeft: 10, width: 30, height: 30, tintColor: "#FFFFFF" }} />
                    </TouchableOpacity>
                </View>
                <View style={{  paddingTop: 40 , justifyContent: "center", alignItems:"center"}}>
                    <Image source={{ uri: userProfile?.images[0].url }}
                        resizeMode='contain' style={styles.avatar} />
                </View>
                <View style={{justifyContent: "center", alignItems:"center", paddingTop: 10}}>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: 120, height: 50, borderRadius: 15, overflow: "hidden", borderColor: "#fff", backgroundColor: "#000", borderWidth: 2 }}
                            onPress={() => { navigation.navigate("Info"); }}>

                            
                            <Text style={{ fontSize: 17, fontWeight: "bold", color: "#fff" }}> Change avatar</Text>

                        </TouchableOpacity>
                        </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 80,
        resizeMode: 'cover'
    },
})
export default Info;