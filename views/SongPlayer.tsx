import { SafeAreaView, StatusBar, Image, ScrollView, StyleSheet, Text, View, Pressable, Touchable, TouchableOpacity, Dimensions, TextInput,Animated, Easing } from "react-native";
import React, {useRef, useContext, useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { getAPI } from "../UsingAPI/CallAPI.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import TrackPlayer, { Capability, State, usePlaybackState,useTrackPlayerEvents,Event } from 'react-native-track-player';
import { Player } from "./ContextTrack";

function SongPlayer({ item,modalVisible,setModalVisible}: any): React.JSX.Element {
    const [isPlaying, setIsPlaying] = useState(true);
    const spintValue = useRef(new Animated.Value(0)).current;
    const { currentTrack, setCurrentTrack , currentList,setCurrentList }: any = useContext(Player);
    const [isLike,setIslike] = useState(false);

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
    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
            const nextTrackId = event.nextTrack;
            setCurrentTrack(currentList[nextTrackId]);
            setUpInfoTrack(); 
        }
    });
    const setUpInfoTrack = async()=> {
        let id_track = "";
        if(currentTrack.track) {
            id_track = currentTrack.track.id;
        } else {
            id_track = currentTrack.id;
        }
        const accessToken = await AsyncStorage.getItem("token");
        const url_checkSaved = `https://api.spotify.com/v1/me/tracks/contains?ids=${id_track}`;
        const config = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };
        try {
            const data_check = await getAPI(url_checkSaved, config);
            console.log("islike: ",data_check[0]);
            setIslike(data_check[0]);
        } catch (err: any) {
            console.log(err.message);
        }
    }

    const spin = spintValue.interpolate({
        inputRange:[0,1],
        outputRange: ["0deg","360deg"]
    })
    const startAnimation = () => {   
            Animated.loop(
           
                Animated.parallel([  
                    Animated.sequence([
                        
                        Animated.timing(
                            spintValue,
                            {
                                toValue:1,
                                duration:8000,
                                useNativeDriver:true,
                                easing: Easing.linear
                            }
                        )
                    ])    
                ])
            ).start();
            
            setIsPlaying(true);
    };
    const stopAnimation = () => {
        spintValue.stopAnimation((value) => {
            spintValue.setValue(value); // Lưu giữ góc quay hiện tại
        });
        setIsPlaying(false);
        
    };
    useEffect(()=> {
        setUpInfoTrack();
    },[])
    useEffect(()=> {
        
        async function setStatePlay() {
            const state = await TrackPlayer.getState();
            if(state === State.Playing) {
                startAnimation();
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
                    <Animated.View style={{transform:[{rotate:spin}], justifyContent: "center", alignItems: "center", width: 250, height: 250, marginTop: 30, borderRadius: 250 }}>
                        <LinearGradient colors={["#1b1b1c", "#808080"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{width:"100%",height:"100%",alignItems:"center",justifyContent:"center",borderRadius:250}}>
                            {
                               <Image style={{ width: 180, height: 180, borderRadius: 180 }} source={{ uri:currentTrack.track? currentTrack.track.album.images[0].url:currentTrack.album.images[0].url }} />
                            }
                        </LinearGradient>
                    </Animated.View>
                </View>
                <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={{ color: "#5f225b", fontSize: 25, fontWeight: "bold" }}>{currentTrack.track?currentTrack.track.name:currentTrack.name}</Text>
                            <Text style={{ color: "#a46e8d", fontSize: 15, fontWeight: "500", marginTop: 5 }}>{currentTrack.track?currentTrack.track.artists[0].name:currentTrack.artists[0].name}</Text>
                        </View>
                        <TouchableOpacity>
                            {
                                isLike? <Image style={{ tintColor: "#18b14c" }} source={require("../icons/heart-d-24.png")} />
                                    : <Image style={{ tintColor: "#fff" }} source={require("../icons/heart-d-24.png")} />
                            }
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
                        <TouchableOpacity
                            onPress={async()=> {
                                startAnimation();
                                
                                await TrackPlayer.skipToPrevious();
                                await TrackPlayer.play();
                            }}>
                            <Image style={{ tintColor: "#3b0044",width:40,height:40 }} source={require("../icons/prev.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={async ()=> {
                                setIsPlaying(!isPlaying);
                                const state = await TrackPlayer.getState();
                                if (state === State.Playing) {
                                    stopAnimation();
                                    await TrackPlayer.pause();
                                } else if(state === State.Paused) {
                                    startAnimation();
                                    await TrackPlayer.play();
                                }
                            }}
                            style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: "#3b0044", justifyContent: "center", alignItems: "center" }}>
                            {
                                isPlaying===true ? <Image style={{ tintColor: "#fff" }} source={require("../icons/pause.png")} />
                                    : <Image style={{ tintColor: "#fff" }} source={require("../icons/play.png")} />
                            }
                            
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={async()=> {
                                startAnimation();
                                await TrackPlayer.skipToNext();
                                await TrackPlayer.play();
                            }}>
                            <Image style={{ tintColor: "#3b0044" ,width:40,height:40}} source={require("../icons/next.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default SongPlayer;