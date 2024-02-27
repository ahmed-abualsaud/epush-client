<script>
	import Droplist from "../../shared/Droplist.svelte"
	import UserErrorModal from "./UserErrorModal.svelte"
	import UserSuccessModal from "./UserSuccessModal.svelte"

	import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { showModal } from "$lib/helper/modal"
    import { currentClient } from "$lib/helper/store"
    import { setcurrentRouteDisplay } from "$lib/router/router"
	import { getClientSenders, listBusinessFields, updateClient } from "../../../api/clientApi"

    let address = ""
    let companyName = ""
    let businessField = $currentClient.businessfield?.name

    let clientSenders = []
    let businessFields = []

    onMount(async () => {
        clientSenders = await getClientSenders()
    })
    const getBusinessFields = async () => {
        businessFields = await listBusinessFields()
        return businessFields.map(b => b.name)
    }

    const cancel = () => {
        address = ""
        companyName = ""
        businessField = ""
    }

    const updateCompanyProfile = async () => {
        try {
            let updatedUser = new FormData()

            if (! empty(address)) { updatedUser.append("address", address) }
            if (! empty(companyName)) { updatedUser.append("company_name", companyName) }
            if (! empty(businessField)) { updatedUser.append("business_field_id", businessFields.find(b => b.name == businessField)?.id) }

            await updateClient(updatedUser)
            showModal(UserSuccessModal)
        } catch (e) {
            showModal(UserErrorModal)
        }
    }
</script>

<div class="flex flex-col items-start flex-1 self-stretch gap-6">
    <div class="flex flex-col justify-center items-start self-stretch gap-1 pb-5 border-b">
        <span class="self-stretch text-gray-900 text-lg font-semibold">Company Profile</span>
        <span class="self-stretch text-gray-600 text-sm">Update your company details here.</span>
    </div>
    <div class="flex flex-col items-start self-stretch flex-1 gap-5">
        <div class="flex items-start self-stretch gap-8 w-2/3">
            <div class="flex flex-col items-start w-1/3">
                <span class="self-stretch text-gray-700 text-sm font-medium">Company Name</span>
                <span class="self-stretch text-gray-600 text-sm">Legal name</span>
            </div>
            <div class="flex items-start flex-1 self-stretch">
                <div class="flex flex-col items-center justify-center py-[5px] px-1.5 border-y border-l border-l-gray-300 border-y-gray-300 rounded-tl-lg rounded-bl-lg w-11 h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6.24984 5.83333H8.5415M6.24984 9.16667H8.5415M6.24984 12.5H8.5415M11.4582 5.83333H13.7498M11.4582 9.16667H13.7498M11.4582 12.5H13.7498M16.6665 17.5V5.16667C16.6665 4.23325 16.6665 3.76654 16.4848 3.41002C16.3251 3.09641 16.0701 2.84144 15.7565 2.68166C15.4 2.5 14.9333 2.5 13.9998 2.5H5.99984C5.06642 2.5 4.59971 2.5 4.24319 2.68166C3.92958 2.84144 3.67462 3.09641 3.51483 3.41002C3.33317 3.76654 3.33317 4.23325 3.33317 5.16667V17.5M18.3332 17.5H1.6665" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <input bind:value={companyName} placeholder={$currentClient?.company_name ?? "Enter Your Company Name"} class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-tr-lg rounded-br-lg outline-none"/>
            </div>
        </div>

        <div class=" h-[1px] self-stretch w-full bg-gray-200"></div>

        <div class="flex items-start self-stretch gap-8 w-2/3">
            <div class="flex flex-col items-start w-1/3">
                <span class="self-stretch text-gray-700 text-sm font-medium">Address</span>
                <span class="self-stretch text-gray-600 text-sm">Describe your offical location</span>
            </div>
            <div class="flex items-start flex-1 self-stretch">
                <div class="flex flex-col items-center justify-center py-[5px] px-1.5 border-y border-l border-l-gray-300 border-y-gray-300 rounded-tl-lg rounded-bl-lg w-11 h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10.0002 18.3327C10.8335 14.166 16.6668 13.6812 16.6668 8.33268C16.6668 4.65078 13.6821 1.66602 10.0002 1.66602C6.31826 1.66602 3.3335 4.65078 3.3335 8.33268C3.3335 13.6812 9.16683 14.166 10.0002 18.3327Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.0002 10.8327C11.3809 10.8327 12.5002 9.71339 12.5002 8.33268C12.5002 6.95197 11.3809 5.83268 10.0002 5.83268C8.61945 5.83268 7.50016 6.95197 7.50016 8.33268C7.50016 9.71339 8.61945 10.8327 10.0002 10.8327Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <input bind:value={address} placeholder={$currentClient?.address ?? "Enter Your Address"} class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-tr-lg rounded-br-lg outline-none"/>
            </div>
        </div>

        <div class=" h-[1px] self-stretch w-full bg-gray-200"></div>

        <div class="flex items-start self-stretch gap-8 w-2/3">
            <div class="flex flex-col items-start w-1/3">
                <span class="self-stretch text-gray-700 text-sm font-medium">Business Field</span>
                <span class="self-stretch text-gray-600 text-sm">Identify your business industry</span>
            </div>
            <Droplist placeholder="Select Business Field" fetchOptionsFunction={getBusinessFields} bind:selectedOption={businessField} clazz="flex-1 self-stretch border-gray-300">
                <i slot="icon" class="fa-regular fa-briefcase-blank text-gray-500"></i>
            </Droplist>
        </div>

        <div class=" h-[1px] self-stretch w-full bg-gray-200"></div>

        <div class="flex flex-col items-start self-stretch flex-1 gap-6 w-2/3">
            <div class="flex items-center justify-between self-stretch flex-1 gap-8">
                <div class="flex flex-col items-start w-1/3">
                    <span class="self-stretch text-gray-700 text-sm font-medium">Legal Documents</span>
                    <span class="self-stretch text-gray-600 text-sm">Your senders status based on your documents</span>
                </div>
                <button on:click={async () => await setcurrentRouteDisplay("Documents")} class="flex justify-center items-center gap-2">
                    <span class=" text-primary-700 text-sm font-semibold text-nowrap whitespace-nowrap">View Documents</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4.1665 9.99935H15.8332M15.8332 9.99935L9.99984 4.16602M15.8332 9.99935L9.99984 15.8327" stroke="#527615" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <div class="flex items-center flex-wrap self-stretch flex-1 gap-2">
                {#each clientSenders as sender}
                    {#if sender.approved}
                    <div class="flex py-1 px-3 items-center rounded-2xl bg-success-50 mix-blend-multiply">
                        <span class=" text-success-700 text-center text-sm font-medium">{sender.name}: Verfied</span>
                    </div>
                    {:else}
                    <div class="flex py-1 px-3 items-center rounded-2xl bg-error-50 mix-blend-multiply">
                        <span class=" text-error-700 text-center text-sm font-medium">{sender.name}: Not Verified</span>
                    </div>
                    {/if}
                {/each}
            </div>
        </div>

        <div class=" h-[1px] self-stretch w-full bg-gray-200"></div>

        <div class="flex justify-end items-center self-stretch flex-1 gap-3 w-2/3">
            <button on:click={cancel} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Cancel</span>
            </button>
            <button 
                disabled={empty(businessField) && empty(address) && empty(companyName)} 
                on:click={updateCompanyProfile} 
                class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {(empty(businessField) && empty(address) && empty(companyName)) ? "opacity-40" : "opacity-100"}">
                <span class="text-white font-semibold">Save Changes</span>
            </button>
        </div>
    </div>
</div>