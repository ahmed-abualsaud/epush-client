<script>
	import UserErrorModal from "./UserErrorModal.svelte"
    import ViewAvatarModal from "./ViewAvatarModal.svelte"
	import UserSuccessModal from "./UserSuccessModal.svelte"
	import DeleteAvatarModal from "./DeleteAvatarModal.svelte"

    import { empty } from "$lib/helper/utils"
    import { navigate } from "$lib/router/router"
    import { showModal } from "$lib/helper/modal"
    import { infoAlert } from "$lib/helper/alert"
    import { currentClient } from "$lib/helper/store"
	import { updateUser } from "../../../api/clientApi"
    import { validateEmail } from "$lib/helper/strUtils"


    let firstName = ""
    let lastName = ""
    let username = ""
    let email = ""
    let phone = ""
    let avatar = {}

    let isValidEmail = true
    let showErrorMessages = false
    let defaultAvatar = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
    let avatarPreview = empty($currentClient?.avatar) ? defaultAvatar : $currentClient.avatar

    const validateEmailAddress = () => {
        showErrorMessages = false
        isValidEmail = validateEmail(email)
    }

    const validatePhone = (e) => {
        const keyCode = e.keyCode || e.which
        const keyValue = String.fromCharCode(keyCode)
        const isValid = ((/^[0-9\b]+$/.test(keyValue) || (keyCode >= 96 && keyCode <= 105))) || keyCode == 37 || keyCode == 39
        if (!isValid) {
          e.preventDefault()
        }
    }

    const cancel = () => {
        firstName = ""
        lastName = ""
        username = ""
        email = ""
        phone = ""
    }

    const updateUserProfile = async () => {
        try {
            showErrorMessages = true
            if (! isValidEmail) return

            let updatedUser = new FormData()

            if (! empty(firstName)) { updatedUser.append("first_name", firstName) }
            if (! empty(lastName)) { updatedUser.append("last_name", lastName) }
            if (! empty(username)) { updatedUser.append("username", username) }
            if (! empty(email)) { updatedUser.append("email", email) }
            if (! empty(phone)) { updatedUser.append("phone", phone) }

            await updateUser(updatedUser)
            await navigate("/")
            await navigate("/settings")
            showModal(UserSuccessModal)
        } catch (e) {
            showModal(UserErrorModal)
        }
    }

    const onSelectAvatar = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = function (e) {
            avatar = file
            avatarPreview = e.target.result
        }
        reader.readAsDataURL(file)
    }

    const updateUserAvatar = async () => {
        try {
            if (empty(avatar)) {
                infoAlert("Please select an avatar", 5)
                return
            }

            let updatedUser = new FormData()
            updatedUser.append("avatar", avatar)
            await updateUser(updatedUser)
            $currentClient.avatar = avatarPreview
            showModal(UserSuccessModal, {avatarAction: "update"})
        } catch (e) {
            showModal(UserErrorModal, {avatarAction: "update"})
            alert(e.message)
        }
    }

    $: {
        avatarPreview = empty($currentClient?.avatar) ? defaultAvatar : $currentClient.avatar
    }
</script>

