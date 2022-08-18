import { getToken } from './token.mjs';
import Format from './utils.mjs';

export default async function GetFeat(first_artist, second_artist, token) {
	let url = encodeURI(
		`https://api.spotify.com/v1/search?limit=50&type=track&market=fr&q=${`${first_artist} ${second_artist}`}`
	);

	let response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		});
	} catch (err) {
	}

	const data = await response.json();

	// Check for errors
	if ((data.error && data.error.status === 401) || (data.error && data.error.status === 400)) {
		// Change headers and call again
		return GetFeat(first_artist, second_artist, await getToken());
	}
	else if ((data.error && data.error.status === 429))
	{
		// Wait 5s and try again
		await new Promise(resolve => setTimeout(resolve, 5000));
		return GetFeat(first_artist, second_artist, await getToken());
	}

	let res = data.tracks?.items.map((item) => {
		// Check if both artist are in item.artists list
		first_artist = Format(first_artist);
		second_artist = Format(second_artist);

		const artist1 = item.artists.find((artist) => Format(artist.name) === first_artist);
		const artist2 = item.artists.find((artist) => Format(artist.name) === second_artist);

		if (artist1 && artist2) {
			return {
				album: item
			};
		}
	});

	// Remove undefined values
	res = res?.filter((item) => {
		return item !== undefined;
	});

	res = res?.map((item) => {
		return item.album;
	});

	return res;
}
