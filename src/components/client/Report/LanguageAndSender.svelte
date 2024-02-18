<script>
	import Numbers from "./Numbers.svelte"
	import Droplist from "../../shared/Droplist.svelte"
	import AddMessageModal from "./AddMessageModal.svelte"

	import { onMount } from "svelte"
	import { empty } from "$lib/helper/utils"
	import { handleImageError } from "$lib/helper/image"
    import { makeArrayUnique } from "$lib/helper/arrUtils"
    import { hideModal, showModal } from "$lib/helper/modal"
    import { beautifulToSnakeCase } from "$lib/helper/strUtils"
    import { listMessageLanguages } from "../../../api/messageApi"
    import { setMessageAttribute, clearMessage } from "$lib/helper/store"
    import { getClientSenders, getClientSendersAndConnections } from "../../../api/clientApi"

    export let addMethod = ""


    let selectedLanguage = ""
    let selectedSenderName = ""
    let sendersConnections = []
    let uniqueSendersConnections = []

    let languages = []
    let senders = []

    onMount(async () => {
        sendersConnections = await getClientSendersAndConnections()
        uniqueSendersConnections = makeArrayUnique(sendersConnections, "operator_name")
    })

    const fetchLanguages = async () => {
        languages = (await listMessageLanguages(100000))
        return languages.map(lng => lng.name)
    }

    const fetchClientSenders = async () => {
        senders = (await getClientSenders())
        return senders.map(snd => snd.name)
    }

    const nextStep = () => {
        setMessageAttribute("segments", [])
        setMessageAttribute("validNumbers", [])
        setMessageAttribute("invalidNumbers", [])
        setMessageAttribute("sender", senders.find(snd => snd.name == selectedSenderName))
        setMessageAttribute("language", languages.find(lng => lng.name == selectedLanguage))
        setMessageAttribute("connections", sendersConnections.filter(snd => snd.sender_name == selectedSenderName))
        showModal(Numbers, {addMethod})
    }

    const cancel = async () => {
        selectedLanguage = ""
        selectedSenderName = ""
        hideModal()
        clearMessage()
    }
</script>

