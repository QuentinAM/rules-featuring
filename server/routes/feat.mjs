import fetch from "node-fetch";
import GetFeat from '../utils/track.mjs';
import GetAlbum from '../utils/album.mjs'; 
import { GetAlbumInfos } from "../utils/album.mjs";

export default function GetFeatAndAlbum(first_artist, second_artist)
{
    return new Promise(async (resolve, reject) => {
        const album = await GetAlbum(first_artist, second_artist);
        // const feat = await GetFeat(first_artist, second_artist);
        const album_infos = await Promise.all(album.map(item => GetAlbumInfos(item.album.href)));
        
        console.log(album_infos);
        // console.log(feat);

        resolve({
            album: album,
            // feat: feat
        });
    });
}

