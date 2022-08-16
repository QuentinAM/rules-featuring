<script lang="ts">
    import Album from "./Album.svelte";
    import Track from './Track.svelte'
    import Translation from "./Translation.svelte";

    export let pictureUrl: string;
    export let artistName1: string;
    export let artistName2: string;
    export let album: any[];
    export let feat: any[];
</script>

<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-full">
    <input type="checkbox" /> 
    <div class="collapse-title text-xl font-medium">
        <div class="flex flex-row items-center space-x-2">
            <img src={pictureUrl} class="w-14 lg:w-32 h-full rounded" alt="Album"/>
            <div class="flex flex-col">
                <p class="font-semibold">{artistName2}</p>
                {#if album.length > 0}
                    {#if album.length > 1}
                        <p>{album.length} <Translation id="common_projects" /> !</p>
                    {:else}
                        <p>{album.length} <Translation id="common_project" /> !</p>
                    {/if}
                {/if}
                {#if feat.length > 0}
                    <p>{feat.length} feat{feat.length > 1 ? 's' : ''} !</p>
                {/if}
            </div>
        </div>
    </div>
    <div class="collapse-content space-y-4">
        {#if album.length > 1}
            <p>{album.length} <Translation id="common_projects" /> !</p>
        {:else}
            <p>{album.length} <Translation id="common_project" /> !</p>
        {/if}
        
        {#each album as a}
            <Album album={a} artist1={artistName1} artist2={artistName2} />
            <div class="divider divider-vertical"></div>
        {/each}
        {#if feat.length > 0}
            <h1>Featuring</h1>
        {/if}
        {#each feat as t}
            <Track track={t} />
        {/each}
    </div>
</div>