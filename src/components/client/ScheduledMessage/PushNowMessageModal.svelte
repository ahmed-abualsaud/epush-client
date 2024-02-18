<script>
	import Modal from "../../shared/Modal.svelte"
	import MessageUpdateErrorModal from "./MessageUpdateErrorModal.svelte"
	import MessageUpdateSuccessModal from "./MessageUpdateSuccessModal.svelte"

	import { empty } from "$lib/helper/utils"
    import { updateMessage } from "../../../api/messageApi"
    import { showModal, hideModal } from "$lib/helper/modal"

    export let message

    const saveChanges = async () => {
        try {
            let scheduleTime = (new Date()).toISOString().substring(0, 19).replace("T", " ")
            let result = await updateMessage(message.id, {scheduled_at: scheduleTime})
            if (empty(result)) {
                showModal(MessageUpdateErrorModal)
            } else {
                showModal(MessageUpdateSuccessModal)
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
            <div class="flex justify-center items-center rounded-full border-8 border-primary-50 bg-primary-100 w-16 h-16 p-3">
                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 24 25" fill="none">
                    <path d="M10.5004 12.5H5.00043M4.91577 12.7915L2.58085 19.7662C2.39742 20.3142 2.3057 20.5881 2.37152 20.7569C2.42868 20.9034 2.55144 21.0145 2.70292 21.0567C2.87736 21.1054 3.14083 20.9869 3.66776 20.7497L20.3792 13.2296C20.8936 12.9981 21.1507 12.8824 21.2302 12.7216C21.2993 12.582 21.2993 12.4181 21.2302 12.2784C21.1507 12.1177 20.8936 12.0019 20.3792 11.7705L3.66193 4.24776C3.13659 4.01135 2.87392 3.89315 2.69966 3.94164C2.54832 3.98375 2.42556 4.09454 2.36821 4.24078C2.30216 4.40917 2.3929 4.68255 2.57437 5.22931L4.91642 12.2856C4.94759 12.3795 4.96317 12.4264 4.96933 12.4744C4.97479 12.5171 4.97473 12.5602 4.96916 12.6028C4.96289 12.6508 4.94718 12.6977 4.91577 12.7915Z" stroke="#527615" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex flex-col items-center self-stretch gap-1">
                <span class="self-stretch text-center text-gray-900 text-lg font-semibold">Are you sure push this message now?</span>
                <span class="self-stretch text-center text-gray-600 text-sm">You are one step away from sending this<br>scheduled message.</span>
            </div>
        </div>
        <div class="flex flex-col items-start self-stretch gap-3 pt-8 pb-6 px-6">
            <button on:click={saveChanges} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
                <span class="text-white font-semibold">Push Now</span>
            </button>
            <button on:click={cancel} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Cancel</span>
            </button>
        </div>
    </div>    
</Modal>
