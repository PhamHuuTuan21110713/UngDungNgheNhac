import { getAPI } from "./CallAPI.js";
export const DeleteSavedTrack = async (ids, accessToken) => {
    console.log(ids.split(","))
    const url = `https://api.spotify.com/v1/me/tracks`;
    const config = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: ids.split(",") }) 
    };
    const res = await fetch(url, config);
    if(res.ok) {
        try {
            const get_data = await getAPI("https://api.spotify.com/v1/me/tracks?offset=0&limit=50", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    limit: 50
                }
            });
            return get_data;
        } catch (err) {
            console.log(err.message);
        }
    }
   
}
   