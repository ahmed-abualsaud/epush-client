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
    import { getMessageGroup, getMessageRecipients } from "../../../api/messageApi"


    export let message = {}

    let loading = true
    let messageGroup = {}
    let recipientsChunk = []
    let messageRecipients = []
    let uniqueSenderConnections = makeArrayUnique($currentClient.connections, "operator_name")

    let noDataMessage =  "The message has no recipients"
    let noDataDescription = "All recipients of this message will appear here"

    let columns = {
        number: 'number',
        attributes: 'attributes',
        status: 'status',
        save_date: 'created_at'
    }

    onMount(async () => {
        $storage = {}
        $storage.validNumbers = []
        $storage.invalidNumbers = []

        for (let i = 0; i < 10000; i++) {
            recipientsChunk = (await getMessageRecipients(message.id, i + 1, 5000)).data
            if(empty(recipientsChunk)) {
                loading = false
                break
            }
            messageRecipients = [...messageRecipients, ...recipientsChunk]
        }

        if (! empty(messageRecipients)) {
            messageGroup = await getMessageGroup(messageRecipients[0].message_group_id)
        }

        for (let i = 0; i < $currentClient.connections.length; i++) {
            $currentClient.connections[i].numbers = []
        }

        for (let i = 0; i < messageRecipients.length; i++) {
            for (let j = 0; j < $currentClient.connections.length; j++) {
                if (messageRecipients[i].number.startsWith($currentClient.connections[j].country_code + $currentClient.connections[j].operator_code + "")) {
                    $currentClient.connections[j].numbers.push(messageRecipients[i].number)
                    $storage.validNumbers.push(messageRecipients[i].number)
                }
            }
        }

        let validNumbersSet = new Set($storage.validNumbers)
        $storage.validNumbers = [...validNumbersSet]
        $storage.invalidNumbers = $storage.validNumbers.filter(num => ! validNumbersSet.has(num))
    })


    const mapFunction = (recipient) => {
        recipient.save_date = readableTimestamp(message.created_at)
        recipient.status_temp = recipient.status
        recipient.status = () => renderStatus(recipient.status_temp)
        return recipient
    }

    const renderStatus = (status) => {
        return {
            component: Badge,
            props: {
                text: status,
                color: status == "Sent" ? "green" : "orange",
                icon: '<svg style="padding-right: 4px; width: 12px;" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3" fill="' + (status == "Sent" ? '#12B76A' : '#EF6820') + '"/></svg>'
            }
        }
    }

    const exportToExcel = () => {
        let cols = Object.values(columns)
        exportExcel(cols, messageRecipients.map(obj => cols.map(key => obj[key])))
    }

    const exportValidNumbers = () => {
        exportExcel(['number'], messageRecipients.map(obj => [obj.number]))
    }

    const exportInvalidNumbers = () => {
        exportExcel(['number'], messageRecipients.map(obj => [obj.number]))
    }
