<script>
	import { onMount } from "svelte"
    import { navigate, currentPage } from "$lib/router/router.js"

    onMount(async () => {
        await navigate('home')
    })

</script>

<svelte:component this={$currentPage.component} {...$currentPage.props}/>