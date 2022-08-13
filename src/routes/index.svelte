<script lang="ts">
    import { dev } from "$app/env";
    import { onMount } from "svelte";
    import { allCards } from '$lib/store/utils';
    import Translation from '$lib/components/Translation.svelte';
    import Card from '$lib/components/Card.svelte';
    import { goto } from "$app/navigation";

    let loading: boolean = true;
    let query: string = '';
    let shownCards: any[] = [];
    let history: any[] = [];

    let commonCheck: boolean = true;
    let platinumCheck: boolean = true;

    function onQuery(){
        if (query === '')
        {
            shownCards = $allCards;
            return;
        }
        console.log(query);
        shownCards = $allCards.filter(card => Format(card.artist.displayName).includes(Format(query)));
    }


    function Format(str: string){
        // Remove spaces
        str = str.replace(/\s/g, '');

        // Remove accents
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return str.toLowerCase();
    }

    onMount(() => {
        if ($allCards.length == 0)
        {
            console.log('Fetching cards...');
            fetch(`${dev ? 'http://localhost:3000' : ''}/api/cards`)
            .then(res => res.json())
            .then(data => {
                allCards.set(data);
                shownCards = data;
                loading = false;
            });
        }
        else
        {
            console.log('Cards already fetched.');
            loading = false;
            shownCards = $allCards;
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
    <div class="radial-progress animate-spin text-primary" style="--value:70;"></div>
    <h1><Translation id="loading"/></h1>
{:else}
    <div class="form-control w-full">
        <label class="label">
            <span class="label-text"><Translation id="search"/></span>
            <input class="hidden"/>
        </label>
        <input
            bind:value={query}
            on:input={onQuery}
            placeholder="..."
            type="text"
            class="input input-primary w-full"
        />
    </div>
    {#each shownCards as card}
        <Card
            name={card.artist.displayName}
            pictureUrl={card.pictureUrl}
            season={card.season}
            slug={card.slug}
        />
    {/each}
{/if}