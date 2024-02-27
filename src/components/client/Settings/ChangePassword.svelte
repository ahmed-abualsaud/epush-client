<script>
    import PasswordErrorModal from "./PasswordErrorModal.svelte"
	import PasswordSuccessModal from "./PasswordSuccessModal.svelte"

    import { empty } from "$lib/helper/utils"
    import { showModal } from "$lib/helper/modal"
    import { currentClient } from "$lib/helper/store"
	import { changePassword, signout } from "../../../api/authApi"

    let newPassword = ""
    let currentPassword = ""
    let passwordConfirmation = ""

    let newPasswordType = "password"
    let currentPasswordType = "password"
    let passwordConfirmationType = "password"

    const showNewPassword = () => {
        newPasswordType = newPasswordType === "password" ? "text" : "password"
    }

    const showCurrentPassword = () => {
        currentPasswordType = currentPasswordType === "password" ? "text" : "password"
    }

    const showPasswordConfirmation = () => {
        passwordConfirmationType = passwordConfirmationType === "password" ? "text" : "password"
    }

    const changeClientPassword = async () => {
        try {
            await changePassword({
                user_id: $currentClient.user_id,
                old_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: passwordConfirmation
            })
            await signout()
            showModal(PasswordSuccessModal)
        } catch (e) {
            showModal(PasswordErrorModal)
        }
    }
</script>

