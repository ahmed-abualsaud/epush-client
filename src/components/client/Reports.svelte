<script>
	import Card from "../shared/Card.svelte"
	import Badge from "../shared/Badge.svelte"
	import Table from "../shared/table/Table.svelte"
	import TableContainer from "../shared/table/TableContainer.svelte"
	import ViewSentMessage from "./Report/ViewSentMessage.svelte"
    import AddMessageButton from "./Report/AddMessageButton.svelte"

    import { onMount } from "svelte"
	import { empty } from "$lib/helper/utils"
    import { showModal } from "$lib/helper/modal"
    import { listMessageLanguages } from "../../api/messageApi"
    import { addSlugToCurrentRouteDisplay } from "$lib/router/router"
    import { currentClient, clientSenderNames } from "$lib/helper/store"
    import { readableTimestamp, getDatetimeString } from "$lib/helper/dateTime"

	import { 
        getBulkMessages,
        getDraftMessages,
        getClientMessages,
        getCustomMessages,
        getGroupSMSMessages,
        getCustomWithParametersMessages
    } from "../../api/messageApi"


    let messageSelector
    let totalCost = 0
    let numberOfMessages = 0
    let numberOfRecipients = 0
    let shownTable = "all"
    let noDataMessage =  "You don't have any message for now!"
    let noDataDescription = "Pushed messages will appear here."

    let columns = {
        sender_name: 'sender_name',
        message: 'content',
        sent_date: 'updated_at',
        type_of_send: 'send_type',
        status: 'sent',
        total_cost: 'total_cost',
        language: 'language',
        length: 'length',
        recipients: 'number_of_recipients',
        segments: 'number_of_segments'
    }

    let columnsFilters = {
        sender_name: [{select: () => renderSenderName('With any sender name', 0), value: '{skip}'}, ...$clientSenderNames.map((sender, idx) => ({select: () => renderSenderName(sender, idx + 4), value: sender}))],
        status: [{select: () => renderSenderName('With any status', 1), value: '{skip}'}, {select:() => renderStatus(true), value: 1, type: "int"}, {select: () => renderStatus(false), value: 0, type: "int"}],
        recipients: [
            {
                select: () => renderSenderName('With any number of recipients', 2),
                value: '{skip}',
            }, {
                select: 'Less than or equals 10',
                value: 10,
                operator: '<=',
                type: "int"
            }, {
                select: 'Less than or equals 25',
                value: 25,
                operator: '<=',
                type: "int"
            }, {
                select: 'Less than or equals 50',
                value: 50,
                operator: '<=',
                type: "int"
            }, {
                select: 'Less than or equals 100',
                value: 100,
                operator: '<=',
                type: "int"
            }
        ],
        language: [{select: () => renderSenderName('With any language', 3), value: '{skip}'}]
    }

    onMount(async () => {
        totalCost = $currentClient.stats.total_cost
        numberOfMessages = $currentClient.stats.number_of_messages
        numberOfRecipients = $currentClient.stats.number_of_recipients
        addSlugToCurrentRouteDisplay("reports", shownTable, 1)
        columnsFilters.language.push(...[...new Set((await listMessageLanguages()).map(lng => lng.name))].map(lng => ({select: lng})))
    })

    const onClickHandler = (buttonID) => {
        shownTable = buttonID
        addSlugToCurrentRouteDisplay("reports", shownTable, 1)
        let button = messageSelector.querySelector("#" + buttonID)
        if (empty(button)) return

        messageSelector.querySelectorAll('button').forEach(btn => {
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

    const mapFunction = (message, index) => {
        message.message = message.content
        message.total_cost = message.total_cost + " LE"
        message.length = message.length
        message.sent_date = readableTimestamp(message.updated_at)
        message.temp_sender_name = message.sender_name
        message.sender_name = () => renderSenderName(message.temp_sender_name, index)
        message.segments = message.number_of_segments
        message.recipients = message.number_of_recipients
        message.language = message.language.name
        message.type_of_send = () => renderTypeOfSend(message.send_type)
        message.status = () => renderStatus(message.sent)
        return message
    }

    let index = 0
    const renderSenderName = (sender, idx = -1) => {
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

    const renderStatus = (status) => {
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

    const onPreviewMessage = (message) => {
        showModal(ViewSentMessage, {message})
    }
</script>

<div class="flex flex-col items-start self-stretch flex-1 gap-8 px-6">
    <div class="flex flex-col items-start self-stretch gap-6 w-full">

        <div class="flex items-center self-stretch gap-4">
            <div class="flex flex-col items-start flex-1 gap-1">
                <span class="self-stretch text-gray-900 text-3xl leading-[38px] font-semibold">Reports</span>
                <span class="self-stretch text-gray-600">Manage and view your sent messages</span>
            </div>
        </div>

        <div bind:this={messageSelector} class="flex items-center self-stretch gap-8 border-b">
            <button id="all" on:click={() => onClickHandler("all")} class="flex justify-center items-center gap-2 p-3 border-b border-b-primary-700 bg-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5.83333 7.08333H10M5.83333 10H12.5M8.06979 15H13.5C14.9001 15 15.6002 15 16.135 14.7275C16.6054 14.4878 16.9878 14.1054 17.2275 13.635C17.5 13.1002 17.5 12.4001 17.5 11V6.5C17.5 5.09987 17.5 4.3998 17.2275 3.86502C16.9878 3.39462 16.6054 3.01217 16.135 2.77248C15.6002 2.5 14.9001 2.5 13.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V16.9463C2.5 17.3903 2.5 17.6123 2.59102 17.7263C2.67019 17.8255 2.79022 17.8832 2.91712 17.8831C3.06302 17.8829 3.23639 17.7442 3.58313 17.4668L5.57101 15.8765C5.9771 15.5517 6.18014 15.3892 6.40624 15.2737C6.60683 15.1712 6.82036 15.0963 7.04101 15.051C7.28972 15 7.54975 15 8.06979 15Z" stroke="#527615" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-primary-700">All</span>
            </button>
            <button id="bulk-messages" on:click={() => onClickHandler("bulk-messages")} class="flex justify-center items-center gap-2 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10.8332 5.83333H4.33317C3.39975 5.83333 2.93304 5.83333 2.57652 6.01499C2.26292 6.17478 2.00795 6.42975 1.84816 6.74335C1.6665 7.09987 1.6665 7.56658 1.6665 8.5V11.5C1.6665 12.4334 1.6665 12.9001 1.84816 13.2567C2.00795 13.5703 2.26292 13.8252 2.57652 13.985C2.93304 14.1667 3.39975 14.1667 4.33317 14.1667H10.8332M14.1665 5.83333H15.6665C16.5999 5.83333 17.0666 5.83333 17.4232 6.01499C17.7368 6.17478 17.9917 6.42975 18.1515 6.74335C18.3332 7.09987 18.3332 7.56658 18.3332 8.5V11.5C18.3332 12.4334 18.3332 12.9001 18.1515 13.2567C17.9917 13.5703 17.7368 13.8252 17.4232 13.985C17.0666 14.1667 16.5999 14.1667 15.6665 14.1667H14.1665M14.1665 17.5L14.1665 2.5M16.2498 2.50001L12.0832 2.5M16.2498 17.5L12.0832 17.5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-500">Bulk Messages</span>
            </button>
            <button id="custom-messages" on:click={() => onClickHandler("custom-messages")} class="flex justify-center items-center gap-2 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10.0002 11.6667V7.08341C10.0002 6.39306 10.5598 5.83341 11.2502 5.83341C11.9405 5.83341 12.5002 6.39306 12.5002 7.08341V11.6667C12.5002 13.0475 11.3809 14.1667 10.0002 14.1667C8.61945 14.1667 7.50016 13.0475 7.50016 11.6667V8.33342M7.3335 18.3334H12.6668C14.067 18.3334 14.767 18.3334 15.3018 18.0609C15.7722 17.8212 16.1547 17.4388 16.3943 16.9684C16.6668 16.4336 16.6668 15.7335 16.6668 14.3334V5.66675C16.6668 4.26662 16.6668 3.56655 16.3943 3.03177C16.1547 2.56137 15.7722 2.17892 15.3018 1.93923C14.767 1.66675 14.067 1.66675 12.6668 1.66675H7.3335C5.93336 1.66675 5.2333 1.66675 4.69852 1.93923C4.22811 2.17892 3.84566 2.56137 3.60598 3.03177C3.3335 3.56655 3.3335 4.26662 3.3335 5.66675V14.3334C3.3335 15.7335 3.3335 16.4336 3.60598 16.9684C3.84566 17.4388 4.22811 17.8212 4.69852 18.0609C5.2333 18.3334 5.93336 18.3334 7.3335 18.3334Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-500">Custom Messages</span>
            </button>
            <button id="custom-with-parameters" on:click={() => onClickHandler("custom-with-parameters")} class="flex justify-center items-center gap-2 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M13.3335 3.33341C14.1085 3.33341 14.496 3.33341 14.8139 3.4186C15.6766 3.64977 16.3505 4.32364 16.5816 5.18637C16.6668 5.50428 16.6668 5.89177 16.6668 6.66675V14.3334C16.6668 15.7335 16.6668 16.4336 16.3943 16.9684C16.1547 17.4388 15.7722 17.8212 15.3018 18.0609C14.767 18.3334 14.067 18.3334 12.6668 18.3334H7.3335C5.93336 18.3334 5.2333 18.3334 4.69852 18.0609C4.22811 17.8212 3.84566 17.4388 3.60598 16.9684C3.3335 16.4336 3.3335 15.7335 3.3335 14.3334V6.66675C3.3335 5.89177 3.3335 5.50428 3.41868 5.18637C3.64985 4.32364 4.32372 3.64977 5.18645 3.4186C5.50436 3.33341 5.89185 3.33341 6.66683 3.33341M10.0002 12.9167V9.16675C10.0002 8.47639 10.5598 7.91675 11.2502 7.91675C11.9405 7.91675 12.5002 8.47639 12.5002 9.16675V12.9167C12.5002 14.2975 11.3809 15.4167 10.0002 15.4167C8.61945 15.4167 7.50016 14.2975 7.50016 12.9167V9.58342M8.00016 5.00008H12.0002C12.4669 5.00008 12.7002 5.00008 12.8785 4.90925C13.0353 4.82936 13.1628 4.70188 13.2427 4.54507C13.3335 4.36681 13.3335 4.13346 13.3335 3.66675V3.00008C13.3335 2.53337 13.3335 2.30002 13.2427 2.12176C13.1628 1.96495 13.0353 1.83747 12.8785 1.75758C12.7002 1.66675 12.4669 1.66675 12.0002 1.66675H8.00016C7.53345 1.66675 7.3001 1.66675 7.12184 1.75758C6.96504 1.83747 6.83755 1.96495 6.75766 2.12176C6.66683 2.30002 6.66683 2.53337 6.66683 3.00008V3.66675C6.66683 4.13346 6.66683 4.36681 6.75766 4.54507C6.83755 4.70188 6.96504 4.82936 7.12184 4.90925C7.3001 5.00008 7.53345 5.00008 8.00016 5.00008Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-500">Custom with Parameters</span>
            </button>
            <button id="group-sms" on:click={() => onClickHandler("group-sms")} class="flex justify-center items-center gap-2 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M18.3332 17.5V15.8333C18.3332 14.2801 17.2709 12.9751 15.8332 12.605M12.9165 2.7423C14.1381 3.23679 14.9998 4.43443 14.9998 5.83333C14.9998 7.23224 14.1381 8.42988 12.9165 8.92437M14.1665 17.5C14.1665 15.9469 14.1665 15.1703 13.9128 14.5577C13.5745 13.741 12.9255 13.092 12.1088 12.7537C11.4962 12.5 10.7196 12.5 9.1665 12.5H6.6665C5.11337 12.5 4.3368 12.5 3.72423 12.7537C2.90747 13.092 2.25855 13.741 1.92024 14.5577C1.6665 15.1703 1.6665 15.9469 1.6665 17.5M11.2498 5.83333C11.2498 7.67428 9.75745 9.16667 7.9165 9.16667C6.07555 9.16667 4.58317 7.67428 4.58317 5.83333C4.58317 3.99238 6.07555 2.5 7.9165 2.5C9.75745 2.5 11.2498 3.99238 11.2498 5.83333Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-500">Group SMS</span>
            </button>
            <button id="drafts" on:click={() => onClickHandler("drafts")} class="flex justify-center items-center gap-2 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5.83333 2.5H12.2288C12.6364 2.5 12.8402 2.5 13.0321 2.54605C13.2021 2.58688 13.3647 2.65422 13.5138 2.7456C13.682 2.84867 13.8261 2.9928 14.1144 3.28105L16.719 5.88562C17.0072 6.17387 17.1513 6.318 17.2544 6.48619C17.3458 6.63531 17.4131 6.79789 17.4539 6.96795C17.5 7.15976 17.5 7.36359 17.5 7.77124V14.1667M10.4167 8.33333H7.16667C6.69996 8.33333 6.4666 8.33333 6.28834 8.24251C6.13154 8.16261 6.00406 8.03513 5.92416 7.87833C5.83333 7.70007 5.83333 7.46671 5.83333 7V5.41667M11.25 17.5V13.8333C11.25 13.3666 11.25 13.1333 11.1592 12.955C11.0793 12.7982 10.9518 12.6707 10.795 12.5908C10.6167 12.5 10.3834 12.5 9.91667 12.5H7.16667C6.69996 12.5 6.4666 12.5 6.28834 12.5908C6.13154 12.6707 6.00406 12.7982 5.92416 12.955C5.83333 13.1333 5.83333 13.3666 5.83333 13.8333V17.5M14.5833 8.46895V14.8333C14.5833 15.7668 14.5833 16.2335 14.4017 16.59C14.2419 16.9036 13.9869 17.1586 13.6733 17.3183C13.3168 17.5 12.8501 17.5 11.9167 17.5H5.16667C4.23325 17.5 3.76654 17.5 3.41002 17.3183C3.09641 17.1586 2.84144 16.9036 2.68166 16.59C2.5 16.2335 2.5 15.7668 2.5 14.8333V8.08333C2.5 7.14991 2.5 6.6832 2.68166 6.32668C2.84144 6.01308 3.09641 5.75811 3.41002 5.59832C3.76654 5.41667 4.23325 5.41667 5.16667 5.41667H11.531C11.7349 5.41667 11.8368 5.41667 11.9327 5.43969C12.0177 5.46011 12.099 5.49378 12.1736 5.53947C12.2577 5.591 12.3297 5.66306 12.4739 5.80719L14.1928 7.52614C14.3369 7.67027 14.409 7.74233 14.4605 7.82643C14.5062 7.90099 14.5399 7.98228 14.5603 8.06731C14.5833 8.16321 14.5833 8.26513 14.5833 8.46895Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-500">Drafts</span>
            </button>
        </div>
    </div>

    {#if shownTable != "drafts"}
    <div class="flex flex-col lg:flex-row items-center self-stretch gap-6">
        <Card title="Total Messages" >
            <div slot="title-icon" class="flex justify-center items-center p-3 w-12 h-12 rounded-[28px] border-8 border-primary-50 bg-primary-100">
                <svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7 8.5H12M7 12H15M9.68375 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V20.3355C3 20.8684 3 21.1348 3.10923 21.2716C3.20422 21.3906 3.34827 21.4599 3.50054 21.4597C3.67563 21.4595 3.88367 21.2931 4.29976 20.9602L6.68521 19.0518C7.17252 18.662 7.41617 18.4671 7.68749 18.3285C7.9282 18.2055 8.18443 18.1156 8.44921 18.0613C8.74767 18 9.0597 18 9.68375 18Z" stroke="#6D9A16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <p slot="content" class="self-stretch text-gray-900 text-2xl font-semibold">{numberOfMessages}</p>
            <div class="flex items-center self-stretch gap-2">
                <div class="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path d="M10.6663 15.8334V4.16675M10.6663 4.16675L4.83301 10.0001M10.6663 4.16675L16.4997 10.0001" stroke="#12B76A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-success-700 text-center text-sm font-medium">100%</span>
                </div>
                <span class="flex-1 text-gray-600 text-sm font-medium">vs last month</span>
            </div>
        </Card>
        <Card title="Total Recipients" >
            <div slot="title-icon" class="flex justify-center items-center p-3 w-12 h-12 rounded-[28px] border-8 border-violet-50 bg-violet-100">
                <svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                    <path d="M22.6665 21V19C22.6665 17.1362 21.3917 15.5701 19.6665 15.126M16.1665 3.29076C17.6324 3.88415 18.6665 5.32131 18.6665 7C18.6665 8.67869 17.6324 10.1159 16.1665 10.7092M17.6665 21C17.6665 19.1362 17.6665 18.2044 17.362 17.4693C16.956 16.4892 16.1774 15.7105 15.1972 15.3045C14.4622 15 13.5303 15 11.6665 15H8.6665C6.80274 15 5.87085 15 5.13577 15.3045C4.15566 15.7105 3.37696 16.4892 2.97099 17.4693C2.6665 18.2044 2.6665 19.1362 2.6665 21M14.1665 7C14.1665 9.20914 12.3756 11 10.1665 11C7.95736 11 6.1665 9.20914 6.1665 7C6.1665 4.79086 7.95736 3 10.1665 3C12.3756 3 14.1665 4.79086 14.1665 7Z" stroke="#7839EE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <p slot="content" class="self-stretch text-gray-900 text-2xl font-semibold">{numberOfRecipients}</p>
            <div class="flex items-center self-stretch gap-2">
                <div class="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path d="M10.6663 15.8334V4.16675M10.6663 4.16675L4.83301 10.0001M10.6663 4.16675L16.4997 10.0001" stroke="#12B76A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-success-700 text-center text-sm font-medium">100%</span>
                </div>
                <span class="flex-1 text-gray-600 text-sm font-medium">vs last month</span>
            </div>
        </Card>
        <Card title="Total Cost" >
            <div slot="title-icon" class="flex justify-center items-center p-3 w-12 h-12 rounded-[28px] border-8 border-blue-50 bg-blue-100">
                <svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                    <path d="M13.3335 5C13.3335 6.10457 10.8711 7 7.8335 7C4.79593 7 2.3335 6.10457 2.3335 5M13.3335 5C13.3335 3.89543 10.8711 3 7.8335 3C4.79593 3 2.3335 3.89543 2.3335 5M13.3335 5V9.45715C12.112 9.82398 11.3335 10.3789 11.3335 11M2.3335 5V17C2.3335 18.1046 4.79593 19 7.8335 19C9.16313 19 10.3826 18.8284 11.3335 18.5429V11M2.3335 9C2.3335 10.1046 4.79593 11 7.8335 11C9.16313 11 10.3826 10.8284 11.3335 10.5429M2.3335 13C2.3335 14.1046 4.79593 15 7.8335 15C9.16313 15 10.3826 14.8284 11.3335 14.5429M22.3335 11C22.3335 12.1046 19.8711 13 16.8335 13C13.7959 13 11.3335 12.1046 11.3335 11M22.3335 11C22.3335 9.89543 19.8711 9 16.8335 9C13.7959 9 11.3335 9.89543 11.3335 11M22.3335 11V19C22.3335 20.1046 19.8711 21 16.8335 21C13.7959 21 11.3335 20.1046 11.3335 19V11M22.3335 15C22.3335 16.1046 19.8711 17 16.8335 17C13.7959 17 11.3335 16.1046 11.3335 15" stroke="#1570EF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <p slot="content" class="self-stretch text-gray-900 text-2xl font-semibold">{totalCost}</p>
            <div class="flex items-center self-stretch gap-2">
                <div class="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path d="M10.6663 15.8334V4.16675M10.6663 4.16675L4.83301 10.0001M10.6663 4.16675L16.4997 10.0001" stroke="#12B76A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-success-700 text-center text-sm font-medium">100%</span>
                </div>
                <span class="flex-1 text-gray-600 text-sm font-medium">vs last month</span>
            </div>
        </Card>
    </div>
    {/if}


    <TableContainer>
    {#if shownTable === "all"}
        <Table {columns} {noDataMessage} {noDataDescription} {columnsFilters} onPreview={onPreviewMessage} tableName="Messages" description="Search and find your messages report." defaultCriteria={"draft = false AND approved = true AND scheduled_at <= '" + getDatetimeString() + "'" } {mapFunction} fetchFunction={getClientMessages} searchColumns={[
            'sender_name',
            'message',
            'sent_date',
            'type_of_send',
            'status',
            'language'
        ]}>
            <div slot="no-data">
                <AddMessageButton key={1} />
            </div>
        </Table>
    {/if}
    {#if shownTable === "bulk-messages"}
        <Table {columns} {noDataMessage} {noDataDescription} {columnsFilters} onPreview={onPreviewMessage} tableName="Messages" description="Search and find your messages report." defaultCriteria={"draft = false AND approved = true AND send_type = 'Bulk Messages' AND scheduled_at <= '" + getDatetimeString() + "'" } {mapFunction} fetchFunction={getBulkMessages} searchColumns={[
            'sender_name',
            'message',
            'sent_date',
            'type_of_send',
            'status',
            'language'
        ]}>
            <div slot="no-data">
                <AddMessageButton key={2} />
            </div>
        </Table>
    {/if}
    {#if shownTable === "custom-messages"}
        <Table {columns} {noDataMessage} {noDataDescription} {columnsFilters} onPreview={onPreviewMessage} tableName="Messages" description="Search and find your messages report." defaultCriteria={"draft = false AND approved = true AND send_type = 'Custom Messages' AND scheduled_at <= '" + getDatetimeString() + "'" } {mapFunction} fetchFunction={getCustomMessages} searchColumns={[
            'sender_name',
            'message',
            'sent_date',
            'type_of_send',
            'status',
            'language'
        ]}>
            <div slot="no-data">
                <AddMessageButton key={3} />
            </div>
        </Table>
    {/if}
    {#if shownTable === "custom-with-parameters"}
        <Table {columns} {noDataMessage} {noDataDescription} {columnsFilters} onPreview={onPreviewMessage} tableName="Messages" description="Search and find your messages report." defaultCriteria={"draft = false AND approved = true AND send_type = 'Custom With Parameters' AND scheduled_at <= '" + getDatetimeString() + "'" } {mapFunction} fetchFunction={getCustomWithParametersMessages} searchColumns={[
            'sender_name',
            'message',
            'sent_date',
            'type_of_send',
            'status',
            'language'
        ]}>
            <div slot="no-data">
                <AddMessageButton key={4} />
            </div>
        </Table>
    {/if}
    {#if shownTable === "group-sms"}
        <Table {columns} {noDataMessage} {noDataDescription} {columnsFilters} onPreview={onPreviewMessage} tableName="Messages" description="Search and find your messages report." defaultCriteria={"draft = false AND approved = true AND send_type = 'Group SMS' AND scheduled_at <= '" + getDatetimeString() + "'" } {mapFunction} fetchFunction={getGroupSMSMessages} searchColumns={[
            'sender_name',
            'message',
            'sent_date',
            'type_of_send',
            'status',
            'language'
        ]}>
            <div slot="no-data">
                <AddMessageButton key={5} />
            </div>
        </Table>
    {/if}
    {#if shownTable === "drafts"}
        <Table {columns} {noDataMessage} {noDataDescription} {columnsFilters} onPreview={onPreviewMessage} tableName="Messages" description="Search and find your messages report." defaultCriteria={"draft = true AND approved = true AND scheduled_at <= '" + getDatetimeString() + "'" } {mapFunction} fetchFunction={getDraftMessages} searchColumns={[
            'sender_name',
            'message',
            'sent_date',
            'type_of_send',
            'status',
            'language'
        ]}>
            <div slot="no-data">
                <AddMessageButton key={6} />
            </div>
        </Table>
    {/if}
    </TableContainer>
</div>