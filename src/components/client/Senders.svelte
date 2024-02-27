<script>
	import Badge from "../shared/Badge.svelte"
	import Table from "../shared/table/Table.svelte"
	import AddSenderModal from "./Sender/AddSenderModal.svelte"
	import NetworkOperator from "../shared/NetworkOperator.svelte"
	import TableContainer from "../shared/table/TableContainer.svelte"
	import BulkDeleteSenderModal from "./Sender/BulkDeleteSenderModal.svelte"

    import { showModal } from "$lib/helper/modal"
	import { currentClient } from "$lib/helper/store"
    import { getClientSenders } from "../../api/clientApi"
    import { readableTimestamp } from "$lib/helper/dateTime"
    import { beautifulToSnakeCase } from "$lib/helper/strUtils"


    let noDataMessage = "You don't have any senders for now!"
    let noDataDescription = "Senders will appear here."

    let columnsRenders = {}
    let columns = {
        sender_name: 'name',
        sender_approved: 'approved',
    }
    $currentClient.connections.forEach(conn => {
        columns[beautifulToSnakeCase(conn.operator_name)] = beautifulToSnakeCase(conn.operator_name)
        columnsRenders[beautifulToSnakeCase(conn.operator_name)] = () => renderOperator(conn.operator_name)
    })
    columns.created_at = 'created_at'

    let keys = Object.keys(columns)


    const renderOperator = (operator) => {
        return {
            component: NetworkOperator,
            props: { operator }
        }
    }

    const mapFunction = (conn) => {
        conn.created_at = readableTimestamp(conn.created_at)

        keys.forEach(key => {
            if (! ['sender_name', 'created_at'].includes(key)) {
                let temp = conn[key]
                conn[key] = () => renderStatus(temp)
            }
        })
        return conn
    }

    const renderStatus = (status) => {
        return {
            component: Badge,
            props: {
                text: status ? "Active" : "Inactive",
                color: status ? "green" : "rose",
                icon: '<svg style="padding-right: 4px; width: 12px;" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3" fill="' + (status ? '#12B76A' : '#F43F5E') + '"/></svg>'
            }
        }
    }

    const fetchFunction = async () => {
        let opertors = [...new Set($currentClient.connections.map(conn => {
            return conn.operator_name
        }))]

        let senders = (await getClientSenders()).map(sender => {
            return {
                sender_name: sender.name,
                sender_approved: sender.approved,
                created_at: sender.created_at
            }
        })

        return senders.map(sender => {
            let connection = {...sender}
            opertors.forEach(opertor => {
                connection[beautifulToSnakeCase(opertor)] = false
            })

            $currentClient.connections.filter(conn => conn.sender_name == sender.sender_name).forEach(conn => {
                opertors.forEach(opertor => {
                    connection[beautifulToSnakeCase(opertor)] ||= (conn.approved && (conn.operator_name == opertor))
                })
            })

            return connection
        })
    }

    const searchFunction = (column, value, data) => {
        return data.filter(d => d[column].toString().toLowerCase().match(new RegExp(`.*${value}.*`)))
    }

    const onBulkDelete = (senders) => {
        showModal(BulkDeleteSenderModal, {senders})
    }
</script>

<div class="flex flex-col items-start self-stretch flex-1 gap-6 px-6">
    <div class="flex items-center self-stretch gap-4 mb-4">
        <div class="flex flex-col items-start flex-1 gap-1">
            <span class="self-stretch text-gray-900 text-3xl leading-[38px] font-semibold">Senders</span>
            <span class="self-stretch text-gray-600">Manage and search your senders</span>
        </div>
        <button on:click={() => showModal(AddSenderModal)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-900 bg-gray-900 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-white text-sm font-semibold">New Sender</span>
        </button>
    </div>
    <TableContainer>
        <Table showDateSelector={false} showFilter={false} tableName="Senders" description="Manage your senders and connections" {columns} {columnsRenders} searchColumns={['sender_name']} {searchFunction} {noDataMessage} {noDataDescription} {mapFunction} {fetchFunction} {onBulkDelete} showBulkDownload={false}>
            <div slot="no-data">
                <button on:click={() => showModal(AddSenderModal)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-900 bg-gray-900 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-white text-sm font-semibold">New Sender</span>
                </button>
            </div>
        </Table>
    </TableContainer>
</div>