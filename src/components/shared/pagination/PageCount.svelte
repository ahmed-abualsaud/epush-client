<script>
    export let perPage

    let pageCountList

    const selectPageCount = () => {
        pageCountList.classList.toggle("hidden")
    }

    const onSelectPageCount = (pageCount) => {
        perPage = pageCount
        hideDropdown()
    }

    const hideDropdown = () => {
        pageCountList.classList.add("hidden")
    }
</script>

<div class="relative hide-dropdown">
    <button on:click={selectPageCount} class="text-gray-700 bg-white hover:bg-primary-100 font-medium rounded-lg text-xs px-5 py-2.5 text-center inline-flex items-center border border-gray-300" type="button">
        Rows Per Page
        <svg class="w-2.5 h-2.5 ms-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
    </button>

    <!-- Dropdown menu -->
    <div bind:this={pageCountList} class="absolute z-10 w-full bg-white rounded-b-lg shadow hidden transition-all duration-300 ease-in-out mb-3 gap-2 px-2">
        <button on:click={() => onSelectPageCount(10)} class="flex items-center p-2 rounded-lg hover:bg-primary-100 w-full">
            <span class="w-full ms-2 text-sm font-medium text-gray-900">10 Rows</span>
        </button>

        <button on:click={() => onSelectPageCount(25)} class="flex items-center p-2 rounded-lg hover:bg-primary-100 w-full">
            <span class="w-full ms-2 text-sm font-medium text-gray-900">25 Rows</span>
        </button>

        <button on:click={() => onSelectPageCount(50)} class="flex items-center p-2 rounded-lg hover:bg-primary-100 w-full">
            <span class="w-full ms-2 text-sm font-medium text-gray-900">50 Rows</span>
        </button>

        <button on:click={() => onSelectPageCount(100)} class="flex items-center p-2 rounded-lg hover:bg-primary-100 w-full">
            <span class="w-full ms-2 text-sm font-medium text-gray-900">100 Rows</span>
        </button>

        <button on:click={() => onSelectPageCount(250)} class="flex items-center p-2 rounded-lg hover:bg-primary-100 w-full">
            <span class="w-full ms-2 text-sm font-medium text-gray-900">250 Rows</span>
        </button>

        <button on:click={() => onSelectPageCount(500)} class="flex items-center p-2 rounded-lg hover:bg-primary-100 w-full">
            <span class="w-full ms-2 text-sm font-medium text-gray-900">500 Rows</span>
        </button>
    </div>
</div>

<svelte:window on:click={(e) => {
    if (e.target.closest(".hide-dropdown")) return 
    hideDropdown()
}}/>