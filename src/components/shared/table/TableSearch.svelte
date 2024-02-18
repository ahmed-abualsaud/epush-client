<script>
    import { warnAlert } from "$lib/helper/alert"
    import { exportExcel } from "../../../api/fileApi"
	import { empty, deepCopy } from "$lib/helper/utils"
    import { snakeToBeautifulCase } from "$lib/helper/strUtils"
    import { isReadabelTimestamp, readableToTimestamp } from "$lib/helper/dateTime"

    export let total = 0
    export let filterdData
    export let columns = []
    export let tableName = "Table"
    export let columnsMap = {no_data: "no_data"}
    export let mapFunction = null
    export let searchFunction = null
    export let paginatedSearchFunction = null
    export let useSearch = false
    export let showFilter = true
    export let toggleFilter = false
    export let showExport = true
    export let defaultCriteria
    export let clazz = "w-[400px]"
    export let useCustomSearch = false

    let columnsList
    let columnValue
    let filterButton
    let selectedColumn

    $: {
        if (empty(columns)) {
            columns = Array.isArray(columnsMap) ? columnsMap : Object.keys(columnsMap)
            columns = columns.filter(column => column != "#")
        }
        total = (typeof filterdData == "object" && filterdData.hasOwnProperty("data")) ? filterdData?.total : filterdData?.length
        !useSearch &&( selectedColumn = columns[0])
    }


    const getActualColumnName = (column) => {
        return Array.isArray(columnsMap) ? columnsMap.find(o => o == column) : columnsMap[column]
    }

    const selectColumn = () => {
        columnsList.classList.toggle("opacity-0")
        columnsList.classList.toggle("invisible")
    }

    const setSelectedColumn = (column) => {
        selectedColumn = column
        hideDropdown()
    }

    const hideDropdown = () => {
        columnsList.classList.add("opacity-0")
        columnsList.classList.add("invisible")
    }

    const castValue = (val) => {
        val = ["yes", "true"].includes(val) ? 1 : val
        val = ["no", "false"].includes(val) ? 0 : val
        val = isReadabelTimestamp(val) ? readableToTimestamp(val) : val
        return val
    }

    const searchTable = async () => {
        if (useCustomSearch) {
            filterdData = searchFunction(selectedColumn, castValue(columnValue), filterdData)
            total = filterdData?.length
        } else {
            useSearch = true
            if (searchFunction) {
                paginatedSearchFunction = async (page, take) => await searchFunction(tableName, (empty(defaultCriteria) ? "" : defaultCriteria + " AND ") + getActualColumnName(selectedColumn) + " LIKE '%" + castValue(columnValue) + "%'", true, page, take)
                let data = await paginatedSearchFunction(1, 10)
                if (typeof data == "object" && data.hasOwnProperty("data")) {
                    ! empty(mapFunction) && (data.data = data?.data.map(mapFunction))
                } else {
                    ! empty(mapFunction) && (data = data.map(mapFunction))
                }
                filterdData = data
                total = (typeof filterdData == "object" && filterdData.hasOwnProperty("data")) ?  filterdData?.total : filterdData?.length
            }
        }
    }

    const prepareRowsAndColumns = () => {
        columns = Object.values(columnsMap)
        let rowData = deepCopy(filterdData.data)

        return rowData.map(row => {
            let rowColumns = Object.keys(row)
            rowColumns.forEach(col => {
                row[col] = typeof row[col] == "function" ? row[col]()?.props?.text : row[col]
            })
            return row
        }).map(obj => columns.map(key => obj[key]))
    }

    const exportData = async () => {
        if(! empty(filterdData)) {
            let data = prepareRowsAndColumns()
            exportExcel(columns, data)
        } else {
            warnAlert("Please apply a valid date range", 5)
        }
    }
</script>

<div class="flex items-center gap-3">
    <div class="flex items-center self-stretch gap-2 rounded-lg border border-gray-300 bg-white shadow-sm {clazz}">
        <div class="relative w-2/5 h-full">
            <button on:click={selectColumn} class="hide-dropdown flex justify-between items-center self-stretch gap-2 py-2.5 px-4 border-r border-r-gray-300 shadow-sm w-full truncate h-full">
                <span class="text-gray-900 text-sm truncate">{snakeToBeautifulCase(selectedColumn)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div bind:this={columnsList} class="hide-dropdown absolute top-11 border w-full bg-white opacity-0 invisible transition-all duration-300 ease-in-out max-h-52 overflow-y-auto scrollbart z-[500] rounded-b-lg">
                {#each columns as column, index}
                    {#if column != "#"}
                    <div class="p-2 {index%2 == 0? "bg-gray-50" : "bg-white"}">
                        <button on:click={() => setSelectedColumn(column)} class="text-gray-900 text-sm py-2 px-3 hover:bg-primary-100 rounded-md w-full">{snakeToBeautifulCase(column)}</button>
                    </div>
                    {/if}
                {/each}
            </div>
        </div>
        <div class="flex justify-between items-center flex-1 p-1">
            <input bind:value={columnValue} class="placeholder:text-gray-500 outline-none w-[90%]" placeholder="Search" />
            <button on:click={searchTable} class="flex justify-center items-center gap-2 p-2 rounded-lg border border-primary-50 bg-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#527615" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    </div>

    {#if showExport}
    <button on:click={exportData} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-gray-700 text-sm font-semibold">Export</span>
    </button>
    {/if}

    {#if showFilter}
    <button bind:this={filterButton} on:click={() => toggleFilter = !toggleFilter}>
        {#if ! toggleFilter}
        <div class="flex justify-center items-center gap-2 py-2.5 px-4 h-11 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.82174 4.72239C2.19146 4.01796 1.87631 3.66574 1.86443 3.3664C1.8541 3.10636 1.96585 2.85643 2.16652 2.69074C2.39753 2.5 2.87015 2.5 3.8154 2.5H16.1845C17.1298 2.5 17.6024 2.5 17.8334 2.69074C18.0341 2.85643 18.1458 3.10636 18.1355 3.3664C18.1236 3.66574 17.8084 4.01796 17.1782 4.72239L12.423 10.037C12.2973 10.1774 12.2345 10.2477 12.1897 10.3276C12.15 10.3984 12.1208 10.4747 12.1032 10.554C12.0833 10.6435 12.0833 10.7377 12.0833 10.9261V15.382C12.0833 15.5449 12.0833 15.6264 12.057 15.6969C12.0338 15.7591 11.996 15.8149 11.9468 15.8596C11.8912 15.9102 11.8155 15.9404 11.6642 16.001L8.83088 17.1343C8.52459 17.2568 8.37145 17.3181 8.24851 17.2925C8.14101 17.2702 8.04666 17.2063 7.98599 17.1148C7.91662 17.0101 7.91662 16.8452 7.91662 16.5153V10.9261C7.91662 10.7377 7.91662 10.6435 7.89672 10.554C7.87907 10.4747 7.84992 10.3984 7.81019 10.3276C7.7654 10.2477 7.70258 10.1774 7.57694 10.037L2.82174 4.72239Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-700 text-sm font-semibold">Filter</span>
        </div>
        {/if}

        {#if toggleFilter}
        <div class="flex justify-center items-center gap-2 py-2.5 px-4 h-11 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14.1663 5.83325L5.83301 14.1666M5.83301 5.83325L14.1663 14.1666" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-700 text-sm font-semibold">Close Filters</span>
        </div>
        {/if}
    </button>
    {/if}
</div>

<svelte:window on:click={(e) => {
    if (e.target.closest(".hide-dropdown")) return 
    hideDropdown()
}}/>