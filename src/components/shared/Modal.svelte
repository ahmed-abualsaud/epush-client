<script>
    import { empty } from "$lib/helper/utils"
    import { hideModal, visibleModal } from "$lib/helper/modal"

    export let name = ""
    export let clazz = ""
    export let darkBackground = true
</script>

{#if ! empty(name) && ($visibleModal == name)}
<div class="fixed flex justify-center items-center top-0 left-0 w-screen h-screen {darkBackground && "bg-black bg-opacity-20"} z-[1000]">
    <div class="relative flex justify-center items-center -gap-4 w-fit rounded-xl shadow-xl {clazz}">
        <button on:click={hideModal} class="flex justify-center items-center p-2.5 absolute top-4 right-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <slot />
    </div>
</div>
{/if}
