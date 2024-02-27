<script>
	import FromFile from "./Upload/FromFile.svelte"
	import SavedGroup from "./Upload/SavedGroup.svelte"
	import BulkNumbers from "./Upload/BulkNumbers.svelte"
	import ExtendedForm from "./Upload/ExtendedForm.svelte"
	import FileWithParameters from "./Upload/FileWithParameters.svelte"

    import { empty } from "$lib/helper/utils"
    import { message } from "$lib/helper/store"
    import { handleImageError } from "$lib/helper/image"
    import { makeArrayUnique } from "$lib/helper/arrUtils"
    import { randomString, beautifulToSnakeCase } from "$lib/helper/strUtils"

    export let addMethod

    let uniqueSenderConnections = makeArrayUnique($message.connections, "operator_name")

    let showGroupInput = false
    let showGroupSaveMessage = false
    let showGroupSaveErrorMessage = false

    let groupName = "group-" + randomString()
    $message.groupName = groupName
    $message.customGroup = false

    const setUploadMethod = (uploadMethod) => {
        addMethod = uploadMethod
    }

    const saveGroup = () => {
        if (! empty(groupName) && ! empty($message.validNumbers)) {
            showGroupSaveMessage = true
            $message.groupName = groupName
            $message.customGroup = true
        } else {
            showGroupSaveErrorMessage = true
        }
    }

    const toggleGroupInput = () => {
        showGroupInput = !showGroupInput
        groupName = ""
        showGroupSaveMessage = false
        showGroupSaveErrorMessage = false
    }

    const onKeyDownHandler = () => {
        showGroupSaveMessage = false
        showGroupSaveErrorMessage = false
    }
</script>

