<script>
	import Modal from "../../shared/Modal.svelte"

    import { hideModal } from "$lib/helper/modal"
    import { ucFirst } from "$lib/helper/strUtils"

    export let action = "save"

    const okay = () => {
        hideModal()
    }

</script>


<Modal>
<div class="flex flex-col items-center w-[400px] border bg-white rounded-xl shadow-xl">
    <div class="flex flex-col items-center self-stretch gap-4 p-6 rounded-t-xl bg-white">
        <div class="flex justify-center items-center w-14 h-14 p-3 rounded-[28px] border-8 border-success-50 bg-success-100">
            <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#039855" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="flex flex-col items-center self-stretch gap-6">
            <div class="flex flex-col items-center self-stretch gap-3">
                <div class="flex flex-col items-center self-stretch gap-1">
                    <span class="self-stretch text-gray-900 text-center text-lg font-semibold">Ticket {ucFirst(action)} Successful!</span>
                    {#if action == "save"}
                        <span class="self-stretch text-gray-600 text-center text-sm">Your new ticket has been saved successfully.</span>
                    {:else if action == "update"}
                        <span class="self-stretch text-gray-600 text-center text-sm">Your ticket changes has been applied and saved successfully.</span>                
                    {:else}
                        <span class="self-stretch text-gray-600 text-center text-sm">Your ticket has been deleted successfully.</span>
                    {/if}
                </div>
            </div>
        </div>

    </div>
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="1" viewBox="0 0 400 1" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M400 1H0V0H400V1Z" fill="#EAECF0"/>
    </svg>
    <div class="flex flex-col items-start self-stretch gap-3 pt-8 pb-6 px-6">
        <button on:click={okay} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
            <span class="text-white font-semibold">Okay</span>
        </button>
    </div>
</div>
</Modal>
