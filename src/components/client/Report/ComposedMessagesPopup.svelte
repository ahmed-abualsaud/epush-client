<script>
	import Popup from "../../shared/Popup.svelte"
	import DateAndPush from "./DateAndPush.svelte"

	import { empty } from "$lib/helper/utils"
    import { message } from "$lib/helper/store"
    import { hidePopup } from "$lib/helper/popup"
    import { showModal } from "$lib/helper/modal"

    export let addMethod

    const okay = () => {
        hidePopup()
        showModal(DateAndPush, {addMethod})
    }
</script>
<Popup name="composed-messages">
    <div class="flex flex-col self-stretch flex-1 w-[600px] bg-white rounded-xl">
        <div class="flex flex-col self-stretch flex-1 gap-4 p-6 max-h-[600px] overflow-y-auto">
            {#if ! empty($message.messageWithAttributes)}
                {#each $message.messageWithAttributes as msg}
                    <textarea value={msg.content} class="p-4 bg-gray-100 border rounded-lg" />
                {/each}                
            {/if}
        </div>
        <div class="flex flex-col items-start self-stretch gap-3 pt-8 pb-6 px-6 border-t">
            <button on:click={okay} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
                <span class="text-white font-semibold">OK</span>
            </button>
        </div>
    </div>
</Popup>