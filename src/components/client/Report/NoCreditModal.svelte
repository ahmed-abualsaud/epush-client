<script>
	import NoData from "../../shared/NoData.svelte"
	import AddMessageModal from "./AddMessageModal.svelte"
	import AddBalanceModal from "../Billing/AddBalanceModal.svelte"

    import { showModal } from "$lib/helper/modal"


    const addBalance = async () => {
        showModal(AddBalanceModal)
    }
</script>

<AddMessageModal>
    <NoData message="You don't have enaugh credit!" description="A new order is required so you can have credit for pushing messages" />
    <div slot="footer" class="flex justify-end items-center flex-1 self-stretch pb-6 px-6">
        <button on:click={addBalance} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9.99984 4.1665V15.8332M4.1665 9.99984H15.8332" stroke="#ACDC3F" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-white font-semibold">Add Balance</span>
        </button>
    </div>
</AddMessageModal>