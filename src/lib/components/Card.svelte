<script lang="ts">
	import { goto } from '$app/navigation';
	import Translation from './Translation.svelte';

	export let name: string;
	export let pictureUrl: string;
	export let season: string;
	export let slug: string;
</script>

<div class="card card-side bg-base-100 shadow-xl w-full">
	<figure><img src={pictureUrl} loading="lazy" class="lg:h-52 h-40" alt="Movie" /></figure>
	<div class="card-body">
		<h2 class="card-title">{name}</h2>
		<div>Saison {season}</div>
		<div class="card-actions justify-end">
			<button class="btn btn-primary" on:click={() => goto(`/${slug}`)}
				><Translation id="view" /></button
			>
		</div>
	</div>
</div>
