<script>
	import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { message } from "$lib/helper/store"
    import { errorAlert } from "$lib/helper/alert"
    import { parseExcelFile, parseTextFile, parseWordFile } from "$lib/helper/file"

    let numbers = []
    let loadError = false
    let showTooltip = false
    let loadComplete = false
    let loadInProgress = false
    let uploadingFileName = ""
    let uploadingFileSizeKB = 0
    let uploadingFilePercentage = 0

    onMount(() => {
        $message.validNumbers = []
        $message.invalidNumbers = []
        $message.numbersAttributes = []
        for (let i = 0; i < $message.connections.length; i++) {
            $message.connections[i].numbers = []
        }
    })

    const toggleTooltip = () => {
        showTooltip = !showTooltip
    }

    const showTooltipHandler = () => {
        showTooltip = true
    }

    const hideTooltipHandler = () => {
        showTooltip = false
    }

    const removeUpload = () => {
        numbers = []
        loadError = false
        loadComplete = false
        loadInProgress = false
        uploadingFileName = ""
        uploadingFileSizeKB = 0
        uploadingFilePercentage = 0
        $message.validNumbers = []
        $message.invalidNumbers = []

        for (let i = 0; i < $message.connections.length; i++) {
            $message.connections[i].numbers = []
        }
    }

    const handleOnChange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.onloadstart = function (e) {
            loadInProgress = true
            uploadingFileName = file.name
            uploadingFileSizeKB = (file.size / 1024).toFixed(1)
        }

        reader.onprogress = function(e) {
            uploadingFilePercentage = Math.round((e.loaded / e.total) * 100);
        }

        reader.onloadend = function (e) {
            loadComplete = true
            e.target.attributes = file
            onSelectFile(e.target)
        }

        reader.onerror = function (e) {
            loadError = true
        }

        reader.readAsBinaryString(file)
    }

    const onSelectFile = (file) => {
        let content = file.result

        switch (file.attributes.type) {
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                numbers = [...new Set(parseWordFile(content).filter(n => n && n))].filter(Number)
                break

            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                numbers = [...new Set(parseExcelFile(content).filter(n => n && n))].filter(Number)
                break

            default:
                numbers = [...new Set(parseTextFile(content).filter(n => n && n))].filter(Number)
                break
        }

        $message.validNumbers = []
        $message.invalidNumbers = []
        for (let i = 0; i < $message.connections.length; i++) {
            $message.connections[i].numbers = []
        }

        if (loadComplete && empty(numbers)) {
            loadError = true
            return
        }

        for (let i = 0; i < numbers.length; i++) {
            for (let j = 0; j < $message.connections.length; j++) {
                if ($message.connections[j].country_code == "20" && numbers[i].startsWith("0")) {
                    numbers[i] = "2" + numbers[i]
                }

                if ($message.connections[j].country_code == "20" && ! numbers[i].startsWith("20")) {
                    numbers[i] = "20" + numbers[i]
                }

                if (numbers[i].startsWith($message.connections[j].country_code + $message.connections[j].operator_code + "")) {
                    $message.connections[j].numbers.push(numbers[i])
                    $message.validNumbers.push(numbers[i])
                }
            }
        }

        let validNumbersSet = new Set($message.validNumbers)
        $message.validNumbers = [...validNumbersSet]
        $message.invalidNumbers = numbers.filter(num => !validNumbersSet.has(num))
    }

    $: if(loadError) {
        errorAlert("Upload numbers failed", 5)
    }
</script>

