<script>
	import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { search } from "../../../api/searchApi"

	import NoData from "../NoData.svelte"
	import TableHeader from "./TableHeader.svelte"
	import TableColumns from "./TableColumns.svelte"
	import Pagination from "../pagination/Pagination.svelte"
	import TableExportHeader from "./TableExportHeader.svelte";


    export let columns = []
    export let mapFunction = null
    export let fetchFunction = null
    export let hidePaginator = false
    export let hideFilter = false
    export let tableName = "Table"
    export let description = "Description"
    export let noDataMessage =  "You don’t have any data for now!"
    export let noDataDescription = "Table data will appear here."
    export let defaultCriteria = ""
    export let allowBulkActions = true
    export let columnsFilters = {}

    let rows = []
    let columnsMap = {}
    let selectedRows = []
    let noData = false
    let useSearch = false
    let paginatedSearchFunction = null

    onMount(async () => {
        columnsMap = columns
        columns = Array.isArray(columns) ? columns :  Object.keys(columns)
        columns = columns.includes('#') ? columns : ['#', ...columns]
        if (fetchFunction) {
            let data = await fetchFunction(1)

            if (typeof data == "object" && data.hasOwnProperty("data")) {
                ! empty(mapFunction) && (data.data = data?.data.map(mapFunction))
                noData = empty(data.data)
            } else {
                ! empty(mapFunction) && (data = data.map(mapFunction))
                noData = empty(data)
            }
            rows = data
        }
    })

    $: if (empty(columns)) {
        columns = (typeof rows == "object" && rows.hasOwnProperty("data")) ? Object.keys(rows?.data[0]) : Object.keys(rows[0])
    }
</script>

{#if noData}
    <TableHeader {columnsFilters} {mapFunction} {defaultCriteria} {tableName} {description} {columnsMap} searchFunction={search} bind:filterdData={rows} bind:useSearch={useSearch} bind:paginatedSearchFunction={paginatedSearchFunction} />
    <NoData message={noDataMessage} description={noDataDescription}>
        <slot name="no-data" />
    </NoData>
{:else}
    {#if ! hideFilter && empty(selectedRows)}
    <TableHeader {columnsFilters} {mapFunction} {defaultCriteria} {tableName} {description} {columnsMap} searchFunction={search} bind:filterdData={rows} bind:useSearch={useSearch} bind:paginatedSearchFunction={paginatedSearchFunction} />
    {/if}

    {#if ! empty(selectedRows)}
        <TableExportHeader {tableName} rows={selectedRows} {columnsMap} />
    {/if}

    <div class="flex items-start self-stretch bg-white rounded-b-xl overflow-y-hidden overflow-x-auto">
        <TableColumns {columns} {rows} {allowBulkActions} bind:selectedRows={selectedRows} />
    </div>

    {#if ! hidePaginator && typeof rows == "object" && rows.hasOwnProperty("data")}
    <Pagination bind:data={rows} {useSearch} {mapFunction} onPageClick={fetchFunction} {paginatedSearchFunction}/>
    {/if}
{/if}
