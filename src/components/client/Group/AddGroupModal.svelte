<script>
	import Modal from "../../shared/Modal.svelte"
	import GroupErrorModal from "./GroupErrorModal.svelte"
	import GroupSuccessModal from "./GroupSuccessModal.svelte"
	import FromFileRecipients from "./FromFileRecipients.svelte"
	import BulkNumbersRecipients from "./BulkNumbersRecipients.svelte"
	import ExtendedFormRecipients from "./ExtendedFormRecipients.svelte"

	import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { currentClient } from "$lib/helper/store"
    import { handleImageError } from "$lib/helper/image"
    import { makeArrayUnique } from "$lib/helper/arrUtils"
    import { showModal, hideModal } from "$lib/helper/modal"
	import { addMessageGroup } from "../../../api/messageApi"
    import { beautifulToSnakeCase } from "$lib/helper/strUtils"
    import { setcurrentRouteDisplay } from "$lib/router/router"


    let showErrors = false

    let groupName = ""
    let uploadMethod = "bulk-numbers"

    let validNumbers = []
    let invalidNumbers = []
    let numbersAttributes = []
    let uniqueClientConnection = []

    onMount(async () => {
        uniqueClientConnection = makeArrayUnique($currentClient.connections, "operator_name")
    })

    const setUploadMethod = (uploadMtod) => {
        uploadMethod = uploadMtod
    }

    const saveGroup = async () => {
        showErrors = true
        if (empty(groupName)) return
        let indexOfPhone = numbersAttributes.indexOf("phone")
        let recipients = [...new Set($currentClient.connections.map(conn => conn.numbers).flat())].map(num => num.split(/,\s*/))

        if (recipients[0].length == 1 && indexOfPhone <= -1) {
            indexOfPhone = 0
            numbersAttributes = ["phone"]
        }

        recipients = recipients.map(recipient => {
            return {
                number: recipient[indexOfPhone],
                attributes: JSON.stringify(numbersAttributes.map((key, index) => {
                    return { name: key, value: recipient[index] }
                }))
            }
        })

        try {
            let result = await addMessageGroup({
                user_id: $currentClient.id,
                name: groupName,
                saved: true,
                number_of_recipients: recipients.length,
                recipients: recipients
            })

            if (empty(result)) {
                showModal(GroupErrorModal)
            } else {
                showModal(GroupSuccessModal, {validNumbers, invalidNumbers, uniqueClientConnection})
                await setcurrentRouteDisplay("Home")
                await setcurrentRouteDisplay("Groups")
            }
        } catch (e) {
            showModal(GroupErrorModal)
        }
    }
</script>

