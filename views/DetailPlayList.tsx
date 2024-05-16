import { SafeAreaView, StatusBar, Image, ScrollView, StyleSheet, Text, View, Pressable, Touchable, TouchableOpacity, Dimensions, TextInput } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { getAPI } from "../UsingAPI/CallAPI.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Player } from "./ContextTrack";
import { BottomModal, ModalContent } from 'react-native-modals';
import TrackPlayer, { Capability, State, usePlaybackState, useTrackPlayerEvents, Event } from 'react-native-track-player';

import Loading from "./Loading";
import SongPlayer from "./SongPlayer";
import CurrentTrackBottom from "./CurrentTrackBottom";

function isSameArray(array1: any, array2: any) {
    return array1.length === array2.length && array1.every((value: any, index: any) => value === array2[index])
}

function DetailPlayList({ route }: any): React.JSX.Element {
    const { data, user_id } = route.params;
    const navigation = useNavigation();
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { currentTrack, setCurrentTrack, currentList, setCurrentList }: any = useContext(Player);
    const [listSaved, setListSaved] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
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

    const getTracks = async () => {
        const accessToken = await AsyncStorage.getItem("token");
        const playlist_id = data.id;
        const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?offset=0&limit=25`;
        const config = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };
        try {
            const data_s = await getAPI(url, config);
            console.log("Trackplltdata: ", data_s);
            const ids = data_s.items.map((item: any, index: any) => {
                return item.track.id;
            }).join(",");
            console.log("ids: ", ids)
            const url_checkSaved = `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`;
            const data_check = await getAPI(url_checkSaved, config);
            console.log("datacheck-pll: ", data_check);
            setTracks(data_s.items);
            setListSaved(data_check);
            setIsAdding(user_id == data.owner.id);
            setIsLoading(false);
        } catch (err: any) {
            console.log(err.message);
        }
    }
    const setContentTracksPlayer = async (data_saveTracks: any) => {
        const listTracks = data_saveTracks.map((item: any, index: any) => {
            return {
                id: item.track.id,
                url: item.track.preview_url,
                title: item.track.name,
                artist: item.track.artists[0].name
            }
        })

        await TrackPlayer.reset();
        await TrackPlayer.add(listTracks);
    }
    const RenderTrack = ({ item, trackIndex, islike }: any) => {
        return (
            <TouchableOpacity
                onPress={async () => {
                    if (!isSameArray(tracks, currentList)) {
                        await setContentTracksPlayer(tracks);
                        setCurrentList(tracks);
                    }
                    setCurrentTrack(item);
                    const state = await TrackPlayer.getState();
                    if (state === State.Playing || state === State.Paused) {
                        await TrackPlayer.stop();
                    }
                    await TrackPlayer.skip(trackIndex);
                    TrackPlayer.play();
                }}
                style={{ marginTop: 10, borderRadius: 15, overflow: "hidden" }}>
                <LinearGradient
                    style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}
                    colors={["#232323", "#282828"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Image style={{ width: 60, height: 60 }} source={{ uri: item.track.album.images[0].url }} />
                    <View style={{ flex: 1, justifyContent: "center", marginLeft: 20 }}>
                        <Text style={{ color: "#fff", fontSize: 15 }} numberOfLines={1}>{item.track.name}</Text>
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
        if (tracks.length > 0) {
            setCurrentTrack(tracks[0]);
            if(!isSameArray(tracks,currentList)){
                setCurrentList(tracks);
                await setContentTracksPlayer(tracks);
            }
        }
        const state = await TrackPlayer.getState();
        if (state === State.Playing || state === State.Paused) {
            await TrackPlayer.stop();
        }
        await TrackPlayer.skip(0);
        await TrackPlayer.play();
    }
    useEffect(() => {
        getTracks();
    }, [])
    if (isLoading) {
        return (
            <Loading />
        )
    }
    return (
        <>
            <View style={{ flex: 1, backgroundColor: "#000" }}>
                <LinearGradient style={{ paddingTop: 20, paddingBottom: 0, alignItems: "center" }} colors={["#9ec2d0", "#000"]}>
                    <Image style={{ width: 200, height: 200 }} source={{ uri: data.images[0].url }} />
                    <TouchableOpacity
                        onPress={() => { navigation.goBack(); }}
                        style={{ justifyContent: "center", alignItems: "center", position: "absolute", left: 10, top: 10, backgroundColor: 'rgba(0, 0, 0, 0.6)', width: 50, height: 50, borderRadius: 50 }}>
                        <Image style={{ tintColor: "#fff" }} source={require("../icons/back-arrow.png")} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 10, padding: 10, width: "100%" }}>
                        <Text numberOfLines={2} style={{ color: "#fff", fontSize: 25, fontWeight: "bold" }}>{data.name}</Text>
                    </View>
                </LinearGradient>
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: "#000", paddingHorizontal: 20 }}>
                    <View>
                        <Text style={{ color: "#fff", fontSize: 15, fontWeight: "500" }}>Owner: {data.owner.display_name}</Text>

                    </View>
                    <View style={{ marginTop: 20 }}>
                        {
                            isAdding ? (<TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ borderRadius: 50, width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: "#ababab" }}>
                                    <Image style={{ tintColor: "#fff" }} source={require("../icons/add.png")} />
                                </View>
                                <Text style={{ marginLeft: 10, color: "#fff", fontSize: 17, fontWeight: "bold" }}>Add song to this playlist</Text>
                            </TouchableOpacity>) : (<View></View>)
                        }
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <TouchableOpacity 
                            onPress={playTrack}
                            style={{ backgroundColor: "#31a24c", width: 60, height: 60, borderRadius: 60, justifyContent: "center", alignItems: "center" }}>
                            <Image style={{ tintColor: "#000" }} source={require("../icons/play.png")} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>List songs</Text>
                        <View>
                            {
                                tracks.map((item, index) => {
                                    return <RenderTrack item={item} key={index} islike={listSaved[index]} trackIndex={index} />
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

export default DetailPlayList;