<script lang="ts">
    import { dev } from "$app/env";
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import Translation from '$lib/components/Translation.svelte';
    import { goto } from '$app/navigation';
    import { allCards } from '$lib/store/utils';
    import Favicon from "$lib/assets/favicon.png"

    const slug = $page.params.slug;
    let loading: boolean = true;

    let pictureUrl: string = '';
    let artistName: string = '';

    function Setup(){
        const card = $allCards.find(card => card.slug === slug);
        pictureUrl = card.pictureUrl;
        artistName = card.artist.displayName;
        
        loading = false;
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

                fetch(`${dev ? 'http://localhost:3000' : ''}/api/feat/${artistName}/winnterzuko`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                });
            });
        }
        else
        {
            console.log('Cards already fetched.');
            Setup();
        }
        
    })
</script>

<div class="text-sm breadcrumbs">
	<ul>
		<li><a on:click|preventDefault={() => goto('/')} href='/'><Translation id="home" /></a></li>
		<li>{slug}</li>
	</ul>
</div>
<div class="card card-side bg-base-100 shadow-xl w-full">
    {#if loading}
        <div class="radial-progress animate-spin text-primary" style="--value:70;"></div>
        <h1><Translation id="loading"/></h1>
    {:else}
        <figure><img src={pictureUrl} class="lg:h-96 h-56" alt="Movie"></figure>
        <div class="card-body">
            <h2 class="card-title">{artistName}</h2>
        </div>
    {/if}
</div>