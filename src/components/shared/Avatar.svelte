<script>
	import AddTicket from "../client/Support/AddTicket.svelte"

    import { empty } from "$lib/helper/utils"
    import { signout } from "../../api/authApi"
    import { showModal } from "$lib/helper/modal"
    import { currentClient } from "$lib/helper/store"
    import { setcurrentRouteDisplay } from "$lib/router/router"

    let defaultAvatar = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="

    let user = {}

    let dropDown
    const showDropdown = () => {
        dropDown.classList.toggle('invisible')
        dropDown.classList.toggle('opacity-100')
        dropDown.classList.toggle('-translate-y-5')
    }

    const hideDropdown = () => {
        dropDown.classList.add('invisible')
        dropDown.classList.remove('opacity-100')
        dropDown.classList.remove('-translate-y-5')
    }

    const showSupportModal = async () => {
        hideDropdown()
        await setcurrentRouteDisplay("Support")
        showModal(AddTicket)
    }

    const showSettings= async () => {
        hideDropdown()
        await setcurrentRouteDisplay("Settings")
    }

    const logout = async () => {
        await signout()
    }

    $: {
        user = $currentClient
    }
</script>

<div class="relative flex flex-col items-start">
    <button on:click={showDropdown} class="flex flex-col justify-center items-center w-10 h-10 overflow-hidden hide-dropdown">
        <img class="rounded-full w-full h-full" src={empty(user?.avatar) ? defaultAvatar : user.avatar} alt="Avatar" />
    </button>
    <div bind:this={dropDown} class="hide-dropdown absolute -left-[200px] md:-left-[250px] -bottom-[235px] flex flex-col items-start rounded-lg border border-gray-200 bg-white shadow-md opacity-0 invisible translate-y-0 transition-all duration-500 ease-in-out">
        <div class="flex flex-col items-start w-60 md:w-72 px-3 py-4 border-b border-gray-200 overflow-x-auto">
            <div class="flex items-center gap-3">
                <div class="flex flex-col justify-center items-center w-10 h-10">
                    <img class="rounded-full" src={empty(user?.avatar) ? defaultAvatar : user.avatar} alt="Avatar" />
                </div>
                <div class="flex flex-col items-start flex-1">
                    <span class="self-stretch text-gray-700 text-sm font-semibold">{user?.first_name + " " + user?.last_name ?? "Unknown"}</span>
                    <span class="self-stretch text-gray-600 text-sm">{user?.email ?? "Unknown"}</span>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-start w-60 md:w-72 bg-white">
            <div class="flex flex-col items-start self-stretch py-1 border-b border-gray-200">
                <div class="flex items-center self-stretch py-0.5 px-1.5">
                    <button on:click={showSupportModal} class="flex items-center flex-1 gap-3 py-[9px] px-2.5 rounded-md hover:bg-gray-200">
                        <div class="flex items-center flex-1 gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <g clip-path="url(#clip0_470_3087)">
                                  <path d="M5.64313 5.64315L3.28612 3.28613M3.28612 12.7142L5.64315 10.3572M10.3572 10.3572L12.7142 12.7142M12.7142 3.2861L10.3572 5.64313M14.6668 8.00016C14.6668 11.6821 11.6821 14.6668 8.00016 14.6668C4.31826 14.6668 1.3335 11.6821 1.3335 8.00016C1.3335 4.31826 4.31826 1.3335 8.00016 1.3335C11.6821 1.3335 14.6668 4.31826 14.6668 8.00016ZM11.3335 8.00016C11.3335 9.84111 9.84111 11.3335 8.00016 11.3335C6.15921 11.3335 4.66683 9.84111 4.66683 8.00016C4.66683 6.15921 6.15921 4.66683 8.00016 4.66683C9.84111 4.66683 11.3335 6.15921 11.3335 8.00016Z" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_470_3087">
                                    <rect width="16" height="16" fill="white"/>
                                  </clipPath>
                                </defs>
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Support</span>
                        </div>
                    </button>
                </div>
                <div class="flex items-center self-stretch py-0.5 px-1.5">
                    <button on:click={showSettings} class="flex items-center flex-1 gap-3 py-[9px] px-2.5 rounded-md hover:bg-gray-200">
                        <div class="flex items-center flex-1 gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <g clip-path="url(#clip0_470_18626)">
                                  <path d="M8.00016 10.0002C9.10473 10.0002 10.0002 9.10473 10.0002 8.00016C10.0002 6.89559 9.10473 6.00016 8.00016 6.00016C6.89559 6.00016 6.00016 6.89559 6.00016 8.00016C6.00016 9.10473 6.89559 10.0002 8.00016 10.0002Z" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                  <path d="M12.485 9.81835C12.4043 10.0011 12.3803 10.2039 12.4159 10.4005C12.4516 10.5971 12.5453 10.7785 12.685 10.9214L12.7214 10.9577C12.8341 11.0703 12.9235 11.204 12.9845 11.3511C13.0455 11.4983 13.0769 11.656 13.0769 11.8153C13.0769 11.9746 13.0455 12.1323 12.9845 12.2795C12.9235 12.4266 12.8341 12.5603 12.7214 12.6729C12.6088 12.7856 12.4751 12.875 12.328 12.936C12.1808 12.997 12.0231 13.0284 11.8638 13.0284C11.7045 13.0284 11.5468 12.997 11.3996 12.936C11.2525 12.875 11.1188 12.7856 11.0062 12.6729L10.9699 12.6365C10.827 12.4968 10.6456 12.4031 10.449 12.3674C10.2524 12.3318 10.0496 12.3559 9.86683 12.4365C9.68758 12.5134 9.5347 12.6409 9.42702 12.8035C9.31933 12.9661 9.26155 13.1567 9.26077 13.3517V13.4547C9.26077 13.7762 9.13306 14.0845 8.90575 14.3118C8.67843 14.5391 8.37012 14.6668 8.04865 14.6668C7.72717 14.6668 7.41887 14.5391 7.19155 14.3118C6.96423 14.0845 6.83653 13.7762 6.83653 13.4547V13.4002C6.83183 13.1996 6.7669 13.005 6.65017 12.8418C6.53344 12.6786 6.37031 12.5543 6.18198 12.485C5.99918 12.4043 5.79641 12.3803 5.59981 12.4159C5.4032 12.4516 5.22179 12.5453 5.07895 12.685L5.04259 12.7214C4.93001 12.8341 4.79633 12.9235 4.64918 12.9845C4.50203 13.0455 4.3443 13.0769 4.18501 13.0769C4.02572 13.0769 3.86799 13.0455 3.72084 12.9845C3.57369 12.9235 3.44001 12.8341 3.32744 12.7214C3.21474 12.6088 3.12533 12.4751 3.06433 12.328C3.00333 12.1808 2.97194 12.0231 2.97194 11.8638C2.97194 11.7045 3.00333 11.5468 3.06433 11.3996C3.12533 11.2525 3.21474 11.1188 3.32744 11.0062L3.3638 10.9699C3.50352 10.827 3.59725 10.6456 3.63289 10.449C3.66854 10.2524 3.64448 10.0496 3.5638 9.86683C3.48697 9.68758 3.35941 9.5347 3.19681 9.42702C3.03421 9.31933 2.84367 9.26155 2.64865 9.26077H2.54562C2.22414 9.26077 1.91584 9.13306 1.68852 8.90575C1.4612 8.67843 1.3335 8.37012 1.3335 8.04865C1.3335 7.72717 1.4612 7.41887 1.68852 7.19155C1.91584 6.96423 2.22414 6.83653 2.54562 6.83653H2.60016C2.80077 6.83183 2.99532 6.7669 3.15853 6.65017C3.32173 6.53344 3.44605 6.37031 3.51531 6.18198C3.59599 5.99918 3.62006 5.79641 3.58441 5.59981C3.54876 5.4032 3.45503 5.22179 3.31531 5.07895L3.27895 5.04259C3.16625 4.93001 3.07685 4.79633 3.01585 4.64918C2.95485 4.50203 2.92345 4.3443 2.92345 4.18501C2.92345 4.02572 2.95485 3.86799 3.01585 3.72084C3.07685 3.57369 3.16625 3.44001 3.27895 3.32744C3.39152 3.21474 3.52521 3.12533 3.67236 3.06433C3.81951 3.00333 3.97723 2.97194 4.13653 2.97194C4.29582 2.97194 4.45355 3.00333 4.6007 3.06433C4.74785 3.12533 4.88153 3.21474 4.9941 3.32744L5.03047 3.3638C5.1733 3.50352 5.35472 3.59725 5.55132 3.63289C5.74792 3.66854 5.9507 3.64448 6.1335 3.5638H6.18198C6.36124 3.48697 6.51411 3.35941 6.6218 3.19681C6.72948 3.03421 6.78726 2.84367 6.78804 2.64865V2.54562C6.78804 2.22414 6.91575 1.91584 7.14306 1.68852C7.37038 1.4612 7.67869 1.3335 8.00016 1.3335C8.32164 1.3335 8.62995 1.4612 8.85726 1.68852C9.08458 1.91584 9.21228 2.22414 9.21228 2.54562V2.60016C9.21306 2.79518 9.27085 2.98572 9.37853 3.14832C9.48621 3.31092 9.63909 3.43849 9.81835 3.51531C10.0011 3.59599 10.2039 3.62006 10.4005 3.58441C10.5971 3.54876 10.7785 3.45503 10.9214 3.31531L10.9577 3.27895C11.0703 3.16625 11.204 3.07685 11.3511 3.01585C11.4983 2.95485 11.656 2.92345 11.8153 2.92345C11.9746 2.92345 12.1323 2.95485 12.2795 3.01585C12.4266 3.07685 12.5603 3.16625 12.6729 3.27895C12.7856 3.39152 12.875 3.52521 12.936 3.67236C12.997 3.81951 13.0284 3.97723 13.0284 4.13653C13.0284 4.29582 12.997 4.45355 12.936 4.6007C12.875 4.74785 12.7856 4.88153 12.6729 4.9941L12.6365 5.03047C12.4968 5.1733 12.4031 5.35472 12.3674 5.55132C12.3318 5.74792 12.3559 5.9507 12.4365 6.1335V6.18198C12.5134 6.36124 12.6409 6.51411 12.8035 6.6218C12.9661 6.72948 13.1567 6.78726 13.3517 6.78804H13.4547C13.7762 6.78804 14.0845 6.91575 14.3118 7.14306C14.5391 7.37038 14.6668 7.67869 14.6668 8.00016C14.6668 8.32164 14.5391 8.62995 14.3118 8.85726C14.0845 9.08458 13.7762 9.21228 13.4547 9.21228H13.4002C13.2051 9.21306 13.0146 9.27085 12.852 9.37853C12.6894 9.48621 12.5618 9.63909 12.485 9.81835Z" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_470_18626">
                                    <rect width="16" height="16" fill="white"/>
                                  </clipPath>
                                </defs>
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Settings</span>
                        </div>
                    </button>
                </div>
            </div>
            <div class="flex flex-col items-start self-stretch py-1 border-b border-gray-200">
                <div class="flex items-center self-stretch py-0.5 px-1.5">
                    <button on:click={logout} class="flex items-center flex-1 gap-3 py-[9px] px-2.5 rounded-md hover:bg-gray-200">
                        <div class="flex items-center flex-1 gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6M6 2H5.2C4.0799 2 3.51984 2 3.09202 2.21799C2.7157 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.07989 2 5.2V10.8C2 11.9201 2 12.4802 2.21799 12.908C2.40973 13.2843 2.71569 13.5903 3.09202 13.782C3.51984 14 4.0799 14 5.2 14H6" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Log out</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<svelte:window on:click={(e) => {
    if (e.target.closest(".hide-dropdown")) return 
    hideDropdown()
}}/>