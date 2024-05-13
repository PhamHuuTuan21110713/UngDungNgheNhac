import { SafeAreaView, StatusBar, Image, ScrollView, StyleSheet, Text, View, Pressable, Touchable, TouchableOpacity,Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import { getAPI } from "../UsingAPI/CallAPI.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";


const {width: screenWidth} = Dimensions.get("window");

const  RenderRecentPlayed = ({item}:any)  =>{
    return (
        <View style={{  marginRight:10}}>
            <TouchableOpacity style={{ flex: 1, borderRadius: 10, overflow: "hidden"}}>
                <LinearGradient style={{alignItems:"center"}}  colors={["#232323", "#282828"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
                    <Image source={{ uri: item.track.album.images[0].url }} style={{width:(screenWidth-40)/3, height:(screenWidth-40)/3 }} />
                    <Text ellipsizeMode="middle" numberOfLines={2} style={{ width:(screenWidth-40)/3, fontSize: 17, fontWeight: "bold", color: "#fff" }}>{item.track.name}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}

const ArtistsComponent = ({item}:any) => {
    return (
        <TouchableOpacity style={{alignItems:"center",marginRight:20}}>
            <Image style={{width:(screenWidth-40)/3, height:(screenWidth-40)/3, borderRadius:(screenWidth-40)/3}} source={{uri:item.images[0].url}} />
            <Text style={{color: "#fff", fontSize:15, fontWeight:"bold",marginTop:10}}>{item.name}</Text>
        </TouchableOpacity>
    )
}

function  Home(): React.JSX.Element  {
    const navigation:any = useNavigation();
    const [userProfile, setUserProfile] = useState();
    const [recentPlayed, setRecentPlayed] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const getProfile = async () => {
            const accessToken = await AsyncStorage.getItem("token");
            console.log("Token-getProfile: ", accessToken);

            const url_user = "https://api.spotify.com/v1/me";
            const config_user = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };

            const config_songs = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const url_songs = "https://api.spotify.com/v1/me/player/recently-played?limit=5";

            const config_artists = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const url_artists = "https://api.spotify.com/v1/me/top/artists";

            try {
                const data_user = await getAPI(url_user, config_user);
                
                const data_songs = await getAPI(url_songs, config_songs);
               
                const data_artists = await getAPI(url_artists, config_artists);
                
                setUserProfile(data_user);
                setRecentPlayed(data_songs.items);
                setTopArtists(data_artists.items);
                // console.log("=================");
                // console.log("userProfile-data: ", data_user);

                // console.log("=================");
                // console.log("recentPlayed-data: ", data_songs);

                // console.log("=================");
                // console.log("Top artists-data: ", data_artists);
                setIsLoading(false);
            } catch (err:any) {
                console.log(err.message);
            }
        }
        getProfile();
    }, []);
    console.log("user-prf: ",userProfile);
    console.log("recent-pld: ",recentPlayed);
    console.log("top-arts: ",topArtists);
    if(isLoading) {
        return (
            <View>
                <Text>Loading!!!</Text>
            </View>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor={"black"} />
            <SafeAreaView style={{ flex: 1 }}>
                <LinearGradient colors={["#232323", "#282828"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[style.largestContainer]}>
                    <ScrollView>
                        <View style={[style.headingContainer]}>
                            <TouchableOpacity>
                                <Image source={require("../icons/menu.png")} style={{ tintColor: "#fff" }} />
                            </TouchableOpacity>
                            <Text style={[style.helloText]}>Hello, Love you</Text>
                            <Image style={[style.avatar]} source={{ uri: userProfile?.images[0].url }} />
                        </View>
                        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginTop:30 }}>Your self</Text>
                        <View style={[{ marginTop: 10, flexWrap: "wrap", flexDirection: "row" }]}>
                            <View style={[style.topButtonContainer]}>
                                <TouchableOpacity style={{ flex: 1, borderRadius: 15, overflow: "hidden" }}
                                    onPress={()=> {navigation.navigate("LikedSong");}}>
                                    <LinearGradient style={[style.likedSongsButton]} colors={["#F87275", "#c24f83"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
                                        <Image source={require("../icons/heart-d-24.png")} style={{ tintColor: "#fff", width: 30, height: 30 }} />
                                        <Text style={{ fontSize: 17, fontWeight: "bold", color: "#fff" }}>Liked songs</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            <View style={[style.topButtonContainer]}>
                                <TouchableOpacity style={{ flex: 1, borderRadius: 15, overflow: "hidden" }}>
                                    <LinearGradient style={[style.likedSongsButton]} colors={["#F87275", "#c24f83"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}>
                                        <Image source={require("../icons/playlist.png")} style={{ tintColor: "#fff", width: 30, height: 30 }} />
                                        <Text style={{ fontSize: 17, fontWeight: "bold", color: "#fff" }}>Your play list</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            {/* {
                                recentPlayed.map((it,index) => {
                                    return <RenderRecentPlayed item={it} key={index} />;
                                })
                            } */}
                        </View>
                        <View>
                            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: 10 }} >Top Artists</Text>
                            <ScrollView style={{marginTop:20}}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}>
                                    {
                                        topArtists.map((item, index)=> {
                                            return <ArtistsComponent item={item} key={index} />
                                        })
                                    }
                            </ScrollView>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: 10 }} >Recently Played</Text>
                            <ScrollView style={{marginTop:20}}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}>
                                    {
                                        recentPlayed.map((item, index)=> {
                                            return <RenderRecentPlayed item={item} key={index} />
                                        })
                                    }
                            </ScrollView>
                        </View>
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        </View>
    )
}

const style = StyleSheet.create({
    largestContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    headingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    avatar: {
        width: 60,
        height: 60,
        resizeMode: "cover",
        borderRadius: 60
    },
    helloText: {
        fontSize: 30,
        fontWeight: "600",
        color: "white"
    },
    topButtonContainer: {
        width: "50%",
        height: 80,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    likedSongsButton: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 10
    }
})
export default Home;