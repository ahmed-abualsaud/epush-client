<script>
	import Modal from "../../shared/Modal.svelte"
    import Droplist from "../../shared/Droplist.svelte"
	import TicketErrorModal from "./TicketErrorModal.svelte"
	import TicketSuccessModal from "./TicketSuccessModal.svelte"

    import { empty } from "$lib/helper/utils"
	import { addTicket } from "../../../api/ticketApi"
    import { validateEmail } from "$lib/helper/strUtils"
    import { showModal, hideModal } from "$lib/helper/modal"
    import { setcurrentRouteDisplay } from "$lib/router/router"
    import { currentClient, clientSenderNames } from "$lib/helper/store"


    let firstName = ""
    let lastName = ""
    let email = ""
    let phone = ""
    let senderName = ""
    let problemSubject = ""
    let description = ""

    let isValidEmail = true
    let showErrorMessages = false

    const validatePhone = (e) => {
        const keyCode = e.keyCode || e.which
        const keyValue = String.fromCharCode(keyCode)
        const isValid = ((/^[0-9\b]+$/.test(keyValue) || (keyCode >= 96 && keyCode <= 105))) || keyCode == 37 || keyCode == 39
        if (!isValid) {
          e.preventDefault()
        }
    }

    const validateEmailAddress = () => {
        showErrorMessages = false
        isValidEmail = validateEmail(email)
    }

    const sendTicket = async () => {
        showErrorMessages = true
        if (! isValidEmail) return

        try {
            await addTicket({
                user_id: $currentClient.user_id,
                company_name: $currentClient.company_name,
                first_name: firstName,
                last_name: lastName,
                sender_name: senderName,
                content: description,
                subject: problemSubject,
                email,
                phone
            })
            showModal(TicketSuccessModal)
			await setcurrentRouteDisplay("Home")
            await setcurrentRouteDisplay("Support")
        } catch (e) {
            showModal(TicketErrorModal)
        }
    }
