<script>
	import { onMount } from "svelte"
    import { deepCopy } from "$lib/helper/utils"
    import { showModal } from "$lib/helper/modal"
    import { exportExcel } from "../../api/fileApi"
	import { getClientOrders } from "../../api/expenseApi"
    import { readableTimestamp } from "$lib/helper/dateTime"
    import { sales, currentClient, lastOrder, paymentMethods } from "$lib/helper/store"

    import Badge from "../shared/Badge.svelte"
	import Table from "../shared/table/Table.svelte"
	import AddBalanceModal from "./Billing/AddBalanceModal.svelte"
	import TableContainer from "../shared/table/TableContainer.svelte"

    onMount(async () => {

    })

    let noDataMessage =  "You don't have any orders for now!"
    let noDataDescription = "Your orders will appear here."

    let columns = {
        credit: 'credit',
        sales_name: 'sales_name',
        pricelist: 'price',
        payment_method: 'payment_method',
        status: 'status',
        collection_date: 'collection_date'
    }

    let columnsFilters= {
        status: [{select: () => renderPaymentMethod('With any status', 2), value: '{skip}'}, {select: () => renderStatus('Paid'), value: 'Paid'}, {select: () => renderStatus('Pending'), value: 'Pending'}],
        sales_name: [{select: () => renderPaymentMethod('With any sales name', 3), value: '{skip}'}, ...$sales.map((sls, idx) => ({select: () => renderPaymentMethod(sls, idx), value: sls}))],
        payment_method: [{select: () => renderPaymentMethod('With any payment method', 1), value: '{skip}'}, ...$paymentMethods.map((payMtd, idx) => ({select: () => renderPaymentMethod(payMtd, idx + 4), value: payMtd}))],
        credit: [
            {
                select: () => renderPaymentMethod('With any credits', 2),
                value: '{skip}',
            }, {
                select: 'Less than or equals 10',
                value: 10,
                operator: '<=',
                type: "int"
            }, {
                select: 'Less than or equals 100',
                value: 100,
                operator: '<=',
                type: "int"
            }, {
                select: 'Less than or equals 1000',
                value: 1000,
                operator: '<=',
                type: "int"
            }, {
                select: 'Less than or equals 10000',
                value: 10000,
                operator: '<=',
                type: "int"
            }
        ],
    }

    const mapFunction = (order, index) => {
        order.pricelist = order.price + " LE"
        order.collection_date = readableTimestamp(order.collection_date)
        order.payment_method = () => renderPaymentMethod(order.payment_method_name, index)
        order.credit_temp = order.credit
        order.credit = () => renderCredit(order.credit_temp, order.payment_method_name)
        order.status_temp = order.status
        order.status = () => renderStatus(order.status_temp)
        return order
    }

    const renderCredit = (credit, payMtd) => {
        return {
            component: Badge,
            props: {
                text: (payMtd.toLowerCase() == "deduct" ? "-" : "+") + credit,
                color: payMtd.toLowerCase() == "deduct" ? "rose" : "green"
            }
        }
    }

    const renderStatus = (status) => {
        return {
            component: Badge,
            props: {
                text: status,
                color: status == "Pending" ? "orange" : "green",
                icon: '<svg style="padding-right: 4px; width: 12px;" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3" fill="' + (status == "Pending" ? '#F79009' : '#12B76A') + '"/></svg>'
            }
        }
    }

    let index = 0
    const renderPaymentMethod = (sender, idx = -1) => {
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

    const onDownload = (order) => {
        let cols = Object.values(columns)
        let rowData = [deepCopy(order)]

        let data = rowData.map(row => {
            let rowColumns = Object.keys(row)
            rowColumns.forEach(col => {
                row[col] = typeof row[col] == "function" ? row[col]()?.props?.text : row[col]
            })
            return row
        }).map(obj => cols.map(key => obj[key]))
        exportExcel(cols, data)
    }
</script>

<div class="flex flex-col items-start self-stretch flex-1 gap-6 px-6">
    <div class="flex items-center self-stretch gap-4">
        <div class="flex flex-col items-start flex-1 gap-1">
            <span class="self-stretch text-gray-900 text-3xl leading-[38px] font-semibold">Billings History</span>
            <span class="self-stretch text-gray-600">Manage your billings</span>
        </div>
        <div class="flex justify-end items-end gap-8 py-5 px-4 rounded-xl bg-gray-50">
            <div class="flex flex-col items-start gap-2">
                <span class="self-stretch text-gray-900 text-sm font-medium">Available Balance</span>
                <div class="flex items-start gap-5">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M9.75 3.75C9.75 4.57843 7.90317 5.25 5.625 5.25C3.34683 5.25 1.5 4.57843 1.5 3.75M9.75 3.75C9.75 2.92157 7.90317 2.25 5.625 2.25C3.34683 2.25 1.5 2.92157 1.5 3.75M9.75 3.75V4.875M1.5 3.75V12.75C1.5 13.5784 3.34683 14.25 5.625 14.25M5.625 8.25C5.49859 8.25 5.37351 8.24793 5.25 8.24388C3.14756 8.17499 1.5 7.53246 1.5 6.75M5.625 11.25C3.34683 11.25 1.5 10.5784 1.5 9.75M16.5 8.625C16.5 9.45343 14.6532 10.125 12.375 10.125C10.0968 10.125 8.25 9.45343 8.25 8.625M16.5 8.625C16.5 7.79657 14.6532 7.125 12.375 7.125C10.0968 7.125 8.25 7.79657 8.25 8.625M16.5 8.625V14.25C16.5 15.0784 14.6532 15.75 12.375 15.75C10.0968 15.75 8.25 15.0784 8.25 14.25V8.625M16.5 11.4375C16.5 12.2659 14.6532 12.9375 12.375 12.9375C10.0968 12.9375 8.25 12.2659 8.25 11.4375" stroke="#8DC220" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="text-gray-900 font-medium">{$currentClient.balance ?? "0.0"} LE</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M5.625 7.875H5.6325M9 7.875H9.0075M12.375 7.875H12.3825M5.25 13.5V15.2516C5.25 15.6513 5.25 15.8511 5.33192 15.9537C5.40317 16.043 5.5112 16.0949 5.6254 16.0948C5.75672 16.0946 5.91275 15.9698 6.22482 15.7201L8.01391 14.2889C8.37939 13.9965 8.56213 13.8503 8.76561 13.7463C8.94615 13.6541 9.13832 13.5867 9.33691 13.5459C9.56075 13.5 9.79477 13.5 10.2628 13.5H12.15C13.4101 13.5 14.0402 13.5 14.5215 13.2548C14.9448 13.039 15.289 12.6948 15.5048 12.2715C15.75 11.7902 15.75 11.1601 15.75 9.9V5.85C15.75 4.58988 15.75 3.95982 15.5048 3.47852C15.289 3.05516 14.9448 2.71095 14.5215 2.49524C14.0402 2.25 13.4101 2.25 12.15 2.25H5.85C4.58988 2.25 3.95982 2.25 3.47852 2.49524C3.05516 2.71095 2.71095 3.05516 2.49524 3.47852C2.25 3.95982 2.25 4.58988 2.25 5.85V10.5C2.25 11.1975 2.25 11.5462 2.32667 11.8323C2.53472 12.6088 3.1412 13.2153 3.91766 13.4233C4.20378 13.5 4.55252 13.5 5.25 13.5ZM6 7.875C6 8.08211 5.83211 8.25 5.625 8.25C5.41789 8.25 5.25 8.08211 5.25 7.875C5.25 7.66789 5.41789 7.5 5.625 7.5C5.83211 7.5 6 7.66789 6 7.875ZM9.375 7.875C9.375 8.08211 9.20711 8.25 9 8.25C8.79289 8.25 8.625 8.08211 8.625 7.875C8.625 7.66789 8.79289 7.5 9 7.5C9.20711 7.5 9.375 7.66789 9.375 7.875ZM12.75 7.875C12.75 8.08211 12.5821 8.25 12.375 8.25C12.1679 8.25 12 8.08211 12 7.875C12 7.66789 12.1679 7.5 12.375 7.5C12.5821 7.5 12.75 7.66789 12.75 7.875Z" stroke="#8DC220" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="text-gray-900 font-medium">{$lastOrder.number_of_messages ?? "0"} SMS</span>
                    </div>
                </div>
            </div>
            <button on:click={() => showModal(AddBalanceModal)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-900 bg-gray-900 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10.8332 4.16667C10.8332 5.08714 8.78114 5.83333 6.24984 5.83333C3.71853 5.83333 1.6665 5.08714 1.6665 4.16667M10.8332 4.16667C10.8332 3.24619 8.78114 2.5 6.24984 2.5C3.71853 2.5 1.6665 3.24619 1.6665 4.16667M10.8332 4.16667V5.41667M1.6665 4.16667V14.1667C1.6665 15.0871 3.71853 15.8333 6.24984 15.8333M6.24984 9.16667C6.10938 9.16667 5.9704 9.16437 5.83317 9.15987C3.49713 9.08332 1.6665 8.3694 1.6665 7.5M6.24984 12.5C3.71853 12.5 1.6665 11.7538 1.6665 10.8333M18.3332 9.58333C18.3332 10.5038 16.2811 11.25 13.7498 11.25C11.2185 11.25 9.1665 10.5038 9.1665 9.58333M18.3332 9.58333C18.3332 8.66286 16.2811 7.91667 13.7498 7.91667C11.2185 7.91667 9.1665 8.66286 9.1665 9.58333M18.3332 9.58333V15.8333C18.3332 16.7538 16.2811 17.5 13.7498 17.5C11.2185 17.5 9.1665 16.7538 9.1665 15.8333V9.58333M18.3332 12.7083C18.3332 13.6288 16.2811 14.375 13.7498 14.375C11.2185 14.375 9.1665 13.6288 9.1665 12.7083" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-white text-sm font-semibold">Add Balance</span>
            </button>
        </div>
    </div>
    <TableContainer>
        <Table {columns} {noDataMessage} {noDataDescription} {columnsFilters} {mapFunction} fetchFunction={getClientOrders} {onDownload} showDownloadText={false} tableName="Orders" tableTitle="Client Orders" description="Search and find your orders.">
            <div slot="no-data">
                <button on:click={() => showModal(AddBalanceModal)} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9.99984 4.1665V15.8332M4.1665 9.99984H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-white font-semibold">Add Balance</span>
                </button>
            </div>
        </Table>
    </TableContainer>

</div>