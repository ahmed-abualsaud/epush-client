<script>
	import Modal from "../../shared/Modal.svelte"
	import AddGroupModal from "./AddGroupModal.svelte"

    import { empty } from "$lib/helper/utils"
    import { ucFirst } from "$lib/helper/strUtils"
    import { currentClient } from "$lib/helper/store"
    import { exportExcel } from "../../../api/fileApi"
    import { handleImageError } from "$lib/helper/image"
    import { showModal, hideModal } from "$lib/helper/modal"
    import { beautifulToSnakeCase } from "$lib/helper/strUtils"

    export let action = "save"
    export let validNumbers = []
	export let invalidNumbers = []
    export let uniqueClientConnection = []

    const exportValidNumbers = async () => {
        exportExcel(["phone"], validNumbers.map(phone => [phone]))
    }

    const exportInvalidNumbers = async () => {
        exportExcel(["phone"], invalidNumbers.map(phone => [phone]))
    }

    const okay = () => {
        hideModal()
    }

    const addNewGroup = () => {
        showModal(AddGroupModal)
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
                    <span class="self-stretch text-gray-900 text-center text-lg font-semibold">Group {ucFirst(action)} Successful!</span>
                    {#if action == "save"}
                        <span class="self-stretch text-gray-600 text-center text-sm">Your new group has been saved successfully.</span>
                    {:else if action == "update"}
                        <span class="self-stretch text-gray-600 text-center text-sm">Your group changes has been applied and saved successfully.</span>                
                    {:else}
                        <span class="self-stretch text-gray-600 text-center text-sm">Your group has been deleted successfully.</span>
                    {/if}
                </div>
                {#if action == "save"}
                <div class="flex items-center gap-2">
                    {#each uniqueClientConnection as conn}
                    <div class="items-center gap-1.5 py-1 pe-3 ps-1.5 rounded-2xl bg-gray-100 {empty($currentClient.connections.find(c => c.operator_name == conn.operator_name).numbers) ? "hidden" : "flex"}">
                        <img on:error={handleImageError} alt="" src="image/operators/{beautifulToSnakeCase(conn.operator_name)}.png" />
                        <span class="text-gray-700 text-center text-sm font-medium">
                            {$currentClient.connections.find(c => c.operator_name == conn.operator_name)?.numbers?.length ?? 0}
                        </span>
                    </div>
                    {/each}
                </div>
                {/if}
            </div>
            {#if action == "save"}
            <div class="flex justify-center items-start self-stretch gap-3">
                <div class="flex flex-col items-start self-stretch flex-1 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div class="flex flex-col items-start self-stretch gap-2 p-4">
                        <div class="flex justify-center items-center w-8 h-8 p-2 rounded-[28px] border-4 border-success-50 bg-success-100">
                            <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#039855" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="flex flex-col items-start self-stretch">
                            <span class="self-stretch text-gray-600 text-sm">Valid Numbers</span>
                            <span class="flex-1 text-gray-900 text-lg font-semibold">{validNumbers.length}</span>
                        </div>
                    </div>
                    <button on:click={exportValidNumbers} class="flex flex-col justify-center items-center self-stretch gap-4 py-4 px-6 border-t border-t-gray-200">
                        <span class="text-primary-700 text-sm font-semibold">Download</span>
                    </button>
                </div>
                <div class="flex flex-col items-start self-stretch flex-1 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div class="flex flex-col items-start self-stretch gap-2 p-4">
                        <div class="flex justify-center items-center w-8 h-8 p-2 rounded-[28px] border-4 border-error-50 bg-error-100">
                            <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M11.3337 4.6665L4.66699 11.3332M4.66699 4.6665L11.3337 11.3332" stroke="#D92D20" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="flex flex-col items-start self-stretch">
                            <span class="self-stretch text-gray-600 text-sm">Wrong Numbers</span>
                            <span class="flex-1 text-gray-900 text-lg font-semibold">{invalidNumbers.length}</span>
                        </div>
                    </div>
                    <button on:click={exportInvalidNumbers} disabled={empty(invalidNumbers)} class="flex flex-col justify-center items-center self-stretch gap-4 py-4 px-6 border-t border-t-gray-200">
                        <span class="text-primary-700 text-sm font-semibold {empty(invalidNumbers) ? "opacity-20" : "opacity-100"}">Download</span>
                    </button>
                </div>
            </div>
            {/if}
        </div>

    </div>
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="1" viewBox="0 0 400 1" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M400 1H0V0H400V1Z" fill="#EAECF0"/>
    </svg>
    <div class="flex flex-col items-start self-stretch gap-3 pt-8 pb-6 px-6">
        <button on:click={okay} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
            <span class="text-white font-semibold">Okay</span>
        </button>
        {#if action == "save"}
        <button on:click={addNewGroup} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
            <span class="text-gray-700 font-semibold">Add New Group</span>
        </button>
        {/if}
    </div>
</div>
</Modal>
