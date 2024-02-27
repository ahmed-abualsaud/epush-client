<script>
	import Modal from "../../shared/Modal.svelte"

    import { hideModal } from "$lib/helper/modal"

</script>

<Modal>
    <div class="flex flex-col items-center flex-shrink-0 rounded-xl bg-white shadow-xl w-[400px]">
        <div class="flex flex-col items-center self-stretch gap-4 p-6 border-b">
            <div class="flex justify-center items-center w-14 h-14 p-3 rounded-[28px] border-8 border-error-50 bg-error-100">
                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M17 7.5L7 17.5M7 7.5L17 17.5" stroke="#D92D20" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex flex-col items-center self-stretch gap-1">
                <span class="self-stretch text-gray-900 text-center text-lg font-semibold">Unfortunately,<br>your API key were not generated.</span>
                <span class="self-stretch text-gray-600 text-center text-sm">Something went wrong with generating your new API key.</span>
            </div>
        </div>
        <div class="flex flex-col items-start self-stretch gap-3 pt-8 pb-6 px-6">
            <button on:click={hideModal} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-error-600 bg-error-600 shadow-sm">
                <span class="text-white font-semibold">Close</span>
            </button>
        </div>
    </div>
</Modal>