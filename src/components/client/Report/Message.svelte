<script>
    import Numbers from "./Numbers.svelte"
	import DateAndPush from "./DateAndPush.svelte"
	import Droplist from "../../shared/Droplist.svelte"
	import Textarea from "../../shared/Textarea.svelte"
	import AddMessageModal from "./AddMessageModal.svelte"

	import { onMount } from "svelte"
	import { empty } from "$lib/helper/utils"
    import { showModal } from "$lib/helper/modal"
    import { errorAlert } from "$lib/helper/alert"
    import { message, lastOrder } from "$lib/helper/store"
    import { splitStringByLength } from "$lib/helper/strUtils"
    import { listMessageTemplates, listMessageFilters } from "../../../api/messageApi"
    import { calcMessageLength, getMessageTemplateKeys, messageLanguageFilter } from "$lib/helper/message"

    export let addMethod = ""

    let textareaHtml = ""
    let textareaText = ""
    let messageFilters = []
    let messageTemplates = []
    let censoredWordsNames = []
    let attributesOcurrence = []
    let onEnteringOption= null

    onMount(async () => {
        textareaHtml = ""
        textareaText = ""
        censoredWordsNames = []
        attributesOcurrence = []
        messageFilters = (await listMessageFilters()).map(flt => flt.name)
    })

    const fetchTemplates = async () => {
        messageTemplates = await listMessageTemplates()
        return messageTemplates.map(tmp => tmp.name)
    }

    const nextStep = () => {
        $message.content = textareaText
        generateMessageAttributes()
        showModal(DateAndPush, {addMethod})
    }

    const generateMessageAttributes = () => {
        let unknownAttribute = false
        let messageKeys = getMessageTemplateKeys(textareaText)

        messageKeys.forEach(key => {
            if (! $message.numbersAttributes.includes(key)) {
                unknownAttribute = true
                errorAlert("There are no values for attribute: '" + key + "'", 7)
            }
        })

        if (unknownAttribute) return

        if ($message.sendType == "Custom with Parameters") {
            let validNumbers = [...new Set($message.connections.filter(conn => ! empty(conn.numbers)).map(conn => conn.numbers).flat())]
            let messages = []
            let attrValues = []
            validNumbers.forEach(number => {
                attrValues = number.split(/,\s*/)
                let msg = textareaText
                attrValues.forEach((val, idx) => {
                    msg = msg.replace(new RegExp(`{{${$message.numbersAttributes[idx]}}}`, 'g'), val)
                })
                messages.push({title: attrValues[$message.numbersAttributes.indexOf("phone")], content: msg, segments: getMessageSegements(msg)})
            })
            $message.messageWithAttributes = messages
        }

        if ($message.sendType == "Group SMS" && ! empty($message.selectedGroups[0].recipients[0].attributes)) {
            let messages = []
            $message.selectedGroups.forEach(group => {
                group.recipients.forEach(recip => {
                    let msg = textareaText
                    let recipientAttributes = JSON.parse(recip.attributes)
                    $message.numbersAttributes.forEach(attribute => {
                        msg = msg.replace(new RegExp(`{{${attribute}}}`, 'g'), recipientAttributes.find(attr => attr.name == attribute)?.value)
                    })
                    messages.push({title: recipientAttributes.find(attr => attr.name == "phone")?.value, content: msg, segments: getMessageSegements(msg)})
                })
            })
            $message.messageWithAttributes = messages
        }
    }

    const back = async () => {
        showModal(Numbers, {addMethod})
    }

    const onSelectTemplate = (templateName) => {
        textareaHtml = messageTemplates.find(template => template.name == templateName)?.template
        $message.segments = getMessageSegements(textareaHtml)
    }

    const onTextareaContentChanged = (content) => {
        $message.segments = getMessageSegements(content)
    }

    const getMessageSegements = (content) => {
        let msglen = calcMessageLength(content)
        if (msglen <= $message.language?.max_characters_length) {
            return [{number: 1, content}]
        }
        if (msglen > $message.language?.max_characters_length) {
            return splitStringByLength(content, $message.language?.split_characters_length).map((seg, idx) => ({number: idx + 1, content: seg}))
        }
        return []
    }
</script>