<div class="flex flex-col items-start flex-1 self-stretch gap-6">
    <div class="flex flex-col justify-center items-start self-stretch gap-1 pb-5 border-b">
        <span class="self-stretch text-gray-900 text-lg font-semibold">Profile</span>
        <span class="self-stretch text-gray-600 text-sm">Update your photo and personal details here.</span>
    </div>
    <div class="flex flex-col items-start self-stretch flex-1 gap-5">
        <div class="flex items-start self-stretch gap-8 w-2/3">
            <div class="flex flex-col items-center justify-center self-stretch gap-2 w-1/3">
                <div class="flex flex-col items-center justify-center self-stretch">
                    <span class="self-stretch text-gray-700 text-sm font-medium">Your photo</span>
                    <span class="self-stretch text-gray-600 text-sm">This will be displayed on your profile.</span>
                </div>
                <span class="self-stretch text-primary-600 text-sm">To change your avatar, click on the image to select new avater then hit the update button.</span>
            </div>
            <div class="flex justify-between items-center flex-1">
                <div class="flex gap-5">
                    <div class="relative w-24 h-24 rounded-full overflow-hidden">
                        <img src={avatarPreview ?? defaultAvatar} alt="User Avatar" class="flex flex-col justify-center items-center flex-shrink-0 w-full h-full"/>
                        <input type="file" id="fileInput" class="hidden" on:input={onSelectAvatar}>
                        <label for="fileInput" class="absolute cursor-pointer w-full h-full top-0 left-0 flex flex-col items-center justify-center">
                            <p class="text-primary-700 text-xs text-border-2">Click</p>
                            <p class="text-primary-700 text-xs text-border-2">to</p>
                            <p class="text-primary-700 text-xs text-border-2">Select</p>
                        </label>
                    </div>
                    <button on:click={() => showModal(ViewAvatarModal, {url: avatarPreview})} class="flex justify-center items-center gap-2">
                        <span class="text-gray-600 text-sm font-semibold">Preview</span>
                    </button>
                </div>
                <div class="flex items-start gap-6">
                    <button on:click={() => showModal(DeleteAvatarModal)} class="flex justify-center items-center gap-2">
                        <span class="text-gray-600 text-sm font-semibold">Delete</span>
                    </button>
                    <button on:click={updateUserAvatar} class="flex justify-center items-center gap-2">
                        <span class="text-primary-700 text-sm font-semibold">Update</span>
                    </button>
                </div>
            </div>
        </div>

        <div class=" h-[1px] self-stretch w-full bg-gray-200"></div>

        <div class="flex items-start self-stretch gap-8 w-2/3">
            <div class="flex flex-col items-start w-1/3">
                <span class="self-stretch text-gray-700 text-sm font-medium">Full Name</span>
                <span class="self-stretch text-gray-600 text-sm">Your first and last name</span>
            </div>
            <div class="flex items-start flex-1 self-stretch gap-4">
                <div class="flex flex-1 px-3.5 py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
                    <input bind:value={firstName} class="outline-none w-full" placeholder={$currentClient?.first_name ?? "Enter Your First Name"} />
                </div>
                <div class="flex flex-1 px-3.5 py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
                    <input bind:value={lastName} class="outline-none w-full" placeholder={$currentClient?.last_name ?? "Enter Your Last Name"} />
                </div>
            </div>
        </div>

        <div class=" h-[1px] self-stretch w-full bg-gray-200"></div>

        <div class="flex items-center self-stretch gap-8 w-2/3">
            <div class="flex flex-col items-start w-1/3">
                <span class="self-stretch text-gray-700 text-sm font-medium">Username</span>
                <span class="self-stretch text-gray-600 text-sm">Use it for login, and make sure to be ended with</span>
                <span class="self-stretch text-primary-600 text-sm">@epushagency.com</span>
            </div>
            <div class="flex items-start flex-1">
                <div class="flex flex-col items-center justify-center py-2 px-1.5 border-y border-l border-l-gray-300 border-y-gray-300 rounded-tl-lg rounded-bl-lg w-11 h-full">
                    <span class="text-gray-600 text-center">@</span>
                </div>
                <input bind:value={username} placeholder={$currentClient?.username ?? "Enter Your Username"} class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-tr-lg rounded-br-lg outline-none"/>
            </div>
        </div>

        <div class=" h-[1px] self-stretch w-full bg-gray-200"></div>

        <div class="flex items-start self-stretch gap-8 w-2/3">
            <div class="flex flex-col items-start w-1/3">
                <span class="self-stretch text-gray-700 text-sm font-medium">Email Address</span>
                <span class="self-stretch text-gray-600 text-sm">For communication and reset password</span>
            </div>
            <div class="flex flex-col items-start flex-1 self-stretch gap-1.5">
                <div class="flex items-start flex-1 self-stretch">
                    <div class="flex flex-col items-center justify-center py-[5px] px-1.5 border-y border-l border-l-gray-300 border-y-gray-300 rounded-tl-lg rounded-bl-lg w-11 h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M1.6665 5.83398L8.4706 10.5969C9.02158 10.9825 9.29707 11.1754 9.59672 11.2501C9.86142 11.3161 10.1383 11.3161 10.403 11.2501C10.7026 11.1754 10.9781 10.9825 11.5291 10.5969L18.3332 5.83398M5.6665 16.6673H14.3332C15.7333 16.6673 16.4334 16.6673 16.9681 16.3948C17.4386 16.1552 17.821 15.7727 18.0607 15.3023C18.3332 14.7675 18.3332 14.0674 18.3332 12.6673V7.33398C18.3332 5.93385 18.3332 5.23379 18.0607 4.69901C17.821 4.2286 17.4386 3.84615 16.9681 3.60647C16.4334 3.33398 15.7333 3.33398 14.3332 3.33398H5.6665C4.26637 3.33398 3.56631 3.33398 3.03153 3.60647C2.56112 3.84615 2.17867 4.2286 1.93899 4.69901C1.6665 5.23379 1.6665 5.93385 1.6665 7.33398V12.6673C1.6665 14.0674 1.6665 14.7675 1.93899 15.3023C2.17867 15.7727 2.56112 16.1552 3.03153 16.3948C3.56631 16.6673 4.26637 16.6673 5.6665 16.6673Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <input bind:value={email} on:input={validateEmailAddress} placeholder={$currentClient?.email ?? "Enter Your Email Address"} class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-tr-lg rounded-br-lg outline-none"/>
                </div>
                {#if showErrorMessages && ! isValidEmail}
                    <span class=" text-error-700 text-sm">Please enter a valid email</span>
                {/if}
            </div>
        </div>

        <div class=" h-[1px] self-stretch w-full bg-gray-200"></div>

        <div class="flex items-start self-stretch gap-8 w-2/3">
            <div class="flex flex-col items-start w-1/3">
                <span class="self-stretch text-gray-700 text-sm font-medium">Phone</span>
                <span class="self-stretch text-gray-600 text-sm">To contact you for any support</span>
            </div>
            <div class="flex items-start flex-1 self-stretch">
                <div class="flex flex-col items-center justify-center py-[5px] px-1.5 border-y border-l border-l-gray-300 border-y-gray-300 rounded-tl-lg rounded-bl-lg w-11 h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6.98356 7.37779C7.56356 8.58581 8.35422 9.71801 9.35553 10.7193C10.3568 11.7206 11.4891 12.5113 12.6971 13.0913C12.801 13.1412 12.8529 13.1661 12.9187 13.1853C13.1523 13.2534 13.4392 13.2045 13.637 13.0628C13.6927 13.0229 13.7403 12.9753 13.8356 12.88C14.1269 12.5887 14.2726 12.443 14.4191 12.3478C14.9715 11.9886 15.6837 11.9886 16.2361 12.3478C16.3825 12.443 16.5282 12.5887 16.8196 12.88L16.9819 13.0424C17.4248 13.4853 17.6462 13.7067 17.7665 13.9446C18.0058 14.4175 18.0058 14.9761 17.7665 15.449C17.6462 15.6869 17.4248 15.9083 16.9819 16.3512L16.8506 16.4825C16.4092 16.9239 16.1886 17.1446 15.8885 17.3131C15.5556 17.5001 15.0385 17.6346 14.6567 17.6334C14.3126 17.6324 14.0774 17.5657 13.607 17.4322C11.0792 16.7147 8.69387 15.361 6.70388 13.371C4.7139 11.381 3.36017 8.99569 2.6427 6.46786C2.50919 5.99749 2.44244 5.7623 2.44141 5.41818C2.44028 5.03633 2.57475 4.51925 2.76176 4.18633C2.9303 3.88631 3.15098 3.66563 3.59233 3.22428L3.72369 3.09292C4.16656 2.65005 4.388 2.42861 4.62581 2.30833C5.09878 2.0691 5.65734 2.0691 6.1303 2.30832C6.36812 2.42861 6.58955 2.65005 7.03242 3.09291L7.19481 3.25531C7.48615 3.54665 7.63182 3.69231 7.72706 3.8388C8.08622 4.3912 8.08622 5.10336 7.72706 5.65576C7.63182 5.80225 7.48615 5.94791 7.19481 6.23925C7.09955 6.33451 7.05192 6.38214 7.01206 6.43782C6.87038 6.63568 6.82146 6.92256 6.88957 7.15619C6.90873 7.22193 6.93367 7.27389 6.98356 7.37779Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <input bind:value={phone} on:keydown={validatePhone} placeholder={$currentClient?.phone ?? "Enter Your Phone Number"} class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-tr-lg rounded-br-lg outline-none"/>
            </div>
        </div>

        <div class="flex justify-end items-center self-stretch flex-1 gap-3 w-2/3">
            <button on:click={cancel} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Cancel</span>
            </button>
            <button 
                disabled={empty(firstName) && empty(lastName) && empty(email) && empty(phone) && empty(username)} 
                on:click={updateUserProfile} 
                class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {(empty(firstName) && empty(lastName) && empty(email) && empty(phone) && empty(username)) ? "opacity-40" : "opacity-100"}">
                <span class="text-white font-semibold">Save Changes</span>
            </button>
        </div>
    </div>
</div>

<style>
    .text-border-2 {
        text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
    }
</style>