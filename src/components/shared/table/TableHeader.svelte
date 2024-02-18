<script>
	import TableTitle from "./TableTitle.svelte"
	import TableSearch from "./TableSearch.svelte"
	import TableFilter from "./TableFilter.svelte"
	import CalendarRange from "../CalendarRange.svelte"

    import { empty } from "$lib/helper/utils"
	import { exportExcel } from "../../../api/fileApi"
    import { infoAlert, warnAlert } from "$lib/helper/alert"
    import { readableTimestamp2 } from "$lib/helper/dateTime"

    export let total = 0
    export let filterdData
    export let tableTitle = ""
    export let tableName = "Table"
    export let description  = "description"
    export let columnsMap = {no_data: "no_data"}
    export let mapFunction = null
    export let searchFunction = null
    export let paginatedSearchFunction = null
    export let useSearch = false
    export let showFilter = true
    export let showSearch = true
    export let showDateSelector = true
    export let showSearchExport = true
    export let defaultCriteria = ""
    export let searchClass = ""
    export let columnsFilters = []
    export let searchColumns = []
    export let useCustomSearch = false

    let toggleFilter = false
    let showCalendar = false
    let dataToExport = {}

    let startExportDate = ""
    let endExportDate = ""

    let currentDate = new Date()
    let defaultStartDay = 1
    let defaultStartMonth = (currentDate.getMonth() + 11)%12
    let defaultStartYear = defaultStartMonth == 11 ? currentDate.getFullYear() - 1 : currentDate.getFullYear()

    const exportData = async () => {
        if(! empty(dataToExport)) {
            let cols = Object.values(columnsMap)
            exportExcel(cols, dataToExport.map(obj => cols.map(key => key == 'language' ? obj[key].name : obj[key])))
        } else {
            warnAlert("Please apply a valid date range", 5)
        }
    }

    const applyCalendar = async () => {
        useSearch = true
        if (! (empty(startExportDate) || empty(endExportDate) || empty(searchFunction))) {
            paginatedSearchFunction = async (page, take) => await searchFunction(tableName, (empty(defaultCriteria) ? "" : defaultCriteria + " AND ") + "created_at BETWEEN '" + startExportDate + "' AND '" + endExportDate + "'", true, page, take)
            dataToExport = (await paginatedSearchFunction(1, 1000000)).data
            let data = await paginatedSearchFunction(1, 10)
            if (typeof data == "object" && data.hasOwnProperty("data")) {
                ! empty(mapFunction) && (data.data = data?.data.map(mapFunction))
            } else {
                ! empty(mapFunction) && (data = data.map(mapFunction))
            }
            filterdData = data
        } else {
            infoAlert("No messages exists in this date range", 5)
        }
    }
</script>

<div class="flex flex-col items-start self-stretch gap-5 bg-white rounded-t-xl">
    <div class="flex justify-between items-center self-stretch gap-4 pt-5 px-6 border-b pb-5">
        <TableTitle {tableTitle} {description} {total} />

        {#if showSearch}
        <TableSearch columns={searchColumns} clazz={searchClass} showExport={showSearchExport} {tableName} {mapFunction} {searchFunction} {useCustomSearch} {defaultCriteria} {columnsMap} {showFilter} bind:total={total} bind:filterdData={filterdData} bind:toggleFilter={toggleFilter} bind:useSearch={useSearch} bind:paginatedSearchFunction={paginatedSearchFunction} />            
        {/if}
    
        {#if showDateSelector}
        <div class="flex items-center gap-3">
            <div class="relative flex flex-col items-end gap-2">
                <button on:click={() => showCalendar = !showCalendar} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M17.5 8.33342H2.5M13.3333 1.66675V5.00008M6.66667 1.66675V5.00008M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4388 17.2275 16.9684C17.5 16.4336 17.5 15.7335 17.5 14.3334V7.33342C17.5 5.93328 17.5 5.23322 17.2275 4.69844C16.9878 4.22803 16.6054 3.84558 16.135 3.6059C15.6002 3.33341 14.9001 3.33341 13.5 3.33341H6.5C5.09987 3.33341 4.3998 3.33341 3.86502 3.6059C3.39462 3.84558 3.01217 4.22803 2.77248 4.69844C2.5 5.23322 2.5 5.93328 2.5 7.33341V14.3334C2.5 15.7335 2.5 16.4336 2.77248 16.9684C3.01217 17.4388 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-gray-700 text-sm font-semibold">{! (empty(startExportDate) || empty(endExportDate)) ? readableTimestamp2(startExportDate) + " - " + readableTimestamp2(endExportDate) : "Last 30 Days"}</span>
                </button>
               <CalendarRange {defaultStartDay} {defaultStartMonth} {defaultStartYear} clazz="absolute top-11" onApplyCalendar={applyCalendar} bind:showCalendar={showCalendar} bind:startDate={startExportDate} bind:endDate={endExportDate} />
            </div>
            <button on:click={exportData} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-700 text-sm font-semibold">Export</span>
            </button>
        </div>
        {/if}
    </div>

    {#if showFilter && toggleFilter}
    <TableFilter {tableName} {columnsMap} {columnsFilters} {mapFunction} {defaultCriteria} filterFunction={searchFunction} bind:total={total} bind:filterdData={filterdData} bind:useFilter={useSearch} bind:paginatedfilterFunction={paginatedSearchFunction}/>
    {/if}
</div>