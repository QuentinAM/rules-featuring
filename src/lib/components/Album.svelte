<script lang="ts">
	import { millisToMinutesAndSeconds } from '$lib/utils';
	import Translation from './Translation.svelte';

	export let album: any;
	export let artist1: string;
	export let artist2: string;
</script>

<div class="space-y-1 items-center flex flex-col">
	<a
		href={album.external_urls.spotify}
		target="_blank"
		class="font-semibold lg:text-xl text-smlink link-hover">{album.name} - {artist1} x {artist2}</a
	>
	<p class="lg:text-base text-xs"><Translation id="released_on" /> {album.release_date}</p>
</div>
<div class="card card-side bg-base-100 shadow-xl lg:h-52 h-24 w-full overflow-y-auto">
	<figure><img src={album.images.url} class="lg:w-52 w-24" alt="Album" /></figure>
	<div class="overflow-x-auto w-full">
		<table class="table w-full lg:text-base text-xs">
			<!-- head -->
			<thead>
				<tr>
					<th />
					<th><Translation id="name" /></th>
					<th><Translation id="preview" /></th>
					<th><Translation id="duration" /></th>
				</tr>
			</thead>
			<tbody>
				{#each album.tracks as track, index}
					<tr>
						<th>{index + 1}</th>
						<th>
							<a class="link link-hover" href={track.external_urls.spotify} target="_blank"
								>{track.name}</a
							>
							<div class="text-slate-400 font-normal">
								{#each track.artists as artist, index}
									<a class="link link-hover" href={artist.external_urls.spotify} target="_blank"
										>{artist.name}</a
									>{index === track.artists.length - 1 ? '' : ','}&nbsp;
								{/each}
							</div>
						</th>
						<td>
							{#if track.preview_url}
								<audio class="w-full rounded-lg" src={track.preview_url} controls>
									<track kind="captions" />
								</audio>
							{:else}
								<p class="text-error"><Translation id="unavailable" /></p>
							{/if}
						</td>
						<td>{`${millisToMinutesAndSeconds(track.duration_ms)}s`.replace('.', ':')}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
