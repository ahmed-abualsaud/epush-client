<script>
	import Modal from "../../shared/Modal.svelte"
	import GroupErrorModal from "./GroupErrorModal.svelte"
	import DeleteGroupModal from "./DeleteGroupModal.svelte"
    import GroupSuccessModal from "./GroupSuccessModal.svelte"
    import RecipientErrorPopup from "./RecipientErrorPopup.svelte"
	import RecipientSuccessPopup from "./RecipientSuccessPopup.svelte"
	import EditGroupRecipientPopup from "./EditGroupRecipientPopup.svelte"
	import DeleteGroupRecipientPopup from "./DeleteGroupRecipientPopup.svelte"

	import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { showPopup } from "$lib/helper/popup"
    import { currentClient } from "$lib/helper/store"
    import { exportExcel } from "../../../api/fileApi"
    import { handleImageError } from "$lib/helper/image"
    import { makeArrayUnique } from "$lib/helper/arrUtils"
    import { showModal, hideModal } from "$lib/helper/modal"
    import { setcurrentRouteDisplay } from "$lib/router/router"
    import { successAlert, errorAlert } from "$lib/helper/alert"
    import { isValidJSON, snakeToBeautifulCase, beautifulToSnakeCase } from "$lib/helper/strUtils"
    import { updateMessageGroup, getMessageGroupRecipients, addMessageGroupRecipient } from "../../../api/messageApi"

    export let group = {}
    export let saved = false

    let columnsList

    let groupName = ""
    let addedNumber = ""
    let searchValue = ""
    let selectedPrefix = ""
    let addedAttributes = ""
    let currentAction = "save"
    let selectedColumn = "number"

    let loading = true
    let showPrefixes = false
    let showGroupInput = true
    let addedNumberValid = false
    let addedAttributesValid = false

    let prefixes = []
    let recipientsChunk = []
    let groupRecipients = []
    let filteredGroupRecipients = []
    let uniqueClientConnections = []
    let columns = ["number", "attributes"]
    let selectedUpdateRecipient = {}
    let selectedDeleteRecipient = {}

    onMount(async () => {
        uniqueClientConnections = makeArrayUnique($currentClient.connections, "operator_name")

        for (let i = 0; i < 10000; i++) {
            recipientsChunk = (await getMessageGroupRecipients(group.id, i + 1, 5000)).data
            if(empty(recipientsChunk)) {
                loading = false
                break
            }
            groupRecipients = [...groupRecipients, ...recipientsChunk]
        }

        filteredGroupRecipients = groupRecipients
    
        for (let i = 0; i < $currentClient.connections.length; i++) {
            $currentClient.connections[i].numbers = []
        }

        for (let i = 0; i < groupRecipients.length; i++) {
            for (let j = 0; j < $currentClient.connections.length; j++) {
                if (groupRecipients[i].number.startsWith($currentClient.connections[j].country_code + $currentClient.connections[j].operator_code + "")) {
                    $currentClient.connections[j].numbers.push(groupRecipients[i].number)
                }
            }
        }

        prefixes = [...new Set($currentClient.connections.map(conn => conn.country_code))]
        prefixes = empty(prefixes.find(c => c == "20")) ? prefixes : [prefixes.find(c => c == "20"), ...prefixes.filter(c => c != "20")]
        selectedPrefix = prefixes[0]
    })

    const toggleGroupInput = () => {
        showGroupInput = !showGroupInput
    }

    const searchRecipients = () => {
        filteredGroupRecipients = groupRecipients.filter(recipient => recipient[selectedColumn].includes(searchValue))
    }

    const togglePrefixes = () => {
        showPrefixes = !showPrefixes
    }

    const setSelectedPrefix = (prefix) => {
        showPrefixes = !showPrefixes
        selectedPrefix = prefix
        validateNumber(addedNumber)
    }

    const onHover = (e) => {
        e.target.closest("button").lastChild.classList.add("flex")
        e.target.closest("button").lastChild.classList.remove("hidden")
    }

    const onLeave = (e) => {
        e.target.closest("button").lastChild.classList.add("hidden")
        e.target.closest("button").lastChild.classList.remove("flex")
    }

    const selectColumn = () => {
        columnsList.classList.toggle("opacity-0")
        columnsList.classList.toggle("invisible")
    }

    const setSelectedColumn = (column) => {
        selectedColumn = column
        hideDropdown()
    }

    const hideDropdown = () => {
        columnsList.classList.add("opacity-0")
        columnsList.classList.add("invisible")
    }

    const copyToClipboard = (e) => {
        navigator.clipboard.writeText(e.target.innerText)
        .then(() => {
            successAlert('Copied to clipboard', 2)
        })
        .catch(err => {
            errorAlert('Error copying to clipboard: ' + err.message, 5)
        })
    }

    const editGroup = async () => {
        try {
            await updateMessageGroup(group.id, {name: groupName, saved: true})

            showModal(GroupSuccessModal, {action: "update"})
            await setcurrentRouteDisplay("Home")
            await setcurrentRouteDisplay("Groups")
        } catch (e) {
            showModal(GroupErrorModal, {action: "update"})
        }
    }

    const deleteGroup = () => {
        showModal(DeleteGroupModal, {groups: group})
    }

    const addRecipient = async () => {
        let rightNumber = addedNumber + ""
        rightNumber = (selectedPrefix == "20" && rightNumber.startsWith("0")) ? rightNumber.substring(1) : rightNumber
        currentAction = "save"
        try {
            await addMessageGroupRecipient({
                message_group_id: group.id,
                recipients: [{
                    number: selectedPrefix + rightNumber,
                    attributes: addedAttributes
                }]
            })
            groupRecipients = [...groupRecipients, {
                number: addedNumber + "",
                attributes: addedAttributes
            }]
            filteredGroupRecipients = groupRecipients
            await updateMessageGroup(group.id, {number_of_recipients: filteredGroupRecipients.length})

            showPopup("recipient-success")
            await setcurrentRouteDisplay("Home")
            await setcurrentRouteDisplay("Groups")
        } catch (e) {
            showPopup("recipient-error")
        }
    }

    const updateRecipient = (recipient) => {
        currentAction = "update"
        selectedUpdateRecipient = recipient
        showPopup("update-group-recipient")
    }

    const deleteRecipient = (recipient) => {
        currentAction = "delete"
        selectedDeleteRecipient = recipient
        showPopup("delete-group-recipient")
    }

    const deleteRecipients = () => {
        currentAction = "delete"
        selectedDeleteRecipient = selectedRows.map(rcp => rcp.row)
        showPopup("delete-group-recipient")
    }

    const exportToExcel = () => {
        exportExcel(columns, filteredGroupRecipients.map(recipient => columns.map(column => recipient[column])));
    }


    let recipientsTable
    let selectedRows = []
    let showBulkActions = false

    const bulkAction = () => {
        showBulkActions = ! showBulkActions
        let paginated = (typeof filteredGroupRecipients == "object" && filteredGroupRecipients.hasOwnProperty("data"))
        showBulkActions && (selectedRows = (paginated ? filteredGroupRecipients.data : filteredGroupRecipients).map((row, index) => ({index, row})))
        ! showBulkActions && (selectedRows = [])

        if (showBulkActions) {
            showAllCheckboxs()
        } else {
            hideAllCheckboxs()
        }
    }

    const singleAction = (rowIndex) => {
        let paginated = (typeof filteredGroupRecipients == "object" && filteredGroupRecipients.hasOwnProperty("data"))
        let notHaveRow = empty(selectedRows.find(row => row.index === rowIndex))
        notHaveRow && (selectedRows = [...selectedRows, paginated? {index: rowIndex, row: filteredGroupRecipients.data[rowIndex]} : {index: rowIndex, row: filteredGroupRecipients[rowIndex]}])
        ! notHaveRow && (selectedRows = selectedRows.filter(row => row.index !== rowIndex))
        toggleCheckbox(rowIndex)

        if (selectedRows.length == (paginated ? filteredGroupRecipients.data.length : filteredGroupRecipients.length)) {
            showColumnCheckbox()
        } else {
            hideColumnCheckbox()
        }
    }

    const toggleCheckbox = (rowIndex) => {
        recipientsTable?.querySelector(".checked-column-" + rowIndex)?.classList.toggle("flex")
        recipientsTable?.querySelector(".checked-column-" + rowIndex)?.classList.toggle("hidden")
        recipientsTable?.querySelector(".not-checked-column-" + rowIndex)?.classList.toggle("flex")
        recipientsTable?.querySelector(".not-checked-column-" + rowIndex)?.classList.toggle("hidden")
    }

    const showColumnCheckbox = () => {
        recipientsTable?.querySelector(".checked-column")?.classList.add("flex")
        recipientsTable?.querySelector(".checked-column")?.classList.remove("hidden")
        recipientsTable?.querySelector(".not-checked-column")?.classList.remove("flex")
        recipientsTable?.querySelector(".not-checked-column")?.classList.add("hidden")
    }

    const hideColumnCheckbox = () => {
        recipientsTable?.querySelector(".checked-column")?.classList.remove("flex")
        recipientsTable?.querySelector(".checked-column")?.classList.add("hidden")
        recipientsTable?.querySelector(".not-checked-column")?.classList.add("flex")
        recipientsTable?.querySelector(".not-checked-column")?.classList.remove("hidden")
    }

    const showAllCheckboxs = () => {
        recipientsTable?.querySelectorAll('.bulk-not-checked').forEach(element => {
            element.classList.remove("flex")
            element.classList.add("hidden")
        })

        recipientsTable?.querySelectorAll('.bulk-checked').forEach(element => {
            element.classList.add("flex")
            element.classList.remove("hidden")
        })
    }

    const hideAllCheckboxs = () => {
        recipientsTable?.querySelectorAll('.bulk-not-checked').forEach(element => {
            element.classList.add("flex")
            element.classList.remove("hidden")
        })

        recipientsTable?.querySelectorAll('.bulk-checked').forEach(element => {
            element.classList.remove("flex")
            element.classList.add("hidden")
        })
    }

    const validateNumber = (number) => {
        addedNumber = number
        addedNumberValid = false
        let rightNumber = addedNumber + ""
        rightNumber = (selectedPrefix == "20" && rightNumber.startsWith("0")) ? rightNumber.substring(1) : rightNumber
        rightNumber = selectedPrefix + rightNumber
        for (let j = 0; j < $currentClient.connections.length; j++) {
            if (rightNumber.startsWith($currentClient.connections[j].country_code + $currentClient.connections[j].operator_code + "")) {
                addedNumberValid = true
            }
        }
    }

    const validateAttributes = () => {
        addedAttributesValid = isValidJSON(addedAttributes) ? true : false
    }