</script>
<Modal>
<div class="flex items-start rounded-xl bg-white shadow-xl h-screen w-[850px]">
    <div class="flex flex-col items-center flex-shrink-0 bg-white rounded-xl my-5 w-full overflow-y-auto" style="height: calc(100vh - 44px);">
        <div class="flex flex-col items-start self-stretch gap-4 pt-1 pb-5 px-6 bg-white rounded-t-xl border-b">
            <div class="flex flex-col items-start self-stretch gap-1">
                <div class="flex items-center self-stretch gap-3">
                    <span class="text-gray-900 text-lg font-semibold">Message Details</span>
                    {#if ! empty(message?.status)}
                    <svelte:component this={message?.status()?.component} {...message?.status()?.props} />                            
                    {/if}
                </div>
                <div class="flex items-start gap-2">
                    <span class="text-gray-700 text-sm font-medium">Sent at</span>
                    <span class="text-gray-500 text-sm">{message?.sent_date}</span>
                </div>
            </div>
            <div class="flex justify-between items-center self-stretch">
                <div class="flex items-start gap-2">
                    {#if ! empty(message?.type_of_send)}
                    <svelte:component this={message?.type_of_send().component} {...message?.type_of_send().props} />
                    {/if}
                    <div class="flex items-center gap-1 ps-2 pe-2.5 py-0.5 rounded-2xl bg-blue-light-50 mix-blend-multiply">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <g clip-path="url(#clip0_815_15047)">
                              <path d="M1 6H11M1 6C1 8.76142 3.23858 11 6 11M1 6C1 3.23858 3.23858 1 6 1M11 6C11 8.76142 8.76142 11 6 11M11 6C11 3.23858 8.76142 1 6 1M6 1C7.25064 2.36918 7.96138 4.14602 8 6C7.96138 7.85398 7.25064 9.63082 6 11M6 1C4.74936 2.36918 4.03862 4.14602 4 6C4.03862 7.85398 4.74936 9.63082 6 11" stroke="#0BA5EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_815_15047">
                                <rect width="12" height="12" fill="white"/>
                              </clipPath>
                            </defs>
                        </svg>
                        <span class="text-blue-light-700 text-center text-sm font-medium">{message?.language}</span>
                    </div>
                    <div class="flex items-center gap-1 ps-2 pe-2.5 py-0.5 rounded-2xl bg-blue-light-50 mix-blend-multiply">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <g clip-path="url(#clip0_815_4804)">
                              <path d="M6.00023 9.49992V5.99992M6.14598 9.54224L9.63522 10.7103C9.90867 10.8019 10.0454 10.8477 10.1297 10.8148C10.2029 10.7863 10.2585 10.725 10.2797 10.6493C10.3041 10.5622 10.2451 10.4306 10.1272 10.1675L6.38301 1.8111C6.26769 1.55375 6.21004 1.42508 6.12972 1.3852C6.05994 1.35057 5.97801 1.35043 5.90812 1.38485C5.82767 1.42446 5.7696 1.55295 5.65347 1.80993L1.87622 10.168C1.75737 10.4309 1.69795 10.5624 1.72211 10.6496C1.7431 10.7254 1.79848 10.7869 1.87164 10.8156C1.95589 10.8487 2.09283 10.8032 2.36673 10.7123L5.89299 9.54192C5.93994 9.52633 5.96342 9.51854 5.98743 9.51547C6.00874 9.51274 6.03031 9.51276 6.05161 9.51555C6.07561 9.51869 6.09906 9.52654 6.14598 9.54224Z" stroke="#0BA5EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_815_4804">
                                <rect width="12" height="12" fill="white"/>
                              </clipPath>
                            </defs>
                        </svg>
                        <span class="text-blue-light-700 text-center text-sm font-medium">{message?.temp_sender_name ?? message?.sender?.name}</span>
                    </div>
                </div>
                <div class="flex items-start gap-2">
                    <span class="text-gray-700 text-sm font-medium">Created at</span>
                    <span class="text-gray-500 text-sm">{readableTimestamp(message?.created_at)}</span>
                </div>
            </div>
        </div>

        <div class="flex flex-col items-start self-stretch gap-8 pt-4 px-6">
            <div class="flex flex-col items-start gap-3 self-stretch">
                <span class="text-gray-900 text-lg font-semibold">General Information</span>
                <div class="flex flex-col items-start self-stretch gap-6">
                    <div class="flex flex-col items-start self-stretch gap-4 py-5 px-4 rounded-lg bg-gray-50">
                        <div class="flex justify-between items-center self-stretch">
                            <div class="flex items-center gap-4">
                                <div class="flex items-center gap-2 w-[98px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M7.5 10.5H7.51M12 10.5H12.01M16.5 10.5H16.51M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18ZM8 10.5C8 10.7761 7.77614 11 7.5 11C7.22386 11 7 10.7761 7 10.5C7 10.2239 7.22386 10 7.5 10C7.77614 10 8 10.2239 8 10.5ZM12.5 10.5C12.5 10.7761 12.2761 11 12 11C11.7239 11 11.5 10.7761 11.5 10.5C11.5 10.2239 11.7239 10 12 10C12.2761 10 12.5 10.2239 12.5 10.5ZM17 10.5C17 10.7761 16.7761 11 16.5 11C16.2239 11 16 10.7761 16 10.5C16 10.2239 16.2239 10 16.5 10C16.7761 10 17 10.2239 17 10.5Z" stroke="#475467" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span class="text-gray-600 text-sm">Messages {message?.number_of_segments * message?.number_of_recipients}</span>
                                </div>
                                <div class="flex items-center gap-2 w-[125px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M10.101 4C11.3636 2.76281 13.0927 2 15 2C18.866 2 22 5.13401 22 9C22 10.9073 21.2372 12.6365 19.9999 13.899M7.5 13L9 12V17.5M7.5 17.5H10.5M16 15C16 18.866 12.866 22 9 22C5.13401 22 2 18.866 2 15C2 11.134 5.13401 8 9 8C12.866 8 16 11.134 16 15Z" stroke="#475467" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span class="text-gray-600 text-sm">Message Cost {message?.single_message_cost}</span>
                                </div>
                                <div class="flex items-center gap-2 w-[197px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M19 21L16 18M16 18L19 15M16 18H22M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="#475467" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span class="text-gray-600 text-sm">Each Recipient Will Receive {message?.number_of_segments} Message\s</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M13 5C13 6.10457 10.5376 7 7.5 7C4.46243 7 2 6.10457 2 5M13 5C13 3.89543 10.5376 3 7.5 3C4.46243 3 2 3.89543 2 5M13 5V9.45715C11.7785 9.82398 11 10.3789 11 11M2 5V17C2 18.1046 4.46243 19 7.5 19C8.82963 19 10.0491 18.8284 11 18.5429V11M2 9C2 10.1046 4.46243 11 7.5 11C8.82963 11 10.0491 10.8284 11 10.5429M2 13C2 14.1046 4.46243 15 7.5 15C8.82963 15 10.0491 14.8284 11 14.5429M22 11C22 12.1046 19.5376 13 16.5 13C13.4624 13 11 12.1046 11 11M22 11C22 9.89543 19.5376 9 16.5 9C13.4624 9 11 9.89543 11 11M22 11V19C22 20.1046 19.5376 21 16.5 21C13.4624 21 11 20.1046 11 19V11M22 15C22 16.1046 19.5376 17 16.5 17C13.4624 17 11 16.1046 11 15" stroke="#6D9A16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span class="text-primary-600 text-sm font-medium">Total Cost: {message?.total_cost}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col items-start gap-2 h-[120px] w-full">
                        <div class="flex justify-between items-start self-stretch">
                            <span class="text-gray-700 text-sm font-medium">Message Conent</span>
                            <span class="text-gray-500 text-sm">Length {message?.length}</span>
                        </div>
                        <div class="flex items-start flex-1 self-stretch gap-2 py-3 px-3.5 rounded-lg border border-gray-300 bg-gray-50 shadow-sm">
                            <p class="flex-1 self-stretch text-gray-500">{message?.message}</p>
                        </div>
                    </div>
                    <div class="flex items-start content-start self-stretch flex-wrap gap-y-4 gap-x-10">
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-700 text-sm font-medium">Sent</span>
                            <span class="text-gray-500 text-sm">{message?.number_of_recipients}</span>
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-700 text-sm font-medium">API Key</span>
                            {#if empty($currentClient.api_key)}
                            <Badge color="rose" text="You don't have api key" />
                            {:else}
                            <Badge color="purple" text={$currentClient.api_key} />
                            {/if}
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-700 text-sm font-medium">Use API Key</span>
                            {#if $currentClient.use_api_key}
                            <div class="flex justify-center items-center w-8 h-8 p-2 rounded-[28px] border-4 border-success-50 bg-success-100">
                                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#039855" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            {:else}
                            <div class="flex justify-center items-center w-8 h-8 p-2 rounded-[28px] border-4 border-error-50 bg-error-100">
                                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M11.3337 4.6665L4.66699 11.3332M4.66699 4.6665L11.3337 11.3332" stroke="#D92D20" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            {/if}
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-700 text-sm font-medium">IP Address</span>
                            {#if empty(message?.sender_ip)}
                            <Badge color="rose" text="IP restriction not activated" />
                            {:else}
                            <Badge color="indigo" text={message?.sender_ip} />
                            {/if}
                        </div>
                        <div class="flex flex-col items-start gap-1">
                            <span class="text-gray-700 text-sm font-medium">Use IP Address</span>
                            {#if $currentClient.use_ip_address}
                            <div class="flex justify-center items-center w-8 h-8 p-2 rounded-[28px] border-4 border-success-50 bg-success-100">
                                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#039855" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            {:else}
                            <div class="flex justify-center items-center w-8 h-8 p-2 rounded-[28px] border-4 border-error-50 bg-error-100">
                                <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M11.3337 4.6665L4.66699 11.3332M4.66699 4.6665L11.3337 11.3332" stroke="#D92D20" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
            {#if ! empty(message)}
            <TableContainer>
                <Table useIndex={false} showFilter={false} showDateSelector={false} allowBulkActions={false} showSearchExport={true} {columns} {noDataMessage} {noDataDescription} defaultCriteria={"message_id = " + message.id} searchClass="w-[300px]" columnClass="w-auto" contentClass="h-[300px] overflow-y-auto" tableName="Message Recipients" tableTitle="Recipients" description={"Group Name: " + (messageGroup.name ?? "Unknown")} {mapFunction} fetchFunction={(page, take) => getMessageRecipients(message.id, page, take)}>
                    <div slot="header-extension" class="w-full">
                        <div class="flex justify-center items-center flex-wrap gap-2 p-3 border-b w-full">
                            {#if loading}
                                <div class="font-medium text-red-600">Loading . . . </div>
                            {:else}
                                {#each uniqueSenderConnections as conn}
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
            {/if}
        </div>
        {#if ! empty(messageRecipients)}
        <div class="flex justify-end items-center self-stretch flex-1 gap-3 mt-5 pt-5 px-6 bg-white border-t">
            <button on:click={exportToExcel} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-700 text-sm font-semibold">Export Recipients</span>
            </button>
        </div>
        {/if}
    </div>
</div>
</Modal>