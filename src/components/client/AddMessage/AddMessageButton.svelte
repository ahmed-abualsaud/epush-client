<script>
	import AddMessageIndex from "./AddMessageIndex.svelte"

	import { empty } from "$lib/helper/utils"
    import { showModal } from "$lib/helper/modal"
    import { currentClient, lastOrder } from "$lib/helper/store"

    let buttonClicked = false
    const expandAddMessage = () => {
        buttonClicked = ! buttonClicked
    }

    const addBulkMessages = () => {
        buttonClicked = ! buttonClicked
        showAddMessageModal("add-bulk-message:language-and-sender")
    }

    const addCustomMessages = () => {
        buttonClicked = ! buttonClicked
        showAddMessageModal("add-custom-message:language-and-sender")

    }

    const addCustomWithParameters = () => {
        buttonClicked = ! buttonClicked
        showAddMessageModal("add-custom-with-parameters:language-and-sender")
    }

    const addGroupSms = () => {
        buttonClicked = ! buttonClicked
        showAddMessageModal("add-group-sms:language-and-sender")
    }

    const showAddMessageModal = (modalName) => {
        if (empty($lastOrder)) {
            showModal("no-orders")
        } else if (empty($currentClient) || $currentClient?.balance == 0) {
            showModal("no-credit")
        } else {
            showModal(modalName)
        }
    }
</script>