<AddMessageModal currentStep="message">
    <div class="flex flex-col items-start flex-1 self-stretch gap-5 mb-6">
        <div class="flex items-center self-stretch gap-4 py-3 px-4 rounded-lg border border-purple-200 bg-primary-50">
            <div class="flex items-center flex-1 gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M13 5C13 6.10457 10.5376 7 7.5 7C4.46243 7 2 6.10457 2 5M13 5C13 3.89543 10.5376 3 7.5 3C4.46243 3 2 3.89543 2 5M13 5V9.45715C11.7785 9.82398 11 10.3789 11 11M2 5V17C2 18.1046 4.46243 19 7.5 19C8.82963 19 10.0491 18.8284 11 18.5429V11M2 9C2 10.1046 4.46243 11 7.5 11C8.82963 11 10.0491 10.8284 11 10.5429M2 13C2 14.1046 4.46243 15 7.5 15C8.82963 15 10.0491 14.8284 11 14.5429M22 11C22 12.1046 19.5376 13 16.5 13C13.4624 13 11 12.1046 11 11M22 11C22 9.89543 19.5376 9 16.5 9C13.4624 9 11 9.89543 11 11M22 11V19C22 20.1046 19.5376 21 16.5 21C13.4624 21 11 20.1046 11 19V11M22 15C22 16.1046 19.5376 17 16.5 17C13.4624 17 11 16.1046 11 15" stroke="#6D9A16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-primary-600 font-medium">Total Cost</span>
            </div>
            <span class="text-primary-600 font-semibold">{empty($message.validNumbers) || empty($lastOrder?.pricelist) ? "0.0" : ($message.validNumbers.length * $lastOrder.pricelist?.price * ($message.segments?.length ?? 1)).toFixed(2)} LE</span>
            <div class="flex items-center gap-1 ps-2 pe-2.5 py-0.5 rounded-2xl bg-primary-50 mix-blend-multiply">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <g clip-path="url(#clip0_754_12590)">
                      <path d="M3.75 5.25H3.755M6 5.25H6.005M8.25 5.25H8.255M3.5 9V10.1678C3.5 10.4342 3.5 10.5674 3.55461 10.6358C3.60211 10.6953 3.67413 10.7299 3.75027 10.7298C3.83781 10.7297 3.94184 10.6465 4.14988 10.4801L5.34261 9.52592C5.58626 9.33099 5.70808 9.23353 5.84374 9.16423C5.9641 9.10274 6.09221 9.0578 6.22461 9.03063C6.37383 9 6.52985 9 6.84187 9H8.1C8.94008 9 9.36012 9 9.68099 8.83651C9.96323 8.6927 10.1927 8.46323 10.3365 8.18099C10.5 7.86012 10.5 7.44008 10.5 6.6V3.9C10.5 3.05992 10.5 2.63988 10.3365 2.31901C10.1927 2.03677 9.96323 1.8073 9.68099 1.66349C9.36012 1.5 8.94008 1.5 8.1 1.5H3.9C3.05992 1.5 2.63988 1.5 2.31901 1.66349C2.03677 1.8073 1.8073 2.03677 1.66349 2.31901C1.5 2.63988 1.5 3.05992 1.5 3.9V7C1.5 7.46499 1.5 7.69748 1.55111 7.88823C1.68981 8.40587 2.09413 8.81019 2.61177 8.94889C2.80252 9 3.03501 9 3.5 9ZM4 5.25C4 5.38807 3.88807 5.5 3.75 5.5C3.61193 5.5 3.5 5.38807 3.5 5.25C3.5 5.11193 3.61193 5 3.75 5C3.88807 5 4 5.11193 4 5.25ZM6.25 5.25C6.25 5.38807 6.13807 5.5 6 5.5C5.86193 5.5 5.75 5.38807 5.75 5.25C5.75 5.11193 5.86193 5 6 5C6.13807 5 6.25 5.11193 6.25 5.25ZM8.5 5.25C8.5 5.38807 8.38807 5.5 8.25 5.5C8.11193 5.5 8 5.38807 8 5.25C8 5.11193 8.11193 5 8.25 5C8.38807 5 8.5 5.11193 8.5 5.25Z" stroke="#8DC220" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_754_12590">
                        <rect width="12" height="12" fill="white"/>
                      </clipPath>
                    </defs>
                </svg>
                <span class="text-primary-700 text-sm font-medium">{($message.validNumbers?.length ?? 0) * $message.segments.length} Message</span>
            </div>
            <div class="flex items-center gap-1 ps-2 pe-2.5 py-0.5 rounded-2xl bg-primary-50 mix-blend-multiply">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <g clip-path="url(#clip0_754_12595)">
                      <path d="M5.05051 2C5.68178 1.38141 6.54635 1 7.5 1C9.433 1 11 2.567 11 4.5C11 5.45367 10.6186 6.31825 9.99997 6.94952M3.75 6.5L4.5 6V8.75M3.75 8.75H5.25M8 7.5C8 9.433 6.433 11 4.5 11C2.567 11 1 9.433 1 7.5C1 5.567 2.567 4 4.5 4C6.433 4 8 5.567 8 7.5Z" stroke="#8DC220" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_754_12595">
                        <rect width="12" height="12" fill="white"/>
                      </clipPath>
                    </defs>
                </svg>
                <span class="text-primary-700 text-sm font-medium">
                    {#if empty($lastOrder.pricelist?.price)}
                        <span class="text-error-700">Price Unknown</span>
                    {:else}
                        {$lastOrder.pricelist?.price} per message
                    {/if}
                </span>
            </div>
        </div>
        <div class="flex justify-between items-center self-stretch">
            <div class="flex flex-col items-start gap-1 flex-1">
                <span class="text-gray-700 text-sm font-medium">Message Conent</span>
                {#if ! empty($message.numbersAttributes)}
                <span class="text-gray-600 text-sm">Use <span class="font-bold">/</span> or parameters list to insert it.</span>                    
                {/if}
            </div>
            <div class="flex justify-center items-center gap-3">
                <span class="text-gray-500 text-sm">Number of SMSs: {$message.segments?.length ?? 1}</span>
                <Droplist placeholder="Select Template" fetchOptionsFunction={fetchTemplates} onSelectOption={onSelectTemplate} clazz="w-48">
                    <svg slot="icon" class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6.25 10H6.25833M10 10H10.0083M13.75 10H13.7583M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 10.9976 2.69478 11.9497 3.04839 12.8204C3.11606 12.9871 3.1499 13.0704 3.165 13.1377C3.17976 13.2036 3.18516 13.2524 3.18517 13.3199C3.18518 13.3889 3.17265 13.4641 3.14759 13.6145L2.65344 16.5794C2.60169 16.8898 2.57582 17.0451 2.62397 17.1573C2.66611 17.2556 2.7444 17.3339 2.84265 17.376C2.95491 17.4242 3.11015 17.3983 3.42063 17.3466L6.38554 16.8524C6.53591 16.8273 6.61109 16.8148 6.68011 16.8148C6.74763 16.8148 6.79638 16.8202 6.86227 16.835C6.92962 16.8501 7.01294 16.8839 7.17958 16.9516C8.05025 17.3052 9.00238 17.5 10 17.5ZM6.66667 10C6.66667 10.2301 6.48012 10.4167 6.25 10.4167C6.01988 10.4167 5.83333 10.2301 5.83333 10C5.83333 9.76988 6.01988 9.58333 6.25 9.58333C6.48012 9.58333 6.66667 9.76988 6.66667 10ZM10.4167 10C10.4167 10.2301 10.2301 10.4167 10 10.4167C9.76988 10.4167 9.58333 10.2301 9.58333 10C9.58333 9.76988 9.76988 9.58333 10 9.58333C10.2301 9.58333 10.4167 9.76988 10.4167 10ZM14.1667 10C14.1667 10.2301 13.9801 10.4167 13.75 10.4167C13.5199 10.4167 13.3333 10.2301 13.3333 10C13.3333 9.76988 13.5199 9.58333 13.75 9.58333C13.9801 9.58333 14.1667 9.76988 14.1667 10Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                </Droplist>
            </div>
        </div>
        <div class="flex flex-col items-start flex-1 self-stretch gap-4">
            <div class="flex items-start flex-1 self-stretch gap-4">
                <div class="flex flex-col items-start self-stretch flex-1 gap-1.5">
                    <Textarea bind:html={textareaHtml} bind:text={textareaText} bind:onEnteringOption={onEnteringOption} bind:optionsOcurrence={attributesOcurrence} bind:censoredWordsNames={censoredWordsNames} censoredWords={messageFilters} onInput={onTextareaContentChanged} clazz="{empty(censoredWordsNames) ? "h-[200px]" : "h-[158px]"} overflow-y-auto {empty($message.numbersAttributes) ? "w-[722px]" : "w-[510px]"}" textInputFilter={(e) => messageLanguageFilter(e, $message.language.characters, $message.language.name)} autofillOptions={$message.numbersAttributes}/>
                    <span class="self-stretch text-gray-600 text-sm">{calcMessageLength(textareaText)}/{$message.segments.length <= 1 ? $message.language.max_characters_length : $message.segments.length * $message.language.split_characters_length} Characters ({$message.language.name})</span>
                </div>
                {#if ! empty($message.numbersAttributes)}
                <div class="flex flex-col items-start self-stretch gap-2 py-3 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm {empty(censoredWordsNames) ? "h-[259px]" : "h-[185px]"} w-48 overflow-y-auto">
                    <span class="text-gray-700 text-sm font-medium">Parameters</span>
                    {#each $message.numbersAttributes as attribute, index}
                        <button on:click={() => onEnteringOption(attribute, index)} class="flex justify-between items-center self-stretch ps-3 pe-2.5 py-1 rounded-2xl border-[1.5px] border-blue-light-600 {attributesOcurrence[index] > 0 && "bg-blue-light-50 border-none"}">
                            <span class="text-center text-blue-light-700 text-sm font-medium text-nowrap whitespace-nowrap text-ellipsis overflow-x-hidden">{attribute} {attributesOcurrence[index] > 0 ? "(" + attributesOcurrence[index] + ")" : ""}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <g clip-path="url(#clip0_754_14492)">
                                <path d="M6 4V8M4 6H8M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="#0BA5EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_754_14492">
                                    <rect width="12" height="12" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                        </button>
                    {/each}
                </div>
                {/if}
            </div>
            {#if ! empty(censoredWordsNames)}
            <div class="flex items-start self-stretch p-4 gap-3 rounded-xl border border-error-300 bg-error-25 truncate">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clip-path="url(#clip0_777_1658)">
                      <path d="M10.0003 6.66699V10.0003M10.0003 13.3337H10.0087M18.3337 10.0003C18.3337 14.6027 14.6027 18.3337 10.0003 18.3337C5.39795 18.3337 1.66699 14.6027 1.66699 10.0003C1.66699 5.39795 5.39795 1.66699 10.0003 1.66699C14.6027 1.66699 18.3337 5.39795 18.3337 10.0003Z" stroke="#D92D20" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_777_1658">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                </svg>
                <span class="self-stretch text-error-700 text-sm font-semibold truncate">We found a matching with the following blacklisted words: "<span class="text-error-600 text-base font-normal truncate">{censoredWordsNames.join(", ")}</span>", please remove them.</span>
            </div>
            {/if}
        </div>
    </div>    

    <div slot="footer" class="flex items-center self-stretch gap-12 pb-6 px-6">
        <button class="flex justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.83333 2.5V5.33333C5.83333 5.80004 5.83333 6.0334 5.92416 6.21166C6.00406 6.36846 6.13154 6.49594 6.28834 6.57584C6.4666 6.66667 6.69996 6.66667 7.16667 6.66667H12.8333C13.3 6.66667 13.5334 6.66667 13.7117 6.57584C13.8685 6.49594 13.9959 6.36846 14.0758 6.21166C14.1667 6.0334 14.1667 5.80004 14.1667 5.33333V3.33333M14.1667 17.5V12.1667C14.1667 11.7 14.1667 11.4666 14.0758 11.2883C13.9959 11.1315 13.8685 11.0041 13.7117 10.9242C13.5334 10.8333 13.3 10.8333 12.8333 10.8333H7.16667C6.69996 10.8333 6.4666 10.8333 6.28834 10.9242C6.13154 11.0041 6.00406 11.1315 5.92416 11.2883C5.83333 11.4666 5.83333 11.7 5.83333 12.1667V17.5M17.5 7.77124V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5H12.2288C12.6364 2.5 12.8402 2.5 13.0321 2.54605C13.2021 2.58688 13.3647 2.65422 13.5138 2.7456C13.682 2.84867 13.8261 2.9928 14.1144 3.28105L16.719 5.88562C17.0072 6.17387 17.1513 6.318 17.2544 6.48619C17.3458 6.63531 17.4131 6.79789 17.4539 6.96795C17.5 7.15976 17.5 7.36358 17.5 7.77124Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-600 font-semibold">Save as draft</span>
        </button>
        <div class="flex justify-end items-center flex-1 gap-3">
            <button on:click={back} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Back</span>
            </button>
            <button disabled={! empty(censoredWordsNames) || empty(textareaText)} on:click={nextStep} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {! empty(censoredWordsNames) || empty(textareaText) ? "opacity-20" : "opacity-100"}">
                <span class="text-white font-semibold">Next Step</span>
            </button>
        </div>
    </div>
</AddMessageModal>