<Modal>
    <div class="flex flex-col items-center gap-5 rounded-xl bg-white shadow-xl w-[800px] h-[800px]">
        <div class="flex flex-col items-start self-stretch gap-4 pt-6 px-6 bg-white rounded-t-xl mb-3">
            <div class="flex justify-center items-center p-3 w-12 h-12 rounded-[10px] border border-gray-200 bg-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M19 21V15M16 18H22M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex flex-col items-start flex-1 gap-1">
                <span class="self-stretch text-gray-900 text-lg font-semibold">New Group</span>
                <span class="self-stretch text-gray-600 text-sm">Add new group to your saved groups</span>
            </div>
        </div>

        <div class="flex flex-col items-start px-6 gap-1.5 self-stretch">
            <span class="text-gray-700 text-sm font-medium">Group Name</span>
            <div class="flex justify-between items-center flex-1 gap-2 py-2 px-3 border border-gray-300 self-stretch rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M18.3332 17.5V15.8333C18.3332 14.2801 17.2709 12.9751 15.8332 12.605M12.9165 2.7423C14.1381 3.23679 14.9998 4.43443 14.9998 5.83333C14.9998 7.23224 14.1381 8.42988 12.9165 8.92437M14.1665 17.5C14.1665 15.9469 14.1665 15.1703 13.9128 14.5577C13.5745 13.741 12.9255 13.092 12.1088 12.7537C11.4962 12.5 10.7196 12.5 9.1665 12.5H6.6665C5.11337 12.5 4.3368 12.5 3.72423 12.7537C2.90747 13.092 2.25855 13.741 1.92024 14.5577C1.6665 15.1703 1.6665 15.9469 1.6665 17.5M11.2498 5.83333C11.2498 7.67428 9.75745 9.16667 7.9165 9.16667C6.07555 9.16667 4.58317 7.67428 4.58317 5.83333C4.58317 3.99238 6.07555 2.5 7.9165 2.5C9.75745 2.5 11.2498 3.99238 11.2498 5.83333Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input bind:value={groupName} class="placeholder:text-gray-400 outline-none w-full" placeholder="Enter Group Name" />
            </div>
            {#if showErrors && empty(groupName)}
                <div class="self-stretch text-error-500">Please enter a group name</div>
            {/if} 
        </div>

        <div class="flex flex-col items-start self-stretch flex-1 gap-5 px-6">
            <div class="flex items-start self-stretch gap-4 border-b">
                <!-- <button on:click={() => setUploadMethod("extended-form")} class="flex justify-center items-center gap-2 p-3 {uploadMethod == "extended-form" && "border-b-2 border-b-primary-700 bg-primary-50"}">
                    <i class="fa-regular fa-arrow-down-big-small {uploadMethod == "extended-form" ? "text-[#527615]" : "text-[#667085]"}"></i>
                    <span class="{uploadMethod == "extended-form" ? "text-primary-700" : "text-gray-500"} text-sm font-medium">Extended Form</span>
                </button> -->

                <button on:click={() => setUploadMethod("bulk-numbers")} class="flex justify-center items-center gap-2 p-3 {uploadMethod == "bulk-numbers" && "border-b-2 border-b-primary-700 bg-primary-50"}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10.8332 5.83333H4.33317C3.39975 5.83333 2.93304 5.83333 2.57652 6.01499C2.26292 6.17478 2.00795 6.42975 1.84816 6.74335C1.6665 7.09987 1.6665 7.56658 1.6665 8.5V11.5C1.6665 12.4334 1.6665 12.9001 1.84816 13.2567C2.00795 13.5703 2.26292 13.8252 2.57652 13.985C2.93304 14.1667 3.39975 14.1667 4.33317 14.1667H10.8332M14.1665 5.83333H15.6665C16.5999 5.83333 17.0666 5.83333 17.4232 6.01499C17.7368 6.17478 17.9917 6.42975 18.1515 6.74335C18.3332 7.09987 18.3332 7.56658 18.3332 8.5V11.5C18.3332 12.4334 18.3332 12.9001 18.1515 13.2567C17.9917 13.5703 17.7368 13.8252 17.4232 13.985C17.0666 14.1667 16.5999 14.1667 15.6665 14.1667H14.1665M14.1665 17.5L14.1665 2.5M16.2498 2.50001L12.0832 2.5M16.2498 17.5L12.0832 17.5" stroke={uploadMethod == "bulk-numbers" ? "#527615" : "#667085"} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="{uploadMethod == "bulk-numbers" ? "text-primary-700" : "text-gray-500"} font-medium">Bulk Numbers</span>
                </button>

                <button on:click={() => setUploadMethod("from-file")} class="flex justify-center items-center gap-2 p-3 {uploadMethod == "from-file" && "border-b-2 border-b-primary-700 bg-primary-50"}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10.0002 11.6665V7.08317C10.0002 6.39281 10.5598 5.83317 11.2502 5.83317C11.9405 5.83317 12.5002 6.39281 12.5002 7.08317V11.6665C12.5002 13.0472 11.3809 14.1665 10.0002 14.1665C8.61945 14.1665 7.50016 13.0472 7.50016 11.6665V8.33317M7.3335 18.3332H12.6668C14.067 18.3332 14.767 18.3332 15.3018 18.0607C15.7722 17.821 16.1547 17.4386 16.3943 16.9681C16.6668 16.4334 16.6668 15.7333 16.6668 14.3332V5.6665C16.6668 4.26637 16.6668 3.56631 16.3943 3.03153C16.1547 2.56112 15.7722 2.17867 15.3018 1.93899C14.767 1.6665 14.067 1.6665 12.6668 1.6665H7.3335C5.93336 1.6665 5.2333 1.6665 4.69852 1.93899C4.22811 2.17867 3.84566 2.56112 3.60598 3.03153C3.3335 3.56631 3.3335 4.26637 3.3335 5.6665V14.3332C3.3335 15.7333 3.3335 16.4334 3.60598 16.9681C3.84566 17.4386 4.22811 17.821 4.69852 18.0607C5.2333 18.3332 5.93336 18.3332 7.3335 18.3332Z" stroke={uploadMethod == "from-file" ? "#527615" : "#667085"} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="{uploadMethod == "from-file" ? "text-primary-700" : "text-gray-500"} font-medium">From File</span>
                </button>
            </div>

            <div class="flex flex-col items-start flex-1 self-stretch gap-4">
            {#if uploadMethod == "extended-form"}
                <ExtendedFormRecipients bind:validNumbers={validNumbers} bind:invalidNumbers={invalidNumbers} bind:numbersAttributes={numbersAttributes} />
            {/if}

            {#if uploadMethod == "bulk-numbers"}
                <BulkNumbersRecipients bind:validNumbers={validNumbers} bind:invalidNumbers={invalidNumbers} bind:numbersAttributes={numbersAttributes} />
            {/if}

            {#if uploadMethod == "from-file"}
                <FromFileRecipients bind:validNumbers={validNumbers} bind:invalidNumbers={invalidNumbers} bind:numbersAttributes={numbersAttributes} />
            {/if}
            </div>

            <div class="flex items-center flex-wrap gap-2">
                {#each uniqueClientConnection as conn}
                <div class="flex items-center gap-1.5 py-1 pe-3 ps-1.5 rounded-2xl bg-gray-100 {empty($currentClient.connections.find(c => c.operator_name == conn.operator_name).numbers) ? "mix-blend-luminosity opacity-[0.4]" : "mix-blend-multiply opacity-100"}">
                    <img on:error={handleImageError} alt="" src="image/operators/{beautifulToSnakeCase(conn.operator_name)}.png" />
                    <span class="text-gray-700 text-center text-sm font-medium">
                        {conn.operator_name} {$currentClient.connections.find(c => c.operator_name == conn.operator_name)?.numbers?.length ?? 0}
                    </span>
                </div>
                {/each}
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="13" viewBox="0 0 2 13" fill="none">
                    <path d="M1.5 1C1.5 0.723858 1.27614 0.5 1 0.5C0.723858 0.5 0.5 0.723858 0.5 1L1.5 1ZM0.5 1L0.499999 13L1.5 13L1.5 1L0.5 1Z" fill="#EAECF0"/>
                </svg>
                <div class="flex items-center gap-1.5 ps-2.5 pe-3 py-1 rounded-2xl bg-success-50 {validNumbers.length == 0 ? "mix-blend-luminosity opacity-[0.4]" : "mix-blend-multiply opacity-100"}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <circle cx="4" cy="4" r="3" fill="#12B76A"/>
                    </svg>
                    <span class="text-success-700 text-center text-sm font-medium">Valid {validNumbers.length}</span>
                </div>
                <div class="flex items-center gap-1.5 ps-2.5 pe-3 py-1 rounded-2xl bg-error-50 {invalidNumbers.length == 0 ? "mix-blend-luminosity opacity-[0.4]" : "mix-blend-multiply opacity-100"}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <circle cx="4" cy="4" r="3" fill="#F04438"/>
                    </svg>
                    <span class="text-error-700 text-center text-sm font-medium">Wrong {invalidNumbers.length}</span>
                </div>
            </div>
        </div>

        <div class="flex justify-end items-center self-stretch gap-3 p-6 border-t mt-6">
            <button on:click={hideModal} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Close</span>
            </button>
            <button disabled={empty(validNumbers)} on:click={saveGroup} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {empty(validNumbers) ? "opacity-40" : "opacity-100"}">
                <span class="text-white font-semibold">Save Group</span>
            </button>
        </div>
    </div>
</Modal>