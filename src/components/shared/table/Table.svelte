<script>
	import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { search } from "../../../api/searchApi"

	import NoData from "../NoData.svelte"
	import TableHeader from "./TableHeader.svelte"
	import TableColumns from "./TableColumns.svelte"
	import Pagination from "../pagination/Pagination.svelte"
	import TableExportHeader from "./TableExportHeader.svelte";


    export let columns = [] | {}
    export let afterColumns = []
    export let searchColumns = []
    export let searchFunction = search
    export let mapFunction = null
    export let fetchFunction = null
    export let hidePaginator = false
    export let showHeader = true
    export let showFilter = true
    export let showSearch = true
    export let showDateSelector = true
    export let showSearchExport = false
    export let tableTitle = ""
    export let tableName = "Table"
    export let description = "Description"
    export let noDataMessage =  "You don’t have any data for now!"
    export let noDataDescription = "Table data will appear here."
    export let defaultCriteria = ""
    export let searchClass = ""
    export let columnClass = "w-52"
    export let contentClass = "auto"
    export let allowBulkActions = true
    export let columnsFilters = {}
    export let useIndex = true
    export let onEdit = null
    export let onDelete = null
    export let onPreview = null
    export let onDownload = null
    export let onCustomAction = null
    export let customActionText = ""
    export let showEditText = true
    export let showDeleteText = true
    export let showPreviewText = true
    export let showDownloadText = true
    export let onBulkEdit = null
    export let onBulkDelete = null
    export let showBulkDownload = true
    export let columnsRenders = {}
    export let noColumnsTruncate = []

    let rows = []
    let selectedRows = []
    let noData = false
    let useSearch = false
    let useCustomSearch = false
    let paginatedSearchFunction = null
    let columnsMap = columns

    columns = Array.isArray(columns) ? columns :  Object.keys(columns)
    tableTitle = empty(tableTitle) ? tableName : tableTitle

    if(! empty(searchFunction) && searchFunction != search) {
        useCustomSearch = true
    }

    onMount(async () => {
        if (useIndex) {
            columns = columns.includes('#') ? columns : ['#', ...columns]
        }

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
    {#if showHeader}
    <TableHeader {searchColumns} {searchClass} {showFilter} {showSearch} {showSearchExport} {showDateSelector} {columnsFilters} {mapFunction} {defaultCriteria} {tableName} {tableTitle} {description} {columnsMap} {searchFunction} {useCustomSearch} bind:filterdData={rows} bind:useSearch={useSearch} bind:paginatedSearchFunction={paginatedSearchFunction} />
    {/if}
    <NoData message={noDataMessage} description={noDataDescription} clazz="border-none rounded-xl py-[55px]">
        <slot name="no-data" />
    </NoData>
{:else}
    {#if showHeader && empty(selectedRows)}
    <TableHeader {searchColumns} {searchClass} {showFilter} {showSearch} {showSearchExport} {showDateSelector} {columnsFilters} {mapFunction} {defaultCriteria} {tableName} {tableTitle} {description} {columnsMap} {searchFunction} {useCustomSearch} bind:filterdData={rows} bind:useSearch={useSearch} bind:paginatedSearchFunction={paginatedSearchFunction} />
    <slot name="header-extension" />
    {/if}

    {#if ! empty(selectedRows)}
        <TableExportHeader {showBulkDownload} {tableName} rows={selectedRows} {columnsMap} {onBulkEdit} {onBulkDelete} />
    {/if}

    <div class="flex items-start self-stretch bg-white rounded-b-xl overflow-y-hidden overflow-x-auto">
        <TableColumns {contentClass} clazz={columnClass} {columns} {afterColumns} {noColumnsTruncate} {rows} {allowBulkActions} bind:selectedRows={selectedRows} {onPreview} {onEdit} {showPreviewText} {showEditText} {onDelete} {showDeleteText} {onCustomAction} {customActionText} {onDownload} {showDownloadText} {columnsRenders}>
            <div slot="after-column" let:row={row}>
                <slot name="after-column" {row}/>
            </div>
        </TableColumns>
    </div>

    {#if ! hidePaginator && typeof rows == "object" && rows.hasOwnProperty("data")}
    <Pagination bind:data={rows} {useSearch} {mapFunction} onPageClick={fetchFunction} {paginatedSearchFunction}/>
    {/if}
{/if}
