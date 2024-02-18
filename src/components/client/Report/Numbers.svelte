<script>
    import Message from "./Message.svelte"
	import AddMessageModal from "./AddMessageModal.svelte"
	import UploadRecipients from "../Recipient/Upload.svelte"
	import LanguageAndSender from "./LanguageAndSender.svelte"

	import { empty } from "$lib/helper/utils"
    import { showModal } from "$lib/helper/modal"
    import { successAlert, errorAlert } from "$lib/helper/alert"
    import { addMessage, bulkAddMessages } from "../../../api/messageApi"
    import { message, currentClient, lastOrder } from "$lib/helper/store"

    export let addMethod = ""

    const nextStep = () => {
        showModal(Message, {addMethod})
    }

    const back = async () => {
        showModal(LanguageAndSender, {addMethod})
    }

    const saveAsDraft = async () => {
        try {
            if ($message.sendType == "Custom with Parameters") {
                let attributes = []
                let indexOfPhone = $message.numbersAttributes.indexOf("phone")
                $message.connections.forEach(conn => {
                    attributes = [...attributes, conn.numbers.map(num => num.split(/,\s*/))]
                })

                attributes = [...new Set(attributes.flat().map(attr => JSON.stringify(attr)))].map((attr) => JSON.parse(attr))
                attributes = attributes.map(attr => {
                    return {
                        number: attr[indexOfPhone],
                        attributes: JSON.stringify($message.numbersAttributes.map((key, index) => {
                            return { name: key, value: attr[index] }
                        }))}
                })

                result = await bulkAddMessages({
                    user_id: $currentClient.user_id,
                    sender_id: $message.sender.id,
                    order_id: $lastOrder.id,
                    message_language_id: $message.language.id,
                    send_type: $message.sendType,
                    group_recipients: [{
                        name: $message.groupName,
                        user_id: $currentClient.user_id,
                        recipients: attributes
                    }]
                })

            } else if ($message.sendType == "Group SMS") {
                if (empty($message.messageWithAttributes)) {
                    result = await addMessage({
                        user_id: $currentClient.user_id,
                        sender_id: $message.sender.id,
                        order_id: $lastOrder.id,
                        message_language_id: $message.language.id,
                        send_type: $message.sendType,
                        group_recipients: $message.selectedGroups.map(group => {
                            return {
                                name: group.name,
                                user_id: $currentClient.user_id,
                                recipients: group.recipients
                            }
                        })
                    })
                } else {
                    result = await bulkAddMessages({
                        user_id: $currentClient.user_id,
                        sender_id: $message.sender.id,
                        order_id: $lastOrder.id,
                        message_language_id: $message.language.id,
                        send_type: $message.sendType,
                        group_recipients: $message.selectedGroups.map(group => {
                            return {
                                name: group.name,
                                user_id: $currentClient.user_id,
                                recipients: group.recipients
                            }
                        })
                    })
                }

            } else {
                result = await addMessage({
                    user_id: $currentClient.user_id,
                    sender_id: $message.sender.id,
                    order_id: $lastOrder.id,
                    message_language_id: $message.language.id,
                    send_type: $message.sendType,
                    group_recipients: [{
                        name: $message.groupName,
                        user_id: $currentClient.user_id,
                        recipients: $message.validNumbers.map(number => ({number}))
                    }]
                })
            }

            if (empty(result)) {
                errorAlert("Faild to save the message as draft", 15)
            } else {
                successAlert("Message saved successfully as draft", 15)
            }
        } catch (e) {
            errorAlert("Faild to save the message as draft", 15)
        }
    }
</script>

<AddMessageModal currentStep="numbers">

    <UploadRecipients {addMethod}/>

    <div slot="footer" class="flex items-center self-stretch gap-12 pb-6 px-6">
        <button on:click={saveAsDraft} class="flex justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.83333 2.5V5.33333C5.83333 5.80004 5.83333 6.0334 5.92416 6.21166C6.00406 6.36846 6.13154 6.49594 6.28834 6.57584C6.4666 6.66667 6.69996 6.66667 7.16667 6.66667H12.8333C13.3 6.66667 13.5334 6.66667 13.7117 6.57584C13.8685 6.49594 13.9959 6.36846 14.0758 6.21166C14.1667 6.0334 14.1667 5.80004 14.1667 5.33333V3.33333M14.1667 17.5V12.1667C14.1667 11.7 14.1667 11.4666 14.0758 11.2883C13.9959 11.1315 13.8685 11.0041 13.7117 10.9242C13.5334 10.8333 13.3 10.8333 12.8333 10.8333H7.16667C6.69996 10.8333 6.4666 10.8333 6.28834 10.9242C6.13154 11.0041 6.00406 11.1315 5.92416 11.2883C5.83333 11.4666 5.83333 11.7 5.83333 12.1667V17.5M17.5 7.77124V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H12.2288C12.6364 2.5 12.8402 2.5 13.0321 2.54605C13.2021 2.58688 13.3647 2.65422 13.5138 2.7456C13.682 2.84867 13.8261 2.9928 14.1144 3.28105L16.719 5.88562C17.0072 6.17387 17.1513 6.318 17.2544 6.48619C17.3458 6.63531 17.4131 6.79789 17.4539 6.96795C17.5 7.15976 17.5 7.36358 17.5 7.77124Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-600 font-semibold">Save as draft</span>
        </button>
        <div class="flex justify-end items-center flex-1 gap-3">
            <button on:click={back} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Back</span>
            </button>
            <button disabled={empty($message.validNumbers)} on:click={nextStep} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {empty($message.validNumbers) ? "opacity-20" : "opacity-100"}">
                <span class="text-white font-semibold">Next Step</span>
            </button>
        </div>
    </div>
</AddMessageModal>