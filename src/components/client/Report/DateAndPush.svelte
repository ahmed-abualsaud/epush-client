<script>
	import Message from "./Message.svelte"
	import PushErrorModal from "./PushErrorModal.svelte"
	import AddMessageModal from "./AddMessageModal.svelte"
	import PushSuccessModal from "./PushSuccessModal.svelte"
	import CalendarDate from "../../shared/CalendarDate.svelte"
	import CalendarTime from "../../shared/CalendarTime.svelte"
	import NoEnoughCreditPopup from "./NoEnoughCreditPopup.svelte"

	import { onMount } from "svelte"
	import { empty } from "$lib/helper/utils"
    import { showModal } from "$lib/helper/modal"
    import { showPopup } from "$lib/helper/popup"
    import { addMessage, bulkAddMessages } from "../../../api/messageApi"
    import { message, currentClient, lastOrder } from "$lib/helper/store"

    export let addMethod = ""


    let selectedTime = ""
    let selectedDate = ""
    let enoughCredit = true

    let totalPrice = 0
    let messagePrice = empty($lastOrder?.pricelist?.price) ? 0 : $lastOrder.pricelist.price

    onMount(() => {
        if (empty($message.messageWithAttributes)) {
            totalPrice = ($message.validNumbers.length * ($message.segments?.length ?? 1) * messagePrice).toFixed(2)
        } else {
            totalPrice = ($message.messageWithAttributes.reduce((sum, msg) => sum += msg.segments.length, 0) * messagePrice).toFixed(2)
        }

        if (parseFloat(totalPrice) > parseFloat($currentClient.balance)) {
            showPopup("no-credit")
            enoughCredit = false
        }
    })

    const pushMessage = async () => {
        let result = null
        if (empty($message.scheduleTime)) {
            $message.scheduleTime = (new Date()).toISOString().substring(0, 19).replace("T", " ")
        }

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
                        }))
                    }
                })

                result = await bulkAddMessages({
                    user_id: $currentClient.user_id,
                    sender_id: $message.sender.id,
                    order_id: $lastOrder.id,
                    message_language_id: $message.language.id,
                    length: $message.content.length,
                    scheduled_at: $message.scheduleTime,
                    segments: $message.segments,
                    send_type: $message.sendType,
                    content: {content: $message.content, messages: $message.messageWithAttributes},
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
                        content: $message.content,
                        length: $message.content.length,
                        scheduled_at: $message.scheduleTime,
                        segments: $message.segments,
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
                        content: {content: $message.content, messages: $message.messageWithAttributes},
                        length: $message.content.length,
                        scheduled_at: $message.scheduleTime,
                        segments: $message.segments,
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
                    content: $message.content,
                    length: $message.content.length,
                    scheduled_at: $message.scheduleTime,
                    segments: $message.segments,
                    send_type: $message.sendType,
                    group_recipients: [{
                        name: $message.groupName,
                        user_id: $currentClient.user_id,
                        recipients: $message.validNumbers.map(number => ({number}))
                    }]
                })
            }

            if (empty(result)) {
                window.location.reload()
                showModal(PushErrorModal)
            } else {
                showModal(PushSuccessModal)
            }
        } catch (e) {
            showModal(PushErrorModal)
        }
        
    }

    const back = async () => {
        showModal(Message, {addMethod})
    }

    const applyNow = () => {
        $message.scheduleTime = null
    }

    const applyCalendar = () => {
        showPopup("schedule-calendar-time")
    }

    const showCalendar = () => {
        showPopup("schedule-calendar-date")
    }

    const setDateTime = async () => {
        $message.scheduleTime = selectedDate + " " + selectedTime
    }
</script>

