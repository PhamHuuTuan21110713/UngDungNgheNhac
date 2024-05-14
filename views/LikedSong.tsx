import { SafeAreaView, StatusBar, Image, ScrollView, StyleSheet, Text, View, Pressable, Touchable, TouchableOpacity, Dimensions, TextInput } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { getAPI } from "../UsingAPI/CallAPI.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Player } from "./ContextTrack";
import { BottomModal } from "react-native-modals";

const SongItem = ({ item }: any) => {
    return (
        <TouchableOpacity style={[style.songItem]}>
            <Image style={{ width: 50, height: 50, marginRight: 10, borderRadius: 6 }} source={{ uri: item.track.album.images[0].url }} />
            <View style={{ width: "65%" }}>
                <Text numberOfLines={1} style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>{item.track.name}</Text>
                <Text style={{ color: "#b8b8b8" }}>{item.track.artists[0].name}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>
                <TouchableOpacity>
                    <Image style={{ tintColor: "#18b14c" }} source={require("../icons/heart-d-24.png")} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={{ tintColor: "#fff" }} source={require("../icons/dots.png")} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

function LikedSong(): React.JSX.Element {
    const navigation: any = useNavigation();
    const { currentTrack, setCurrentTrack }: any = useContext(Player);
    const [input, setInput] = useState("");
    const [savedTracks, setSavedTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const getSavedTracks = async () => {
        const accessToken = await AsyncStorage.getItem("token");
        const url_saveTracks = "https://api.spotify.com/v1/me/tracks?offset=0&limit=50";
        const config_saveTracks = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                limit: 50
            }
        };
        try {
            const data_saveTracks = await getAPI(url_saveTracks, config_saveTracks);
            setSavedTracks(data_saveTracks.items);
            setIsLoading(false);
        } catch (err: any) {
            console.log("Liked-Song: ", err.message);
        }
    }
    useEffect(() => {
        getSavedTracks();
    }, [])
    console.log("saved-Tracks: ", savedTracks);

    const playTracks = async () => {
        if (savedTracks.length > 0) {
            setCurrentTrack(savedTracks[0]);
        }
        await play(savedTracks[0]);
    }
    const play = async () => {

    }
    if (isLoading) {
        return (
            <View>
                <Text>Loading!!!</Text>
            </View>
        )
    }
    return (
        <>
            <LinearGradient style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 10 }} colors={["#F87275", "#c24f83"]}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: "row", height: 40 }}>
                        <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                            <Image style={{ tintColor: "#fff" }} source={require("../icons/back-arrow.png")} />
                        </TouchableOpacity>
                        <View style={{ backgroundColor: "#38224e", marginLeft: 10, flexDirection: "row", overflow: "hidden", paddingHorizontal: 15, flex: 1, borderWidth: 2, borderColor: "#fff", borderRadius: 20, alignItems: "center" }}>
                            <Image style={{ tintColor: "#fff" }} source={require("../icons/search.png")} />
                            <TextInput
                                onChangeText={(text) => setInput(text)}
                                style={{ flex: 1, color: "#fff", fontSize: 15, fontWeight: "500" }} placeholder="Find your liked song" placeholderTextColor={"#fff"} />
                        </View>
                    </View>
                    <View style={{ marginTop: 20, alignItems: "center" }}>
                        <Text style={{ color: "#fff", fontSize: 30, fontWeight: "bold" }}>Liked Songs</Text>
                        <Text style={{ color: "#fff", fontSize: 15 }}>{savedTracks.length} songs: Saved to library</Text>
                    </View>
                    <View style={{ marginTop: 15, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <TouchableOpacity
                            onPress={playTracks}
                            style={{ width: 60, height: 60, borderRadius: 80, backgroundColor: "#18b14c", justifyContent: "center", alignItems: "center" }}>
                            <Image style={{ tintColor: "#fff" }} source={require("../icons/play.png")} />
                        </TouchableOpacity>
                        <Text style={{ marginLeft: 10, fontSize: 20, color: "#fff", fontWeight: "bold" }}>Play songs</Text>
                    </View>
                    <View style={{ marginTop: 25 }}>
                        {
                            savedTracks.map((item, index) => {
                                return <SongItem item={item} key={index} />
                            })
                        }
                    </View>
                </ScrollView>
            </LinearGradient>
            {
                currentTrack && (
                    <TouchableOpacity style={[style.currentTrack]}>
                        <View>
                            <Image style={{width:60, height:60,borderRadius:5}} source={{uri:currentTrack.track.album.images[0].url}}/>
                        </View>
                        <View>
                            <Text numberOfLines={1} style={{color:"#fff",fontSize:20,fontWeight:"bold"}}>{currentTrack.track.name}</Text>
                            <Text numberOfLines={1} style={{color:"#fff", fontSize:15}}>{currentTrack.track.artists[0].name}</Text>
                        </View>
                        <TouchableOpacity>
                            <Image style={{tintColor:"#fff"}} source={require("../icons/pause.png")}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            }
            <BottomModal>

            </BottomModal>
        </>
    )
}

const style = StyleSheet.create({
    songItem: {
        marginTop: 3,
        backgroundColor: "#636363",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center"
    },
    currentTrack: {
        backgroundColor:"#38224e",
        padding:10, 
        position: "absolute",
        borderRadius:10,
        left:10,
        right:10,
        bottom:5,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    }
})
export default LikedSong;