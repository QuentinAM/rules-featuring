import { getToken, spToken } from "./token.mjs";

export default async function GetFeat(first_artist, second_artist){
    let url = encodeURI(`https://api.spotify.com/v1/search?limit=2&type=track&market=fr&q=${`${first_artist} ${second_artist}`}`);
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + spToken,
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();

    // Check for errors
    if (data.error && data.error.status === 401 || data.error && data.error.status === 400) {
        // Change headers and call again
        await getToken();
        return GetFeat(first_artist, second_artist);
    }

    return {
        track: data.tracks.items[0],
        track2: data.tracks.items[1],
    }
}