<div class="flex flex-col items-start flex-1 self-stretch gap-6">
    <div class="flex flex-col justify-center items-start self-stretch gap-1 pb-5 border-b">
        <span class="self-stretch text-gray-900 text-lg font-semibold">Change Password</span>
        <span class="self-stretch text-gray-600 text-sm">Update your password easily.</span>
    </div>
    <div class="flex flex-col items-start self-stretch flex-1 gap-5">
        <div class="flex items-start self-stretch gap-8 w-2/3">
            <div class="flex flex-col items-start w-1/3">
                <span class="self-stretch text-gray-700 text-sm font-medium">Current Password</span>
                <span class="self-stretch text-gray-600 text-sm">Verify yourself</span>
            </div>
            <div class="relative flex items-center flex-1 self-stretch">
                <div class="flex flex-col items-center justify-center py-[5px] px-1.5 border-y border-l border-l-gray-300 border-y-gray-300 rounded-tl-lg rounded-bl-lg w-11 h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M14.1668 8.33333V6.66667C14.1668 4.36548 12.3013 2.5 10.0002 2.5C7.69898 2.5 5.8335 4.36548 5.8335 6.66667V8.33333M10.0002 12.0833V13.75M7.3335 17.5H12.6668C14.067 17.5 14.767 17.5 15.3018 17.2275C15.7722 16.9878 16.1547 16.6054 16.3943 16.135C16.6668 15.6002 16.6668 14.9001 16.6668 13.5V12.3333C16.6668 10.9332 16.6668 10.2331 16.3943 9.69836C16.1547 9.22795 15.7722 8.8455 15.3018 8.60582C14.767 8.33333 14.067 8.33333 12.6668 8.33333H7.3335C5.93336 8.33333 5.2333 8.33333 4.69852 8.60582C4.22811 8.8455 3.84566 9.22795 3.60598 9.69836C3.3335 10.2331 3.3335 10.9332 3.3335 12.3333V13.5C3.3335 14.9001 3.3335 15.6002 3.60598 16.135C3.84566 16.6054 4.22811 16.9878 4.69852 17.2275C5.2333 17.5 5.93336 17.5 7.3335 17.5Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <input type={currentPasswordType} on:input={(e) => currentPassword = e.target.value} placeholder="Current password" class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-tr-lg rounded-br-lg outline-none"/>
                <button class="absolute right-2" on:click|preventDefault={showCurrentPassword}>
                    {#if currentPasswordType === "text"}
                        <i class="fa-duotone fa-eye text-gray-400"></i>
                    {/if}
                    {#if currentPasswordType === "password"}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421" stroke="#98A2B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {/if}
                </button>
            </div>
        </div>

        <div class=" h-[1px] self-stretch w-full bg-gray-200"></div>

        <div class="flex items-start self-stretch gap-8 w-2/3">
            <div class="flex flex-col items-start w-1/3">
                <span class="self-stretch text-gray-700 text-sm font-medium">New Password</span>
                <span class="self-stretch text-gray-600 text-sm">Add your password</span>
            </div>
            <div class="flex flex-col items-center flex-1 self-stretch gap-5">
                <div class="relative flex items-center flex-1 self-stretch">
                    <div class="flex flex-col items-center justify-center py-[5px] px-1.5 border-y border-l border-l-gray-300 border-y-gray-300 rounded-tl-lg rounded-bl-lg w-11 h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M14.1668 8.33333V6.66667C14.1668 4.36548 12.3013 2.5 10.0002 2.5C7.69898 2.5 5.8335 4.36548 5.8335 6.66667V8.33333M10.0002 12.0833V13.75M7.3335 17.5H12.6668C14.067 17.5 14.767 17.5 15.3018 17.2275C15.7722 16.9878 16.1547 16.6054 16.3943 16.135C16.6668 15.6002 16.6668 14.9001 16.6668 13.5V12.3333C16.6668 10.9332 16.6668 10.2331 16.3943 9.69836C16.1547 9.22795 15.7722 8.8455 15.3018 8.60582C14.767 8.33333 14.067 8.33333 12.6668 8.33333H7.3335C5.93336 8.33333 5.2333 8.33333 4.69852 8.60582C4.22811 8.8455 3.84566 9.22795 3.60598 9.69836C3.3335 10.2331 3.3335 10.9332 3.3335 12.3333V13.5C3.3335 14.9001 3.3335 15.6002 3.60598 16.135C3.84566 16.6054 4.22811 16.9878 4.69852 17.2275C5.2333 17.5 5.93336 17.5 7.3335 17.5Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <input type={newPasswordType} on:input={(e) => newPassword = e.target.value} placeholder="Enter your new password" class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-tr-lg rounded-br-lg outline-none"/>
                    <button class="absolute right-2" on:click|preventDefault={showNewPassword}>
                        {#if newPasswordType === "text"}
                            <i class="fa-duotone fa-eye text-gray-400"></i>
                        {/if}
                        {#if newPasswordType === "password"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421" stroke="#98A2B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {/if}
                    </button>
                </div>

                <div class="relative flex items-center flex-1 self-stretch">
                    <div class="flex flex-col items-center justify-center py-[5px] px-1.5 border-y border-l border-l-gray-300 border-y-gray-300 rounded-tl-lg rounded-bl-lg w-11 h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M14.1668 8.33333V6.66667C14.1668 4.36548 12.3013 2.5 10.0002 2.5C7.69898 2.5 5.8335 4.36548 5.8335 6.66667V8.33333M10.0002 12.0833V13.75M7.3335 17.5H12.6668C14.067 17.5 14.767 17.5 15.3018 17.2275C15.7722 16.9878 16.1547 16.6054 16.3943 16.135C16.6668 15.6002 16.6668 14.9001 16.6668 13.5V12.3333C16.6668 10.9332 16.6668 10.2331 16.3943 9.69836C16.1547 9.22795 15.7722 8.8455 15.3018 8.60582C14.767 8.33333 14.067 8.33333 12.6668 8.33333H7.3335C5.93336 8.33333 5.2333 8.33333 4.69852 8.60582C4.22811 8.8455 3.84566 9.22795 3.60598 9.69836C3.3335 10.2331 3.3335 10.9332 3.3335 12.3333V13.5C3.3335 14.9001 3.3335 15.6002 3.60598 16.135C3.84566 16.6054 4.22811 16.9878 4.69852 17.2275C5.2333 17.5 5.93336 17.5 7.3335 17.5Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <input type={passwordConfirmationType} on:input={(e) => passwordConfirmation = e.target.value} placeholder="Rewrite new password" class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-tr-lg rounded-br-lg outline-none"/>
                    <button class="absolute right-2" on:click|preventDefault={showPasswordConfirmation}>
                        {#if passwordConfirmationType === "text"}
                            <i class="fa-duotone fa-eye text-gray-400"></i>
                        {/if}
                        {#if passwordConfirmationType === "password"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421" stroke="#98A2B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {/if}
                    </button>
                </div>

                <div class="flex items-center flex-1 self-stretch gap-2 p-2.5 rounded-2xl bg-warn-50 mix-blend-multiply">
                    <div class="flex items-center py-0.5 px-2 rounded-2xl bg-white">
                        <span class="text-warn-700 text-sm font-medium">Note</span>
                    </div>
                    <div class="flex items-center flex-1 gap-1">
                        <span class="text-warn-700 text-xs font-medium">The minimum password length is 8 characters and must contain numbers, lowercase letters, uppercase letters, and at least one special character.</span>
                    </div>
                </div>

                <div class="flex items-center flex-1 self-stretch">
                    <button 
                        disabled={empty(currentPassword) || empty(newPassword) || empty(passwordConfirmation)} 
                        on:click={changeClientPassword} 
                        class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {(empty(currentPassword) || empty(newPassword) || empty(passwordConfirmation)) ? "opacity-40" : "opacity-100"}">
                        <span class="text-white font-semibold">Change Password</span>
                    </button>
                </div>
            </div>
        </div>        
    </div>
</div>