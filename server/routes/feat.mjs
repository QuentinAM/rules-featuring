import fetch from 'node-fetch';
import GetFeat from '../utils/track.mjs';
import GetAlbum from '../utils/album.mjs';
import { GetAlbumInfos } from '../utils/album.mjs';

export default function GetFeatAndAlbum(first_artist, second_artist, token) {
	return new Promise(async (resolve, reject) => {
		const album = await GetAlbum(first_artist, second_artist, token);
		let album_infos = album
			? await Promise.all(
					album.map((item) => {
						if (item) return GetAlbumInfos(item.album.href, token);
					})
			  )
			: [];

		// ALBUMS

		// Keep only album with more than 1 track
		album_infos = album_infos?.filter((item) => {
			return item.tracks?.total > 1;
		});

		// Remove dublet
		album_infos = album_infos?.filter((item, index) => {
			return (
				album_infos?.findIndex((item2) => {
					return item2.name === item.name;
				}) === index
			);
		});

		album_infos = album_infos?.map((item) => {
			return {
				external_urls: item.external_urls,
				name: item.name,
				release_date: item.release_date,
				images: item.images[0],
				tracks: item.tracks.items.map((track) => {
					return {
						artists: track.artists.map((artist) => {
							return {
								name: artist.name,
								external_urls: artist.external_urls
							};
						}),
						name: track.name,
						preview_url: track.preview_url,
						external_urls: track.external_urls,
						duration_ms: track.duration_ms
					};
				})
			};
		});

		// FEAT

		let feat = await GetFeat(first_artist, second_artist, token);
		feat = feat?.map((item) => {
			// Check if track don't exist on common projects
			if (
				album_infos.find((album) => {
					return album.name === item.album.name;
				})
			) {
				return undefined;
			}

			return {
				external_urls: item.external_urls,
				name: item.name,
				album_name: item.album.name,
				album_url: item.album.external_urls.spotify,
				release_date: item.album.release_date,
				images: item.album.images[0],
				artists: item.artists.map((artist) => {
					return {
						name: artist.name,
						external_urls: artist.external_urls.spotify
					};
				}),
				preview_url: item.preview_url,
				duration_ms: item.duration_ms
			};
		});

		// Remove undefined
		feat = feat?.filter((item) => {
			return item !== undefined;
		});

		resolve({
			album: album_infos ?? [],
			feat: feat ?? []
		});
	});
}
