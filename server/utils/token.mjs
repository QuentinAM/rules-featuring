import config from './env.json' assert { type: 'json' };

export let spToken = "";

export async function getToken() {
    console.log("Getting token...");

    const CLIENT_ID = config.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = config.SPOTIFY_CLIENT_SECRET;

    const response = await fetch(`https://accounts.spotify.com/api/token`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials'
        })
    });
    const data = await response.json();
    spToken = data.access_token;
    return data.access_token;
}