<script>
	import Modal from "../../shared/Modal.svelte"

    import { empty } from "$lib/helper/utils"
    import { message } from "$lib/helper/store"
	import { exportExcel } from "../../../api/fileApi"
    import { makeArrayUnique } from "$lib/helper/arrUtils"
    import { showModal, hideModal } from "$lib/helper/modal"
    import { beautifulToSnakeCase } from "$lib/helper/strUtils"

    let uniqueSenderConnections = []
    $: uniqueSenderConnections = makeArrayUnique($message.connections, "operator_name")

    const okay = () => {
        hideModal()
    }

    const sendNewMessage = () => {
        showModal("add-bulk-message:language-and-sender")
    }

    const exportValidNumbers = async () => {
        exportExcel(["phone"], $message.validNumbers.map(phone => [phone]))
    }

    const exportInvalidNumbers = async () => {
        exportExcel(["phone"], $message.invalidNumbers.map(phone => [phone]))
    }

    const handleImageError = (event) => {
        const img = event.target;
        img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="17.25" viewBox="0 0 576 512"><path d="M62.6 2.3C46.2-4.3 27.6 3.6 20.9 20C7.4 53.4 0 89.9 0 128s7.4 74.6 20.9 108c6.6 16.4 25.3 24.3 41.7 17.7S86.9 228.4 80.3 212C69.8 186.1 64 157.8 64 128s5.8-58.1 16.3-84C86.9 27.6 79 9 62.6 2.3zm450.8 0C497 9 489.1 27.6 495.7 44C506.2 69.9 512 98.2 512 128s-5.8 58.1-16.3 84c-6.6 16.4 1.3 35 17.7 41.7s35-1.3 41.7-17.7c13.5-33.4 20.9-69.9 20.9-108s-7.4-74.6-20.9-108C548.4 3.6 529.8-4.3 513.4 2.3zM340.1 165.2c7.5-10.5 11.9-23.3 11.9-37.2c0-35.3-28.7-64-64-64s-64 28.7-64 64c0 13.9 4.4 26.7 11.9 37.2L98.9 466.8c-7.3 16.1-.2 35.1 15.9 42.4s35.1 .2 42.4-15.9L177.7 448H398.3l20.6 45.2c7.3 16.1 26.3 23.2 42.4 15.9s23.2-26.3 15.9-42.4L340.1 165.2zM369.2 384H206.8l14.5-32H354.7l14.5 32zM288 205.3L325.6 288H250.4L288 205.3zM163.3 73.6c5.3-12.1-.2-26.3-12.4-31.6s-26.3 .2-31.6 12.4C109.5 77 104 101.9 104 128s5.5 51 15.3 73.6c5.3 12.1 19.5 17.7 31.6 12.4s17.7-19.5 12.4-31.6C156 165.8 152 147.4 152 128s4-37.8 11.3-54.4zM456.7 54.4c-5.3-12.1-19.5-17.7-31.6-12.4s-17.7 19.5-12.4 31.6C420 90.2 424 108.6 424 128s-4 37.8-11.3 54.4c-5.3 12.1 .2 26.3 12.4 31.6s26.3-.2 31.6-12.4C466.5 179 472 154.1 472 128s-5.5-51-15.3-73.6z"/></svg>';
        img.classList.add("fas");
        img.setAttribute("aria-hidden", "true");
        img.setAttribute("role", "img");
        img.setAttribute("aria-label", "Prohibited");
        img.setAttribute("style", "font-size: 24px; color: red; text-align: center;");
    }
</script>


<Modal name="push-success-modal">
<div class="flex flex-col items-center w-[400px] border bg-white rounded-xl shadow-xl">
    <div class="flex flex-col items-center self-stretch gap-4 pt-6 px-6 rounded-t-xl bg-white">
        <div class="flex justify-center items-center w-12 h-12 p-3 rounded-[28px] border-8 border-success-50 bg-success-100">
            <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#039855" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="flex flex-col items-center self-stretch gap-6">
            <div class="flex flex-col items-center self-stretch gap-3">
                <div class="flex flex-col items-center self-stretch gap-1">
                    <span class="self-stretch text-gray-900 text-center text-lg font-semibold">Message Sent Successful!</span>
                    <span class="self-stretch text-gray-600 text-center text-sm">Your message has been sent and is on its way to your recipients.</span>
                </div>
                <div class="flex items-center gap-2">
                    {#each uniqueSenderConnections as conn}
                    <div class="items-center gap-1.5 py-1 pe-3 ps-1.5 rounded-2xl bg-gray-100 {empty($message.connections.find(c => c.operator_name == conn.operator_name).numbers) ? "hidden" : "flex"}">
                        <img on:error={handleImageError} alt="" src="image/operators/{beautifulToSnakeCase(conn.operator_name)}.png" />
                        <span class="text-gray-700 text-center text-sm font-medium">
                            {$message.connections.find(c => c.operator_name == conn.operator_name)?.numbers?.length ?? 0}
                        </span>
                    </div>
                    {/each}
                </div>
            </div>
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
                            <span class="flex-1 text-gray-900 text-lg font-semibold">{$message.validNumbers.length}</span>
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
                            <span class="flex-1 text-gray-900 text-lg font-semibold">{$message.invalidNumbers.length}</span>
                        </div>
                    </div>
                    <button on:click={exportInvalidNumbers} disabled={empty($message.invalidNumbers)} class="flex flex-col justify-center items-center self-stretch gap-4 py-4 px-6 border-t border-t-gray-200">
                        <span class="text-primary-700 text-sm font-semibold {empty($message.invalidNumbers) ? "opacity-20" : "opacity-100"}">Download</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="1" viewBox="0 0 400 1" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M400 1H0V0H400V1Z" fill="#EAECF0"/>
    </svg>
    <div class="flex flex-col items-start self-stretch gap-3 pt-8 pb-6 px-6">
        <button on:click={okay} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
            <span class="text-white font-semibold">Okay</span>
        </button>
        <button on:click={sendNewMessage} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
            <span class="text-gray-700 font-semibold">Send New Message</span>
        </button>
    </div>
</div>
</Modal>
