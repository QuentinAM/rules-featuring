<script lang="ts">
	import { language } from '$lib/store/utils';
	import { onMount } from 'svelte';

	// let Flag: any;
	let languageSelected: any;
	let loading: boolean = true;
	const languages = ['FR', 'EN'];
	const flags: any = {
		"FR": "🇫🇷",
		"EN": "🇬🇧"
	}

	onMount(async () => {
		languageSelected = localStorage.getItem('language') || 'FR';
		loading = false;
	});

	$: if (!loading) localStorage.setItem('language', languageSelected);
	$: language.set(languageSelected);
</script>

{#if !loading}
	<select bind:value={languageSelected} class="select">
		{#each languages as l}
			<option value={l}>
				{flags[l]} &nbsp;{l}
			</option>
		{/each}
	</select>
{/if}