</script>

<Modal>
    <div class="flex flex-col items-center gap-4 rounded-xl bg-white shadow-xl w-[800px]">
        <div class="flex flex-col items-start self-stretch gap-4 pt-6 pb-5 bg-white rounded-t-xl border-b">
            <div class="flex flex-col items-start self-stretch gap-1 px-6">
                <div class="flex items-center self-stretch gap-3">
                    <span class="self-stretch text-gray-900 text-lg font-semibold">{group.name}</span>
                    <div class="flex items-center py-0.5 px-2 rounded-2xl bg-primary-50 mix-blend-multiply">
                        <span class="text-primary-700 text-center text-xs font-medium lowercase">{group.number_of_recipients}</span>
                    </div>
                </div>
                <div class="flex flex-col items-start flex-1 gap-1">
                    <span class="self-stretch text-gray-500 text-sm">{group.save_date}</span>
                </div>
            </div>
            <div class="flex items-center flex-wrap gap-2 px-6">
                {#if loading}
                    <div class="font-medium text-red-600">Loading . . . </div>
                {:else}
                    {#each uniqueClientConnections as conn}
                    <div class="flex items-center gap-1.5 py-1 pe-3 ps-1.5 rounded-2xl bg-gray-100 {empty($currentClient.connections.find(c => c.operator_name == conn.operator_name).numbers) ? "hidden" : "mix-blend-multiply"}">
                        <img on:error={handleImageError} alt="" src="image/operators/{beautifulToSnakeCase(conn.operator_name)}.png" />
                        <span class="text-gray-700 text-center text-sm font-medium">
                            {conn.operator_name} {$currentClient.connections.find(c => c.operator_name == conn.operator_name)?.numbers?.length ?? 0}
                        </span>
                    </div>
                    {/each}
                {/if}
            </div>
        </div>

        <div class="flex flex-col items-start self-stretch px-6">
            <div class="flex flex-col items-start self-stretch rounded-xl border border-gray-200 bg-white shadow-sm">

                <div class="flex flex-col items-center self-stretch gap-2 rounded-t-xl py-4 px-6 border-b border-b-gray-200 bg-white">
                    <div class="flex justify-between items-center self-stretch">
                        <span class="text-gray-900 text-lg font-semibold">Add New Recipient</span>

                        <button disabled={! addedNumberValid || ! (! addedAttributesValid && ! empty(addedAttributes)) || empty(addedNumber)} on:click={addRecipient} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-primary-600 bg-primary-600 hover:bg-primary-700 shadow-sm {(! addedNumberValid || (! addedAttributesValid && ! empty(addedAttributes)) || empty(addedNumber)) ? "opacity-40" : "opacity-100"}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="text-white text-sm font-semibold">Add</span>
                        </button>
                    </div>
                    <div class="flex flex-col self-stretch flex-1 gap-2">
                        <div class="flex items-center self-stretch flex-1 gap-1">
                            <div class="flex items-center self-stretch flex-1">
                                <div class="relative w-14">
                                    <button on:click={togglePrefixes} class="flex flex-col items-center justify-center py-1 px-1.5 border-y border-l border-l-gray-300 border-y-gray-300 rounded-tl-lg rounded-bl-lg w-full">
                                        <span class="text-gray-600 text-center">{loading ? "..." : selectedPrefix}</span>
                                        <svg class=" -my-1.5 stroke-gray-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M5 7.5L10 12.5L15 7.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                    <div class="absolute top-10 bg-white border border-gray-300 rounded-b-lg rounded-tl-lg w-full max-h-28 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out z-[9999] {showPrefixes ? "visible opacity-100" : "invisible opacity-0"}">
                                        {#each prefixes as prefix}
                                        <button on:click={() => setSelectedPrefix(prefix)} class="flex justify-center items-center my-1 mx-0.5 py-1 px-0.5 rounded-lg hover:bg-primary-50 w-full">
                                            <span class="text-gray-600">{prefix}</span>
                                        </button>
                                        {/each}
                                    </div>
                                </div>
                                <input bind:value={addedNumber} on:input={(e) => validateNumber(e.target.value)} placeholder="Enter Number" type="number" class="flex items-center flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-tr-lg rounded-br-lg outline-none"/>
                            </div>
                                
                            <div class="flex items-center self-stretch flex-1">
                                <input bind:value={addedAttributes} on:input={validateAttributes} placeholder="Enter Attributes in JSON Formt" class="flex items-center flex-1 gap-2 py-2 px-3 border border-gray-300 rounded-lg outline-none"/>
                            </div>
                        </div>
                        <div class="relative flex items-center self-stretch flex-1 pt-2">
                            {#if ! (addedNumberValid || empty(addedNumber))}
                            <span class="absolute left-0 text-sm text-error-700 text-start ps-1">The number is not compatible with any network</span>
                            {/if}
                            {#if ! (addedAttributesValid || empty(addedAttributes))}
                            <span class="absolute left-1/2 text-sm text-error-700 text-start ps-1">Please enter attributes in json format</span>
                            {/if}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-start self-stretch bg-white rounded-b-xl" bind:this={recipientsTable}>

                    {#if ! empty(selectedRows)}
                    <div class="flex justify-end items-center self-stretch gap-4 py-[23px] px-6 border-b border-b-gray-200 bg-primary-50">
                        <button on:click={deleteRecipients} class="flex justify-end items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 2.5H12.5M2.5 5H17.5M15.8333 5L15.2489 13.7661C15.1612 15.0813 15.1174 15.7389 14.8333 16.2375C14.5833 16.6765 14.206 17.0294 13.7514 17.2497C13.235 17.5 12.5759 17.5 11.2578 17.5H8.74221C7.42409 17.5 6.76503 17.5 6.24861 17.2497C5.79396 17.0294 5.41674 16.6765 5.16665 16.2375C4.88259 15.7389 4.83875 15.0813 4.75107 13.7661L4.16667 5M8.33333 8.75V12.9167M11.6667 8.75V12.9167" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="text-gray-700 text-sm font-semibold">Delete</span>
                        </button>
                    </div>
                    {:else}
                    <div class="flex items-center self-stretch gap-4 py-5 px-6 border-b border-b-gray-200 bg-gray-50">
                        <div class="flex items-center self-stretch flex-1 gap-2 rounded-lg border border-gray-300 bg-white shadow-sm">
                            <div class="relative w-1/4 h-full">
                                <button on:click={selectColumn} class="hide-dropdown flex justify-between items-center self-stretch gap-2 py-2.5 px-4 border-r border-r-gray-300 shadow-sm w-full truncate h-full">
                                    <span class="text-gray-900 text-sm truncate">{snakeToBeautifulCase(selectedColumn)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                                <div bind:this={columnsList} class="hide-dropdown absolute top-11 border w-full bg-white opacity-0 invisible transition-all duration-300 ease-in-out max-h-52 overflow-y-auto scrollbart z-[500] rounded-b-lg">
                                    {#each columns as column, index}
                                        {#if column != "#"}
                                        <div class="p-2 {index%2 == 0? "bg-gray-50" : "bg-white"}">
                                            <button on:click={() => setSelectedColumn(column)} class="text-gray-900 text-sm py-2 px-3 hover:bg-primary-100 rounded-md w-full">{snakeToBeautifulCase(column)}</button>
                                        </div>
                                        {/if}
                                    {/each}
                                </div>
                            </div>
                            <div class="flex justify-between items-center self-stretch flex-1 ps-3 pe-1 py-1">
                                <input bind:value={searchValue} class="placeholder:text-gray-500 outline-none w-[90%]" placeholder="Search Recipients" />
                                <button on:click={searchRecipients} class="flex justify-center items-center gap-2 p-2 rounded-lg border border-primary-50 bg-primary-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#527615" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button on:click={exportToExcel} class="flex justify-end items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="text-gray-700 text-sm font-semibold">Export</span>
                        </button>
                    </div>
                    {/if}

                    <div class="flex self-stretch h-11 border-b border-b-gray-200 bg-white">
                        <div class="flex items-center self-stretch flex-1 gap-3 py-3 px-6">
                            <button on:click={bulkAction} class="flex justify-center items-center">
                                <div class="bulk-checked checked-column hidden justify-center items-center w-5 h-5 p-[3px] border border-primary-600 rounded-md bg-primary-50" type="checkbox">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M11.6663 3.5L5.24967 9.91667L2.33301 7" stroke="#6D9A16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <div class="bulk-not-checked not-checked-column flex w-5 h-5 border border-gray-300 rounded-md bg-white" type="checkbox"></div>
                            </button>
                            <div class="flex items-center self-stretch flex-1 gap-4">
                                <span class="text-gray-600 text-xs font-medium w-28">Number</span>
                                <span class="text-gray-600 text-xs font-medium">Attributes</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 h-11 py-3 px-6 w-[17%]">
                            <span class="text-gray-600 text-xs font-medium">Action</span>
                        </div>
                    </div>

                    {#if loading}
                    <div class="flex justify-center items-center self-stretch gap-3 py-4 px-6 h-[72px] border-b border-b-gray-200 rounded-b-xl bg-white text-red-600 text-xl font-medium">Loading . . . </div>
                    {:else}
                    <div class="flex flex-col self-stretch max-h-[288px] rounded-b-xl overflow-auto">
                        {#each filteredGroupRecipients as recipient, index}
                            <div class="flex h-[72px] border-b border-b-gray-200 {index%2 == 1 ? "bg-white" : "bg-gray-50"}">
                                <div class="flex items-center self-stretch flex-1 gap-3 py-4 px-6">
                                    <button on:click={() => singleAction(index)} class="flex justify-center items-center">
                                        <div class="bulk-checked checked-column-{index} hidden justify-center items-center w-5 h-5 p-[3px] border border-primary-600 rounded-md bg-primary-50" type="checkbox">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M11.6663 3.5L5.24967 9.91667L2.33301 7" stroke="#6D9A16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                        <div class="bulk-not-checked not-checked-column-{index} flex w-5 h-5 border border-gray-300 rounded-md bg-white" type="checkbox"></div>
                                    </button>
                                    <div class="flex items-center self-stretch flex-1 gap-4">
                                        <span class="text-gray-900 text-sm font-medium  w-28 truncate">{recipient.number}</span>
                                        {#if empty(recipient.attributes)}
                                        <i class="fas fa-ban"></i>
                                        {:else}
                                        <button data-title="click to copy" class="relative flex flex-col" on:click={copyToClipboard} on:mouseover={onHover} on:focus={onHover} on:mouseleave={onLeave}>
                                            <span class="text-gray-900 text-sm font-medium max-w-96 text-nowrap whitespace-nowrap truncate">{recipient.attributes}</span>
                                            <div class="absolute top-full hidden flex-col items-start w-[280px] shadow-lg">
                                                <svg class="rotate-180" xmlns="http://www.w3.org/2000/svg" width="28" height="9" viewBox="0 0 28 9" fill="none">
                                                    <path d="M14.0711 0.485289C14.962 0.485289 15.4081 1.56243 14.7782 2.1924L8.70711 8.26347C8.31658 8.654 7.68342 8.654 7.29289 8.26347L1.22183 2.1924C0.591867 1.56243 1.03803 0.485289 1.92894 0.485289L14.0711 0.485289Z" fill="#101828"/>
                                                </svg>
                                                <div class="flex flex-col items-start self-stretch gap-1 p-3 rounded-lg bg-gray-900">
                                                    <span class="self-stretch text-white text-start text-xs font-semibold">Attributes</span>
                                                    <span class="self-stretch text-white text-start text-wrap text-xs font-medium">{recipient.attributes}</span>
                                                </div>
                                            </div>
                                        </button>
                                        {/if}
                                    </div>
                                </div>
                                <div class="flex items-center self-stretch gap-1 p-4 w-[17%]">
                                    <button on:click={() => deleteRecipient(recipient)} class="flex justify-center items-center p-2.5 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                            <path d="M13.3333 5.50033V4.83366C13.3333 3.90024 13.3333 3.43353 13.1517 3.07701C12.9919 2.7634 12.7369 2.50844 12.4233 2.34865C12.0668 2.16699 11.6001 2.16699 10.6667 2.16699H9.33333C8.39991 2.16699 7.9332 2.16699 7.57668 2.34865C7.26308 2.50844 7.00811 2.7634 6.84832 3.07701C6.66667 3.43353 6.66667 3.90024 6.66667 4.83366V5.50033M8.33333 10.0837V14.2503M11.6667 10.0837V14.2503M2.5 5.50033H17.5M15.8333 5.50033V14.8337C15.8333 16.2338 15.8333 16.9339 15.5608 17.4686C15.3212 17.939 14.9387 18.3215 14.4683 18.5612C13.9335 18.8337 13.2335 18.8337 11.8333 18.8337H8.16667C6.76654 18.8337 6.06647 18.8337 5.53169 18.5612C5.06129 18.3215 4.67883 17.939 4.43915 17.4686C4.16667 16.9339 4.16667 16.2338 4.16667 14.8337V5.50033" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                    <button on:click={() => updateRecipient(recipient)} class="flex justify-center items-center p-2.5 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                            <path d="M2.39637 15.5963C2.43466 15.2517 2.4538 15.0794 2.50594 14.9184C2.55219 14.7755 2.61753 14.6396 2.70021 14.5142C2.79339 14.3729 2.91596 14.2503 3.16112 14.0052L14.1664 2.99992C15.0868 2.07945 16.5792 2.07945 17.4997 2.99993C18.4202 3.9204 18.4202 5.41279 17.4997 6.33326L6.49445 17.3385C6.2493 17.5836 6.12672 17.7062 5.98541 17.7994C5.86005 17.8821 5.72408 17.9474 5.58121 17.9937C5.42018 18.0458 5.24789 18.0649 4.90331 18.1032L2.08301 18.4166L2.39637 15.5963Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                        {/each}
                    </div>
                    {/if}
                </div>
            </div>
        </div>

        {#if saved}
        <div class="flex items-center gap-4 self-stretch py-3 px-6">
            <span class="text-gray-700 font-medium">Group Name</span>
            <div class="flex items-center self-stretch rounded-lg border border-gray-300 bg-white shadow-sm gap-2 flex-1 p-1 w-full h-12">
                <input bind:value={groupName} class="flex items-center flex-1 ps-3 pe-1 py-1 placeholder:text-gray-500 outline-none" placeholder={group.name} />
            </div>
        </div>
        {:else}
        <div class="flex items-center self-stretch gap-4 py-3 px-6">
            <div class="flex items-start flex-1 gap-2 max-w-fit">
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
                <div class="flex flex-col items-start flex-1 -mt-1">
                    <span class="self-stretch text-gray-700 text-sm font-medium">Make this group as a saved group</span>
                    <span class="self-stretch text-gray-600 text-sm">Save group for future using, It will be<br>shown when you add a new message</span>
                </div>
            </div>
  
            <div class="items-center self-stretch rounded-lg border border-gray-300 bg-white shadow-sm gap-2 flex-1 p-1 w-full h-12 {showGroupInput ? "flex" : "hidden"}">
                <input bind:value={groupName} class="flex items-center flex-1 ps-3 pe-1 py-1 placeholder:text-gray-500 outline-none" placeholder={group.name} />
            </div>
        </div>
        {/if}

        <div class="flex items-center self-stretch gap-3 p-6 border-t">
            <button on:click={deleteGroup} class="flex justify-center items-center">
                <span class="text-red-700 text-sm font-semibold">Delete Group</span>
            </button>
            <div class="flex justify-end items-center self-stretch flex-1 gap-3">
                <button on:click={hideModal} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                    <span class="text-gray-700 font-semibold">Close</span>
                </button>
                <button disabled={empty(groupName)} on:click={editGroup} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm {empty(groupName) ? "opacity-40" : "opacity-100"}">
                    <span class="text-white font-semibold">Save Changes</span>
                </button>
            </div>
        </div>
    </div>
</Modal>

{#if currentAction == "save"}
    <RecipientErrorPopup action="save" />
    <RecipientSuccessPopup action="save" />    
{/if}

{#if currentAction == "update"}
    <EditGroupRecipientPopup {group} {prefixes} recipients={selectedUpdateRecipient} bind:allRecipients={filteredGroupRecipients} />
{/if}

{#if currentAction == "delete"}
    <DeleteGroupRecipientPopup {group} recipients={selectedDeleteRecipient} bind:allRecipients={filteredGroupRecipients} />
{/if}