<script lang="ts">
	import { dev } from '$app/env';
	import { onMount } from 'svelte';
	import Translation from '$lib/components/Translation.svelte';
	import Spinner from '$lib/assets/spinner.png';
	import { page } from '$app/stores';
	import Collab from '$lib/components/Collab.svelte';

	const artist: string | null = $page.url.searchParams.get('artist');
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

	function GetAllFeat(index: number) {
		copiedClipboard = false;
		loadingAlbum = true;
		loadingTrack = true;
		albumData = [];
		featData = [];
		artistName1 = allCards[index].artistName;

		if (!timeoutFinished) {
			clearTimeout(timeout);
		}
		timeoutFinished = false;

		timeout = setTimeout(() => {
			timeoutFinished = true;
			for (let i = 0; i < allCards.length; i++) {
				if (i !== index) {
					const artistName2 = allCards[i].artistName;

					const pictureUrl = allCards[i].pictureUrl;
					let uri = encodeURI(
						`${dev ? 'http://localhost:3000' : ''}/api/feat/${artistName1}/${artistName2}`
					);
					fetch(uri)
						.then((res) => res.json())
						.then((data) => {
							const newAlbumData = data.album.sort((a: any, b: any) => {
								if (a.release_date > b.release_date) return -1;
								else if (a.release_date < b.release_date) return 1;
								return 0;
							});
							albumData = [
								...albumData,
								{
									name: artistName2,
									pictureUrl: pictureUrl,
									found: newAlbumData.length > 0,
									data: newAlbumData
								}
							];

							const newFeatData = data.feat.sort((a: any, b: any) => {
								if (a.release_date > b.release_date) return -1;
								else if (a.release_date < b.release_date) return 1;
								return 0;
							});
							featData = [
								...featData,
								{
									found: newFeatData.length > 0,
									data: newFeatData
								}
							];

							if (i === allCards.length - 1) {
								loadingAlbum = false;
								loadingTrack = false;
							}
						})
						.catch(err => console.log(err));
				}
			}
		}, 1500);
	}

	function Setup(data: any[]) {
		allCards = data;
		if (artist) {
			artistName1 = artist;

			// Get artist 1 index
			artist1Index = allCards.findIndex((card: any) => {
				return card.artistName === artistName1;
			});

			console.log(artist1Index);

			// Shift $allcards to make artist 1 the first artist
			allCards = [...allCards.slice(artist1Index), ...allCards.slice(0, artist1Index)];
			GetAllFeat(0);
		} else {
			GetAllFeat(0);
		}
	}

	function Copy() {
		navigator.clipboard.writeText(
			encodeURI(`${location.protocol}//${location.host}${location.pathname}?artist=${artistName1}`)
		);
		copiedClipboard = true;
	}

	onMount(() => {
		console.log('Fetching cards...');
		fetch(`${dev ? 'http://localhost:3000' : ''}/api/cards`)
			.then((res) => res.json())
			.then((data) => {
				Setup(data);
				loading = false;
			});
	});
</script>

<div>
	<a class="text-primary hover:underline" href="https://rules.art/" target="_blank"
		>Rules</a
	>
	<Translation id="description" />
	(s/o
	<a class="text-primary hover:underline" href="https://github.com/0xChqrles" target="_blank"
		>Chqrles</a
	>)
	<Translation id="by" /> <a class="text-primary hover:underline" href="https://quentinam.fr/" target="_blank">
		QuentinAM
	</a>
</div>
{#if loading}
	<img src={Spinner} class="animate-spin h-10" alt="spinner" />
{:else}
	<div class="flex flex-col items-center">
		<h1 class="font-bold text-xl mb-1">{artistName1}</h1>
		<div class="carousel lg:w-[20rem] w-[12rem]">
			{#each allCards as card, index}
				<div id={`${index}-1`} class="carousel-item relative w-full">
					<img
						src={card.pictureUrl}
						class="lg:h-[26rem] h-[15rem] w-full"
						alt={card.artistName}
					/>
					<div
						class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
					>
						<a
							on:click={() => GetAllFeat(index === 0 ? allCards.length - 1 : index - 1)}
							href={`#${index === 0 ? allCards.length - 1 : index - 1}-1`}
							class="btn btn-circle">❮</a
						>
						<a
							on:click={() => GetAllFeat(index === allCards.length - 1 ? 0 : index + 1)}
							href={`#${index === allCards.length - 1 ? 0 : index + 1}-1`}
							class="btn btn-circle">❯</a
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div
		class:tooltip-success={copiedClipboard}
		class="tooltip tooltip-right"
		data-tip={copiedClipboard ? 'Copied !' : 'Copy'}
	>
		<button on:click={Copy} class="btn btn-primary w-full"><Translation id="send" /></button>
	</div>
	{#each albumData as album, index}
		{#if album.found || featData[index].found}
			<Collab
				feat={featData[index].data}
				{artistName1}
				pictureUrl={album.pictureUrl}
				artistName2={album.name}
				album={album.data}
			/>
		{/if}
	{/each}
	{#if loadingAlbum || loadingTrack}
		<img src={Spinner} class="animate-spin h-10" alt="spinner" />
	{/if}
{/if}
