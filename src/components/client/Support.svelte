<script>
	import Badge from "../shared/Badge.svelte"
	import Table from "../shared/table/Table.svelte"
	import AddTicket from "./Support/AddTicket.svelte"
	import ViewTicket from "./Support/ViewTicket.svelte"
	import TableContainer from "../shared/table/TableContainer.svelte"

    import { showModal } from "$lib/helper/modal"
    import { clientSenderNames } from "$lib/helper/store"
    import { getClientTickets } from "../../api/ticketApi"
    import { readableTimestamp } from "$lib/helper/dateTime"


    let noDataMessage = "You don't have any saved support tickets for now!"
    let noDataDescription = "Your Saved saved support tickets will appear here."

    let columns = {
        first_name: 'first_name',
        last_name: 'last_name',
        email: 'email',
        phone: 'phone',
        content: 'content',
        status: 'status',
        sender_name: 'sender_name',
        notes: 'notes',
        created_at: 'created_at',
    }

    let columnsFilters = {
        sender_name: [{select: () => renderSender('With any sender name', 0), value: '{skip}'}, ...$clientSenderNames.map((sender, idx) => ({select: () => renderSender(sender, idx + 4), value: sender}))],
        status: [
            {select: () => renderSender('With any status', 1), value: '{skip}'},
            {select:() => renderStatus("Initiated"), value: "Initiated"},
            {select: () => renderStatus("Processing"), value: "Processing"},
            {select: () => renderStatus("Completed"), value: "Completed"},
            {select: () => renderStatus("Closed"), value: "Closed"}
        ]
    }

    const mapFunction = (ticket, index) => {
        ticket.created_at = readableTimestamp(ticket.created_at)
        ticket.status_temp = ticket.status
        ticket.status = () => renderStatus(ticket.status_temp)
        ticket.email_temp = ticket.email
        ticket.email = () => renderSender(ticket.email_temp, index)
        ticket.sender_name_temp = ticket.sender_name
        ticket.sender_name = () => renderSender(ticket.sender_name_temp, index)
        return ticket
    }

    const renderStatus = (sts) => {
        let color = sts == "Completed" ? "green" : (sts == "Initiated" ? "blue" : (sts == "Processing" ? "purple" : "rose"))
        let stroke = sts == "Completed" ? "#388E3C" : (sts == "Initiated" ? "#1976D2" : (sts == "Processing" ? "#7E57C2" : "#EC407A"))
        return {
            component: Badge,
            props: {
                text: sts,
                color: color,
                icon: '<svg style="padding-right: 4px; width: 12px;" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3" fill="' + stroke + '"/></svg>'
            },
        }
    }
    let index = 0
    const renderSender = (sender, idx = -1) => {
        index = idx == -1 ? index + 1 : idx
        let color = index%5 == 0 ? "rose" : (index%4 == 1 ? "green" :  (index%5 == 2 ? "blue" : (index%5 == 3 ? "purple" : "indigo")))
        return {
            component: Badge,
            props: {
                text: sender,
                color: color
            },
        }
    }

    const onPreview = (ticket) => {
        showModal(ViewTicket, {ticket})
    }
</script>
<div class="flex flex-col items-start self-stretch flex-1 gap-6 px-6">
    <div class="flex items-center self-stretch gap-4 mb-4">
        <div class="flex flex-col items-start flex-1 gap-1">
            <span class="self-stretch text-gray-900 text-3xl leading-[38px] font-semibold">Support</span>
            <span class="self-stretch text-gray-600">Manage and filter your saved support tickets.</span>
        </div>
        <button on:click={() => showModal(AddTicket)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-900 bg-gray-900 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-white text-sm font-semibold">New Support Ticket</span>
        </button>
    </div>
    <TableContainer>
        <Table showDateSelector={false} {columnsFilters} tableName="Tickets" tableTitle="Support Tickets" description="Manage and filter your saved support tickets" {columns} {noDataMessage} {noDataDescription} {mapFunction} fetchFunction={getClientTickets} {onPreview}>
            <div slot="no-data">
                <button on:click={() => showModal(AddTicket)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-900 bg-gray-900 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-white text-sm font-semibold">New Template</span>
                </button>
            </div>
        </Table>
    </TableContainer>
</div>