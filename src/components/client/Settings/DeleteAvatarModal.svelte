<script>
	import Modal from "../../shared/Modal.svelte"
	import UserErrorModal from "./UserErrorModal.svelte"
	import UserSuccessModal from "./UserSuccessModal.svelte"

    import { currentClient } from "$lib/helper/store"
	import { updateUser } from "../../../api/clientApi"
    import { showModal, hideModal } from "$lib/helper/modal"


    let defaultAvatar = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="

    const deleteAvatar = async () => {
        try {
            let updatedUser = new FormData()
            updatedUser.set("avatar", null)
            await updateUser(updatedUser)
            $currentClient.avatar = defaultAvatar
            showModal(UserSuccessModal, {avatarAction: "delete"})
        } catch (e) {
            showModal(UserErrorModal, {avatarAction: "delete"})
        }
    }    
</script>

<Modal>
    <div class="flex flex-col items-center flex-shrink-0 rounded-xl bg-white shadow-xl w-[400px]">
        <div class="flex flex-col items-center self-stretch gap-4 p-6 border-b">
            <div class="flex justify-center items-center rounded-[28px] border-8 border-error-50 bg-error-100 w-14 h-14 p-3">
                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M11.9998 9.49999V13.5M11.9998 17.5H12.0098M10.6151 4.39171L2.39019 18.5983C1.93398 19.3863 1.70588 19.7803 1.73959 20.1037C1.769 20.3857 1.91677 20.642 2.14613 20.8088C2.40908 21 2.86435 21 3.77487 21H20.2246C21.1352 21 21.5904 21 21.8534 20.8088C22.0827 20.642 22.2305 20.3857 22.2599 20.1037C22.2936 19.7803 22.0655 19.3863 21.6093 18.5983L13.3844 4.39171C12.9299 3.60654 12.7026 3.21396 12.4061 3.08211C12.1474 2.9671 11.8521 2.9671 11.5935 3.08211C11.2969 3.21396 11.0696 3.60655 10.6151 4.39171Z" stroke="#D92D20" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex flex-col items-center self-stretch gap-1">
                <span class="self-stretch text-gray-900 text-center text-lg font-semibold">Are you sure to<br/>delete your avatar now?</span>
                <span class="self-stretch text-gray-600 text-center text-sm">You will delete your profile avatar permanently.</span>
            </div>
        </div>
        <div class="flex flex-col items-start self-stretch gap-3 pt-8 pb-6 px-6">
            <button on:click={deleteAvatar} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-error-600 bg-error-600 shadow-sm">
                <span class="text-white font-semibold">Delete Now</span>
            </button>
            <button on:click={hideModal} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Cancel</span>
            </button>
        </div>
    </div>
</Modal>