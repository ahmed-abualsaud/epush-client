<script>
	import Alert from "./Alert.svelte"
	import Spinner from "./Spinner.svelte"
    import { errorPromise } from "$lib/helper/error"

    export let alertClass = ""
</script>

{#await $errorPromise}
    <Spinner />    
{:catch error}
    <Alert type="error" message={error.message} clazz={alertClass}/>
{/await}