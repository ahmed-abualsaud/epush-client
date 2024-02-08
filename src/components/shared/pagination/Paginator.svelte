
<script>
	import { onMount } from 'svelte'
    import { writable } from 'svelte/store'
    import { empty } from "$lib/helper/utils"

    export let data
    export let take = 10
    export let mapFunction = null
    export let onPageClick = null
    export let paginatedSearchFunction = null
    export let useSearch = false

    let pagesNav
    let numberOfPages = 5
    let firstPageNumber = 1
    let prevTake = writable(take)

    onMount(() => {
        pagesNav?.querySelectorAll("button")[data?.current_page - 1].classList.add("bg-primary-100")
    })
    $: {
        if (take !== $prevTake) {
            prevTake.set(take)
            data.current_page = 1
            onPageLoad(1)
        }

        numberOfPages = Math.min(Math.ceil(data?.total / take), 5)
        let deviation = data?.current_page - Math.max(numberOfPages - Math.ceil(data?.total / take) + data?.current_page - 1 , Math.ceil(numberOfPages/2))
        firstPageNumber = Math.max(deviation, 1)
        changePaginatorColor()
    }

    const changePaginatorColor = () => {
        let buttons = pagesNav?.querySelectorAll("button")
        if (buttons) {
            buttons.forEach(btn => {
                btn.classList.remove("bg-primary-100")
            })
            buttons[data?.current_page - 1]?.classList.add("bg-primary-100")
        }
    }

    const onPageLoad = async (page) => {
        if (useSearch) {
            if (paginatedSearchFunction) {
                let rows = await paginatedSearchFunction(page, take)
                ! empty(mapFunction) && (rows.data = rows?.data.map(mapFunction))
                data = rows
            }
        } else {
            if (onPageClick) {
                let rows = await onPageClick(page, take)
                ! empty(mapFunction) && (rows.data = rows?.data.map(mapFunction))
                data = rows
            }
        }
    }

    const getNextPage = () => {
        return Math.min(data?.current_page + 1, Math.ceil(data?.total / take));
    }


    const getPreviousPage = () => {
        return Math.max(data?.current_page - 1, 1);
    }
</script>

<nav class="flex items-center flex-col flex-wrap md:flex-row justify-between self-stretch pt-3 pb-4 px-6 border-b">
    <button on:click={() => onPageLoad(getPreviousPage())} class="flex justify-center items-center gap-2 py-2 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15.8332 10.0001H4.1665M4.1665 10.0001L9.99984 15.8334M4.1665 10.0001L9.99984 4.16675" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        <span class="text-gray-700 text-sm font-semibold">Previous</span>
    </button>
    <div bind:this={pagesNav} class="flex items-start gap-0.5">
        {#each {length: numberOfPages} as _, i}
        <button  on:click={() => onPageLoad(i + firstPageNumber)} class="flex justify-center items-center w-10 h-10 rounded-lg bg-gray-50 hover:bg-primary-100">
            <div class="flex justify-center items-center self-stretch flex-shrink-0 w-10 p-3 rounded-lg">
                <span class="text-gray-800 text-center text-sm font-medium">{i + firstPageNumber}</span>
            </div>
        </button>
    {/each}
    </div>
    <button on:click={() => onPageLoad(getNextPage())} class="flex justify-center items-center gap-2 py-2 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-100">
        <span  class="text-gray-700 text-sm font-semibold">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4.1665 10.0001H15.8332M15.8332 10.0001L9.99984 4.16675M15.8332 10.0001L9.99984 15.8334" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
</nav>