</script>
<Modal>
    <div class="flex flex-col items-center rounded-xl bg-white shadow-xl w-[800px]">
        <div class="flex flex-col items-center self-stretch gap-4 bg-white rounded-t-xl p-6">
            <div class="flex justify-center items-center self-stretch rounded-[10px] border border-gray-200 bg-white shadow-sm w-12 h-12 p-3">
                <svg class=" flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M9.13626 9.13628L4.92893 4.92896M4.92893 19.0711L9.16797 14.8321M14.8611 14.8638L19.0684 19.0711M19.0684 4.92896L14.8287 9.16862M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex items-center self-stretch gap-4">
                <div class="flex flex-col items-start flex-1 gap-1 self-stretch">
                    <span class="self-stretch text-gray-900 text-lg font-semibold">New Support Ticket</span>
                    <span class="self-stretch text-gray-600 text-sm">Send complaints or suggestions; we'll respond promptly</span>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-start gap-4 self-stretch px-6 pb-8">
            <div class="flex items-start self-stretch gap-4">
                <div class="relative flex flex-col items-start flex-1 gap-1.5">
                    <span class="text-gray-700 text-sm font-medium">First Name</span>
                    <div class="flex px-3.5 py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
                        <input bind:value={firstName} class="placeholder:text-gray-500 outline-none w-full" placeholder="Enter First Name" />
                        <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M6.06016 6.49967C6.2169 6.05412 6.52626 5.67841 6.93347 5.4391C7.34067 5.19978 7.81943 5.1123 8.28495 5.19215C8.75047 5.272 9.17271 5.51402 9.47688 5.87536C9.78106 6.2367 9.94753 6.69402 9.94683 7.16634C9.94683 8.49967 7.94683 9.16634 7.94683 9.16634M8.00016 11.833H8.00683M14.6668 8.49967C14.6668 12.1816 11.6821 15.1663 8.00016 15.1663C4.31826 15.1663 1.3335 12.1816 1.3335 8.49967C1.3335 4.81778 4.31826 1.83301 8.00016 1.83301C11.6821 1.83301 14.6668 4.81778 14.6668 8.49967Z" stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
                <div class="relative flex flex-col items-start flex-1 gap-1.5">
                    <span class="text-gray-700 text-sm font-medium">Last Name</span>
                    <div class="flex px-3.5 py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
                        <input bind:value={lastName} class="placeholder:text-gray-500 outline-none w-full" placeholder="Enter Last Name" />
                        <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M6.06016 6.49967C6.2169 6.05412 6.52626 5.67841 6.93347 5.4391C7.34067 5.19978 7.81943 5.1123 8.28495 5.19215C8.75047 5.272 9.17271 5.51402 9.47688 5.87536C9.78106 6.2367 9.94753 6.69402 9.94683 7.16634C9.94683 8.49967 7.94683 9.16634 7.94683 9.16634M8.00016 11.833H8.00683M14.6668 8.49967C14.6668 12.1816 11.6821 15.1663 8.00016 15.1663C4.31826 15.1663 1.3335 12.1816 1.3335 8.49967C1.3335 4.81778 4.31826 1.83301 8.00016 1.83301C11.6821 1.83301 14.6668 4.81778 14.6668 8.49967Z" stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="flex items-start self-stretch gap-4">
                <div class="relative flex flex-col items-start flex-1 gap-1.5">
                    <span class="text-gray-700 text-sm font-medium">Email Address</span>
                    <div class="flex px-3.5 py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M1.6665 5.83398L8.4706 10.5969C9.02158 10.9825 9.29707 11.1754 9.59672 11.2501C9.86142 11.3161 10.1383 11.3161 10.403 11.2501C10.7026 11.1754 10.9781 10.9825 11.5291 10.5969L18.3332 5.83398M5.6665 16.6673H14.3332C15.7333 16.6673 16.4334 16.6673 16.9681 16.3948C17.4386 16.1552 17.821 15.7727 18.0607 15.3023C18.3332 14.7675 18.3332 14.0674 18.3332 12.6673V7.33398C18.3332 5.93385 18.3332 5.23379 18.0607 4.69901C17.821 4.2286 17.4386 3.84615 16.9681 3.60647C16.4334 3.33398 15.7333 3.33398 14.3332 3.33398H5.6665C4.26637 3.33398 3.56631 3.33398 3.03153 3.60647C2.56112 3.84615 2.17867 4.2286 1.93899 4.69901C1.6665 5.23379 1.6665 5.93385 1.6665 7.33398V12.6673C1.6665 14.0674 1.6665 14.7675 1.93899 15.3023C2.17867 15.7727 2.56112 16.1552 3.03153 16.3948C3.56631 16.6673 4.26637 16.6673 5.6665 16.6673Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input bind:value={email} on:input={validateEmailAddress} class="placeholder:text-gray-500 outline-none w-full" placeholder="Enter Email Address" />
                        <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M6.06016 6.49967C6.2169 6.05412 6.52626 5.67841 6.93347 5.4391C7.34067 5.19978 7.81943 5.1123 8.28495 5.19215C8.75047 5.272 9.17271 5.51402 9.47688 5.87536C9.78106 6.2367 9.94753 6.69402 9.94683 7.16634C9.94683 8.49967 7.94683 9.16634 7.94683 9.16634M8.00016 11.833H8.00683M14.6668 8.49967C14.6668 12.1816 11.6821 15.1663 8.00016 15.1663C4.31826 15.1663 1.3335 12.1816 1.3335 8.49967C1.3335 4.81778 4.31826 1.83301 8.00016 1.83301C11.6821 1.83301 14.6668 4.81778 14.6668 8.49967Z" stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    {#if showErrorMessages && ! isValidEmail}
                    <span class=" text-error-700 text-sm">Please enter a valid email</span>
                    {/if}
                </div>
                <div class="relative flex flex-col items-start flex-1 gap-1.5">
                    <span class="text-gray-700 text-sm font-medium">Phone Number</span>
                    <div class="flex px-3.5 py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M6.98356 7.37779C7.56356 8.58581 8.35422 9.71801 9.35553 10.7193C10.3568 11.7206 11.4891 12.5113 12.6971 13.0913C12.801 13.1412 12.8529 13.1661 12.9187 13.1853C13.1523 13.2534 13.4392 13.2045 13.637 13.0628C13.6927 13.0229 13.7403 12.9753 13.8356 12.88C14.1269 12.5887 14.2726 12.443 14.4191 12.3478C14.9715 11.9886 15.6837 11.9886 16.2361 12.3478C16.3825 12.443 16.5282 12.5887 16.8196 12.88L16.9819 13.0424C17.4248 13.4853 17.6462 13.7067 17.7665 13.9446C18.0058 14.4175 18.0058 14.9761 17.7665 15.449C17.6462 15.6869 17.4248 15.9083 16.9819 16.3512L16.8506 16.4825C16.4092 16.9239 16.1886 17.1446 15.8885 17.3131C15.5556 17.5001 15.0385 17.6346 14.6567 17.6334C14.3126 17.6324 14.0774 17.5657 13.607 17.4322C11.0792 16.7147 8.69387 15.361 6.70388 13.371C4.7139 11.381 3.36017 8.99569 2.6427 6.46786C2.50919 5.99749 2.44244 5.7623 2.44141 5.41818C2.44028 5.03633 2.57475 4.51925 2.76176 4.18633C2.9303 3.88631 3.15098 3.66563 3.59233 3.22428L3.72369 3.09292C4.16656 2.65005 4.388 2.42861 4.62581 2.30833C5.09878 2.0691 5.65734 2.0691 6.1303 2.30832C6.36812 2.42861 6.58955 2.65005 7.03242 3.09291L7.19481 3.25531C7.48615 3.54665 7.63182 3.69231 7.72706 3.8388C8.08622 4.3912 8.08622 5.10336 7.72706 5.65576C7.63182 5.80225 7.48615 5.94791 7.19481 6.23925C7.09955 6.33451 7.05192 6.38214 7.01206 6.43782C6.87038 6.63568 6.82146 6.92256 6.88957 7.15619C6.90873 7.22193 6.93367 7.27389 6.98356 7.37779Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <input bind:value={phone} on:keydown={validatePhone} class="placeholder:text-gray-500 outline-none w-full" placeholder="Enter Phone Number" />
                        <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M6.06016 6.49967C6.2169 6.05412 6.52626 5.67841 6.93347 5.4391C7.34067 5.19978 7.81943 5.1123 8.28495 5.19215C8.75047 5.272 9.17271 5.51402 9.47688 5.87536C9.78106 6.2367 9.94753 6.69402 9.94683 7.16634C9.94683 8.49967 7.94683 9.16634 7.94683 9.16634M8.00016 11.833H8.00683M14.6668 8.49967C14.6668 12.1816 11.6821 15.1663 8.00016 15.1663C4.31826 15.1663 1.3335 12.1816 1.3335 8.49967C1.3335 4.81778 4.31826 1.83301 8.00016 1.83301C11.6821 1.83301 14.6668 4.81778 14.6668 8.49967Z" stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="flex items-start self-stretch gap-4">
                <div class="relative flex flex-col items-start flex-1 gap-1.5">
                    <Droplist name="Sender Name" placeholder="Select Sender Name" fetchOptionsFunction={() => $clientSenderNames} bind:selectedOption={senderName}>
                        <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10.0004 15.8336V10.0003M10.2433 15.9041L16.0587 17.851C16.5145 18.0035 16.7423 18.0798 16.8829 18.0251C17.0049 17.9775 17.0975 17.8754 17.1328 17.7493C17.1735 17.6041 17.0752 17.3848 16.8787 16.9462L10.6383 3.01891C10.4462 2.58999 10.3501 2.37553 10.2162 2.30908C10.0999 2.25135 9.96334 2.25113 9.84686 2.30849C9.71279 2.37451 9.61601 2.58866 9.42245 3.01696L3.12703 16.947C2.92895 17.3853 2.82991 17.6044 2.87019 17.7498C2.90516 17.8761 2.99747 17.9785 3.11941 18.0264C3.25981 18.0815 3.48806 18.0058 3.94455 17.8543L9.82165 15.9036C9.89991 15.8776 9.93904 15.8646 9.97905 15.8595C10.0146 15.855 10.0505 15.855 10.086 15.8597C10.126 15.8649 10.1651 15.878 10.2433 15.9041Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </Droplist>
                </div>
                <div class="relative flex flex-col items-start flex-1 gap-1.5">
                    <span class="text-gray-700 text-sm font-medium">Problem Supject</span>
                    <div class="flex px-3.5 py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
                        <input bind:value={problemSubject} class="placeholder:text-gray-500 outline-none w-full" placeholder="Enter Problem Subject" />
                        <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M6.06016 6.49967C6.2169 6.05412 6.52626 5.67841 6.93347 5.4391C7.34067 5.19978 7.81943 5.1123 8.28495 5.19215C8.75047 5.272 9.17271 5.51402 9.47688 5.87536C9.78106 6.2367 9.94753 6.69402 9.94683 7.16634C9.94683 8.49967 7.94683 9.16634 7.94683 9.16634M8.00016 11.833H8.00683M14.6668 8.49967C14.6668 12.1816 11.6821 15.1663 8.00016 15.1663C4.31826 15.1663 1.3335 12.1816 1.3335 8.49967C1.3335 4.81778 4.31826 1.83301 8.00016 1.83301C11.6821 1.83301 14.6668 4.81778 14.6668 8.49967Z" stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="flex flex-col items-start self-stretch flex-1 gap-1.5">
                <span class="text-gray-700 text-sm font-medium">Description</span>
                <textarea bind:value={description} placeholder="What we can do for you.." class="flex items-start flex-1 self-stretch gap-2 py-3 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm outline-none min-h-40" />
            </div>
        </div>
        <div class="flex justify-end items-start flex-1 self-stretch gap-3 p-6 border-t border-t-gray-200">
            <button on:click={hideModal} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Close</span>
            </button>
            <button 
                disabled={empty(firstName) || empty(lastName) || empty(email) || empty(phone) || empty(problemSubject) || empty(senderName) || empty(description)} 
                on:click={sendTicket} 
                class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {(empty(firstName) || empty(lastName) || empty(email) || empty(phone) || empty(problemSubject) || empty(senderName) || empty(description)) ? "opacity-40" : "opacity-100"}">
                <span class="text-white font-semibold">Send to Us</span>
            </button>
        </div>
    </div>
</Modal>