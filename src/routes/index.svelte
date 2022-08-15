<script lang="ts">
    import { dev } from "$app/env";
    import { onMount } from "svelte";
    import { allCards } from '$lib/store/utils';
    import Translation from '$lib/components/Translation.svelte';
    import Album from "$lib/components/Album.svelte";
    import Track from "$lib/components/Track.svelte";
    import Spinner from '$lib/assets/spinner.png';
    import { goto } from "$app/navigation";

    let loading: boolean = true;
    let loadingAlbum: boolean = false;
    let loadingTrack: boolean = false;

    let artistName1: string = '';
    let artistName2: string = '';
    let albumData: any[] = [];
    let featData: any[] = [];

    function NextFeat(index: number, direction: number){
        albumData = [];
        featData = [];
        loadingAlbum = true;
        loadingTrack = true;
        if (direction === 1)
        {
            artistName1 = $allCards[index].artist.displayName;
        }
        else
        {
            artistName2 = $allCards[index].artist.displayName;
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
            if (featData.length > 0)
                console.log(JSON.stringify(featData[0], null, 4));
        });
    }

    function Setup(){
        artistName1 = $allCards[0].artist.displayName;
        artistName2 = $allCards[0].artist.displayName;
    }

    onMount(() => {
        if ($allCards.length == 0)
        {
            console.log('Fetching cards...');
            fetch(`${dev ? 'http://localhost:3000' : ''}/api/cards`)
            .then(res => res.json())
            .then(data => {
                allCards.set(data);
                Setup();
                loading = false;
            });
        }
        else
        {
            console.log('Cards already fetched.');
            Setup();
            loading = false;
        }
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
    {/if}
    <div class="flex flex-row space-x-2">
        <div class=" flex flex-col items-center">
            <h1>{artistName1}</h1>
            <div class="carousel lg:w-[23rem] w-[12rem]">
                {#each $allCards as card, index}
                    <div id={`${index}-1`} class="carousel-item relative w-full">
                        <img src={card.pictureUrl} class="lg:h-[30rem] h-[15rem] w-full" alt={card.artist.displayName}/>
                        <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a on:click={() => NextFeat(index === 0 ? $allCards.length - 1 : index - 1, 1)} href={`#${index === 0 ? $allCards.length - 1 : index - 1}-1`} class="btn btn-circle">❮</a> 
                            <a on:click={() => NextFeat(index === $allCards.length - 1 ? 0 : index + 1, 1)} href={`#${index === $allCards.length - 1 ? 0 : index + 1}-1`} class="btn btn-circle">❯</a>
                        </div>
                    </div> 
                {/each}
            </div>
        </div>
        <div class=" flex flex-col items-center">
            <h1>{artistName2}</h1>
            <div class="carousel lg:w-[23rem] w-[12rem]">
                {#each $allCards as card, index}
                    <div id={`${index}-2`} class="carousel-item relative w-full">
                        <img src={card.pictureUrl} class="lg:h-[30rem] h-[15rem] w-full" alt={card.artist.displayName}/>
                        <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a on:click={() => NextFeat(index === 0 ? $allCards.length - 1 : index - 1, 2)} href={`#${index === 0 ? $allCards.length - 1 : index - 1}-2`} class="btn btn-circle">❮</a> 
                            <a on:click={() => NextFeat(index === $allCards.length - 1 ? 0 : index + 1, 2)} href={`#${index === $allCards.length - 1 ? 0 : index + 1}-2`} class="btn btn-circle">❯</a>
                        </div>
                    </div> 
                {/each}
            </div>
        </div>
    </div>
{/if}