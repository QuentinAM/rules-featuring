<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar />
<div class="min-h-screen bg-base-200 flex justify-center">
	<div class="flex flex-col items-center space-y-4 mt-4 w-full mx-4 lg:w-2/3 lg:mx-0">
		<slot />
	</div>
</div>