<div>
    <div class="flex items-center gap-[1px]">
        <button on:click={() => showAddMessageModal("add-bulk-message:language-and-sender")} class="flex justify-center items-center gap-2 py-2.5 px-2.5 sm:px-4 rounded-l-lg border border-primary-600 bg-primary-600 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 11.25V6.25M7.5 8.75H12.5M5.83333 15V16.9463C5.83333 17.3903 5.83333 17.6123 5.92436 17.7263C6.00352 17.8255 6.12356 17.8832 6.25045 17.8831C6.39636 17.8829 6.56973 17.7442 6.91646 17.4668L8.90434 15.8765C9.31043 15.5517 9.51347 15.3892 9.73957 15.2737C9.94017 15.1712 10.1537 15.0963 10.3743 15.051C10.6231 15 10.8831 15 11.4031 15H13.5C14.9001 15 15.6002 15 16.135 14.7275C16.6054 14.4878 16.9878 14.1054 17.2275 13.635C17.5 13.1002 17.5 12.4001 17.5 11V6.5C17.5 5.09987 17.5 4.3998 17.2275 3.86502C16.9878 3.39462 16.6054 3.01217 16.135 2.77248C15.6002 2.5 14.9001 2.5 13.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V11.6667C2.5 12.4416 2.5 12.8291 2.58519 13.147C2.81635 14.0098 3.49022 14.6836 4.35295 14.9148C4.67087 15 5.05836 15 5.83333 15Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="hidden xs:inline-block text-2xs sm:text-sm font-normal md:font-semibold text-white">Send Message</span>
        </button>
        <button on:click={expandAddMessage} class="flex justify-center items-center gap-2 p-2.5 rounded-r-lg border {buttonClicked ? 'border-primary-50 bg-primary-50' : 'border-primary-600 bg-primary-600'} shadow-md">
            {#if ! buttonClicked}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {/if}
            {#if buttonClicked}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 12.5L10 7.5L5 12.5" stroke="#6D9A16" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {/if}
        </button>
    </div>
    {#if buttonClicked}
    <div class="flex w-[201px] flex-col items-start absolute right-[136px] top-[84px] rounded-lg border border-gray-200 bg-white shadow-lg z-50">
        <div class="flex flex-col items-start self-stretch py-1 px-0 border-b border-b-gray-200">
            <button on:click={addBulkMessages} class="flex items-center self-stretch py-0.5 px-1.5">
                <div class="flex items-center flex-1 gap-3 py-[9px] px-2.5 rounded-md hover:bg-primary-50">
                    <div class="flex items-center flex-1 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8.66634 4.66667H3.46634C2.7196 4.66667 2.34624 4.66667 2.06102 4.81199C1.81014 4.93982 1.60616 5.1438 1.47833 5.39468C1.33301 5.67989 1.33301 6.05326 1.33301 6.8V9.2C1.33301 9.94674 1.33301 10.3201 1.47833 10.6053C1.60616 10.8562 1.81014 11.0602 2.06102 11.188C2.34624 11.3333 2.7196 11.3333 3.46634 11.3333H8.66634M11.333 4.66667H12.533C13.2797 4.66667 13.6531 4.66667 13.9383 4.81199C14.1892 4.93982 14.3932 5.1438 14.521 5.39468C14.6663 5.67989 14.6663 6.05326 14.6663 6.8V9.2C14.6663 9.94674 14.6663 10.3201 14.521 10.6053C14.3932 10.8562 14.1892 11.0602 13.9383 11.188C13.6531 11.3333 13.2797 11.3333 12.533 11.3333H11.333M11.333 14L11.333 2M12.9997 2.00001L9.66634 2M12.9997 14L9.66634 14" stroke="#6D9A16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="flex-1 text-start text-gray-700 text-sm font-medium">Bulk Messages</span>
                    </div>
                </div>
            </button>
            <button on:click={addCustomMessages} class="flex items-center self-stretch py-0.5 px-1.5">
                <div class="flex items-center flex-1 gap-3 py-[9px] px-2.5 rounded-md hover:bg-primary-50">
                    <div class="flex items-center flex-1 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8.00033 9.33325V5.66659C8.00033 5.1143 8.44804 4.66659 9.00033 4.66659C9.55261 4.66659 10.0003 5.1143 10.0003 5.66659V9.33325C10.0003 10.4378 9.10489 11.3333 8.00033 11.3333C6.89576 11.3333 6.00033 10.4378 6.00033 9.33325V6.66659M5.86699 14.6666H10.1337C11.2538 14.6666 11.8138 14.6666 12.2416 14.4486C12.618 14.2569 12.9239 13.9509 13.1157 13.5746C13.3337 13.1467 13.3337 12.5867 13.3337 11.4666V4.53325C13.3337 3.41315 13.3337 2.85309 13.1157 2.42527C12.9239 2.04895 12.618 1.74299 12.2416 1.55124C11.8138 1.33325 11.2538 1.33325 10.1337 1.33325H5.86699C4.74689 1.33325 4.18683 1.33325 3.75901 1.55124C3.38269 1.74299 3.07673 2.04895 2.88498 2.42527C2.66699 2.85309 2.66699 3.41315 2.66699 4.53325V11.4666C2.66699 12.5867 2.66699 13.1467 2.88498 13.5746C3.07673 13.9509 3.38269 14.2569 3.75901 14.4486C4.18683 14.6666 4.74689 14.6666 5.86699 14.6666Z" stroke="#6D9A16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="flex-1 text-start text-gray-700 text-sm font-medium">Custom Messages</span>
                    </div>
                </div>
            </button>
            <button on:click={addCustomWithParameters} class="flex items-center self-stretch py-0.5 px-1.5 over">
                <div class="flex items-center flex-1 gap-3 py-[9px] px-2.5 rounded-md truncate hover:bg-primary-50">
                    <div class="flex items-center flex-1 gap-2 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10.667 2.66659C11.287 2.66659 11.597 2.66659 11.8513 2.73473C12.5415 2.91967 13.0806 3.45876 13.2655 4.14895C13.3337 4.40328 13.3337 4.71327 13.3337 5.33325V11.4666C13.3337 12.5867 13.3337 13.1467 13.1157 13.5746C12.9239 13.9509 12.618 14.2569 12.2416 14.4486C11.8138 14.6666 11.2538 14.6666 10.1337 14.6666H5.86699C4.74689 14.6666 4.18683 14.6666 3.75901 14.4486C3.38269 14.2569 3.07673 13.9509 2.88498 13.5746C2.66699 13.1467 2.66699 12.5867 2.66699 11.4666V5.33325C2.66699 4.71327 2.66699 4.40328 2.73514 4.14895C2.92007 3.45876 3.45917 2.91967 4.14935 2.73473C4.40369 2.66659 4.71368 2.66659 5.33366 2.66659M8.00033 10.3333V7.33325C8.00033 6.78097 8.44804 6.33325 9.00033 6.33325C9.55261 6.33325 10.0003 6.78097 10.0003 7.33325V10.3333C10.0003 11.4378 9.10489 12.3333 8.00033 12.3333C6.89576 12.3333 6.00033 11.4378 6.00033 10.3333V7.66659M6.40033 3.99992H9.60032C9.97369 3.99992 10.1604 3.99992 10.303 3.92726C10.4284 3.86334 10.5304 3.76135 10.5943 3.63591C10.667 3.4933 10.667 3.30662 10.667 2.93325V2.39992C10.667 2.02655 10.667 1.83987 10.5943 1.69726C10.5304 1.57182 10.4284 1.46983 10.303 1.40591C10.1604 1.33325 9.97369 1.33325 9.60033 1.33325H6.40033C6.02696 1.33325 5.84027 1.33325 5.69767 1.40591C5.57222 1.46983 5.47024 1.57182 5.40632 1.69726C5.33366 1.83987 5.33366 2.02655 5.33366 2.39992V2.93325C5.33366 3.30662 5.33366 3.4933 5.40632 3.63591C5.47024 3.76135 5.57222 3.86334 5.69767 3.92726C5.84027 3.99992 6.02696 3.99992 6.40033 3.99992Z" stroke="#6D9A16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="flex-1 text-start text-gray-700 text-sm font-medium truncate">Custom with Parameters</span>
                    </div>
                </div>
            </button>
            <button on:click={addGroupSms} class="flex items-center self-stretch py-0.5 px-1.5">
                <div class="flex items-center flex-1 gap-3 py-[9px] px-2.5 rounded-md hover:bg-primary-50">
                    <div class="flex items-center flex-1 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14.6663 14V12.6667C14.6663 11.4241 13.8165 10.38 12.6663 10.084M10.333 2.19384C11.3103 2.58943 11.9997 3.54754 11.9997 4.66667C11.9997 5.78579 11.3103 6.7439 10.333 7.13949M11.333 14C11.333 12.7575 11.333 12.1362 11.13 11.6462C10.8594 10.9928 10.3402 10.4736 9.68683 10.203C9.19677 10 8.57552 10 7.33301 10H5.33301C4.0905 10 3.46924 10 2.97919 10.203C2.32578 10.4736 1.80665 10.9928 1.536 11.6462C1.33301 12.1362 1.33301 12.7575 1.33301 14M8.99967 4.66667C8.99967 6.13943 7.80577 7.33333 6.33301 7.33333C4.86025 7.33333 3.66634 6.13943 3.66634 4.66667C3.66634 3.19391 4.86025 2 6.33301 2C7.80577 2 8.99967 3.19391 8.99967 4.66667Z" stroke="#6D9A16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="flex-1 text-start text-gray-700 text-sm font-medium">Group SMS</span>
                    </div>
                </div>
            </button>
        </div>
    </div>
    {/if}
</div>

<AddMessageIndex />