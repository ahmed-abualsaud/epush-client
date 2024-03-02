<script>
	import Popup from "../../shared/Popup.svelte"
	import NoData from "../../shared/NoData.svelte"
	import AddBalanceModal from "../Billing/AddBalanceModal.svelte"

    import { hidePopup } from "$lib/helper/popup"
    import { showModal } from "$lib/helper/modal"

    const addBalance = () => {
        hidePopup()
        showModal(AddBalanceModal)
    }

    const saveAsDraft = () => {
        hidePopup()
    }
</script>
<Popup name="no-credit">
    <div class="flex flex-col self-stretch flex-1 w-[600px] bg-white rounded-xl">
        <NoData message="You don't have enaugh credit!" description="A new order is required so you can have credit for pushing messages" />
        <div class="flex flex-col items-start self-stretch gap-3 pt-8 pb-6 px-6 border-t">
            <button on:click={addBalance} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.99984 4.1665V15.8332M4.1665 9.99984H15.8332" stroke="#ACDC3F" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-white font-semibold">Add Balance</span>
            </button>
            <button on:click={saveAsDraft} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5.83333 2.5V5.33333C5.83333 5.80004 5.83333 6.0334 5.92416 6.21166C6.00406 6.36846 6.13154 6.49594 6.28834 6.57584C6.4666 6.66667 6.69996 6.66667 7.16667 6.66667H12.8333C13.3 6.66667 13.5334 6.66667 13.7117 6.57584C13.8685 6.49594 13.9959 6.36846 14.0758 6.21166C14.1667 6.0334 14.1667 5.80004 14.1667 5.33333V3.33333M14.1667 17.5V12.1667C14.1667 11.7 14.1667 11.4666 14.0758 11.2883C13.9959 11.1315 13.8685 11.0041 13.7117 10.9242C13.5334 10.8333 13.3 10.8333 12.8333 10.8333H7.16667C6.69996 10.8333 6.4666 10.8333 6.28834 10.9242C6.13154 11.0041 6.00406 11.1315 5.92416 11.2883C5.83333 11.4666 5.83333 11.7 5.83333 12.1667V17.5M17.5 7.77124V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H12.2288C12.6364 2.5 12.8402 2.5 13.0321 2.54605C13.2021 2.58688 13.3647 2.65422 13.5138 2.7456C13.682 2.84867 13.8261 2.9928 14.1144 3.28105L16.719 5.88562C17.0072 6.17387 17.1513 6.318 17.2544 6.48619C17.3458 6.63531 17.4131 6.79789 17.4539 6.96795C17.5 7.15976 17.5 7.36358 17.5 7.77124Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-700 font-semibold">Save as Draft</span>
            </button>
        </div>
    </div>
</Popup>