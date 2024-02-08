<script>
	import Async from "../components/shared/Async.svelte"

    import { onMount } from "svelte"
    import { navigate, currentPage } from "$lib/router/router"

    onMount(async () => {
        await navigate('signin')
    })
</script>

<Async alertClass="bottom-[3vh] left-[50vw] md:left-[29vw] -translate-x-1/2"/>
<svelte:component this={$currentPage.component} {...$currentPage.props}/>