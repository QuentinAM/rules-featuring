<script lang="ts">
    import { dev } from "$app/env";
    import { onMount } from "svelte";
    import Translation from '$lib/components/Translation.svelte';
    import Spinner from '$lib/assets/spinner.png';
    import { page } from '$app/stores'
    // import { allData } from '$lib/store/utils';
    import Collab from "$lib/components/Collab.svelte";

    const artist1: string | null = $page.url.searchParams.get('artist1');
    let artist1Index: number = 0;

    let loading: boolean = true;
    let loadingAlbum: boolean = false;
    let loadingTrack: boolean = false;

    let artistName1: string = '';
    let albumData: any[] = [];
    let featData: any[] = [];

    let allCards: any[] = [];
    let copiedClipboard: boolean = false;

    let timeout: NodeJS.Timeout;
    let timeoutFinished: boolean = true;

    function GetAllFeat(index: number){
        copiedClipboard = false;
        loadingAlbum = true;
        loadingTrack = true;
        albumData = [];
        featData = [];
        artistName1 = allCards[index].artist.displayName;

        if (!timeoutFinished){
            clearTimeout(timeout);
        }
        timeoutFinished = false;

        timeout = setTimeout(() => {
            timeoutFinished = true;
            for (let i = 0; i < allCards.length; i++){
                if (i !== index)
                {
                    const artistName2 = allCards[i].artist.displayName;
                    
                    // // Check in $allData if an object with artistName1 and artistName2 exists
                    // const data = $allData.find(d => d.artistName1 === artistName1 && d.artistName2 === artistName2);
                    // if (data)
                    // {
                    //     console.log('Data already exist', artistName1, artistName2);
                    //     albumData = [...albumData, data.album];
                    //     featData = [...featData, data.feat];
                    //     if (i === allCards.length - 1){
                    //         loadingAlbum = false;
                    //         loadingTrack = false;
                    //     }
                    //     continue;
                    // }
                    
                    const pictureUrl = allCards[i].pictureUrl;
                    let uri = encodeURI(`${dev ? 'http://localhost:3000' : ''}/api/feat/${artistName1}/${artistName2}`);
                    fetch(uri)
                    .then(res => res.json())
                    .then(data => {
                        const newAlbumData = data.album.sort((a: any, b: any) => {
                            if (a.release_date > b.release_date) return -1;
                            else if (a.release_date < b.release_date) return 1;
                            return 0;
                        });
                        albumData = [...albumData, {
                            name: artistName2,
                            pictureUrl: pictureUrl,
                            found: newAlbumData.length > 0,
                            data: newAlbumData
                        }];

                        const newFeatData = data.feat.sort((a: any, b: any) => {
                            if (a.release_date > b.release_date) return -1;
                            else if (a.release_date < b.release_date) return 1;
                            return 0;
                        });
                        featData = [...featData, {
                            found: newFeatData.length > 0,
                            data: newFeatData
                        }];

                        // let newData = $allData;
                        // newData = [...newData, {
                        //     artistName1: artistName1,
                        //     artistName2: artistName2,
                        //     album: albumData,
                        //     feat: featData
                        // }];
                        // allData.set(newData);

                        if (i === allCards.length - 1){
                            loadingAlbum = false;
                            loadingTrack = false;
                        }
                    });
                }
            }
        }, 1500);
    }

    function Setup(data: any[]){
        allCards = data;
        if (artist1){
            artistName1 = artist1;

            // Get artist 1 index
            artist1Index = allCards.findIndex((card: any) => {
                return card.artist.displayName === artistName1;
            });

            console.log(artist1Index);

            // Shift $allcards to make artist 1 the first artist
            allCards = [...allCards.slice(artist1Index), ...allCards.slice(0, artist1Index)];
            GetAllFeat(0);
        }
        else{
            GetAllFeat(0);
        }
    }

    function Copy(){
        navigator.clipboard.writeText(encodeURI(`${location.protocol}//${location.host}${location.pathname}?artist1=${artistName1}`));
        copiedClipboard = true;
    }

    onMount(() => { 
        console.log('Fetching cards...');
        fetch(`${dev ? 'http://localhost:3000' : ''}/api/cards`)
        .then(res => res.json())
        .then(data => {
            Setup(data);
            loading = false;
        });
    })
</script>

<div class="text-sm breadcrumbs">
	<ul>
		<li><Translation id="home" /></li>
	</ul>
</div>
<div>
    <Translation id="description"/>
    (s/o <a class="text-primary hover:underline" href="https://github.com/0xChqrles" target="_blank">Chqrles</a>)
</div>
{#if loading}
    <img src={Spinner} class="animate-spin h-10" alt="spinner"/>
{:else}
    <div class="flex flex-col items-center">
        <h1>{artistName1}</h1>
        <div class="carousel lg:w-[23rem] w-[12rem]">
            {#each allCards as card, index}
                <div id={`${index}-1`} class="carousel-item relative w-full">
                    <img src={card.pictureUrl} class="lg:h-[30rem] h-[15rem] w-full" alt={card.artist.displayName}/>
                    <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a on:click={() => GetAllFeat(index === 0 ? allCards.length - 1 : index - 1)} href={`#${index === 0 ? allCards.length - 1 : index - 1}-1`} class="btn btn-circle">❮</a> 
                        <a on:click={() => GetAllFeat(index === allCards.length - 1 ? 0 : index + 1)} href={`#${index === allCards.length - 1 ? 0 : index + 1}-1`} class="btn btn-circle">❯</a>
                    </div>
                </div> 
            {/each}
        </div>
    </div>
    {#if albumData.length > 0 || featData.length > 0}
        <div class:tooltip-success={copiedClipboard} class="tooltip tooltip-bottom" data-tip={copiedClipboard ? 'Copied !' : 'Copy'}>
            <button on:click={Copy} class="btn btn-primary w-full">Send this to a friend</button>
        </div>
    {/if}
    {#each albumData as album, index}
        {#if album.found || featData[index].found}
            <Collab feat={featData[index].data} {artistName1} pictureUrl={album.pictureUrl} artistName2={album.name} album={album.data}/>
        {/if}
    {/each}
    {#if loadingAlbum || loadingTrack}
        <img src={Spinner} class="animate-spin h-10" alt="spinner"/>
    {/if}
{/if}