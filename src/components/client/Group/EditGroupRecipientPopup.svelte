<script>
	import Popup from "../../shared/Popup.svelte"
	import RecipientErrorPopup from "./RecipientErrorPopup.svelte"
	import RecipientSuccessPopup from "./RecipientSuccessPopup.svelte"

	import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { currentClient } from "$lib/helper/store"
    import { showPopup, hidePopup } from "$lib/helper/popup"
    import { setcurrentRouteDisplay } from "$lib/router/router"
    import { updateMessageGroupRecipient } from "../../../api/messageApi"

    export let bulk = false
    export let group = {}
    export let prefixes = []
    export let recipients = {} | []
    export let allRecipients = []

    let updatedNumber = ""
    let updatedAttributes = ""

    let updatedNumberValid = false
    let updatedAttributesValid = false

    let showPrefixes = false
    let selectedPrefix = prefixes[0]

    onMount(() => {
        updatedNumber = ""
        updatedAttributes = ""
        recipients = Array.isArray(recipients) ? recipients : [recipients]
        updatedNumber = recipients[0].number
        updatedAttributes = recipients[0].attributes
        for (let j = 0; j < $currentClient.connections.length; j++) {
            if (updatedNumber.startsWith($currentClient.connections[j].country_code + $currentClient.connections[j].operator_code + "")) {
                updatedNumber = updatedNumber.substring($currentClient.connections[j].country_code.length)
                updatedNumberValid = true
            }
        }
    })

    const togglePrefixes = () => {
        showPrefixes = !showPrefixes
    }

    const setSelectedPrefix = (prefix) => {
        showPrefixes = !showPrefixes
        selectedPrefix = prefix
        validateNumber(updatedNumber)
    }

    const updateSelectedRecipients = async () => {
        recipients = Array.isArray(recipients) ? recipients : [recipients]
        try {
            for (let i = 0; i < recipients.length; i++) {
                recipients[i] = await updateMessageGroupRecipient(recipients[i].id, {
                    message_group_id: group.id,
                    number: updatedNumber + "",
                    attributes: updatedAttributes
                })
                allRecipients = [...allRecipients.map(recipient => {
                    if (recipient.id == recipients[i].id) {
                        recipient.number = recipients[i].number
                        recipient.attributes = recipients[i].attributes
                    }
                    return recipient
                })]
            }

            showPopup("recipient-success")
            await setcurrentRouteDisplay("Home")
            await setcurrentRouteDisplay("Groups")
        } catch (e) {
            showPopup("recipient-error")
        }
    }

    const cancel = () => {
        hidePopup()
    }

    const validateNumber = (number) => {
        updatedNumber = number
        updatedNumberValid = false
        let rightNumber = updatedNumber + ""
        rightNumber = (selectedPrefix == "20" && rightNumber.startsWith("0")) ? rightNumber.substring(1) : rightNumber
        rightNumber = selectedPrefix + rightNumber
        for (let j = 0; j < $currentClient.connections.length; j++) {
            if (rightNumber.startsWith($currentClient.connections[j].country_code + $currentClient.connections[j].operator_code + "")) {
                updatedNumberValid = true
            }
        }
    }

    const validateAttributes = () => {
        updatedAttributesValid = isValidJSON(updatedAttributes) ? true : false
    }
</script>

<Popup name="update-group-recipient">
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

        <div class="flex flex-col self-stretch flex-1 gap-2">
            <div class="flex flex-col self-stretch flex-1 gap-2 px-6">
                <div class="flex items-center self-stretch flex-1">
                    <div class="relative w-14">
                        <button on:click={togglePrefixes} class="flex flex-col items-center justify-center py-[5px] px-1.5 border-y border-l border-l-gray-300 border-y-gray-300 rounded-tl-lg rounded-bl-lg w-full">
                            <span class="text-gray-600 text-center">{selectedPrefix}</span>
                            <svg class=" -my-1.5 stroke-gray-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5 7.5L10 12.5L15 7.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <div class="absolute top-10 bg-white border border-gray-300 rounded-b-lg rounded-tl-lg w-full max-h-28 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out z-[9999] {showPrefixes ? "visible opacity-100" : "invisible opacity-0"}">
                            {#each prefixes as prefix}
                            <button on:click={() => setSelectedPrefix(prefix)} class="flex justify-center items-center my-1 mx-0.5 py-1 px-0.5 rounded-lg hover:bg-primary-50 w-full">
                                <span class="text-gray-600">{prefix}</span>
                            </button>
                            {/each}
                        </div>
                    </div>
                    <input bind:value={updatedNumber} on:input={(e) => validateNumber(e.target.value)} placeholder={updatedNumber} type="number" class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-tr-lg rounded-br-lg outline-none"/>
                </div>
                {#if ! (updatedNumberValid || empty(updatedNumber))}
                <span class="text-sm text-error-700 text-start ps-1">The number is not compatible with any network</span>
                {/if}
            </div>
            <div class="flex flex-col self-stretch flex-1 gap-2 px-6">
                <div class="flex items-center self-stretch flex-1">
                    <input bind:value={updatedAttributes} on:input={validateAttributes} placeholder={updatedAttributes ?? "Enter Attributes in JSON Format"} class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-lg outline-none"/>
                </div>
                {#if ! (updatedAttributesValid || empty(updatedAttributes))}
                <span class="text-sm text-error-700 text-start ps-1">Please enter attributes in json format</span>
                {/if}
            </div>
        </div>

        <div class="flex flex-col items-start self-stretch gap-3 p-6 border-t">
            <button disabled={empty(updatedNumber)} on:click={updateSelectedRecipients} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {empty(updatedNumber) ? "opacity-40" : "opacity-100"}">
                <span class="text-white font-semibold">Save Now</span>
            </button>
            <button on:click={cancel} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Cancel</span>
            </button>
        </div>
    </div>    
</Popup>

<RecipientErrorPopup action="update" />
<RecipientSuccessPopup action="update" />