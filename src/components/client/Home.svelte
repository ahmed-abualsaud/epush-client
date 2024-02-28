<script>
	import Badge from "../shared/Badge.svelte"
	import Table from "../shared/table/Table.svelte"
	import AdsCarousel from "../shared/AdsCarousel.svelte"
	import SmoothLineChart from "../shared/SmoothLineChart.svelte"
	import AddBalanceModal from "./Billing/AddBalanceModal.svelte"
	import ViewSentMessage from "./Report/ViewSentMessage.svelte"

	import { onMount } from "svelte"
    import { showModal } from "$lib/helper/modal"
    import { getAuthenticatedUser } from "$lib/helper/auth"
    import { readableTimestamp } from "$lib/helper/dateTime"
	import { countElementsByMonth } from "$lib/helper/utils"
    import { setcurrentRouteDisplay } from "$lib/router/router"
    import { currentClient, lastOrder } from "$lib/helper/store"
    import { getClientOrders, getOrders } from "../../api/expenseApi"
    import { getClientLastOneYearMessages, getClientMessages, latestMessages } from "../../api/messageApi"

    let images = [
        {
            src: "image/announce-1.png",
            alt: "Announce 1"
        }, {
            src: "image/announce-1.png",
            alt: "Announce 2"
        }, {
            src: "image/announce-1.png",
            alt: "Announce 3"
        }, {
            src: "image/announce-1.png",
            alt: "Announce 4"
        }, {
            src: "image/announce-1.png",
            alt: "Announce 4"
        }, {
            src: "image/announce-1.png",
            alt: "Announce 4"
        },
    ]

    let messages
    let lastOneYearMessages = {}
    onMount(async () => {
        messages = await getClientMessages()
        lastOneYearMessages = countElementsByMonth((await getClientLastOneYearMessages()).data)
    })

    let user
    const loadUser = async () => {
        user = await getAuthenticatedUser()
    }

    $: loadUser()

    const messageMapFunction = (message) => {
        message.message = message.content
        message.total_cost = message.total_cost + " LE"
        message.length = message.length
        message.sent_date = readableTimestamp(message.updated_at)
        message.sender_name = () => renderSenderName(message.sender.name)
        message.segments = message.number_of_segments
        message.recipients = message.number_of_recipients
        message.language = message.language.name
        message.type_of_send = () => renderTypeOfSend(message.send_type)
        message.status = () => renderMessageStatus(message.sent)
        return message
    }

    let messageIndex = 0
    const renderSenderName = (sender) => {
        messageIndex++
        let color = messageIndex%5 == 0 ? "rose" : (messageIndex%4 == 1 ? "green" :  (messageIndex%5 == 2 ? "blue" : "purple"))
        return {
            component: Badge,
            props: {
                text: sender,
                color: color
            },
        }
    }

    const renderMessageStatus = (status) => {
        return {
            component: Badge,
            props: {
                text: status ? "Sent" : "Pending",
                color: status ? "green" : "blue",
                icon: '<svg style="padding-right: 4px; width: 12px;" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3" fill="' + (status ? '#12B76A' : '#2E90FA') + '"/></svg>'
            }
        }
    }

    const renderTypeOfSend = (sendType) => {
        let icon =  sendType == "Bulk Messages" ? '<svg style="padding-right: 4px; width: 17px;" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><g clip-path="url(#clip0_529_2366)"><path d="M6.5 3.5H2.6C2.03995 3.5 1.75992 3.5 1.54601 3.60899C1.35785 3.70487 1.20487 3.85785 1.10899 4.04601C1 4.25992 1 4.53995 1 5.1V6.9C1 7.46005 1 7.74008 1.10899 7.95399C1.20487 8.14215 1.35785 8.29513 1.54601 8.39101C1.75992 8.5 2.03995 8.5 2.6 8.5H6.5M8.5 3.5H9.4C9.96005 3.5 10.2401 3.5 10.454 3.60899C10.6422 3.70487 10.7951 3.85785 10.891 4.04601C11 4.25992 11 4.53995 11 5.1V6.9C11 7.46005 11 7.74008 10.891 7.95399C10.7951 8.14215 10.6422 8.29513 10.454 8.39101C10.2401 8.5 9.96005 8.5 9.4 8.5H8.5M8.5 10.5L8.5 1.5M9.75 1.5L7.25 1.5M9.75 10.5L7.25 10.5" stroke="#12B76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_529_2366"><rect width="12" height="12" fill="white"/></clipPath></defs></svg>' :
                    sendType == "Custom Messages" ? '<svg style="padding-right: 4px; width: 17px;" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 7V4.25C6 3.83579 6.33579 3.5 6.75 3.5C7.16421 3.5 7.5 3.83579 7.5 4.25V7C7.5 7.82843 6.82843 8.5 6 8.5C5.17157 8.5 4.5 7.82843 4.5 7V5M4.4 11H7.6C8.44008 11 8.86012 11 9.18099 10.8365C9.46323 10.6927 9.6927 10.4632 9.83651 10.181C10 9.86012 10 9.44008 10 8.6V3.4C10 2.55992 10 2.13988 9.83651 1.81901C9.6927 1.53677 9.46323 1.3073 9.18099 1.16349C8.86012 1 8.44008 1 7.6 1H4.4C3.55992 1 3.13988 1 2.81901 1.16349C2.53677 1.3073 2.3073 1.53677 2.16349 1.81901C2 2.13988 2 2.55992 2 3.4V8.6C2 9.44008 2 9.86012 2.16349 10.181C2.3073 10.4632 2.53677 10.6927 2.81901 10.8365C3.13988 11 3.55992 11 4.4 11Z" stroke="#6172F3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
                    sendType == "Custom with Parameters" ? '<svg style="padding-right: 4px; width: 17px;" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2C8.46499 2 8.69748 2 8.88823 2.05111C9.40587 2.18981 9.81019 2.59413 9.94889 3.11177C10 3.30252 10 3.53501 10 4V8.6C10 9.44008 10 9.86012 9.83651 10.181C9.6927 10.4632 9.46323 10.6927 9.18099 10.8365C8.86012 11 8.44008 11 7.6 11H4.4C3.55992 11 3.13988 11 2.81901 10.8365C2.53677 10.6927 2.3073 10.4632 2.16349 10.181C2 9.86012 2 9.44008 2 8.6V4C2 3.53501 2 3.30252 2.05111 3.11177C2.18981 2.59413 2.59413 2.18981 3.11177 2.05111C3.30252 2 3.53501 2 4 2M6 7.75V5.5C6 5.08579 6.33579 4.75 6.75 4.75C7.16421 4.75 7.5 5.08579 7.5 5.5V7.75C7.5 8.57843 6.82843 9.25 6 9.25C5.17157 9.25 4.5 8.57843 4.5 7.75V5.75M4.8 3H7.2C7.48003 3 7.62004 3 7.727 2.9455C7.82108 2.89757 7.89757 2.82108 7.9455 2.727C8 2.62004 8 2.48003 8 2.2V1.8C8 1.51997 8 1.37996 7.9455 1.273C7.89757 1.17892 7.82108 1.10243 7.727 1.0545C7.62004 1 7.48003 1 7.2 1H4.8C4.51997 1 4.37996 1 4.273 1.0545C4.17892 1.10243 4.10243 1.17892 4.0545 1.273C4 1.37996 4 1.51997 4 1.8V2.2C4 2.48003 4 2.62004 4.0545 2.727C4.10243 2.82108 4.17892 2.89757 4.273 2.9455C4.37996 3 4.51997 3 4.8 3Z" stroke="#F63D68" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
                    '<svg style="padding-right: 4px; width: 17px;" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><g clip-path="url(#clip0_529_10081)"><path d="M11 10.5V9.5C11 8.56808 10.3626 7.78503 9.5 7.56301M7.75 1.64538C8.48296 1.94207 9 2.66066 9 3.5C9 4.33934 8.48296 5.05793 7.75 5.35462M8.5 10.5C8.5 9.56812 8.5 9.10218 8.34776 8.73463C8.14477 8.24458 7.75542 7.85523 7.26537 7.65224C6.89782 7.5 6.43188 7.5 5.5 7.5H4C3.06812 7.5 2.60218 7.5 2.23463 7.65224C1.74458 7.85523 1.35523 8.24458 1.15224 8.73463C1 9.10218 1 9.56812 1 10.5M6.75 3.5C6.75 4.60457 5.85457 5.5 4.75 5.5C3.64543 5.5 2.75 4.60457 2.75 3.5C2.75 2.39543 3.64543 1.5 4.75 1.5C5.85457 1.5 6.75 2.39543 6.75 3.5Z" stroke="#0BA5EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_529_10081"><rect width="12" height="12" fill="white"/></clipPath></defs></svg>'
        return {
            component: Badge,
            props: {
                text: sendType,
                color: sendType == "Bulk Messages" ? "green" : (sendType == "Custom Messages" ? "indigo" : (sendType == "Custom with Parameters" ? "rose" : "blue")),
                icon
            }
        }
    }

    const orderMapFunction = (order, index) => {
        order.pricelist = order.price + " LE"
        order.collection_date = readableTimestamp(order.collection_date)
        order.payment_method = () => renderPaymentMethod(order.payment_method_name, index)
        order.credit_temp = order.credit
        order.credit = () => renderCredit(order.credit_temp, order.payment_method_name)
        order.status_temp = order.status
        // order.status = () => renderOrderStatus(order.status_temp)
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

    const renderOrderStatus = (status) => {
        return {
            component: Badge,
            props: {
                text: status,
                color: status == "Pending" ? "orange" : "green",
                icon: '<svg style="padding-right: 4px; width: 12px;" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3" fill="' + (status == "Pending" ? '#F79009' : '#12B76A') + '"/></svg>'
            }
        }
    }

    let orderStatus = 0
    const renderPaymentMethod = (payMtod, idx = -1) => {
        orderStatus = idx == -1 ? orderStatus + 1 : idx
        let color = orderStatus%5 == 0 ? "rose" : (orderStatus%4 == 1 ? "green" :  (orderStatus%5 == 2 ? "blue" : (orderStatus%5 == 3 ? "purple" : "indigo")))
        return {
            component: Badge,
            props: {
                text: payMtod,
                color: color
            },
        }
    }

    const viewAll = () => {
        setcurrentRouteDisplay("Reports")
    }

    const onPreviewMessage = (message) => {
        showModal(ViewSentMessage, {message})
    }

    let messagesButton
    let ordersButton
    let shownTable = "messages"
    const showTable = (table) => {
        shownTable = table

        if (table == "messages") {
            messagesButton.classList.add("bg-gray-100")
            messagesButton.classList.remove("bg-white")
            ordersButton.classList.remove("bg-gray-100")
            ordersButton.classList.add("bg-white")
        }

        if (table == "orders") {
            ordersButton.classList.add("bg-gray-100")
            ordersButton.classList.remove("bg-white")
            messagesButton.classList.remove("bg-gray-100")
            messagesButton.classList.add("bg-white")
        }
    }
</script>

<div class="flex flex-col justify-center items-start self-stretch flex-1 gap-6 px-6">
    <div class="flex items-center self-stretch gap-4">
        <div class="flex flex-col items-start flex-1 gap-1">
            <span class="self-stretch text-gray-900 text-3xl leading-[38px] font-semibold">Hi {user?.first_name ?? "Unknown"},</span>
            <span class="self-stretch text-gray-600">Track, manage and forecast your customers and orders.</span>
        </div>
    </div>
    <div class="flex items-center md:items-end self-stretch gap-6 flex-col md:flex-row">
        <AdsCarousel {images} />
        <!-- Balance Card -->
        <div class="flex justify-between items-center w-[250px] xs:w-[300px] sm:w-[397px] h-[200px] sm:h-[168px] py-4 px-6 rounded-lg bg-gray-100">
            <div class="flex flex-col items-start gap-6">
                <div class="flex flex-col items-start gap-2">
                    <span class="text-gray-900 font-medium">Available Balance</span>
                    <div class="flex items-start gap-5 flex-col sm:flex-row">
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
                <div class="flex items-center gap-12">
                    <button on:click={() => showModal(AddBalanceModal)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-900 bg-gray-900 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10.8332 4.16667C10.8332 5.08714 8.78114 5.83333 6.24984 5.83333C3.71853 5.83333 1.6665 5.08714 1.6665 4.16667M10.8332 4.16667C10.8332 3.24619 8.78114 2.5 6.24984 2.5C3.71853 2.5 1.6665 3.24619 1.6665 4.16667M10.8332 4.16667V5.41667M1.6665 4.16667V14.1667C1.6665 15.0871 3.71853 15.8333 6.24984 15.8333M6.24984 9.16667C6.10938 9.16667 5.9704 9.16437 5.83317 9.15987C3.49713 9.08332 1.6665 8.3694 1.6665 7.5M6.24984 12.5C3.71853 12.5 1.6665 11.7538 1.6665 10.8333M18.3332 9.58333C18.3332 10.5038 16.2811 11.25 13.7498 11.25C11.2185 11.25 9.1665 10.5038 9.1665 9.58333M18.3332 9.58333C18.3332 8.66286 16.2811 7.91667 13.7498 7.91667C11.2185 7.91667 9.1665 8.66286 9.1665 9.58333M18.3332 9.58333V15.8333C18.3332 16.7538 16.2811 17.5 13.7498 17.5C11.2185 17.5 9.1665 16.7538 9.1665 15.8333V9.58333M18.3332 12.7083C18.3332 13.6288 16.2811 14.375 13.7498 14.375C11.2185 14.375 9.1665 13.6288 9.1665 12.7083" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="text-white font-semibold">Add Balance</span>
                    </button>
                </div>
            </div>
            <svg class="flex-shrink hidden xs:block" xmlns="http://www.w3.org/2000/svg" width="77" height="96" viewBox="0 0 77 96" fill="none">
                <path d="M21.4372 79.824L18.619 93.5544C18.4828 94.2623 18.6418 94.6921 18.9596 94.8994L10.9619 90.2299C10.6414 90.0479 10.4598 89.5928 10.596 88.8875L13.4369 75.1571C13.6185 74.2216 13.3915 73.4935 12.8919 73.1978L20.8897 77.8672C21.4145 78.163 21.6188 78.8911 21.4372 79.824Z" fill="#8DC220"/>
                <path d="M19.0138 95.9229C18.817 95.9226 18.6238 95.8703 18.4537 95.7712L10.4534 91.1042C9.71665 90.682 9.39876 89.782 9.60817 88.6974L12.4515 74.9493C12.5651 74.3552 12.4112 74.0923 12.3759 74.0645C12.1467 73.9286 11.9808 73.7072 11.9146 73.4488C11.8484 73.1904 11.8872 72.9163 12.0226 72.6866C12.0892 72.572 12.1776 72.4717 12.2829 72.3913C12.3881 72.311 12.5081 72.2522 12.6361 72.2184C12.764 72.1846 12.8974 72.1764 13.0285 72.1943C13.1596 72.2121 13.2859 72.2557 13.4002 72.3226L21.398 76.9921C22.3087 77.5078 22.6948 78.6404 22.4273 80.0182L22.4248 80.0258L19.6092 93.7588C19.5537 94.0369 19.5915 94.143 19.5915 94.143C20.0532 94.4414 20.1516 95.0051 19.864 95.4754C19.7726 95.6169 19.6463 95.7324 19.4974 95.8108C19.3485 95.8892 19.1819 95.9278 19.0138 95.9229ZM14.4447 75.2729L14.4295 75.3488L11.5862 89.0918C11.554 89.2149 11.5505 89.3438 11.5761 89.4685L17.7043 93.0054L20.4468 79.6264C20.5654 79.0247 20.4266 78.7668 20.3963 78.7441L14.4447 75.2729Z" fill="black"/>
                <path d="M68.654 7.75533C62.5661 4.2235 53.2715 5.09066 42.8618 11.1254C24.6158 21.6677 9.86654 44.0748 9.91195 61.1524C9.93718 68.5093 12.6847 73.6541 17.274 76.3416L9.25093 71.6746C4.68438 69.0099 1.93435 63.8398 1.91417 56.4854C1.86875 39.4053 16.6155 17.021 34.864 6.45586C45.2712 0.42116 54.5658 -0.443468 60.6335 3.10858L68.654 7.75533Z" fill="#8DC220"/>
                <path d="M42.8733 11.115C61.1396 0.547309 75.9493 5.85137 75.9973 22.924C76.0452 40.0143 61.3136 62.4086 43.0474 72.9763C39.4043 75.0848 35.8923 76.5663 32.6099 77.4436C32.4239 77.4986 32.2452 77.5758 32.0776 77.6736C31.5623 77.9885 31.1249 78.4164 30.7984 78.9251L20.8277 93.9473C20.5603 94.3468 20.2626 94.6299 19.9699 94.7968C19.1323 95.2822 18.3628 94.8221 18.6176 93.5529L21.4433 79.82C21.6578 78.7582 21.3348 77.9416 20.6511 77.752C14.0763 75.8812 9.9487 70.1549 9.92347 61.1496C9.87301 44.077 24.6197 21.6751 42.8733 11.115Z" fill="white"/>
                <path d="M75.9803 22.9265C76.0307 40.0168 61.2966 62.4162 43.0304 72.9839C39.3974 75.0822 35.8904 76.5738 32.6106 77.4334C32.434 77.484 32.2574 77.5851 32.0808 77.6862C31.6014 77.939 31.1473 78.3688 30.7941 78.925L20.8284 93.9422C20.5508 94.3467 20.2481 94.6248 19.9706 94.8018C19.138 95.2822 18.3559 94.8271 18.6082 93.563L21.4339 79.8099C21.6609 78.748 21.333 77.939 20.6518 77.7621C20.1722 77.6285 19.7006 77.4681 19.2389 77.2817C29.7092 76.0176 40.5579 71.2394 49.7667 63.0229C67.8563 46.8933 73.533 22.8759 64.2737 6.11426C71.4137 7.63115 75.955 13.4712 75.9803 22.9265Z" fill="#E9EDF4"/>
                <path d="M17.2803 77.3569C17.1019 77.3567 16.9268 77.3087 16.7732 77.2179L8.75017 72.5484C3.71686 69.6132 0.92899 63.9097 0.908806 56.4896C0.86087 39.1262 15.87 16.292 34.3633 5.58019C44.7402 -0.43175 54.4965 -1.65032 61.1495 2.23798L69.1625 6.87966C69.3943 7.01377 69.5635 7.23467 69.6328 7.49377C69.7021 7.75288 69.6659 8.02897 69.5321 8.2613C69.3982 8.49363 69.1778 8.66317 68.9192 8.73263C68.6606 8.80209 68.3851 8.76577 68.1533 8.63167L68.1482 8.62915C62.1183 5.13271 53.0862 6.36645 43.3728 12.0017C25.437 22.3671 10.8821 44.4126 10.9275 61.1515C10.9451 67.9017 13.3192 72.8518 17.7899 75.4684C17.9835 75.5796 18.1348 75.7519 18.2202 75.9584C18.3056 76.1649 18.3204 76.3939 18.2622 76.6097C18.2039 76.8255 18.076 77.0158 17.8984 77.151C17.7207 77.2862 17.5034 77.3587 17.2803 77.3569ZM52.2031 2.01297C47.243 2.01297 41.4452 3.80796 35.3724 7.3322C17.4342 17.7204 2.88176 39.7684 2.92717 56.4845C2.94736 63.2524 5.3139 68.2025 9.7644 70.8014L11.3816 71.7419C9.75935 68.8826 8.91668 65.3204 8.90659 61.1566C8.86118 43.773 23.8703 20.9362 42.361 10.2497C49.1831 6.29566 55.7554 4.41724 61.3488 4.68776L60.1328 3.98746C57.8773 2.66523 55.1903 2.01297 52.2031 2.01297Z" fill="black"/>
                <path d="M19.3373 96.0001C18.9718 96.0038 18.6147 95.8904 18.318 95.6765C18.0127 95.4565 17.334 94.7891 17.6267 93.3557L20.4499 79.6177C20.5634 79.0539 20.4297 78.7606 20.3818 78.7278C13.1131 76.6623 8.93509 70.2585 8.90734 61.1571C8.8594 43.7811 23.8685 20.9443 42.3618 10.2401C52.7059 4.25852 62.4521 3.02226 69.1027 6.85241C74.1738 9.78001 76.9793 15.4886 76.9995 22.9239C77.05 40.3074 62.0434 63.1543 43.5476 73.856C39.9095 75.962 36.3143 77.4991 32.8679 78.4219C32.767 78.4526 32.6704 78.4959 32.5803 78.5508C32.1972 78.7885 31.8729 79.11 31.6316 79.4913L21.6659 94.5085C21.3203 95.0217 20.9091 95.4212 20.4701 95.6765C20.1274 95.8823 19.7367 95.994 19.3373 96.0001ZM60.2294 6.67544C55.2642 6.67544 49.4538 8.47295 43.3735 11.9947C25.4353 22.3702 10.8778 44.4233 10.9282 61.1495C10.9535 69.4039 14.4982 74.9532 20.9217 76.7811C22.1428 77.1199 22.7508 78.4244 22.4254 80.0222L19.5996 93.7602L19.5896 93.8208C19.7465 93.6998 19.8806 93.5517 19.9857 93.3835L29.9514 78.3662C30.403 77.6912 30.9605 77.1527 31.5711 76.7988C31.8108 76.6597 32.0631 76.5485 32.3229 76.4752C35.6204 75.5903 39.0517 74.124 42.5384 72.1015C60.4767 61.7259 75.0291 39.6678 74.9811 22.9289C74.9635 16.1484 72.5818 11.1958 68.0935 8.60694C65.8531 7.31759 63.1914 6.67544 60.2294 6.67544Z" fill="black"/>
                <path d="M27.5681 43.3186C28.9961 42.4893 30.2954 41.9862 31.4534 41.8067C31.8218 41.7511 32.0009 41.9458 32.0034 42.3933C31.995 42.6654 31.9214 42.9316 31.789 43.1694C31.6658 43.4265 31.4702 43.6418 31.2264 43.7888C31.1292 43.8394 31.0227 43.8695 30.9135 43.8773C29.8018 44.0977 28.7366 44.5091 27.7649 45.0933C26.8006 45.6333 25.9492 46.3543 25.257 47.217C24.6187 48.0411 24.2983 48.8577 24.2983 49.6693C24.3008 50.2052 24.4547 50.5541 24.76 50.7185C25.0653 50.8777 25.4513 50.9207 25.913 50.8373C26.3772 50.7614 27.008 50.592 27.8027 50.3443C28.8296 50.0333 29.6647 49.8361 30.2954 49.7552C30.5781 49.7087 30.8671 49.7191 31.1457 49.786C31.4243 49.8528 31.6867 49.9747 31.9177 50.1446C32.3718 50.4859 32.5989 51.1659 32.5989 52.1823C32.6039 53.0241 32.397 53.9014 31.9807 54.8065C31.5396 55.7556 30.9474 56.6265 30.2273 57.3852C29.4704 58.1993 28.6025 58.8894 27.6135 59.4608C25.9584 60.419 24.4093 60.9524 22.9586 61.0738C22.8868 61.0806 22.8144 61.0712 22.7467 61.0463C22.6791 61.0213 22.6178 60.9815 22.5676 60.9297C22.4567 60.802 22.3997 60.6361 22.4086 60.467C22.4086 60.2142 22.4843 59.9487 22.6357 59.6757C22.7643 59.4198 22.9629 59.2058 23.2084 59.0588C23.3214 58.9891 23.4495 58.9475 23.5818 58.9375C24.7777 58.8591 26.0619 58.4217 27.4318 57.6279C29.7075 56.3133 30.8454 54.7913 30.8378 53.0671C30.8378 52.6196 30.694 52.3264 30.3963 52.1974C30.0511 52.0615 29.6729 52.0333 29.3114 52.1165C28.6932 52.2337 28.081 52.3814 27.4773 52.5589C26.4176 52.8547 25.5648 53.0443 24.9164 53.1253C24.2605 53.2163 23.6979 53.1 23.2311 52.7814C22.7593 52.4705 22.5247 51.8258 22.5222 50.8524C22.5337 49.9332 22.7311 49.0259 23.1024 48.1852C23.4884 47.2625 24.0612 46.3751 24.8231 45.5206C25.6166 44.6462 26.543 43.903 27.5681 43.3186ZM49.1066 30.9635C49.4598 30.7612 49.7626 30.7359 50.0098 30.8826C50.2571 31.0343 50.3832 31.3124 50.3832 31.7143L50.421 45.1388C50.4157 45.4461 50.3286 45.7463 50.1687 46.0085C50.0214 46.276 49.8065 46.5001 49.5456 46.6582C49.2958 46.8049 49.0839 46.8276 48.9098 46.7366C48.7332 46.6431 48.6449 46.4509 48.6424 46.1678L48.607 33.393L44.1313 48.8451C44.0304 49.194 43.8639 49.5176 43.6368 49.821C43.4357 50.1016 43.1789 50.3374 42.8824 50.5137C42.6612 50.6614 42.3943 50.7242 42.1306 50.6906C42.0208 50.6718 41.9174 50.6256 41.8301 50.5562C41.7428 50.4869 41.6744 50.3966 41.6311 50.2937L37.0872 40.0572L37.1225 52.8345C37.1152 53.1445 37.0246 53.4467 36.8601 53.7093C36.7072 53.9788 36.4884 54.205 36.2243 54.3666C35.9771 54.5082 35.7677 54.5309 35.6012 54.4374C35.4296 54.3388 35.3438 54.1466 35.3438 53.8635L35.306 40.439C35.3152 39.9924 35.4423 39.5563 35.6743 39.1749C35.8824 38.7813 36.1916 38.4505 36.57 38.2168L37.2159 37.8451C37.4757 37.6934 37.7129 37.6504 37.9273 37.7061C38.1443 37.7617 38.3058 37.8906 38.4092 38.0979L42.8749 48.2636L47.2774 32.9683C47.3784 32.6396 47.5398 32.3262 47.7568 32.0203C47.94 31.7424 48.1821 31.5085 48.4658 31.3351L49.1066 30.9635ZM58.4642 25.442C59.8973 24.6128 61.1916 24.1122 62.3546 23.9302C62.718 23.8745 62.9021 24.0692 62.9047 24.5167C62.8962 24.7889 62.8226 25.055 62.6902 25.2928C62.5658 25.5513 62.3684 25.7676 62.1225 25.9148C62.0262 25.9647 61.9205 25.9939 61.8122 26.0007C60.7016 26.2221 59.6374 26.6335 58.6661 27.2168C57.7016 27.7564 56.8501 28.4775 56.1583 29.3404C55.5149 30.1671 55.1945 30.9837 55.197 31.7927C55.197 32.3287 55.3509 32.6801 55.6562 32.8444C56.0197 33.0103 56.4277 33.0512 56.8168 32.9607C57.2759 32.8849 57.9041 32.718 58.6989 32.4703C59.7308 32.1568 60.5608 31.9621 61.1916 31.8787C61.8248 31.7978 62.3647 31.9292 62.8189 32.268C63.268 32.6118 63.495 33.2919 63.4976 34.3082C63.4976 35.1501 63.2957 36.0223 62.8819 36.9299C62.4657 37.8401 61.8803 38.6996 61.1234 39.5086C60.3613 40.329 59.4802 41.0296 58.5097 41.5868C56.8546 42.5449 55.3055 43.0784 53.8598 43.1972C53.7877 43.2059 53.7145 43.1971 53.6465 43.1716C53.5785 43.1461 53.5175 43.1046 53.4688 43.0506C53.3603 42.9444 53.3098 42.7851 53.3098 42.5905C53.3098 42.3376 53.3805 42.0747 53.5319 41.7991C53.6619 41.5426 53.8624 41.3286 54.1096 41.1823C54.2383 41.1064 54.3619 41.0685 54.478 41.0609C55.6789 40.98 56.9631 40.5452 58.328 39.7539C60.6062 38.4367 61.7441 36.9148 61.7416 35.1906C61.739 34.7405 61.5902 34.4498 61.2975 34.3209C60.952 34.1864 60.5743 34.1583 60.2126 34.24C59.7812 34.3158 59.1656 34.4624 58.3709 34.6849C57.5323 34.933 56.6775 35.1223 55.8126 35.2512C55.2277 35.3522 54.6262 35.2295 54.1273 34.9074C53.6605 34.5939 53.4208 33.9518 53.4183 32.9784C53.4158 32.1188 53.6101 31.234 53.9986 30.3112C54.3846 29.3884 54.9624 28.496 55.7218 27.644C56.514 26.7701 57.4397 26.0277 58.4642 25.4445V25.442Z" fill="black"/>
            </svg>
        </div>
    </div>
    <SmoothLineChart 
        title="Messages over time"
        xTitle="Messages"
        yTitle="Month"
        xPoints={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
        yPoints={Object.values(lastOneYearMessages)}
    />
    <div class="flex items-center self-stretch gap-6">
        <div class="flex flex-col items-start flex-1 rounded-xl border border-gray-200 bg-white shadow-sm w-full">
            <div class="flex flex-col items-start self-stretch gap-5 pb-5 rounded-t-xl bg-white border-b">
                <div class="flex items-start self-stretch gap-4 px-6 pt-5">
                    <div class="flex items-center self-stretch flex-1 gap-3">
                        <span class="text-gray-900 text-lg font-semibold">Latest</span>

                        <div class="flex items-start rounded-lg border border-gray-300 shadow-sm">
                            <button bind:this={messagesButton} on:click={() => showTable("messages")} class="flex justify-center items-center rounded-l-lg gap-2 py-2.5 px-4 border-r border-r-gray-300 bg-gray-100 hover:bg-gray-100">
                                <span class="text-gray-800 font-semibold text-sm">Messages</span>
                            </button>
                            <button bind:this={ordersButton} on:click={() => showTable("orders")} class="flex justify-center items-center rounded-r-lg gap-2 py-2.5 px-4 bg-white hover:bg-gray-100">
                                <span class="text-gray-700 font-semibold text-sm">Orders</span>
                            </button>
                        </div>

                    </div>
                    <button on:click={viewAll} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm">
                        <span class="text-gray-700 text-sm font-semibold">View All</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4.1665 9.99984H15.8332M15.8332 9.99984L9.99984 4.1665M15.8332 9.99984L9.99984 15.8332" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                    </button>
                </div>
            </div>
            {#if shownTable === "messages"}
                <Table showHeader={false} allowBulkActions={false} mapFunction={messageMapFunction} onPreview={onPreviewMessage} fetchFunction={async () =>  latestMessages(4)} columns={[
                    'sender_name',
                    'message',
                    'sent_date',
                    'type_of_send',
                    'status',
                    'total_cost',
                    'language',
                    'length',
                    'recipients',
                    'segments'
                ]} />
            {/if}
            {#if shownTable === "orders"}
                <Table showHeader={false} allowBulkActions={false} mapFunction={orderMapFunction} fetchFunction={() => getOrders(4)} columns={{
                    credit: 'credit',
                    sales_name: 'sales_name',
                    pricelist: 'price',
                    payment_method: 'payment_method',
                    // status: 'status',
                    collection_date: 'collection_date'
                }}>
                    <div slot="no-data">
                        <button on:click={() => showModal(AddBalanceModal)} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M9.99984 4.1665V15.8332M4.1665 9.99984H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="text-white font-semibold">Add Balance</span>
                        </button>
                    </div>
                </Table>
            {/if}
        </div>
    </div>
</div>