<script>
	import Modal from "../../shared/Modal.svelte"
	import Droplist from "../../shared/Droplist.svelte"
	import SMSTemplateErrorModal from "./SMSTemplateErrorModal.svelte"
    import SMSTemplateSuccessModal from "./SMSTemplateSuccessModal.svelte"

    import { empty } from "$lib/helper/utils"
    import { currentClient } from "$lib/helper/store"
    import { showModal, hideModal } from "$lib/helper/modal"
    import { splitStringByLength } from "$lib/helper/strUtils"
    import { setcurrentRouteDisplay } from "$lib/router/router"
    import { calcMessageLength, messageLanguageFilter } from "$lib/helper/message"
    import { listMessageLanguages, addMessageTemplate } from "../../../api/messageApi"


    let template = ""
    let templateName = ""
    let selectedLanguage = ""
    let numberOfSegments = 0

    let languages = []
    let selectedLangObj = {}

    const fetchLanguages = async () => {
        languages = (await listMessageLanguages(100000))
        return languages.map(lng => lng.name)
    }

    const addNewTemplate = async () => {
        try {
            await addMessageTemplate({
                name: templateName,
                subject: templateName,
                template: template,
                user_id: $currentClient.user_id
            })

            showModal(SMSTemplateSuccessModal)
			await setcurrentRouteDisplay("Home")
            await setcurrentRouteDisplay("SMS Templates")
        } catch (e) {
            showModal(SMSTemplateErrorModal)
        }
    }

    const onSelectLanguage = (language) => {
        selectedLangObj = languages.find(lng => lng.name == language) ?? {}
        template = ""
    }

    $: {
        let msglen = calcMessageLength(template)
        if (msglen <= selectedLangObj?.max_characters_length) {
            numberOfSegments = 1
        } else if (msglen > selectedLangObj?.max_characters_length) {
            numberOfSegments = splitStringByLength(template, selectedLangObj?.split_characters_length).length
        } else {
            numberOfSegments = 0
        }
    }
</script>
<Modal>
    <div class="flex flex-col items-center rounded-xl bg-white shadow-xl w-[800px]">
        <div class="flex flex-col items-start self-stretch gap-4 p-6 bg-white rounded-t-xl">
            <div class=" flex justify-center items-center p-3 w-14 h-14 rounded-[10px] border border-gray-200 bg-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12.4996 14.5V8.5M9.49962 11.5H15.4996M12.4996 20C17.194 20 20.9996 16.1944 20.9996 11.5C20.9996 6.80558 17.194 3 12.4996 3C7.8052 3 3.99962 6.80558 3.99962 11.5C3.99962 12.45 4.15547 13.3636 4.443 14.2166C4.55119 14.5376 4.60529 14.6981 4.61505 14.8214C4.62469 14.9432 4.6174 15.0286 4.58728 15.1469C4.55677 15.2668 4.48942 15.3915 4.35472 15.6408L2.71906 18.6684C2.48575 19.1002 2.36909 19.3161 2.3952 19.4828C2.41794 19.6279 2.50337 19.7557 2.6288 19.8322C2.7728 19.9201 3.01692 19.8948 3.50517 19.8444L8.62619 19.315C8.78127 19.299 8.85881 19.291 8.92949 19.2937C8.999 19.2963 9.04807 19.3029 9.11586 19.3185C9.18478 19.3344 9.27145 19.3678 9.44478 19.4345C10.3928 19.7998 11.4228 20 12.4996 20Z" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex flex-col items-start self-stretch flex-1 gap-1">
                <span class="self-stretch text-gray-900 text-lg font-semibold">New SMS Template</span>
                <span class="self-stretch text-gray-600 text-sm">Add a new SMS template for future using</span>
            </div>
        </div>
        <div class="flex flex-col items-start self-stretch gap-4 px-6 pb-8">
            <div class="flex flex-col items-start flex-1 self-stretch gap-4">
                <Droplist name="Message Language" placeholder="Select Language" fetchOptionsFunction={fetchLanguages} bind:selectedOption={selectedLanguage} onSelectOption={onSelectLanguage}>
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
                <div class="relative flex flex-col items-start gap-1.5 self-stretch">
                    <span class="text-gray-700 text-sm font-medium">Template Name</span>        
                    <div class="hide-dropdown flex px-3.5 py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
                        <input bind:value={templateName} class="placeholder:text-gray-500 outline-none w-full" placeholder="Enter Template Name" />
                        <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M6.06016 6.49967C6.2169 6.05412 6.52626 5.67841 6.93347 5.4391C7.34067 5.19978 7.81943 5.1123 8.28495 5.19215C8.75047 5.272 9.17271 5.51402 9.47688 5.87536C9.78106 6.2367 9.94753 6.69402 9.94683 7.16634C9.94683 8.49967 7.94683 9.16634 7.94683 9.16634M8.00016 11.833H8.00683M14.6668 8.49967C14.6668 12.1816 11.6821 15.1663 8.00016 15.1663C4.31826 15.1663 1.3335 12.1816 1.3335 8.49967C1.3335 4.81778 4.31826 1.83301 8.00016 1.83301C11.6821 1.83301 14.6668 4.81778 14.6668 8.49967Z" stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-start self-stretch gap-2">
                <div class="flex justify-between items-center self-stretch flex-1">
                    <span class="text-gray-700 text-sm font-medium">Message Conent</span>
                    <span class="text-gray-500 text-sm">Number of SMSs: {numberOfSegments}</span>
                </div>
                <div class="flex flex-col items-start self-stretch flex-1 gap-1.5">
                    <textarea bind:value={template} on:keydown={(e) => messageLanguageFilter(e, selectedLangObj.characters, selectedLanguage)} placeholder="Enter your message.." class="flex items-start flex-1 self-stretch gap-2 py-3 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm outline-none min-h-64" />
                    <span class="self-stretch text-gray-600 text-sm">{calcMessageLength(template)}/{(numberOfSegments <= 1 ? selectedLangObj.max_characters_length : numberOfSegments * selectedLangObj.split_characters_length) ?? 0} Characters ({empty(selectedLanguage) ? "English" : selectedLanguage})</span>
                </div>
            </div>
        </div>
        <div class="flex justify-end items-center self-stretch flex-1 gap-3 p-6 border-t border-gray-200">
			<button on:click={hideModal} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
				<span class="text-gray-700 font-semibold">Close</span>
			</button>
			<button disabled={empty(selectedLanguage) || empty(template) || empty(templateName)} on:click={addNewTemplate} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {(empty(selectedLanguage) || empty(template) || empty(templateName)) ? "opacity-40" : "opacity-100"}">
				<span class="text-white font-semibold">Save Template</span>
			</button>
		</div>
    </div>
</Modal>