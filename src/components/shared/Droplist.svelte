<script>
    import { empty } from '$lib/helper/utils'
	import { onMount } from 'svelte';

    export let name = ""
    export let clazz = ""
    export let options = []
    export let placeholder = ""
    export let onSelectOption = null
    export let selectedOption = null
    export let fetchOptionsFunction = null

    let searchValue = ""
    let toggleDropDown = false
    let initialOptions = options

    onMount(async () => {
        if (fetchOptionsFunction) {
            options = await fetchOptionsFunction()
            initialOptions = options
        }
    })
    const toggleDropList = () => {
        toggleDropDown = ! toggleDropDown
        options = initialOptions
    }

    const setSelectedOption = (option) => {
        selectedOption = option
        toggleDropDown = ! toggleDropDown
        onSelectOption && onSelectOption(option)
    }

    $: if (searchValue) {
        options = options.filter(option => option.toLowerCase().includes(searchValue.toLowerCase()))
    } else {
        options = initialOptions
    }

</script>

<div class="relative flex flex-col items-start gap-1.5 self-stretch {clazz}">
    {#if ! empty(name)}
    <span class="text-gray-700 text-sm font-medium">{name}</span>        
    {/if}

    <button on:click={toggleDropList} class="hide-dropdown flex px-3.5 py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm {clazz}">
        <div class="flex items-center flex-1 gap-2 truncate">
            <slot name="icon" />
            <span class="text-gray-500 truncate">{empty(selectedOption) ? placeholder : selectedOption}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>

    <div class="hide-dropdown absolute flex flex-col items-start top-full border border-gray-300 bg-white w-full {toggleDropDown ? "visible opacity-100" : "invisible opacity-0"} transition-all duration-300 ease-in-out rounded-lg z-50 max-h-60 overflow-y-auto">
        {#if ! empty(initialOptions)}
        <div class="flex justify-between items-center flex-1 py-2 px-3 my-2 mx-3 border border-gray-300 self-stretch rounded-lg">
            <input bind:value={searchValue} class="placeholder:text-gray-500 outline-none w-full" placeholder="Search" />
        </div>
        <div class="flex flex-col items-start self-stretch">
            {#each options as option}
            <button on:click={() => setSelectedOption(option)} class="flex items-start self-stretch flex-1 my-2 mx-3 py-2 px-3 hover:bg-primary-50 rounded-lg">
                <span class="text-gray-900 text-nowrap whitespace-nowrap text-ellipsis overflow-x-hidden">{option}</span>
            </button>
            {/each}
        </div>
        {:else}
        <div class="flex justify-center items-center self-stretch my-2 mx-3 py-2 px-3">
            <span class="text-red-500 font-semibold">No Options Available!</span>
        </div>
        {/if}
    </div>
</div>

<svelte:window on:click={(e) => {
    if (e.target.closest(".hide-dropdown")) return 
    toggleDropDown = false
}}/>