<AddMessageModal currentStep="date-and-push">
    <div class="flex flex-col items-start flex-1 self-stretch gap-5 mb-6">
        <div class="flex items-center self-stretch gap-4 py-3 px-4 rounded-lg border border-purple-200 bg-primary-50">
            <div class="flex items-center flex-1 gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M13 5C13 6.10457 10.5376 7 7.5 7C4.46243 7 2 6.10457 2 5M13 5C13 3.89543 10.5376 3 7.5 3C4.46243 3 2 3.89543 2 5M13 5V9.45715C11.7785 9.82398 11 10.3789 11 11M2 5V17C2 18.1046 4.46243 19 7.5 19C8.82963 19 10.0491 18.8284 11 18.5429V11M2 9C2 10.1046 4.46243 11 7.5 11C8.82963 11 10.0491 10.8284 11 10.5429M2 13C2 14.1046 4.46243 15 7.5 15C8.82963 15 10.0491 14.8284 11 14.5429M22 11C22 12.1046 19.5376 13 16.5 13C13.4624 13 11 12.1046 11 11M22 11C22 9.89543 19.5376 9 16.5 9C13.4624 9 11 9.89543 11 11M22 11V19C22 20.1046 19.5376 21 16.5 21C13.4624 21 11 20.1046 11 19V11M22 15C22 16.1046 19.5376 17 16.5 17C13.4624 17 11 16.1046 11 15" stroke="#6D9A16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-primary-600 font-medium">Total Cost</span>
            </div>
            <span class="text-primary-600 font-semibold">{empty($message.validNumbers) || empty($lastOrder?.pricelist) ? "0.0" : totalPrice} LE</span>
            <div class="flex items-center gap-1 ps-2 pe-2.5 py-0.5 rounded-2xl bg-primary-50 mix-blend-multiply">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <g clip-path="url(#clip0_754_12590)">
                      <path d="M3.75 5.25H3.755M6 5.25H6.005M8.25 5.25H8.255M3.5 9V10.1678C3.5 10.4342 3.5 10.5674 3.55461 10.6358C3.60211 10.6953 3.67413 10.7299 3.75027 10.7298C3.83781 10.7297 3.94184 10.6465 4.14988 10.4801L5.34261 9.52592C5.58626 9.33099 5.70808 9.23353 5.84374 9.16423C5.9641 9.10274 6.09221 9.0578 6.22461 9.03063C6.37383 9 6.52985 9 6.84187 9H8.1C8.94008 9 9.36012 9 9.68099 8.83651C9.96323 8.6927 10.1927 8.46323 10.3365 8.18099C10.5 7.86012 10.5 7.44008 10.5 6.6V3.9C10.5 3.05992 10.5 2.63988 10.3365 2.31901C10.1927 2.03677 9.96323 1.8073 9.68099 1.66349C9.36012 1.5 8.94008 1.5 8.1 1.5H3.9C3.05992 1.5 2.63988 1.5 2.31901 1.66349C2.03677 1.8073 1.8073 2.03677 1.66349 2.31901C1.5 2.63988 1.5 3.05992 1.5 3.9V7C1.5 7.46499 1.5 7.69748 1.55111 7.88823C1.68981 8.40587 2.09413 8.81019 2.61177 8.94889C2.80252 9 3.03501 9 3.5 9ZM4 5.25C4 5.38807 3.88807 5.5 3.75 5.5C3.61193 5.5 3.5 5.38807 3.5 5.25C3.5 5.11193 3.61193 5 3.75 5C3.88807 5 4 5.11193 4 5.25ZM6.25 5.25C6.25 5.38807 6.13807 5.5 6 5.5C5.86193 5.5 5.75 5.38807 5.75 5.25C5.75 5.11193 5.86193 5 6 5C6.13807 5 6.25 5.11193 6.25 5.25ZM8.5 5.25C8.5 5.38807 8.38807 5.5 8.25 5.5C8.11193 5.5 8 5.38807 8 5.25C8 5.11193 8.11193 5 8.25 5C8.38807 5 8.5 5.11193 8.5 5.25Z" stroke="#8DC220" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_754_12590">
                        <rect width="12" height="12" fill="white"/>
                      </clipPath>
                    </defs>
                </svg>
                <span class="text-primary-700 text-sm font-medium">{($message.validNumbers?.length ?? 0) * $message.segments.length} Message</span>
            </div>
            <div class="flex items-center gap-1 ps-2 pe-2.5 py-0.5 rounded-2xl bg-primary-50 mix-blend-multiply">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <g clip-path="url(#clip0_754_12595)">
                      <path d="M5.05051 2C5.68178 1.38141 6.54635 1 7.5 1C9.433 1 11 2.567 11 4.5C11 5.45367 10.6186 6.31825 9.99997 6.94952M3.75 6.5L4.5 6V8.75M3.75 8.75H5.25M8 7.5C8 9.433 6.433 11 4.5 11C2.567 11 1 9.433 1 7.5C1 5.567 2.567 4 4.5 4C6.433 4 8 5.567 8 7.5Z" stroke="#8DC220" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_754_12595">
                        <rect width="12" height="12" fill="white"/>
                      </clipPath>
                    </defs>
                </svg>
                <span class="text-primary-700 text-sm font-medium">
                    {#if empty($lastOrder.pricelist?.price)}
                        <span class="text-error-700">Price Unknown</span>
                    {:else}
                        {$lastOrder.pricelist?.price} per message
                    {/if}
                </span>
            </div>
        </div>

        <div class="flex flex-col items-start self-stretch flex-1 gap-4">
            <div class="relative flex flex-col items-start gap-1.5 self-stretch">
                <span class="text-gray-700 text-sm font-medium">Pushing Date and Time</span>        
            
                <button on:click={showCalendar} class="hide-dropdown flex px-3.5 py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
                    <div class="flex items-center flex-1 gap-2 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M17.5 8.33317H2.5M13.3333 1.6665V4.99984M6.66667 1.6665V4.99984M7.5 13.3332L9.16667 14.9998L12.9167 11.2498M6.5 18.3332H13.5C14.9001 18.3332 15.6002 18.3332 16.135 18.0607C16.6054 17.821 16.9878 17.4386 17.2275 16.9681C17.5 16.4334 17.5 15.7333 17.5 14.3332V7.33317C17.5 5.93304 17.5 5.23297 17.2275 4.69819C16.9878 4.22779 16.6054 3.84534 16.135 3.60565C15.6002 3.33317 14.9001 3.33317 13.5 3.33317H6.5C5.09987 3.33317 4.3998 3.33317 3.86502 3.60565C3.39462 3.84534 3.01217 4.22779 2.77248 4.69819C2.5 5.23297 2.5 5.93304 2.5 7.33317V14.3332C2.5 15.7333 2.5 16.4334 2.77248 16.9681C3.01217 17.4386 3.39462 17.821 3.86502 18.0607C4.3998 18.3332 5.09987 18.3332 6.5 18.3332Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {#if empty($message.scheduleTime)}
                        <span class="text-gray-900 font-medium truncate">Immediately</span>
                        {:else}
                        <span class="text-gray-900 font-medium truncate">Scheduling</span>
                        <span class="text-gray-600 truncate">{$message.scheduleTime}</span>
                        {/if}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            {#if empty($message.scheduleTime)}
            <span class="text-gray-600 text-sm">Immediately: Message will sent after push</span>
            {:else}
            <span class="text-gray-600 text-sm">Scheduling: Message will sent in the date you selected</span>
            {/if}
        </div>
    </div>    

    <div slot="footer" class="flex items-center self-stretch gap-12 pb-6 px-6">
        <button class="flex justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.83333 2.5V5.33333C5.83333 5.80004 5.83333 6.0334 5.92416 6.21166C6.00406 6.36846 6.13154 6.49594 6.28834 6.57584C6.4666 6.66667 6.69996 6.66667 7.16667 6.66667H12.8333C13.3 6.66667 13.5334 6.66667 13.7117 6.57584C13.8685 6.49594 13.9959 6.36846 14.0758 6.21166C14.1667 6.0334 14.1667 5.80004 14.1667 5.33333V3.33333M14.1667 17.5V12.1667C14.1667 11.7 14.1667 11.4666 14.0758 11.2883C13.9959 11.1315 13.8685 11.0041 13.7117 10.9242C13.5334 10.8333 13.3 10.8333 12.8333 10.8333H7.16667C6.69996 10.8333 6.4666 10.8333 6.28834 10.9242C6.13154 11.0041 6.00406 11.1315 5.92416 11.2883C5.83333 11.4666 5.83333 11.7 5.83333 12.1667V17.5M17.5 7.77124V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H12.2288C12.6364 2.5 12.8402 2.5 13.0321 2.54605C13.2021 2.58688 13.3647 2.65422 13.5138 2.7456C13.682 2.84867 13.8261 2.9928 14.1144 3.28105L16.719 5.88562C17.0072 6.17387 17.1513 6.318 17.2544 6.48619C17.3458 6.63531 17.4131 6.79789 17.4539 6.96795C17.5 7.15976 17.5 7.36358 17.5 7.77124Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-600 font-semibold">Save as draft</span>
        </button>
        <div class="flex justify-end items-center flex-1 gap-3">
            <button on:click={back} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Back</span>
            </button>
            <button disabled={! enoughCredit} on:click={pushMessage} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {enoughCredit ? "opacity-100" : "opacity-40"}">
                <span class="text-white font-semibold">Push Message</span>
            </button>
        </div>
    </div>
</AddMessageModal>

<CalendarTime bind:selectedTime={selectedTime} onSelectTime={setDateTime} />
<CalendarDate bind:selectedDate={selectedDate} onCancelCalendar={applyNow} onApplyCalendar={applyCalendar} />
<NoEnoughCreditPopup />