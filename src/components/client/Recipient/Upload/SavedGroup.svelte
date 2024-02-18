<script>
	import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { message } from "$lib/helper/store"
    import { hideModal } from "$lib/helper/modal"
    import { snakeToBeautifulCase } from "$lib/helper/strUtils"
    import { setcurrentRouteDisplay } from "$lib/router/router"
    import { getClientSavedGroups } from "../../../../api/clientApi"
    import { getMessageGroupRecipients } from "../../../../api/messageApi"

	import NoData from "../../../shared/NoData.svelte"

    let groups = []
    let selectedGroups = []
    let recipientsChunk = []
    let selectedRecipients = []
    let columns = ['group_name', 'recipients']
    let allSelected = false

    onMount(async () => {
        $message.validNumbers = []
        $message.invalidNumbers = []
        $message.numbersAttributes = []
        $message.sendType = "Group SMS"
        for (let i = 0; i < $message.connections.length; i++) {
            $message.connections[i].numbers = []
        }
        groups = (await getClientSavedGroups(1, 1000000)).data.map(mapFunction)
    })

    const mapFunction = (group) => {
        group.group_name = group.name
        group.recipients = group.number_of_recipients
        return group
    }

    const gotoGroups = () => {
        hideModal()
        setcurrentRouteDisplay('Groups')
    }

    const selectAll = async () => {
        if (allSelected) return
        allSelected = true
        selectedGroups = groups
        for (let i = 0; i < selectedGroups.length; i++) {
            selectedGroups[i].recipients = []
            for (let j = 0; j < 1000; j++) {
                recipientsChunk = (await getMessageGroupRecipients(selectedGroups[i].id, j + 1, 5000)).data
                if(empty(recipientsChunk)) break
                selectedRecipients = [...selectedRecipients, ...recipientsChunk]
                selectedGroups[i].recipients = [...selectedGroups[i].recipients, ...recipientsChunk.map(rcp => ({number: rcp.number, attributes: rcp.attributes}))]
            }
        }

        $message.selectedGroups = selectedGroups
    }

    const unselectAll = () => {
        selectedGroups = []
        selectedRecipients = []
        allSelected = false
    }

    const selectGroup = async (group) => {
        if (! empty(selectedGroups.find(grp => grp.id == group.id))) {
            selectedGroups = selectedGroups.filter(grp => grp.id != group.id)
            selectedRecipients = selectedRecipients.filter(recipient => recipient.message_group_id !== group.id)
        } else {
            group.recipients = []
            for (let i = 0; i < 1000; i++) {
                recipientsChunk = (await getMessageGroupRecipients(group.id, i + 1, 5000)).data
                if(empty(recipientsChunk)) break
                group.recipients = [...group.recipients, ...recipientsChunk.map(rcp => ({number: rcp.number, attributes: rcp.attributes}))]
                selectedRecipients = [...selectedRecipients, ...recipientsChunk]
                selectedGroups.recipients = []
            }
            selectedGroups = [...selectedGroups, group]
        }

        allSelected = selectedGroups.length === groups.length ? true : false
        $message.selectedGroups = selectedGroups
    }

    $: {
        $message.validNumbers = [...new Set(selectedRecipients.map(recipient => recipient.number))]
        for (let j = 0; j < $message.connections.length; j++) {
            $message.connections[j].numbers = []

            for (let i = 0; i < $message.validNumbers.length; i++) {
                if ($message.validNumbers[i].startsWith($message.connections[j].country_code + $message.connections[j].operator_code + "")) {
                    $message.connections[j].numbers.push($message.validNumbers[i])
                }
            }
        }

        if (! empty(selectedRecipients[0]?.attributes)) {
            $message.numbersAttributes = JSON.parse(selectedRecipients[0].attributes).map(attr => attr.name)
            if ($message.numbersAttributes.indexOf("phone") < 0) {
                errorAlert("Phone attribute not found, please make sure if phone attribute exists", 5)
            }
        }
    }
</script>
<div class="flex flex-col items-start flex-1 gap-4 w-full max-h-full">
    <div class="flex items-center self-stretch gap-3">
        <div class="flex flex-col items-start gap-1 w-full">
            <div class="flex items-center gap-1">
                <span class="text-gray-700 text-sm font-medium">Select from saved groups</span>
            </div>
            <span class="text-gray-700 text-sm">Single or multi select for groups</span>
        </div>
        <button on:click={selectAll} class="flex justify-center items-center gap-2">
            <span class="text-gray-700 text-sm font-semibold text-nowrap whitespace-nowrap">Select All</span>
        </button>
        <button on:click={unselectAll} class="flex justify-center items-center gap-2">
            <span class="text-gray-700 text-sm font-semibold text-nowrap whitespace-nowrap">Unselect All</span>
        </button>
    </div>

    {#if ! empty(groups)}
    <div class="flex flex-col items-start flex-1 self-stretch rounded-xl border border-gray-200 bg-white text-sm overflow-y-auto">
        <div class="flex items-start self-stretch flex-1 bg-white rounded-xl">
            {#each columns as column}
                <div class="flex flex-col items-start {column == "recipients"? "flex-1" : ""}">
                    <div class="flex items-center self-stretch gap-3 h-11 py-3 px-6 border-b border-b-gray-200 bg-white rounded-t-xl">
                        <div class="flex items-center gap-1">
                            <span class="text-gray-600 text-xs font-medium">{snakeToBeautifulCase(column)}</span>
                        </div>
                        {#if column == "group_name"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8.00016 3.33301V12.6663M8.00016 12.6663L12.6668 7.99967M8.00016 12.6663L3.3335 7.99967" stroke="#475467" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {/if}
                    </div>
                    {#each groups as group, index}
                    <div class="flex items-center self-stretch gap-3 h-[72px] py-4 px-6 border-b border-b-gray-200 {index%2 == 1 ? "bg-gray-50" : "bg-white"}">
                        <span class="text-gray-900 text-sm font-medium">{group[column]} {column == "recipients"? "Number" : ""}</span>
                    </div>
                    {/each}
                </div>
            {/each}
            <div class="flex flex-col items-start w-20">
                <div class="flex items-center self-stretch gap-3 h-11 py-3 px-6 border-b border-b-gray-200 bg-white rounded-t-xl">
                    <div class="flex items-center gap-1">
                        <span class="text-gray-600 text-xs font-medium text-start">Select</span>
                    </div>
                </div>
                {#each groups as group, index}
                <div class="flex items-center self-stretch gap-3 h-[72px] py-4 px-6 border-b border-b-gray-200 {index%2 == 1 ? "bg-gray-50" : "bg-white"}">
                    <button on:click={() => selectGroup(group)} class="flex justify-center items-center">
                        {#if ! empty(selectedGroups.find(grp => grp.id == group.id))}
                        <div class="flex justify-center items-center w-5 h-5 p-[3px] border border-primary-600 rounded-md bg-primary-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M11.6663 3.5L5.24967 9.91667L2.33301 7" stroke="#6D9A16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        {:else}
                        <div class="flex w-5 h-5 border border-gray-300 rounded-md bg-white"></div>
                        {/if}
                    </button>
                </div>
                {/each}
            </div>
        </div>
    </div>
    {:else}
    <NoData message="You don't have any groups yet!" description="You don't need to enter numbers each time you push a message, create a new group so you can select them here" clazz="overflow-y-auto">
        <button on:click={gotoGroups} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
            <span class="text-white font-semibold">Add Group</span>
        </button>
    </NoData>
    {/if}
</div>