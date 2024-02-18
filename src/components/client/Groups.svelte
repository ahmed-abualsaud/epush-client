<script>
	import Badge from "../shared/Badge.svelte"
	import Table from "../shared/table/Table.svelte"
	import ViewGroup from "./Group/ViewGroup.svelte"
	import AddGroupModal from "./Group/AddGroupModal.svelte"
	import EditGroupModal from "./Group/EditGroupModal.svelte"
	import DeleteGroupModal from "./Group/DeleteGroupModal.svelte"
	import TableContainer from "../shared/table/TableContainer.svelte"

    import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { showModal } from "$lib/helper/modal"
    import { readableTimestamp } from "$lib/helper/dateTime"
    import { getMessageGroupRecipients } from "../../api/messageApi"
    import { addSlugToCurrentRouteDisplay } from "$lib/router/router"
	import { getClientGroupsLog, getClientSavedGroups } from "../../api/clientApi"


    let groupSelector
    let shownTable = "saved-groups"
    let noSavedGroupsMessage =  "You don't have any saved groups for now!"
    let noSavedGroupsDescription = "Saved groups will appear here."
    let noGroupLogMessage =  "You don't have any group log for now!"
    let noGroupLogDescription = "Group log will appear here."

    let columns = {
        group_name: 'name',
        recipients: 'number_of_recipients',
        save_date: 'created_at'
    }

    onMount(async () => {
        addSlugToCurrentRouteDisplay("Groups", shownTable, 1)
    })

    const mapFunction = (group, index) => {
        group.group_name = () => renderGroupName(group.name, index)
        group.recipients = group.number_of_recipients + " \u00A0Number"
        group.save_date = readableTimestamp(group.created_at)
        return group
    }

    let index = 0
    const renderGroupName = (group, idx = -1) => {
        index = idx == -1 ? index + 1 : idx
        let color = index%5 == 0 ? "rose" : (index%4 == 1 ? "green" :  (index%5 == 2 ? "blue" : (index%5 == 3 ? "purple" : "indigo")))
        return {
            component: Badge,
            props: {
                text: group,
                color: color
            },
        }
    }

    const onClickHandler = (buttonID) => {
        shownTable = buttonID
        addSlugToCurrentRouteDisplay("Groups", shownTable, 1)
        let button = groupSelector.querySelector("#" + buttonID)
        if (empty(button)) return

        groupSelector.querySelectorAll('button').forEach(btn => {
            if (btn.classList.contains('border-b-primary-700')) {
                btn.classList.remove('border-b')
                btn.classList.remove('border-b-primary-700')
                btn.classList.remove('bg-primary-50')
                btn.querySelector('path').setAttribute('stroke', '#667085')
                btn.querySelector('span').classList.add('text-gray-500')
                btn.querySelector('span').classList.remove('text-primary-700')
            }
        })

        button.classList.add('border-b')
        button.classList.add('border-b-primary-700')
        button.classList.add('bg-primary-50')
        button.querySelector('path').setAttribute('stroke', '#527615')
        button.querySelector('span').classList.remove('text-gray-500')
        button.querySelector('span').classList.add('text-primary-700')
    }

    const onEditGroup = (group, saved) => {
        showModal(EditGroupModal, {group, saved})
    }

    const onPreviewGroup = (group) => {
        showModal(ViewGroup, {group})
    }

    const onDeleteGroup = (groups) => {
        showModal(DeleteGroupModal, {groups})
    }

    const onBulkDelete = (groups) => {
        showModal(DeleteGroupModal, {bulk: true, groups})
    }
</script>

