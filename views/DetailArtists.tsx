import { SafeAreaView, StatusBar, Image, ScrollView, StyleSheet, Text, View, Pressable, Touchable, TouchableOpacity, Dimensions, TextInput } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { getAPI } from "../UsingAPI/CallAPI.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Player } from "./ContextTrack";
import { BottomModal, ModalContent } from 'react-native-modals';
import TrackPlayer, { Capability, State, usePlaybackState, useTrackPlayerEvents, Event } from 'react-native-track-player';

import SongPlayer from "./SongPlayer";
import CurrentTrackBottom from "./CurrentTrackBottom";

import Loading from "./Loading";
function DetailArtists({ route }: any): React.JSX.Element {
    const { data } = route.params;
    const navigation = useNavigation();
    const [topTracks, setTopTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [listSaved, setListSaved] = useState([]);
    const { currentTrack, setCurrentTrack, currentList, setCurrentList }: any = useContext(Player);
    const [modalVisible, setModalVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    useTrackPlayerEvents([Event.PlaybackState], async (event) => {
        if (event.type === Event.PlaybackState) {
            const state = await TrackPlayer.getState();
            if (state === State.Playing) {
                setIsPlaying(true);
            } else if (state === State.Paused) {
                setIsPlaying(false);
            }

        }
    });

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
            const nextTrackId = event.nextTrack;
            setCurrentTrack(currentList[nextTrackId]);
        }
    });

    const getTopTracks = async () => {
        const accessToken = await AsyncStorage.getItem("token");
        const url = `https://api.spotify.com/v1/artists/${data.id}/top-tracks`;
        const config = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };
        try {
            const data = await getAPI(url, config);
            console.log("TrackArtstdata: ", data);
            const ids = data.tracks.map((item: any, index: any) => {
                return item.id;
            }).join(",");
            const url_checkSaved = `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`;
            const data_check = await getAPI(url_checkSaved, config);
            console.log("datacheck: ", data_check);
            setTopTracks(data.tracks);
            setListSaved(data_check);
            setIsLoading(false);
        } catch (err: any) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        getTopTracks();
    }, [])
    // console.log("TopTrackArtisi: ",topTracks);
    const RenderTopSong = ({ item, islike }: any) => {
        return (
            <TouchableOpacity style={{ marginTop: 10, borderRadius: 15, overflow: "hidden" }}>
                <LinearGradient
                    style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}
                    colors={["#232323", "#282828"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Image style={{ width: 60, height: 60 }} source={{ uri: item.album.images[0].url }} />
                    <View style={{ justifyContent: "center", marginLeft: 20 }}>
                        <Text style={{ color: "#fff", fontSize: 15 }} numberOfLines={1}>{item.album.name}</Text>
                    </View>
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}>
                        {
                            islike ? <Image style={{ tintColor: "#31a24c" }} source={require("../icons/heart-d-24.png")} />
                                : <Image style={{ tintColor: "#fff" }} source={require("../icons/heart-d-24.png")} />
                        }

                    </TouchableOpacity>
                </LinearGradient>
            </TouchableOpacity>
        )
    }
    const playTrack = async()=> {
        
    }
    if (isLoading) {
        return (
            <Loading />
        )
    }
    return (
        <>
            <View style={{ flex: 1, backgroundColor: "#000" }}>
                <ScrollView style={{ flex: 1, backgroundColor: "#000" }}>
                    <View style={{ width: "100%" }}>
                        <Image style={{ width: "100%", height: 250 }} source={{ uri: data.images[0].url }} />
                        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', position: "absolute", bottom: 0, left: 0, right: 0, alignItems: "flex-start" }}>
                            <Text style={{ marginLeft: 10, color: "#fff", fontSize: 40, fontWeight: "bold" }}>{data.name}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => { navigation.goBack(); }}
                            style={{ justifyContent: "center", alignItems: "center", position: "absolute", left: 10, top: 10, backgroundColor: 'rgba(0, 0, 0, 0.6)', width: 50, height: 50, borderRadius: 50 }}>
                            <Image style={{ tintColor: "#fff" }} source={require("../icons/back-arrow.png")} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 }}>
                        <Text style={{ color: "#fff", fontSize: 15 }}>Followers: {data.followers.total}</Text>
                        <TouchableOpacity
                            onPress={playTrack}
                        style={{ width: 60, height: 60, backgroundColor: "#31a24c", justifyContent: "center", alignItems: "center", borderRadius: 60 }}>
                            <Image style={{ tintColor: "#000" }} source={require("../icons/play.png")} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
                        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>Famous</Text>
                        <View>
                            {
                                topTracks.map((item, index) => {
                                    return <RenderTopSong item={item} key={index} islike={listSaved[index]} />;
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
                {
                    currentTrack && (<View style={{ height: 100 }}>
                        <CurrentTrackBottom currentTrack={currentTrack} modalVisible={modalVisible}
                            setModalVisible={setModalVisible} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
                    </View>
                    )
                }
            </View>
            <BottomModal
                visible={modalVisible}
                onHardwareBackPress={() => setModalVisible(false)}
                swipeDirection={["up", "down"]}
                swipeThreshold={200}>
                <ModalContent style={{ height: "100%", width: "100%", backgroundColor: "#453249" }}>
                    <SongPlayer item={currentTrack} modalVisible={modalVisible} setModalVisible={setModalVisible} />
                </ModalContent>

            </BottomModal>
        </>
    )
}

export default DetailArtists;