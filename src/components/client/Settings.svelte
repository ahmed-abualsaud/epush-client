<script>
	import UserProfile from "./Settings/UserProfile.svelte"
	import CompanyProfile from "./Settings/CompanyProfile.svelte"
	import ChangePassword from "./Settings/ChangePassword.svelte"

    import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { addSlugToCurrentRouteDisplay } from "$lib/router/router"

    let formSelector
    let shownForm = "user-profile"

    onMount(() => {
        addSlugToCurrentRouteDisplay("Settings", shownForm, 1)
    })

    const onClickHandler = (buttonID) => {
        shownForm = buttonID
        addSlugToCurrentRouteDisplay("Settings", shownForm, 1)
        let button = formSelector.querySelector("#" + buttonID)
        if (empty(button)) return

        formSelector.querySelectorAll('button').forEach(btn => {
            if (btn.classList.contains('border-b-primary-700')) {
                btn.classList.remove('border-b')
                btn.classList.remove('border-b-primary-700')
                btn.classList.remove('bg-primary-50')
                btn.querySelector('path').setAttribute('stroke', '#667085')
                btn.querySelector('span').classList.add('text-gray-500')
                btn.querySelector('span').classList.remove('text-primary-700')
            }
        })

        button.classList.add('border-b')
        button.classList.add('border-b-primary-700')
        button.classList.add('bg-primary-50')
        button.querySelector('path').setAttribute('stroke', '#527615')
        button.querySelector('span').classList.remove('text-gray-500')
        button.querySelector('span').classList.add('text-primary-700')
    }
</script>

<div class="flex flex-col items-start self-stretch flex-1 gap-8 px-6 pb-40">
    <div class="flex flex-col self-stretch gap-6">
        <div class="flex flex-col items-start flex-1 gap-1">
            <span class="self-stretch text-gray-900 text-3xl leading-[38px] font-semibold">Settings</span>
            <span class="self-stretch text-gray-600">Manage your account  and company profile.</span>
        </div>
        <div bind:this={formSelector} class="flex items-center self-stretch gap-8 border-b">
            <button id="user-profile" on:click={() => onClickHandler("user-profile")} class="flex justify-center items-center gap-2 p-3 border-b border-b-primary-700 bg-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clip-path="url(#clip0_438_20054)">
                      <path d="M4.43008 16.198C4.93702 15.0037 6.12061 14.166 7.49984 14.166H12.4998C13.8791 14.166 15.0627 15.0037 15.5696 16.198M13.3332 7.91602C13.3332 9.75697 11.8408 11.2493 9.99984 11.2493C8.15889 11.2493 6.6665 9.75697 6.6665 7.91602C6.6665 6.07507 8.15889 4.58268 9.99984 4.58268C11.8408 4.58268 13.3332 6.07507 13.3332 7.91602ZM18.3332 9.99935C18.3332 14.6017 14.6022 18.3327 9.99984 18.3327C5.39746 18.3327 1.6665 14.6017 1.6665 9.99935C1.6665 5.39698 5.39746 1.66602 9.99984 1.66602C14.6022 1.66602 18.3332 5.39698 18.3332 9.99935Z" stroke="#527615" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_438_20054">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                </svg>
                <span class="text-primary-700">User Profile</span>
            </button>
            <button id="company-profile" on:click={() => onClickHandler("company-profile")} class="flex justify-center items-center gap-2 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6.24984 5.83333H8.5415M6.24984 9.16667H8.5415M6.24984 12.5H8.5415M11.4582 5.83333H13.7498M11.4582 9.16667H13.7498M11.4582 12.5H13.7498M16.6665 17.5V5.16667C16.6665 4.23325 16.6665 3.76654 16.4848 3.41002C16.3251 3.09641 16.0701 2.84144 15.7565 2.68166C15.4 2.5 14.9333 2.5 13.9998 2.5H5.99984C5.06642 2.5 4.59971 2.5 4.24319 2.68166C3.92958 2.84144 3.67462 3.09641 3.51483 3.41002C3.33317 3.76654 3.33317 4.23325 3.33317 5.16667V17.5M18.3332 17.5H1.6665" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-500">Company Profile</span>
            </button>
            <button id="change-password" on:click={() => onClickHandler("change-password")} class="flex justify-center items-center gap-2 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M14.1668 8.33333V6.66667C14.1668 4.36548 12.3013 2.5 10.0002 2.5C7.69898 2.5 5.8335 4.36548 5.8335 6.66667V8.33333M10.0002 12.0833V13.75M7.3335 17.5H12.6668C14.067 17.5 14.767 17.5 15.3018 17.2275C15.7722 16.9878 16.1547 16.6054 16.3943 16.135C16.6668 15.6002 16.6668 14.9001 16.6668 13.5V12.3333C16.6668 10.9332 16.6668 10.2331 16.3943 9.69836C16.1547 9.22795 15.7722 8.8455 15.3018 8.60582C14.767 8.33333 14.067 8.33333 12.6668 8.33333H7.3335C5.93336 8.33333 5.2333 8.33333 4.69852 8.60582C4.22811 8.8455 3.84566 9.22795 3.60598 9.69836C3.3335 10.2331 3.3335 10.9332 3.3335 12.3333V13.5C3.3335 14.9001 3.3335 15.6002 3.60598 16.135C3.84566 16.6054 4.22811 16.9878 4.69852 17.2275C5.2333 17.5 5.93336 17.5 7.3335 17.5Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-500">Change Password</span>
            </button>
        </div>
    </div>

    {#if shownForm == "user-profile"}
        <UserProfile />
    {/if}

    {#if shownForm == "company-profile"}
        <CompanyProfile />
    {/if}

    {#if shownForm == "change-password"}
        <ChangePassword />
    {/if}
</div>