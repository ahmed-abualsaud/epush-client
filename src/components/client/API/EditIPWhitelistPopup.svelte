<script>
	import Popup from "../../shared/Popup.svelte"
	import IPWhitelistErrorPopup from "./IPWhitelistErrorPopup.svelte"
	import IPWhitelistSuccessPopup from "./IPWhitelistSuccessPopup.svelte"

	import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { showPopup, hidePopup } from "$lib/helper/popup"
	import { updateIPWhitelist } from "../../../api/clientApi"

    export let bulk = false
    export let ipID = 0
    export let ipWhitelists = []
    export let updatedIPAddress = ""

    onMount(() => {
        updatedIPAddress = empty(updatedIPAddress) ? ipWhitelists.find(ip => ip.id == ipID)?.ip_address : updatedIPAddress
    })

    const updateIP = async () => {
        try {
            await updateIPWhitelist(ipID, {
                ip_address: updatedIPAddress
            })

            ipWhitelists = ipWhitelists.map(ip => {
                if (ip.id == ipID) {
                    ip.ip_address = updatedIPAddress
                }
                return ip
            })
            showPopup("ipwhitelist-success")
        } catch (e) {
            showPopup("ipwhitelist-error")
        }
    }

    const cancel = () => {
        hidePopup()
    }
</script>

<Popup name="update-ipwhitelist">
    <div class="flex flex-col items-center rounded-xl gap-5 bg-white shadow-xl w-[480px]">
        <div class="flex flex-col items-center self-stretch gap-4 pt-6 pb-5 px-6 bg-white rounded-t-xl">
            <div class="flex justify-center items-center rounded-[28px] border-8 border-primary-50 bg-primary-100 w-14 h-14 p-3">
                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M18.3337 17.5V15.8333C18.3337 14.2801 17.2713 12.9751 15.8337 12.605M12.917 2.7423C14.1386 3.23679 15.0003 4.43443 15.0003 5.83333C15.0003 7.23224 14.1386 8.42988 12.917 8.92437M14.167 17.5C14.167 15.9469 14.167 15.1703 13.9133 14.5577C13.5749 13.741 12.926 13.092 12.1093 12.7537C11.4967 12.5 10.7201 12.5 9.16699 12.5H6.66699C5.11385 12.5 4.33728 12.5 3.72471 12.7537C2.90795 13.092 2.25904 13.741 1.92073 14.5577C1.66699 15.1703 1.66699 15.9469 1.66699 17.5M11.2503 5.83333C11.2503 7.67428 9.75794 9.16667 7.91699 9.16667C6.07604 9.16667 4.58366 7.67428 4.58366 5.83333C4.58366 3.99238 6.07604 2.5 7.91699 2.5C9.75794 2.5 11.2503 3.99238 11.2503 5.83333Z" stroke="#6D9A16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex flex-col items-center self-stretch gap-1">
                <span class="self-stretch text-center text-gray-900 text-lg font-semibold">Edit {bulk ? "these selected recipients" : "this recipient"} now?</span>
                <span class="self-stretch text-center text-gray-600 text-sm">You will update {bulk ? "these selected recipients" : "this recipient"}</span>
            </div>
        </div>

        <div class="flex flex-col self-stretch flex-1 gap-2 px-6">
            <div class="flex items-center self-stretch flex-1">
                <input bind:value={updatedIPAddress} placeholder={updatedIPAddress} class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-lg outline-none"/>
            </div>
        </div>

        <div class="flex flex-col items-start self-stretch gap-3 p-6 border-t">
            <button disabled={empty(updatedIPAddress)} on:click={updateIP} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {empty(updatedIPAddress) ? "opacity-40" : "opacity-100"}">
                <span class="text-white font-semibold">Save Now</span>
            </button>
            <button on:click={cancel} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Cancel</span>
            </button>
        </div>
    </div>    
</Popup>

<IPWhitelistErrorPopup action="update" />
<IPWhitelistSuccessPopup action="update" />