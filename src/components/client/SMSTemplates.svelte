<script>
	import Badge from "../shared/Badge.svelte"
	import Table from "../shared/table/Table.svelte"
	import TableContainer from "../shared/table/TableContainer.svelte"
	import AddSMSTemaplate from "./SMSTemplate/AddSMSTemaplate.svelte"
	import EditSMSTemaplate from "./SMSTemplate/EditSMSTemaplate.svelte"
	import DeleteSMSTemplateModal from "./SMSTemplate/DeleteSMSTemplateModal.svelte"
	import BulkDeleteSMSTemplateModal from "./SMSTemplate/BulkDeleteSMSTemplateModal.svelte"

    import { showModal } from "$lib/helper/modal"
	import { listMessageTemplatesPaginated } from "../../api/messageApi"


    let noDataMessage = "You don't have any sms templates for now!"
    let noDataDescription = "Your Saved SMS Templates will appear here."

    let columns = {
        template_title: 'subject',
        message: 'template',
    }

    const mapFunction = (temp, index) => {
        temp.template_title = () => renderTitle(temp.subject, index)
        temp.message = temp.template
        return temp
    }

    let index = 0
    const renderTitle = (title, idx = -1) => {
        index = idx == -1 ? index + 1 : idx
        let color = index%5 == 0 ? "rose" : (index%4 == 1 ? "green" :  (index%5 == 2 ? "blue" : (index%5 == 3 ? "purple" : "indigo")))
        return {
            component: Badge,
            props: {
                text: title,
                color: color
            },
        }
    }

    const onDelete = (template) => {
        showModal(DeleteSMSTemplateModal, {template})
    }

    const onEdit = (template) => {
        showModal(EditSMSTemaplate, {template})
    }

    const onBulkDelete = (templates) => {
        showModal(BulkDeleteSMSTemplateModal, {templates})
    }
</script>

<div class="flex flex-col items-start self-stretch flex-1 gap-6 px-6">
    <div class="flex items-center self-stretch gap-4 mb-4">
        <div class="flex flex-col items-start flex-1 gap-1">
            <span class="self-stretch text-gray-900 text-3xl leading-[38px] font-semibold">SMS Templates</span>
            <span class="self-stretch text-gray-600">Save your SMS for future using</span>
        </div>
        <button on:click={() => showModal(AddSMSTemaplate)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-900 bg-gray-900 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-white text-sm font-semibold">New Template</span>
        </button>
    </div>
    <TableContainer>
        <Table showDateSelector={false} showFilter={false} tableName="SMS Templates" tableTitle="Templates" description="Mange your saved SMS Templates" {columns} noColumnsTruncate={["message"]} {noDataMessage} {noDataDescription} {mapFunction} fetchFunction={listMessageTemplatesPaginated} showDeleteText={false} {onDelete} {onBulkDelete} {onEdit} showEditText={false}>
            <div slot="no-data">
                <button on:click={() => showModal(AddSMSTemaplate)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-900 bg-gray-900 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-white text-sm font-semibold">New Template</span>
                </button>
            </div>
        </Table>
    </TableContainer>
</div>