<AddMessageModal currentStep="language-and-sender">
    <div class="flex flex-col justify-between items-start self-stretch flex-1 mb-8">
        <div class="flex flex-col items-start self-stretch gap-4">

            <Droplist name="Message Language" placeholder="Select Language" fetchOptionsFunction={fetchLanguages} bind:selectedOption={selectedLanguage}>
                <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clip-path="url(#clip0_630_12154)">
                    <path d="M1.6665 9.99984H18.3332M1.6665 9.99984C1.6665 14.6022 5.39746 18.3332 9.99984 18.3332M1.6665 9.99984C1.6665 5.39746 5.39746 1.6665 9.99984 1.6665M18.3332 9.99984C18.3332 14.6022 14.6022 18.3332 9.99984 18.3332M18.3332 9.99984C18.3332 5.39746 14.6022 1.6665 9.99984 1.6665M9.99984 1.6665C12.0842 3.94846 13.2688 6.90987 13.3332 9.99984C13.2688 13.0898 12.0842 16.0512 9.99984 18.3332M9.99984 1.6665C7.91544 3.94846 6.73088 6.90987 6.6665 9.99984C6.73088 13.0898 7.91544 16.0512 9.99984 18.3332" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_630_12154">
                        <rect width="20" height="20" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>
            </Droplist>

            <Droplist name="Sender Name" placeholder="Select Sender" fetchOptionsFunction={fetchClientSenders} bind:selectedOption={selectedSenderName}>
                <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10.0004 15.8331V9.99978M10.2433 15.9037L16.0587 17.8505C16.5145 18.0031 16.7423 18.0793 16.8829 18.0246C17.0049 17.9771 17.0975 17.8749 17.1328 17.7488C17.1735 17.6036 17.0752 17.3843 16.8787 16.9457L10.6383 3.01842C10.4462 2.5895 10.3501 2.37505 10.2162 2.30859C10.0999 2.25086 9.96334 2.25064 9.84686 2.308C9.71279 2.37402 9.61601 2.58817 9.42245 3.01647L3.12703 16.9465C2.92895 17.3848 2.82991 17.6039 2.87019 17.7493C2.90516 17.8756 2.99747 17.978 3.11941 18.0259C3.25981 18.081 3.48806 18.0053 3.94455 17.8538L9.82165 15.9031C9.89991 15.8771 9.93904 15.8642 9.97905 15.859C10.0146 15.8545 10.0505 15.8545 10.086 15.8592C10.126 15.8644 10.1651 15.8775 10.2433 15.9037Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </Droplist>

            <div class="flex flex-col items-start gap-2">
                <span class="text-gray-700 text-sm">You Can Send To</span>
                <div class="flex items-start gap-2">
                    {#each uniqueSendersConnections as conn}
                    <div class="flex items-center gap-1.5 py-1 pe-3 ps-1.5 rounded-2xl bg-gray-100 {empty(sendersConnections.filter(snd => (snd.sender_name == selectedSenderName) && snd.approved && snd.sender_approved && (snd.operator_name == conn.operator_name))) ? "mix-blend-luminosity opacity-[0.4]" : "mix-blend-multiply opacity-100"}">
                        <img on:error={handleImageError} alt="" src="image/operators/{beautifulToSnakeCase(conn.operator_name)}.png" />
                        <span class="text-gray-700 text-center text-sm font-medium">{conn.operator_name}</span>
                    </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="flex items-start self-stretch gap-3 p-4 rounded-xl border border-blue-300 bg-blue-50">
            <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_630_12082)">
                <path d="M9.99984 13.3332V9.99984M9.99984 6.6665H10.0082M18.3332 9.99984C18.3332 14.6022 14.6022 18.3332 9.99984 18.3332C5.39746 18.3332 1.6665 14.6022 1.6665 9.99984C1.6665 5.39746 5.39746 1.6665 9.99984 1.6665C14.6022 1.6665 18.3332 5.39746 18.3332 9.99984Z" stroke="#0086C9" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                <clipPath id="clip0_630_12082">
                    <rect width="20" height="20" fill="white"/>
                </clipPath>
                </defs>
            </svg>

            <div class="flex flex-col items-start self-stretch gap-1">
                <span class="self-stretch text-blue-light-700 text-sm font-semibold">Important Notes</span>
                <div class="self-stretch text-blue-light-700 text-sm">
                    <div class="flex gap-2">
                        <div class="flex justify-center items-center"><i class="fa-sharp fa-solid fa-circle text-[4px]"></i></div>
                        <span class="self-stretch text-blue-light-700 text-sm">Choose Arabic when sending a bilingual message.</span>
                    </div>
                    <div class="flex gap-2">
                        <div class="flex justify-center items-center"><i class="fa-sharp fa-solid fa-circle text-[4px]"></i></div>
                        <span class="self-stretch text-blue-light-700 text-sm">Stick to scheduled times (8 am to 10 pm) for successful delivery.</span>
                    </div>
                    <div class="flex gap-2">
                        <div class="flex justify-center items-center"><i class="fa-sharp fa-solid fa-circle text-[4px]"></i></div>
                        <span class="self-stretch text-blue-light-700 text-sm">Test messages without symbols before bulk sending.</span>
                    </div>
                    <div class="flex gap-2">
                        <div class="flex justify-center items-center"><i class="fa-sharp fa-solid fa-circle text-[4px]"></i></div>
                        <span class="self-stretch text-blue-light-700 text-sm">Test links individually before sending in bulk.</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div slot="footer" class="flex items-center self-stretch gap-12 pb-6 px-6">
        {#if ! empty(selectedSenderName) && empty(sendersConnections.find(snd => (snd.sender_name == selectedSenderName) && snd.approved && snd.sender_approved))}
        <div class="flex items-center gap-2 ps-2 pe-2.5 py-2 rounded-2xl bg-red-50 mix-blend-multiply">
            <i class="fa-solid fa-triangle-exclamation text-error-700"></i>
            <span class="text-error-700 text-center font-medium">The selected sender not approved yet</span>
        </div>
        {/if}

        <div class="flex justify-end items-center flex-1 gap-3">
            <button on:click={cancel} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Cancel</span>
            </button>
            <button disabled={empty(selectedLanguage) || empty(selectedSenderName) || empty(sendersConnections.find(snd => (snd.sender_name == selectedSenderName) && snd.approved && snd.sender_approved))} on:click={nextStep} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {empty(selectedLanguage) || empty(selectedSenderName) || empty(sendersConnections.find(snd => (snd.sender_name == selectedSenderName) && snd.approved && snd.sender_approved)) ? "opacity-20" : "opacity-100"}">
                <span class="text-white font-semibold">Next Step</span>
            </button>
        </div>
    </div>

</AddMessageModal>