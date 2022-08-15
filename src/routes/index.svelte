<script lang="ts">
    import { dev } from "$app/env";
    import { onMount } from "svelte";
    import Translation from '$lib/components/Translation.svelte';
    import Album from "$lib/components/Album.svelte";
    import Track from "$lib/components/Track.svelte";
    import Spinner from '$lib/assets/spinner.png';
    import { page } from '$app/stores'

    const artist1: string | null = $page.url.searchParams.get('artist1');
    const artist2: string | null = $page.url.searchParams.get('artist2');
    let artist1Index: number = 0;
    let artist2Index: number = 0;

    let loading: boolean = true;
    let loadingAlbum: boolean = false;
    let loadingTrack: boolean = false;

    let artistName1: string = '';
    let artistName2: string = '';
    let albumData: any[] = [];
    let featData: any[] = [];

    let allCards1: any[] = [];
    let allCards2: any[] = [];
    let copiedClipboard: boolean = false;

    function NextFeat(index: number, direction: number){
        copiedClipboard = false;
        albumData = [];
        featData = [];
        loadingAlbum = true;
        loadingTrack = true;
        if (direction === 1)
        {
            artistName1 = allCards1[index].artist.displayName;
        }
        else
        {
            artistName2 = allCards2[index].artist.displayName;
        }

        if (artistName1 === artistName2){
            loadingAlbum = false;
            loadingTrack = false;
            return;
        }

        let uri = encodeURI(`${dev ? 'http://localhost:3000' : ''}/api/feat/${artistName1}/${artistName2}`);
        fetch(uri)
        .then(res => res.json())
        .then(data => {
            albumData = data.album.sort((a: any, b: any) => {
                if (a.release_date > b.release_date) return -1;
                else if (a.release_date < b.release_date) return 1;
                return 0;
            });
            loadingAlbum = false;

            featData = data.feat.sort((a: any, b: any) => {
                if (a.release_date > b.release_date) return -1;
                else if (a.release_date < b.release_date) return 1;
                return 0;
            });
            loadingTrack = false;
        });
    }

    function Setup(data: any[]){
        allCards1 = data;
        allCards2 = data;
        if (artist1 && artist2){
            artistName1 = artist1;
            artistName2 = artist2.split('#')[0];
            if (artistName1 === artistName2) return;

            // Get artist 1 index
            artist1Index = allCards1.findIndex((card: any) => {
                return card.artist.displayName === artistName1;
            });
            // Get artist 2 index
            artist2Index = allCards2.findIndex((card: any) => {
                return card.artist.displayName === artistName2;
            });

            console.log(artist1Index, artist2Index);

            // Shift $allcards to make artist 1 the first artist
            allCards1 = [...allCards1.slice(artist1Index), ...allCards1.slice(0, artist1Index)];
            allCards2 = [...allCards2.slice(artist2Index), ...allCards2.slice(0, artist2Index)];

            NextFeat(0, 1);
        }
        else{
            artistName1 = data[0].artist.displayName;
            artistName2 = data[0].artist.displayName;
        }
    }

    function Copy(){
        navigator.clipboard.writeText(encodeURI(`${location.protocol}//${location.host}${location.pathname}?artist1=${artistName1}&artist2=${artistName2}`));
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
    <div class="flex flex-row space-x-2">
        <div class=" flex flex-col items-center">
            <h1>{artistName1}</h1>
            <div class="carousel lg:w-[23rem] w-[12rem]">
                {#each allCards1 as card, index}
                    <div id={`${index}-1`} class="carousel-item relative w-full">
                        <img src={card.pictureUrl} class="lg:h-[30rem] h-[15rem] w-full" alt={card.artist.displayName}/>
                        <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a on:click={() => NextFeat(index === 0 ? allCards1.length - 1 : index - 1, 1)} href={`#${index === 0 ? allCards1.length - 1 : index - 1}-1`} class="btn btn-circle">❮</a> 
                            <a on:click={() => NextFeat(index === allCards1.length - 1 ? 0 : index + 1, 1)} href={`#${index === allCards1.length - 1 ? 0 : index + 1}-1`} class="btn btn-circle">❯</a>
                        </div>
                    </div> 
                {/each}
            </div>
        </div>
        <div class=" flex flex-col items-center">
            <h1>{artistName2}</h1>
            <div class="carousel lg:w-[23rem] w-[12rem]">
                {#each allCards2 as card, index}
                    <div id={`${index}-2`} class="carousel-item relative w-full">
                        <img src={card.pictureUrl} class="lg:h-[30rem] h-[15rem] w-full" alt={card.artist.displayName}/>
                        <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a on:click={() => NextFeat(index === 0 ? allCards2.length - 1 : index - 1, 2)} href={`#${index === 0 ? allCards2.length - 1 : index - 1}-2`} class="btn btn-circle">❮</a> 
                            <a on:click={() => NextFeat(index === allCards2.length - 1 ? 0 : index + 1, 2)} href={`#${index === allCards2.length - 1 ? 0 : index + 1}-2`} class="btn btn-circle">❯</a>
                        </div>
                    </div> 
                {/each}
            </div>
        </div>
    </div>
    {#if loadingAlbum || loadingTrack}
        <img src={Spinner} class="animate-spin h-10" alt="spinner"/>
    {:else}
        <div class="h-10"></div>
        {#if albumData.length > 0}
            <h1 class="w-full font-semibold text-3xl">Common projects</h1>
        {/if}
        {#each albumData as album}
            <Album {album} artist1={artistName1} artist2={artistName2} />
        {/each}
        {#if featData.length > 0}
            <h1 class="w-full font-semibold text-3xl">Featuring</h1>
        {/if}
        {#each featData as track}
            <Track {track} />
        {/each}

        {#if albumData.length > 0 || featData.length > 0}
            <div class:tooltip-success={copiedClipboard} class="tooltip tooltip-bottom" data-tip={copiedClipboard ? 'Copied !' : 'Copy'}>
                <button on:click={Copy} class="btn btn-primary w-full">Send this to a friend</button>
            </div>
        {/if}
    {/if}
{/if}