<div class="flex flex-col items-start self-stretch flex-1 gap-6 px-6">
    <div class="flex items-center self-stretch gap-4 mb-4">
        <div class="flex flex-col items-start flex-1 gap-1">
            <span class="self-stretch text-gray-900 text-3xl leading-[38px] font-semibold">Groups</span>
            <span class="self-stretch text-gray-600">Manage your saved groups & group log</span>
        </div>
        <button on:click={() => showModal(AddGroupModal)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-900 bg-gray-900 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-white text-sm font-semibold">New Group</span>
        </button>
    </div>

    <div bind:this={groupSelector} class="flex items-center self-stretch gap-8 border-b">
        <button id="saved-groups" on:click={() => onClickHandler("saved-groups")} class="flex justify-center items-center gap-2 p-3 border-b border-b-primary-700 bg-primary-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13.3332 15L14.9998 16.6667L18.3332 13.3333M9.99984 12.5H6.6665C5.11337 12.5 4.3368 12.5 3.72423 12.7537C2.90747 13.092 2.25855 13.741 1.92024 14.5577C1.6665 15.1703 1.6665 15.9469 1.6665 17.5M12.9165 2.7423C14.1381 3.23679 14.9998 4.43443 14.9998 5.83333C14.9998 7.23224 14.1381 8.42988 12.9165 8.92437M11.2498 5.83333C11.2498 7.67428 9.75745 9.16667 7.9165 9.16667C6.07555 9.16667 4.58317 7.67428 4.58317 5.83333C4.58317 3.99238 6.07555 2.5 7.9165 2.5C9.75745 2.5 11.2498 3.99238 11.2498 5.83333Z" stroke="#527615" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-primary-700">Saved Groups</span>
        </button>
        <button id="group-log" on:click={() => onClickHandler("group-log")} class="flex justify-center items-center gap-2 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.3332 17.5V15.8333C18.3332 14.2801 17.2709 12.9751 15.8332 12.605M12.9165 2.7423C14.1381 3.23679 14.9998 4.43443 14.9998 5.83333C14.9998 7.23224 14.1381 8.42988 12.9165 8.92437M14.1665 17.5C14.1665 15.9469 14.1665 15.1703 13.9128 14.5577C13.5745 13.741 12.9255 13.092 12.1088 12.7537C11.4962 12.5 10.7196 12.5 9.1665 12.5H6.6665C5.11337 12.5 4.3368 12.5 3.72423 12.7537C2.90747 13.092 2.25855 13.741 1.92024 14.5577C1.6665 15.1703 1.6665 15.9469 1.6665 17.5M11.2498 5.83333C11.2498 7.67428 9.75745 9.16667 7.9165 9.16667C6.07555 9.16667 4.58317 7.67428 4.58317 5.83333C4.58317 3.99238 6.07555 2.5 7.9165 2.5C9.75745 2.5 11.2498 3.99238 11.2498 5.83333Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-500">Group Log</span>
        </button>
    </div>

    <TableContainer>
        {#if shownTable === "saved-groups"}
            <Table {columns} afterColumns={["recipients"]} noDataMessage={noSavedGroupsMessage} noDataDescription={noSavedGroupsDescription} onEdit={(group) => onEditGroup(group, true)} showEditText={false} onPreview={onPreviewGroup} showPreviewText={false} onDelete={onDeleteGroup} showDeleteText={false} {onBulkDelete} showFilter={false} showDateSelector={false} defaultCriteria="saved = true" tableName="Message Groups" tableTitle="Saved Groups" description="Search and manage your saved groups." {mapFunction} fetchFunction={getClientSavedGroups}>
                <div slot="no-data">
                    <button on:click={() => showModal(AddGroupModal)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-primary-600 bg-primary-600 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="text-white text-sm font-semibold">New Group</span>
                    </button>
                </div>
                <div class="flex items-center -ms-10" slot="after-column" let:row={row}>
                    {#await getMessageGroupRecipients(row.id, 1, 5)}
                        <div class="font-medium text-primary-700">Loading . . . </div>
                    {:then data}
                        <div class="flex justify-start items-center gap-1">
                            {#each data.data as recipient}
                                <Badge text={recipient.number} />
                            {/each}
                            {#if (data.total - Math.min(5, data.total)) > 0}
                                <Badge text={"+ " + (data.total - Math.min(5, data.total))} color="orange"/>
                            {/if}
                        </div>
                    {:catch error}
                        <div class="font-medium text-error-600">{error.message}</div>
                    {/await}
                </div>
            </Table>
        {/if}
        {#if shownTable === "group-log"}
            <Table {columns} afterColumns={["recipients"]} noDataMessage={noGroupLogMessage} noDataDescription={noGroupLogDescription} onEdit={(group) => onEditGroup(group, false)} showEditText={false} onPreview={onPreviewGroup} showPreviewText={false} onDelete={onDeleteGroup} showDeleteText={false} {onBulkDelete} showFilter={false} showDateSelector={false} defaultCriteria="saved = false" tableName="Message Groups" tableTitle="Group Log" description="Search and manage your group log." {mapFunction} fetchFunction={getClientGroupsLog}>
                <div slot="no-data">
                    <button on:click={() => showModal(AddGroupModal)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-primary-600 bg-primary-600 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="text-white text-sm font-semibold">New Group</span>
                    </button>
                </div>
                <div class="flex items-center -ms-10" slot="after-column" let:row={row}>
                    {#await getMessageGroupRecipients(row.id, 1, 4)}
                        <div class="font-medium text-primary-700">Loading . . . </div>
                    {:then data}
                        <div class="flex justify-start items-center gap-1">
                            {#each data.data as recipient}
                                <Badge text={recipient.number} />
                            {/each}
                            {#if (data.total - Math.min(4, data.total)) > 0}
                                <Badge text={"+ " + (data.total - Math.min(4, data.total))} color="orange"/>
                            {/if}
                        </div>
                    {:catch error}
                        <div class="font-medium text-error-600">{error.message}</div>
                    {/await}
                </div>
            </Table>
        {/if}
    </TableContainer>
</div>