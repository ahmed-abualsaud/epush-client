<script>
	import Modal from "../../shared/Modal.svelte"
	import SenderErrorModal from "./SenderErrorModal.svelte"
	import SenderSuccessModal from "./SenderSuccessModal.svelte"

	import { empty } from "$lib/helper/utils"
	import { currentClient } from "$lib/helper/store"
	import { addSender } from "../../../api/messageApi"
	import { showModal, hideModal } from "$lib/helper/modal"
    import { setcurrentRouteDisplay } from "$lib/router/router"


	let senderName = ""

	const requestNewSender = async () => {
		try {
			await addSender({
				user_id: $currentClient.id,
				name: senderName,
				approved: false,
			})

			showModal(SenderSuccessModal)
			await setcurrentRouteDisplay("Home")
            await setcurrentRouteDisplay("Senders")
		} catch (e) {
			showModal(SenderErrorModal)
		}

	}

	const senderNameOnInputHandler = (e) => {
        const englishRegex = /^[A-Za-z0-9\s]*$/;
        if (!englishRegex.test(e.currentTarget.value)) {
            e.currentTarget.value = e.currentTarget.value.substring(0, e.currentTarget.value.length - 1);
			senderName = e.currentTarget.value
        }
    }
</script>

<Modal>
	<div class="flex flex-col items-center w-[600px] rounded-xl bg-white shadow-xl">
		<div class="flex flex-col items-start self-stretch gap-4 p-6 bg-white rounded-t-xl">
			<div class="flex justify-center items-center p-3 w-14 h-1/4 rounded-[10px] border border-gray-200 bg-white shadow-sm">
				<svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
					<path d="M12.0005 19.5003V12.5003M12.292 19.585L19.2704 21.9212C19.8173 22.1043 20.0908 22.1958 20.2594 22.1301C20.4059 22.0731 20.517 21.9505 20.5594 21.7992C20.6082 21.6249 20.4903 21.3617 20.2545 20.8354L12.766 4.12269C12.5354 3.60799 12.4201 3.35064 12.2594 3.2709C12.1199 3.20162 11.956 3.20136 11.8162 3.27019C11.6553 3.34941 11.5392 3.60639 11.3069 4.12035L3.75244 20.8364C3.51474 21.3623 3.39589 21.6253 3.44422 21.7998C3.48619 21.9513 3.59697 22.0742 3.74329 22.1317C3.91178 22.1978 4.18567 22.1069 4.73346 21.9251L11.786 19.5843C11.8799 19.5532 11.9268 19.5376 11.9749 19.5314C12.0175 19.526 12.0606 19.526 12.1032 19.5316C12.1512 19.5379 12.1981 19.5536 12.292 19.585Z" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
			<div class="flex flex-col items-start flex-1 gap-1">
				<span class="self-stretch text-gray-900 text-lg font-semibold">New Sender</span>
				<span class="self-stretch text-gray-600 text-sm">Add new sender name to use it in future messages</span>
			</div>
		</div>
		<div class="flex flex-col items-start self-stretch gap-1.5 px-6 pb-8">
			<div class="flex flex-col items-start self-stretch gap-1.5">
				<span class="text-gray-700 text-sm font-medium">Sender Name</span>
				<div class="flex justify-between items-center flex-1 py-2 px-3 border border-gray-300 self-stretch rounded-lg">
					<input bind:value={senderName} on:input={senderNameOnInputHandler} maxLength={11} class="placeholder:text-gray-500 outline-none w-full" placeholder="Add name.." />
					<svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
						<path d="M6.06016 6.49967C6.2169 6.05412 6.52626 5.67841 6.93347 5.4391C7.34067 5.19978 7.81943 5.1123 8.28495 5.19215C8.75047 5.272 9.17271 5.51402 9.47688 5.87536C9.78106 6.2367 9.94753 6.69402 9.94683 7.16634C9.94683 8.49967 7.94683 9.16634 7.94683 9.16634M8.00016 11.833H8.00683M14.6668 8.49967C14.6668 12.1816 11.6821 15.1663 8.00016 15.1663C4.31826 15.1663 1.3335 12.1816 1.3335 8.49967C1.3335 4.81778 4.31826 1.83301 8.00016 1.83301C11.6821 1.83301 14.6668 4.81778 14.6668 8.49967Z" stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
			</div>
			<span class="self-stretch text-gray-600 text-sm">Should be in English Only, (Max 11 digit with no symbols or special characters)</span>
		</div>
		<div class="flex justify-end items-center self-stretch flex-1 gap-3 p-6 border-t border-gray-200">
			<button on:click={hideModal} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
				<span class="text-gray-700 font-semibold">Close</span>
			</button>
			<button disabled={empty(senderName)} on:click={requestNewSender} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {empty(senderName) ? "opacity-40" : "opacity-100"}">
				<span class="text-white font-semibold">Request</span>
			</button>
		</div>
	</div>
</Modal>