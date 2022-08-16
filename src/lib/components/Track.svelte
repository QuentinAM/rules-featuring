<script lang="ts">
	import { millisToMinutesAndSeconds } from '$lib/utils';
	import Translation from './Translation.svelte';

	export let track: any;
</script>

<div class="card card-side bg-base-100 lg:h-52 h-40 shadow-2xl w-full">
	<figure><img src={track.images.url} class="lg:w-52 w-40" alt="feat" /></figure>
	<div class="card-body lg:overflow-y-hidden overflow-y-auto h-full p-2 lg:p-8">
		<h2 class="card-title">
			<a
				href={track.external_urls.spotify}
				target="_blank"
				class="font-semibold text-xl link link-hover">{track.name}</a
			>
		</h2>
		<div class="text-slate-400 font-normal">
			{#each track.artists as artist, index}
				<a class="link link-hover" href={artist.external_urls} target="_blank">{artist.name}</a
				>{index === track.artists.length - 1 ? '' : ','}&nbsp;
			{/each}
		</div>
		<p>
			<Translation id="released_on" />
			{track.release_date}
			<Translation id="on" />
			<a href={track.album_url} target="_blank" class="link link-hover inline font-semibold"
				>{track.album_name}</a
			>
		</p>
		{#if track.preview_url}
			<div class="card-actions justify-end lg:mt-3">
				<div class="flex flex-row w-full space-x-2 items-center justify-center">
					<audio class="w-full rounded-lg" src={track.preview_url} controls>
						<track kind="captions" />
					</audio>
					<div class="divider divider-horizontal" />
					<p>{`${millisToMinutesAndSeconds(track.duration_ms)}s`.replace('.', ':')}</p>
				</div>
			</div>
		{/if}
	</div>
</div>