<div class="flex flex-col items-start flex-1 self-stretch gap-4">
    <div class="flex flex-col items-start self-stretch gap-2 border-b border-b-gray-200">
        <div class="flex items-start gap-4">
            <button on:click={() => setUploadMethod("add-extended-form")} class="flex justify-center items-center gap-2 p-3 {addMethod == "add-extended-form" && "border-b-2 border-b-primary-700 bg-primary-50"}">
                <i class="fa-regular fa-arrow-down-big-small {addMethod == "add-extended-form" ? "text-[#527615]" : "text-[#667085]"}"></i>
                <span class="{addMethod == "add-extended-form" ? "text-primary-700" : "text-gray-500"} text-sm font-medium">Extended Form</span>
            </button>

            <button on:click={() => setUploadMethod("add-bulk-message")} class="flex justify-center items-center gap-2 p-3 {addMethod == "add-bulk-message" && "border-b-2 border-b-primary-700 bg-primary-50"}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10.8332 5.83333H4.33317C3.39975 5.83333 2.93304 5.83333 2.57652 6.01499C2.26292 6.17478 2.00795 6.42975 1.84816 6.74335C1.6665 7.09987 1.6665 7.56658 1.6665 8.5V11.5C1.6665 12.4334 1.6665 12.9001 1.84816 13.2567C2.00795 13.5703 2.26292 13.8252 2.57652 13.985C2.93304 14.1667 3.39975 14.1667 4.33317 14.1667H10.8332M14.1665 5.83333H15.6665C16.5999 5.83333 17.0666 5.83333 17.4232 6.01499C17.7368 6.17478 17.9917 6.42975 18.1515 6.74335C18.3332 7.09987 18.3332 7.56658 18.3332 8.5V11.5C18.3332 12.4334 18.3332 12.9001 18.1515 13.2567C17.9917 13.5703 17.7368 13.8252 17.4232 13.985C17.0666 14.1667 16.5999 14.1667 15.6665 14.1667H14.1665M14.1665 17.5L14.1665 2.5M16.2498 2.50001L12.0832 2.5M16.2498 17.5L12.0832 17.5" stroke={addMethod == "add-bulk-message" ? "#527615" : "#667085"} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="{addMethod == "add-bulk-message" ? "text-primary-700" : "text-gray-500"} text-sm font-medium">Bulk Numbers</span>
            </button>

            <button on:click={() => setUploadMethod("add-custom-message")} class="flex justify-center items-center gap-2 p-3 {addMethod == "add-custom-message" && "border-b-2 border-b-primary-700 bg-primary-50"}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10.0002 11.6665V7.08317C10.0002 6.39281 10.5598 5.83317 11.2502 5.83317C11.9405 5.83317 12.5002 6.39281 12.5002 7.08317V11.6665C12.5002 13.0472 11.3809 14.1665 10.0002 14.1665C8.61945 14.1665 7.50016 13.0472 7.50016 11.6665V8.33317M7.3335 18.3332H12.6668C14.067 18.3332 14.767 18.3332 15.3018 18.0607C15.7722 17.821 16.1547 17.4386 16.3943 16.9681C16.6668 16.4334 16.6668 15.7333 16.6668 14.3332V5.6665C16.6668 4.26637 16.6668 3.56631 16.3943 3.03153C16.1547 2.56112 15.7722 2.17867 15.3018 1.93899C14.767 1.6665 14.067 1.6665 12.6668 1.6665H7.3335C5.93336 1.6665 5.2333 1.6665 4.69852 1.93899C4.22811 2.17867 3.84566 2.56112 3.60598 3.03153C3.3335 3.56631 3.3335 4.26637 3.3335 5.6665V14.3332C3.3335 15.7333 3.3335 16.4334 3.60598 16.9681C3.84566 17.4386 4.22811 17.821 4.69852 18.0607C5.2333 18.3332 5.93336 18.3332 7.3335 18.3332Z" stroke={addMethod == "add-custom-message" ? "#527615" : "#667085"} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="{addMethod == "add-custom-message" ? "text-primary-700" : "text-gray-500"} text-sm font-medium">From File</span>
            </button>

            <button on:click={() => setUploadMethod("add-custom-with-parameters")} class="flex justify-center items-center gap-2 p-3 {addMethod == "add-custom-with-parameters" && "border-b-2 border-b-primary-700 bg-primary-50"}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M13.3335 3.33317C14.1085 3.33317 14.496 3.33317 14.8139 3.41836C15.6766 3.64952 16.3505 4.32339 16.5816 5.18612C16.6668 5.50404 16.6668 5.89153 16.6668 6.6665V14.3332C16.6668 15.7333 16.6668 16.4334 16.3943 16.9681C16.1547 17.4386 15.7722 17.821 15.3018 18.0607C14.767 18.3332 14.067 18.3332 12.6668 18.3332H7.3335C5.93336 18.3332 5.2333 18.3332 4.69852 18.0607C4.22811 17.821 3.84566 17.4386 3.60598 16.9681C3.3335 16.4334 3.3335 15.7333 3.3335 14.3332V6.6665C3.3335 5.89153 3.3335 5.50404 3.41868 5.18612C3.64985 4.32339 4.32372 3.64952 5.18645 3.41836C5.50436 3.33317 5.89185 3.33317 6.66683 3.33317M10.0002 12.9165V9.1665C10.0002 8.47615 10.5598 7.9165 11.2502 7.9165C11.9405 7.9165 12.5002 8.47615 12.5002 9.1665V12.9165C12.5002 14.2972 11.3809 15.4165 10.0002 15.4165C8.61945 15.4165 7.50016 14.2972 7.50016 12.9165V9.58317M8.00016 4.99984H12.0002C12.4669 4.99984 12.7002 4.99984 12.8785 4.90901C13.0353 4.82912 13.1628 4.70163 13.2427 4.54483C13.3335 4.36657 13.3335 4.13321 13.3335 3.6665V2.99984C13.3335 2.53313 13.3335 2.29977 13.2427 2.12151C13.1628 1.96471 13.0353 1.83723 12.8785 1.75733C12.7002 1.6665 12.4669 1.6665 12.0002 1.6665H8.00016C7.53345 1.6665 7.3001 1.6665 7.12184 1.75733C6.96504 1.83723 6.83755 1.96471 6.75766 2.12151C6.66683 2.29977 6.66683 2.53313 6.66683 2.99984V3.6665C6.66683 4.13321 6.66683 4.36657 6.75766 4.54483C6.83755 4.70163 6.96504 4.82912 7.12184 4.90901C7.3001 4.99984 7.53345 4.99984 8.00016 4.99984Z" stroke={addMethod == "add-custom-with-parameters" ? "#527615" : "#667085"} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="{addMethod == "add-custom-with-parameters" ? "text-primary-700" : "text-gray-500"} text-sm font-medium">File with Parameters</span>
            </button>

            <button on:click={() => setUploadMethod("add-group-sms")} class="flex justify-center items-center gap-2 p-3 {addMethod == "add-group-sms" && "border-b-2 border-b-primary-700 bg-primary-50"}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M18.3332 17.5V15.8333C18.3332 14.2801 17.2709 12.9751 15.8332 12.605M12.9165 2.7423C14.1381 3.23679 14.9998 4.43443 14.9998 5.83333C14.9998 7.23224 14.1381 8.42988 12.9165 8.92437M14.1665 17.5C14.1665 15.9469 14.1665 15.1703 13.9128 14.5577C13.5745 13.741 12.9255 13.092 12.1088 12.7537C11.4962 12.5 10.7196 12.5 9.1665 12.5H6.6665C5.11337 12.5 4.3368 12.5 3.72423 12.7537C2.90747 13.092 2.25855 13.741 1.92024 14.5577C1.6665 15.1703 1.6665 15.9469 1.6665 17.5M11.2498 5.83333C11.2498 7.67428 9.75745 9.16667 7.9165 9.16667C6.07555 9.16667 4.58317 7.67428 4.58317 5.83333C4.58317 3.99238 6.07555 2.5 7.9165 2.5C9.75745 2.5 11.2498 3.99238 11.2498 5.83333Z" stroke={addMethod == "add-group-sms" ? "#527615" : "#667085"} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="{addMethod == "add-group-sms" ? "text-primary-700" : "text-gray-500"} text-sm font-medium">Saved Group</span>
            </button>
        </div>
    </div>

    <div class="flex flex-col items-start flex-1 self-stretch gap-4 {showGroupInput ? "max-h-[226px]" : "max-h-[280px]"} {(showGroupSaveMessage || showGroupSaveErrorMessage) && "max-h-[212px]"} {addMethod == "add-group-sms" && "max-h-[290px]"}">

        {#if addMethod == "add-extended-form"}
            <ExtendedForm />
        {/if}

        {#if addMethod == "add-bulk-message"}
            <BulkNumbers />
        {/if}

        {#if addMethod == "add-custom-message"}
            <FromFile />
        {/if}

        {#if addMethod == "add-custom-with-parameters"}
            <FileWithParameters />
        {/if}

        {#if addMethod == "add-group-sms"}
            <SavedGroup />
        {/if}
    </div>

    <div class="flex items-center self-stretch bg-white w-full gap-4 {addMethod == "add-group-sms" ? "justify-center" : "justify-between"}">
        {#if addMethod != "add-group-sms"}
        <div class="flex flex-col items-start flex-1 gap-2">
            <div class="flex items-start flex-1 gap-2 w-[300px]">
                <button on:click={toggleGroupInput} class="flex items-center w-9 h-5 p-0.5 me-1 rounded-xl {showGroupInput ? "bg-primary-600" : "bg-gray-200"}">
                    <svg class="flex-shrink-0 transition-all duration-700 ease-in-out {showGroupInput ? "translate-x-3.5" : "translate-x-0"}" xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <g filter="url(#filter0_dd_684_12226)">
                        <circle cx="10" cy="10" r="8" fill="white"/>
                        </g>
                        <defs>
                        <filter id="filter0_dd_684_12226" x="-1" y="0" width="22" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="1"/>
                            <feGaussianBlur stdDeviation="1"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.06 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_684_12226"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="1"/>
                            <feGaussianBlur stdDeviation="1.5"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0"/>
                            <feBlend mode="normal" in2="effect1_dropShadow_684_12226" result="effect2_dropShadow_684_12226"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_684_12226" result="shape"/>
                        </filter>
                        </defs>
                    </svg>
                </button>
                <div class="flex flex-col items-start flex-1">
                <span class="self-stretch text-gray-700 text-sm font-medium">Save Numbers as New Group</span>
                <span class="self-stretch text-gray-600 text-sm">Save group for future using</span>
                </div>
            </div>
  
            <div class=" flex-col items-start self-stretch gap-2 {showGroupInput ? "flex" : "hidden"}">
                <div class="flex items-center self-stretch rounded-lg border border-gray-300 bg-white shadow-sm gap-2 flex-1 p-1 w-[300px]">
                <input on:keydown={onKeyDownHandler} bind:value={groupName} class="flex items-center flex-1 ps-3 pe-1 py-1 placeholder:text-gray-500 outline-none" placeholder="Enter group name" />
                {#if showGroupSaveMessage}
                    <button class="flex justify-center items-center gap-2 p-2 rounded-lg border border-primary-50 bg-primary-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M16.6663 5L7.49967 14.1667L3.33301 10" stroke="#527615" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>     
                {:else}
                    <button on:click={saveGroup} class="flex justify-center items-center gap-2 py-2 px-3.5 rounded-lg border border-blue-50 bg-blue-50">
                        <span class="text-blue-light-700 text-sm font-semibold">Save</span>
                    </button>
                {/if}
                </div>
                {#if showGroupSaveErrorMessage && empty($message.validNumbers)}
                    <span class="text-red-600 text-sm font-[Montserrat]">Please enter valid recipients numbers!</span>
                {/if}
                {#if showGroupSaveErrorMessage && ! empty($message.validNumbers) && empty(groupName)}
                <span class="text-red-600 text-sm font-[Montserrat]">Please type a valid group name!</span>
                {/if}
                {#if showGroupSaveMessage && ! empty($message.validNumbers) && ! empty(groupName)}
                <span class="text-gray-600 text-sm font-[Montserrat]">Group saved!</span>
                {/if}
            </div>
        </div>
        {/if}

        <div class="flex items-center flex-wrap gap-2">
            {#each uniqueSenderConnections as conn}
            <div class="flex items-center gap-1.5 py-1 pe-3 ps-1.5 rounded-2xl bg-gray-100 {empty($message.connections.find(c => c.operator_name == conn.operator_name).numbers) ? "mix-blend-luminosity opacity-[0.4]" : "mix-blend-multiply opacity-100"}">
                <img on:error={handleImageError} alt="" src="image/operators/{beautifulToSnakeCase(conn.operator_name)}.png" />
                <span class="text-gray-700 text-center text-sm font-medium">
                    {conn.operator_name} {$message.connections.find(c => c.operator_name == conn.operator_name)?.numbers?.length ?? 0}
                </span>
            </div>
            {/each}
            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="13" viewBox="0 0 2 13" fill="none">
                <path d="M1.5 1C1.5 0.723858 1.27614 0.5 1 0.5C0.723858 0.5 0.5 0.723858 0.5 1L1.5 1ZM0.5 1L0.499999 13L1.5 13L1.5 1L0.5 1Z" fill="#EAECF0"/>
            </svg>
            <div class="flex items-center gap-1.5 ps-2.5 pe-3 py-1 rounded-2xl bg-success-50 {$message.validNumbers.length == 0 ? "mix-blend-luminosity opacity-[0.4]" : "mix-blend-multiply opacity-100"}">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <circle cx="4" cy="4" r="3" fill="#12B76A"/>
                </svg>
                <span class="text-success-700 text-center text-sm font-medium">Valid {$message.validNumbers.length}</span>
            </div>
            <div class="flex items-center gap-1.5 ps-2.5 pe-3 py-1 rounded-2xl bg-error-50 {$message.invalidNumbers.length == 0 ? "mix-blend-luminosity opacity-[0.4]" : "mix-blend-multiply opacity-100"}">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <circle cx="4" cy="4" r="3" fill="#F04438"/>
                </svg>
                <span class="text-error-700 text-center text-sm font-medium">Wrong {$message.invalidNumbers.length}</span>
            </div>
        </div>
    </div>
</div>