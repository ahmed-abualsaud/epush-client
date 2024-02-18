<script>
	import PageInfo from "./PageInfo.svelte"
	import PageCount from "./PageCount.svelte"
	import Paginator from "./Paginator.svelte"

    export let data
    export let take = 10
    export let mapFunction = null
    export let onPageClick = null
    export let paginatedSearchFunction = null
    export let useSearch = false
</script>

<div class="flex flex-col items-start w-full rounded-b-xl">
    <Paginator bind:data={data} {take} {mapFunction} {onPageClick} {paginatedSearchFunction} {useSearch}/>
    <div class="flex justify-between items-center w-full py-3 px-6 bg-gray-50 rounded-b-xl">
        <PageInfo {take} total={data?.total} />
        <PageCount bind:perPage={take} />
    </div>
</div>