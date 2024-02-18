<script>
	import Modal from "../../shared/Modal.svelte"
	import CalendarDate from "../../shared/CalendarDate.svelte"
	import CalendarTime from "../../shared/CalendarTime.svelte"
	import MessageUpdateErrorModal from "./MessageUpdateErrorModal.svelte"
	import MessageUpdateSuccessModal from "./MessageUpdateSuccessModal.svelte"

	import { empty } from "$lib/helper/utils"
    import { showPopup } from "$lib/helper/popup"
    import { updateMessage } from "../../../api/messageApi"
    import { showModal, hideModal } from "$lib/helper/modal"
    import { setcurrentRouteDisplay } from "$lib/router/router"

    export let message

    let selectedTime = ""
    let selectedDate = ""
    let scheduleTime = ""

    const applyCalendar = () => {
        showPopup("schedule-calendar-time")
    }

    const showCalendar = () => {
        showPopup("schedule-calendar-date")
    }

    const applyNow = () => {
        scheduleTime = ""
    }

    const setDateTime = async () => {
        scheduleTime = selectedDate + " " + selectedTime
    }

    const saveChanges = async () => {
        if (empty(scheduleTime)) {
            scheduleTime = (new Date()).toISOString().substring(0, 19).replace("T", " ")
        }

        try {
            let result = await updateMessage(message.id, {scheduled_at: scheduleTime})
            if (empty(result)) {
                showModal(MessageUpdateErrorModal)
            } else {
                showModal(MessageUpdateSuccessModal)
                await setcurrentRouteDisplay("Home")
                await setcurrentRouteDisplay("Scheduled Messages")
            }
        } catch (e) {
            showModal(MessageUpdateErrorModal)
        }
    }

    const cancel = () => {
        hideModal()
    }
</script>

<Modal>
    <div class="flex flex-col items-center rounded-xl bg-white shadow-xl w-[480px]">
        <div class="flex flex-col items-center self-stretch gap-4 pt-6 pb-5 px-6 bg-white rounded-t-xl border-b">
            <div class="flex justify-center items-center rounded-[28px] border-8 border-blue-50 bg-blue-100 w-14 h-14 p-3">
                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M22.7 12L20.7005 14L18.7 12M20.9451 13.5C20.9814 13.1717 21 12.838 21 12.5C21 7.52944 16.9706 3.5 12 3.5C7.02944 3.5 3 7.52944 3 12.5C3 17.4706 7.02944 21.5 12 21.5C14.8273 21.5 17.35 20.1963 19 18.1573M12 7.5V12.5L15 14.5" stroke="#1570EF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex flex-col items-center self-stretch gap-1 mb-4">
                <span class="self-stretch text-center text-gray-900 text-lg font-semibold">Change Schedule Time!</span>
                <span class="self-stretch text-center text-gray-600 text-sm">You are one step away from changing<br>schedule time of this message.</span>
            </div>
            <div class="flex flex-col items-start self-stretch flex-1 gap-4">
                <div class="relative flex flex-col items-start gap-1.5 self-stretch">
                    <span class="text-gray-700 text-sm font-medium">Pushing Date and Time</span>        
                
                    <button on:click={showCalendar} class="hide-dropdown flex px-3.5 py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
                        <div class="flex items-center flex-1 gap-2 truncate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M17.5 8.33317H2.5M13.3333 1.6665V4.99984M6.66667 1.6665V4.99984M7.5 13.3332L9.16667 14.9998L12.9167 11.2498M6.5 18.3332H13.5C14.9001 18.3332 15.6002 18.3332 16.135 18.0607C16.6054 17.821 16.9878 17.4386 17.2275 16.9681C17.5 16.4334 17.5 15.7333 17.5 14.3332V7.33317C17.5 5.93304 17.5 5.23297 17.2275 4.69819C16.9878 4.22779 16.6054 3.84534 16.135 3.60565C15.6002 3.33317 14.9001 3.33317 13.5 3.33317H6.5C5.09987 3.33317 4.3998 3.33317 3.86502 3.60565C3.39462 3.84534 3.01217 4.22779 2.77248 4.69819C2.5 5.23297 2.5 5.93304 2.5 7.33317V14.3332C2.5 15.7333 2.5 16.4334 2.77248 16.9681C3.01217 17.4386 3.39462 17.821 3.86502 18.0607C4.3998 18.3332 5.09987 18.3332 6.5 18.3332Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            {#if empty(scheduleTime)}
                            <span class="text-gray-900 font-medium truncate">Immediately</span>
                            {:else}
                            <span class="text-gray-900 font-medium truncate">Scheduling</span>
                            <span class="text-gray-600 truncate">{scheduleTime}</span>
                            {/if}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                {#if empty(scheduleTime)}
                <span class="text-gray-600 text-sm">Immediately: Message will sent after push</span>
                {:else}
                <span class="text-gray-600 text-sm">Scheduling: Message will sent in the date you selected</span>
                {/if}
            </div>
        </div>
        <div class="flex flex-col items-start self-stretch gap-3 pt-8 pb-6 px-6">
            <button on:click={saveChanges} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
                <span class="text-white font-semibold">Save Changes</span>
            </button>
            <button on:click={cancel} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Cancel</span>
            </button>
        </div>
    </div>    
</Modal>

<CalendarTime bind:selectedTime={selectedTime} onSelectTime={setDateTime} />
<CalendarDate bind:selectedDate={selectedDate} onCancelCalendar={applyNow} onApplyCalendar={applyCalendar} />
