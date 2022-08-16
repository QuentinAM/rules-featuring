<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar />
<div class="min-h-screen bg-base-200 flex justify-center">
	<div class="flex flex-col items-center space-y-4 mt-4 w-full mx-3 lg:w-5/6 lg:mx-0 mb-10">
		<slot />
	</div>
</div>