<div class="flex flex-col items-start flex-1 gap-4 w-full">
    <div class="flex items-center self-stretch gap-3">
        <div class="flex flex-col items-start gap-1 w-full">
            <div class="relative flex items-center gap-1">
                <span class="text-gray-700 text-sm font-medium">Upload Numbers File</span>
                <button on:click={toggleTooltip} on:mouseleave={hideTooltipHandler} on:mouseover={showTooltipHandler} on:focus={showTooltipHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <g clip-path="url(#clip0_438_20996)">
                            <path d="M8.00016 10.6668V8.00016M8.00016 5.3335H8.00683M14.6668 8.00016C14.6668 11.6821 11.6821 14.6668 8.00016 14.6668C4.31826 14.6668 1.3335 11.6821 1.3335 8.00016C1.3335 4.31826 4.31826 1.3335 8.00016 1.3335C11.6821 1.3335 14.6668 4.31826 14.6668 8.00016Z" stroke="#D0D5DD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_438_20996">
                                <rect width="16" height="16" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </button>
                <div class="absolute left-[137px] -top-14 flex flex-col items-start w-96 transition-all duration-300 ease-in-out {showTooltip ? "visible opacity-100" : "invisible opacity-0"}">
                    <div class="flex flex-col items-start self-stretch py-2 px-3 rounded-lg bg-gray-900 shadow-lg">
                        <span class="text-white text-center text-xs font-semibold">Accept numbers in format 01xx or 201xx (or prefixed with valid country code and operator code)</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="9" viewBox="0 0 28 9" fill="none">
                        <path d="M26.0711 0.485289C26.962 0.485289 27.4081 1.56243 26.7782 2.1924L20.7071 8.26347C20.3166 8.654 19.6834 8.654 19.2929 8.26347L13.2218 2.1924C12.5919 1.56243 13.038 0.485289 13.9289 0.485289L26.0711 0.485289Z" fill="#101828"/>
                    </svg>
                </div>
            </div>
            <span class="text-gray-700 text-sm">Choose your numbers file and upload it here</span>
        </div>
        <button class="flex justify-center items-center gap-2 py-2 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M9.99984 18.8332C14.6022 18.8332 18.3332 15.1022 18.3332 10.4998C18.3332 5.89746 14.6022 2.1665 9.99984 2.1665C5.39746 2.1665 1.6665 5.89746 1.6665 10.4998C1.6665 15.1022 5.39746 18.8332 9.99984 18.8332Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.9165 7.97095C7.9165 7.57321 7.9165 7.37434 7.99962 7.26332C8.07206 7.16657 8.18293 7.10603 8.30349 7.09742C8.44182 7.08754 8.60911 7.19508 8.94368 7.41016L12.8775 9.93905C13.1678 10.1257 13.313 10.219 13.3631 10.3377C13.4069 10.4413 13.4069 10.5583 13.3631 10.662C13.313 10.7807 13.1678 10.874 12.8775 11.0606L8.94368 13.5895C8.60911 13.8046 8.44182 13.9121 8.30349 13.9023C8.18293 13.8936 8.07206 13.8331 7.99962 13.7364C7.9165 13.6253 7.9165 13.4265 7.9165 13.0287V7.97095Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-700 text-sm font-semibold text-nowrap whitespace-nowrap">How to Import</span>
        </button>
        <button class="flex justify-center items-center gap-2 py-2 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M11.6668 2.39111V5.83323C11.6668 6.29994 11.6668 6.5333 11.7577 6.71156C11.8376 6.86836 11.965 6.99584 12.1218 7.07574C12.3001 7.16656 12.5335 7.16656 13.0002 7.16656H16.4423M7.50016 12.9998L10.0002 15.4998M10.0002 15.4998L12.5002 12.9998M10.0002 15.4998L10.0002 10.4998M11.6668 2.1665H7.3335C5.93336 2.1665 5.2333 2.1665 4.69852 2.43899C4.22811 2.67867 3.84566 3.06112 3.60598 3.53153C3.3335 4.06631 3.3335 4.76637 3.3335 6.1665V14.8332C3.3335 16.2333 3.3335 16.9334 3.60598 17.4681C3.84566 17.9386 4.22811 18.321 4.69852 18.5607C5.2333 18.8332 5.93336 18.8332 7.3335 18.8332H12.6668C14.067 18.8332 14.767 18.8332 15.3018 18.5607C15.7722 18.321 16.1547 17.9386 16.3943 17.4681C16.6668 16.9334 16.6668 16.2333 16.6668 14.8332V7.1665L11.6668 2.1665Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-700 text-sm font-semibold text-nowrap whitespace-nowrap">Download Sample</span>
        </button>
    </div>
    {#if loadInProgress}
    <div class="relative flex items-start self-stretch gap-1 p-4 rounded-xl border {loadError ? "border-error-300 bg-error-25" : (loadComplete ? "border-primary-600 bg-white" : "border-gray-200 bg-white")}">
        <div class="flex items-start flex-1 gap-4">
            <div class="flex justify-center items-center w-8 h-8 p-2 rounded-[28px] border-4 {loadError ? "border-error-50 bg-error-100" : "border-primary-50 bg-primary-100"}">
                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path d="M9.33317 2.01314V4.76683C9.33317 5.1402 9.33317 5.32688 9.40583 5.46949C9.46975 5.59493 9.57173 5.69692 9.69718 5.76083C9.83978 5.8335 10.0265 5.8335 10.3998 5.8335H13.1535M13.3332 7.15898V11.9668C13.3332 13.0869 13.3332 13.647 13.1152 14.0748C12.9234 14.4511 12.6175 14.7571 12.2412 14.9488C11.8133 15.1668 11.2533 15.1668 10.1332 15.1668H5.8665C4.7464 15.1668 4.18635 15.1668 3.75852 14.9488C3.3822 14.7571 3.07624 14.4511 2.88449 14.0748C2.6665 13.647 2.6665 13.0869 2.6665 11.9668V5.0335C2.6665 3.91339 2.6665 3.35334 2.88449 2.92552C3.07624 2.54919 3.3822 2.24323 3.75852 2.05148C4.18635 1.8335 4.7464 1.8335 5.8665 1.8335H8.00769C8.49687 1.8335 8.74146 1.8335 8.97163 1.88876C9.17571 1.93775 9.3708 2.01856 9.54974 2.12822C9.75157 2.2519 9.92453 2.42485 10.2704 2.77075L12.3959 4.89624C12.7418 5.24214 12.9148 5.41509 13.0385 5.61693C13.1481 5.79587 13.2289 5.99096 13.2779 6.19503C13.3332 6.42521 13.3332 6.6698 13.3332 7.15898Z" stroke={loadError ? "#D92D20" : "#6D9A16"} stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex flex-col items-start flex-1 gap-1">
                <div class="flex flex-col items-start self-stretch pe-8">
                    {#if loadError}
                    <span class="self-stretch text-error-700 text-sm font-medium">Upload failed, please try again</span>
                    {/if}
                    <span class="self-stretch text-sm font-medium {loadError ? "text-error-600" : "text-gray-700"}">{uploadingFileName}</span>
                    {#if loadError}
                    <button on:click={removeUpload} class="flex justify-center items-center gap-2">
                        <span class="text-error-700 text-sm font-semibold">Try again</span>
                    </button>
                    {:else}
                    <span class="self-stretch text-gray-600 text-sm">{uploadingFileSizeKB} KB</span>
                    {/if}
                </div>
                {#if ! loadError}
                <div class="flex items-center self-stretch gap-3">
                    <div class="relative flex-1 h-2">
                        <div class="h-full flex-shrink-0 rounded bg-gray-200"></div>
                        <div style="width: {uploadingFilePercentage}%;" class="absolute top-0 h-full flex-shrink-0 rounded bg-primary-600"></div>
                    </div>
                    <span class="text-gray-700 text-sm font-medium">{uploadingFilePercentage}%</span>
                </div>
                {/if}
            </div>
        </div>
        <div class="absolute top-2 right-2 flex justify-end items-center gap-3 rounded-lg">
            {#if loadComplete && ! loadError}
            <div class="flex justify-center items-center w-4 h-4 p-[3px] rounded-lg border border-primary-600 bg-primary-600">
                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none">
                    <path d="M8.33366 3L3.75033 7.58333L1.66699 5.5" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>                
            {/if}
            <button on:click={removeUpload} class=" flex justify-center items-center gap-2 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path d="M13.3333 5.49984V4.83317C13.3333 3.89975 13.3333 3.43304 13.1517 3.07652C12.9919 2.76292 12.7369 2.50795 12.4233 2.34816C12.0668 2.1665 11.6001 2.1665 10.6667 2.1665H9.33333C8.39991 2.1665 7.9332 2.1665 7.57668 2.34816C7.26308 2.50795 7.00811 2.76292 6.84832 3.07652C6.66667 3.43304 6.66667 3.89975 6.66667 4.83317V5.49984M8.33333 10.0832V14.2498M11.6667 10.0832V14.2498M2.5 5.49984H17.5M15.8333 5.49984V14.8332C15.8333 16.2333 15.8333 16.9334 15.5608 17.4681C15.3212 17.9386 14.9387 18.321 14.4683 18.5607C13.9335 18.8332 13.2335 18.8332 11.8333 18.8332H8.16667C6.76654 18.8332 6.06647 18.8332 5.53169 18.5607C5.06129 18.321 4.67883 17.9386 4.43915 17.4681C4.16667 16.9334 4.16667 16.2333 4.16667 14.8332V5.49984" stroke={loadError ? "#B42318" : "#667085"} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    </div>
    {:else}
    <div class="relative flex flex-col justify-center items-center flex-1 self-stretch gap-1 py-4 px-6 rounded-xl border border-gray-200 bg-white">
        <input class="absolute w-full h-full cursor-pointer opacity-0" type="file" on:change={handleOnChange} on:click= { (e)=> { e.target.value = null }}/>
        <div class="flex flex-col items-center self-stretch gap-3">
            <div class="flex justify-center items-center w-14 h-14 p-3.5 rounded-[28px] border-[10px] border-gray-50 bg-gray-100">
                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M9.3335 18.6667L14.0002 14M14.0002 14L18.6668 18.6667M14.0002 14V24.5M23.3335 19.5333C24.7586 18.3564 25.6668 16.5759 25.6668 14.5833C25.6668 11.0395 22.794 8.16667 19.2502 8.16667C18.9952 8.16667 18.7567 8.03366 18.6273 7.81403C17.1059 5.23231 14.297 3.5 11.0835 3.5C6.251 3.5 2.3335 7.41751 2.3335 12.25C2.3335 14.6605 3.30818 16.8433 4.88494 18.4258" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex flex-col items-center self-stretch gap-1">
                <div class="flex justify-center items-start self-stretch gap-1">
                    <button class="flex justify-center items-center gap-2">
                        <span class="text-primary-700 font-semibold">Click to upload</span>
                    </button>
                    <span class="text-gray-600">or drag and drop</span>
                </div>
                <span class="self-stretch text-gray-600 text-sm text-center">xlsx, csv, docx or txt (max. 100,000 numbers)</span>
            </div>
        </div>
    </div>
    {/if}
</div>