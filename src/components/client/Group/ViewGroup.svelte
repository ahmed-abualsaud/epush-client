<script>
	import { onMount } from "svelte"
	import Modal from "../../shared/Modal.svelte"
	import Badge from "../../shared/Badge.svelte"
	import Table from "../../shared/table/Table.svelte"
	import TableContainer from "../../shared/table/TableContainer.svelte"

    import { empty } from "$lib/helper/utils"
    import { exportExcel } from "../../../api/fileApi"
    import { handleImageError } from "$lib/helper/image"
    import { makeArrayUnique } from "$lib/helper/arrUtils"
    import { readableTimestamp } from "$lib/helper/dateTime"
    import { storage, currentClient } from "$lib/helper/store"
    import { beautifulToSnakeCase } from "$lib/helper/strUtils"
    import { getMessageGroupRecipients } from "../../../api/messageApi"


    export let group = {}

    let loading = true
    let recipientsChunk = []
    let groupRecipients = []
    let uniqueClientConnections = makeArrayUnique($currentClient.connections, "operator_name")

    let noDataMessage =  "The group has no recipients"
    let noDataDescription = "All recipients of this group will appear here"

    let columns = {
        number: 'number',
        attributes: 'attributes',
        save_date: 'created_at'
    }

    onMount(async () => {
        $storage = {}
        $storage.validNumbers = []
        $storage.invalidNumbers = []

        for (let i = 0; i < 10000; i++) {
            recipientsChunk = (await getMessageGroupRecipients(group.id, i + 1, 5000)).data
            if(empty(recipientsChunk)) {
                loading = false
                break
            }
            groupRecipients = [...groupRecipients, ...recipientsChunk]
        }

        for (let i = 0; i < $currentClient.connections.length; i++) {
            $currentClient.connections[i].numbers = []
        }

        for (let i = 0; i < groupRecipients.length; i++) {
            for (let j = 0; j < $currentClient.connections.length; j++) {
                if (groupRecipients[i].number.startsWith($currentClient.connections[j].country_code + $currentClient.connections[j].operator_code + "")) {
                    $currentClient.connections[j].numbers.push(groupRecipients[i].number)
                    $storage.validNumbers.push(groupRecipients[i].number)
                }
            }
        }

        let validNumbersSet = new Set($storage.validNumbers)
        $storage.validNumbers = [...validNumbersSet]
        $storage.invalidNumbers = $storage.validNumbers.filter(num => ! validNumbersSet.has(num))
    })


    const mapFunction = (recipient, index) => {
        recipient.save_date = readableTimestamp(group.created_at)
        recipient.number_temp = recipient.number
        recipient.number = () => renderNumber(recipient.number_temp, index)
        return recipient
    }

    const renderNumber = (number, index) => {
        let color = index%5 == 0 ? "rose" : (index%4 == 1 ? "green" :  (index%5 == 2 ? "blue" : (index%5 == 3 ? "purple" : "indigo")))
        return {
            component: Badge,
            props: {
                text: number,
                color: color,
            }
        }
    }

    const exportToExcel = () => {
        let cols = Object.values(columns)
        exportExcel(cols, groupRecipients.map(obj => cols.map(key => obj[key])))
    }

    const exportValidNumbers = () => {
        exportExcel(['number'], groupRecipients.map(obj => [obj.number]))
    }

    const exportInvalidNumbers = () => {
        exportExcel(['number'], groupRecipients.map(obj => [obj.number]))
    }
</script>
<Modal>
<div class="flex flex-col items-start gap-5 rounded-xl bg-white shadow-xl w-[850px]">
    <div class="flex items-center self-stretch px-5 pt-5">
        <span class="text-gray-900 text-lg font-semibold">Recipients Information</span>
    </div>
    {#if ! empty(group)}
    <div class="flex justify-center items-center self-stretch flex-1 px-5">
        <TableContainer>
            <Table useIndex={false} showFilter={false} showDateSelector={false} allowBulkActions={false} showSearchExport={true} {columns} {noDataMessage} {noDataDescription} defaultCriteria={"message_group_id = " + group.id} searchClass="w-[300px]" columnClass="w-auto" contentClass="h-[400px] overflow-y-auto" tableName="Message Group Recipients" tableTitle="Recipients" description={"Group Name: " + (group.name ?? "Unknown")} {mapFunction} fetchFunction={(page, take) => getMessageGroupRecipients(group.id, page, take)}>
                <div slot="header-extension" class="w-full">
                    <div class="flex justify-center items-center flex-wrap gap-2 p-3 border-b w-full">
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
                    <div class="flex justify-evenly items-center flex-wrap gap-2 p-3 border-b w-full">
                        <button on:click={exportValidNumbers} class="flex items-center gap-1 ps-2.5 pe-2 py-0.5 rounded-2xl bg-success-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <g clip-path="url(#clip0_835_15050)">
                                    <path d="M10.5 10.5H1.5M9 5.5L6 8.5M6 8.5L3 5.5M6 8.5V1.5" stroke="#12B76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_835_15050">
                                    <rect width="12" height="12" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            <span class="text-center text-success-700 text-sm font-medium">{$storage.validNumbers?.length} Valid Number</span>
                        </button>
                        <button on:click={exportInvalidNumbers} disabled={empty($storage.invalidNumbers)} class="flex items-center gap-1 ps-2.5 pe-2 py-0.5 rounded-2xl bg-error-50 {empty($storage.invalidNumbers) ? "opacity-40" : "opacity-100"}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <g clip-path="url(#clip0_835_15054)">
                                    <path d="M10.5 10.5H1.5M9 5.5L6 8.5M6 8.5L3 5.5M6 8.5V1.5" stroke="#F04438" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_835_15054">
                                    <rect width="12" height="12" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            <span class="text-center text-error-700 text-sm font-medium">{$storage.invalidNumbers?.length} Wrong Number</span>
                        </button>
                    </div>
                </div>
            </Table>
        </TableContainer>
    </div>

    {/if}
    {#if ! empty(groupRecipients)}
    <div class="flex justify-end items-center self-stretch flex-1 gap-3 py-5 px-6 rounded-b-xl bg-white border-t">
        <button on:click={exportToExcel} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-700 text-sm font-semibold">Export Recipients</span>
        </button>
    </div>
    {/if}
</div>
</Modal>