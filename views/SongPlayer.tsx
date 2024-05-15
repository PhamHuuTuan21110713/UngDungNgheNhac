import { SafeAreaView, StatusBar, Image, ScrollView, StyleSheet, Text, View, Pressable, Touchable, TouchableOpacity, Dimensions, TextInput } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { getAPI } from "../UsingAPI/CallAPI.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import TrackPlayer, { Capability, State, usePlaybackState,useTrackPlayerEvents,Event } from 'react-native-track-player';

function SongPlayer({ item,modalVisible,setModalVisible }: any): React.JSX.Element {
    const [isPlaying, setIsPlaying] = useState(true);
    useTrackPlayerEvents([Event.PlaybackState], async (event) => {
        if (event.type === Event.PlaybackState) {
            const state = await TrackPlayer.getState();
            if(state === State.Playing) {
                setIsPlaying(true);
            } else if(state===State.Paused) {
                setIsPlaying(false);
            }
            
        }
    });
    useEffect(()=> {
        async function setStatePlay() {
            const state = await TrackPlayer.getState();
            if(state === State.Playing) {
                setIsPlaying(true);
            } else if(state===State.Paused) {
                setIsPlaying(false);
            }
        }
        setStatePlay();
    },[])
    return (
        <View style={{ flex: 1, height: "100%", width: "100%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#453249" }}>
                <TouchableOpacity
                    onPress={()=> setModalVisible(!modalVisible)}>
                    <Image style={{ tintColor: "#fff" }} source={require("../icons/drop-down.png")} />
                </TouchableOpacity>
                <Text style={{ color: "#fff", fontSize: 15, fontWeight: "bold" }}>Now playing</Text>
                <TouchableOpacity>
                    <Image style={{ tintColor: "#fff" }} source={require("../icons/dots.png")} />
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, backgroundColor: "#ffe9e3", marginTop: 30, borderRadius: 25 }}>
                <View style={{ alignItems: "center" }}>
                    <View style={{ justifyContent: "center", alignItems: "center", width: 250, height: 250, marginTop: 30, borderRadius: 250, backgroundColor: "#1a1919" }}>
                        <Image style={{ width: 180, height: 180, borderRadius: 180 }} source={{ uri: item.track.album.images[0].url }} />
                    </View>
                </View>
                <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={{ color: "#5f225b", fontSize: 25, fontWeight: "bold" }}>{item.track.name}</Text>
                            <Text style={{ color: "#a46e8d", fontSize: 15, fontWeight: "500", marginTop: 5 }}>{item.track.artists[0].name}</Text>
                        </View>
                        <TouchableOpacity>
                            <Image style={{ tintColor: "#18b14c" }} source={require("../icons/heart-d-24.png")} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 70 }}>
                        <View>

                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={{ color: "#a46e8d", fontSize: 15 }}>0:00</Text>
                            <Text style={{ color: "#a46e8d", fontSize: 15 }}>0:30</Text>
                        </View>
                    </View>
                    <View style={{ marginTop:30,flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                        <TouchableOpacity>
                            <Image style={{ tintColor: "#3b0044",width:40,height:40 }} source={require("../icons/prev.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={async ()=> {
                                setIsPlaying(!isPlaying);
                                const state = await TrackPlayer.getState();
                                if (state === State.Playing) {
                                    
                                    await TrackPlayer.pause();
                                } else if(state === State.Paused) {
                                    await TrackPlayer.play();
                                }
                            }}
                            style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: "#3b0044", justifyContent: "center", alignItems: "center" }}>
                            {
                                isPlaying===true ? <Image style={{ tintColor: "#fff" }} source={require("../icons/pause.png")} />
                                    : <Image style={{ tintColor: "#fff" }} source={require("../icons/play.png")} />
                            }
                            
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image style={{ tintColor: "#3b0044" ,width:40,height:40}} source={require("../icons/next.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default SongPlayer;