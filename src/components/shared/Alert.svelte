<script>
    import { onMount, onDestroy } from "svelte"

    export let clazz
    export let message
    export let seconds = 300
    export let type = "default"
    export let description = null

    let alert
    let timeoutId

    const removeAfterDelay = () => {
        timeoutId = setTimeout(() => {
            alert?.remove()
        }, seconds * 1000)
    }

    onMount(() => {
        const audio = new Audio("audio/beep-sound.mp3")
        audio.play()
        removeAfterDelay()
    })

    onDestroy(() => {
        clearTimeout(timeoutId)
    })

    $: {
        clearTimeout(timeoutId)
        removeAfterDelay()
    }
</script>

{#if type == "default"}
<div bind:this={alert} class="fixed flex w-60 sm:w-72 lg:w-[400px] flex-col items-center gap-4 z-[99999] {clazz}">
    <div class="flex items-center self-stretch gap-3 p-4 border border-gray-300 bg-gray-50 rounded-xl ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <g clip-path="url(#clip0_305_103)">
                <path d="M9.99996 6.66675V10.0001M9.99996 13.3334H10.0083M18.3333 10.0001C18.3333 14.6025 14.6023 18.3334 9.99996 18.3334C5.39759 18.3334 1.66663 14.6025 1.66663 10.0001C1.66663 5.39771 5.39759 1.66675 9.99996 1.66675C14.6023 1.66675 18.3333 5.39771 18.3333 10.0001Z" stroke="#D92D20" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_305_103">
                    <rect width="20" height="20" fill="white"/>
                </clipPath>
            </defs>
        </svg>
        <div class="flex flex-col items-start flex-1 gap-3">
            <div class="flex flex-col items-start self-stretch gap-1">
                <div class="self-stretch text-gray-700 text-sm font-medium">
                    {message}
                </div>
               {#if description}
               <div class="self-stretch text-gray-700 text-sm font-normal">
                        {description}
                    </div>
               {/if}
            </div>
        </div>
        <button on:click={() => alert?.remove()} class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="#F04438" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
</div>
{/if}
  
{#if type == "info"}
<div bind:this={alert} class="fixed flex w-60 sm:w-72 lg:w-[400px] flex-col items-center gap-4 z-50 {clazz}">
    <div class="flex items-center self-stretch gap-3 p-4 border border-blue-300 bg-blue-50 rounded-xl ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <g clip-path="url(#clip0_305_103)">
                <path d="M9.99996 6.66675V10.0001M9.99996 13.3334H10.0083M18.3333 10.0001C18.3333 14.6025 14.6023 18.3334 9.99996 18.3334C5.39759 18.3334 1.66663 14.6025 1.66663 10.0001C1.66663 5.39771 5.39759 1.66675 9.99996 1.66675C14.6023 1.66675 18.3333 5.39771 18.3333 10.0001Z" stroke="#2b6cb0" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_305_103">
                    <rect width="20" height="20" fill="white"/>
                </clipPath>
            </defs>
        </svg>
        <div class="flex flex-col items-start flex-1 gap-3">
            <div class="flex flex-col items-start self-stretch gap-1">
                <div class="self-stretch text-blue-700 text-sm font-medium">
                    {message}
                </div>
               {#if description}
               <div class="self-stretch text-blue-700 text-sm font-normal">
                        {description}
                    </div>
               {/if}
            </div>
        </div>
        <button on:click={() => alert?.remove()} class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="#2b6cb0" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
</div>
{/if}

{#if type == "warn"}
<div bind:this={alert} class="fixed flex w-60 sm:w-72 lg:w-[400px] flex-col items-center gap-4 z-50 {clazz}">
    <div class="flex items-center self-stretch gap-3 p-4 border border-yellow-300 bg-yellow-50 rounded-xl ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <g clip-path="url(#clip0_305_103)">
                <path d="M9.99996 6.66675V10.0001M9.99996 13.3334H10.0083M18.3333 10.0001C18.3333 14.6025 14.6023 18.3334 9.99996 18.3334C5.39759 18.3334 1.66663 14.6025 1.66663 10.0001C1.66663 5.39771 5.39759 1.66675 9.99996 1.66675C14.6023 1.66675 18.3333 5.39771 18.3333 10.0001Z" stroke="#CA8A04" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_305_103">
                    <rect width="20" height="20" fill="white"/>
                </clipPath>
            </defs>
        </svg>
        <div class="flex flex-col items-start flex-1 gap-3">
            <div class="flex flex-col items-start self-stretch gap-1">
                <div class="self-stretch text-yellow-700 text-sm font-medium">
                    {message}
                </div>
               {#if description}
               <div class="self-stretch text-yellow-700 text-sm font-normal">
                        {description}
                    </div>
               {/if}
            </div>
        </div>
        <button on:click={() => alert?.remove()} class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="#CA8A04" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
</div>
{/if}

{#if type == "success"}
<div bind:this={alert} class="fixed flex w-60 sm:w-72 lg:w-[400px] flex-col items-center gap-4 z-50 {clazz}">
    <div class="flex items-center self-stretch gap-3 p-4 border border-success-300 bg-success-25 rounded-xl ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <g clip-path="url(#clip0_364_516)">
                <path d="M6.25008 10L8.75008 12.5L13.7501 7.50002M18.3334 10C18.3334 14.6024 14.6025 18.3334 10.0001 18.3334C5.39771 18.3334 1.66675 14.6024 1.66675 10C1.66675 5.39765 5.39771 1.66669 10.0001 1.66669C14.6025 1.66669 18.3334 5.39765 18.3334 10Z" stroke="#039855" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_364_516">
                    <rect width="20" height="20" fill="white"/>
                </clipPath>
            </defs>
          </svg>
        <div class="flex flex-col items-start flex-1 gap-3">
            <div class="flex flex-col items-start self-stretch gap-1">
                <div class="self-stretch text-success-700 text-sm font-medium">
                    {message}
                </div>
               {#if description}
               <div class="self-stretch text-success-700 text-sm font-normal">
                        {description}
                    </div>
               {/if}
            </div>
        </div>
        <button on:click={() => alert?.remove()} class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="#12B76A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
</div>
{/if}

{#if type == "error"}
<div bind:this={alert} class="fixed flex w-60 sm:w-72 lg:w-[400px] flex-col items-center gap-4 z-50 {clazz}">
    <div class="flex items-center self-stretch gap-3 p-4 border border-error-300 bg-error-25 rounded-xl ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <g clip-path="url(#clip0_305_103)">
                <path d="M9.99996 6.66675V10.0001M9.99996 13.3334H10.0083M18.3333 10.0001C18.3333 14.6025 14.6023 18.3334 9.99996 18.3334C5.39759 18.3334 1.66663 14.6025 1.66663 10.0001C1.66663 5.39771 5.39759 1.66675 9.99996 1.66675C14.6023 1.66675 18.3333 5.39771 18.3333 10.0001Z" stroke="#D92D20" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_305_103">
                    <rect width="20" height="20" fill="white"/>
                </clipPath>
            </defs>
        </svg>
        <div class="flex flex-col items-start flex-1 gap-3">
            <div class="flex flex-col items-start self-stretch gap-1">
                <div class="self-stretch text-error-700 text-sm font-medium">
                    {message}
                </div>
               {#if description}
               <div class="self-stretch text-error-700 text-sm font-normal">
                        {description}
                    </div>
               {/if}
            </div>
        </div>
        <button on:click={() => alert?.remove()} class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="#F04438" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
</div>
{/if}