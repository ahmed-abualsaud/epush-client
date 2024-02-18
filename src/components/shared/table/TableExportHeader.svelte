<script>
    import { empty } from "$lib/helper/utils"
    import { deepCopy } from "$lib/helper/utils"
    import { ucFirst } from "$lib/helper/strUtils"
    import { exportPDF, exportExcel } from "../../../api/fileApi"

    export let tableName = "Table"
    export let rows = [] | {}
    export let columnsMap = {}
    export let onBulkEdit = null
    export let onBulkDelete = null
    export let showBulkDownload = true

    let columns = []
    const prepareRowsAndColumns = () => {
        columns = Object.values(columnsMap)
        let rowData = deepCopy(rows)

        return rowData.map(row => {
            let rowColumns = Object.keys(row.row)
            rowColumns.forEach(col => {
                row.row[col] = typeof row.row[col] == "function" ? row.row[col]()?.props?.text : row.row[col]
            })
            return row.row
        }).map(obj => columns.map(key => obj[key]))
    }

    // const exportToPDF = () => {
    //     let data = prepareRowsAndColumns()
    //     exportPDF(columns, data)
    // }

    const exportToExcel = () => {
        let data = prepareRowsAndColumns()
        exportExcel(columns, data)
    }

</script>

<div class="flex flex-col items-start self-stretch gap-6 bg-primary-50 rounded-xl">
    <div class="flex items-start self-stretch gap-4 pt-[26px] px-6">
        <div class="flex flex-col justify-center items-start self-stretch flex-1 gap-1">
            <span class="text-gray-900 text-lg font-semibold">
                {(typeof rows === "object" && rows.hasOwnProperty("data") ? rows.data.length : rows.length) + " " + ucFirst(tableName)} Selected
            </span>
        </div>
        <div class="flex gap-5">
            {#if ! empty(onBulkDelete)}
            <button on:click={() => onBulkDelete && onBulkDelete(rows.map(r => r.row))} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 2.5H12.5M2.5 5H17.5M15.8333 5L15.2489 13.7661C15.1612 15.0813 15.1174 15.7389 14.8333 16.2375C14.5833 16.6765 14.206 17.0294 13.7514 17.2497C13.235 17.5 12.5759 17.5 11.2578 17.5H8.74221C7.42409 17.5 6.76503 17.5 6.24861 17.2497C5.79396 17.0294 5.41674 16.6765 5.16665 16.2375C4.88259 15.7389 4.83875 15.0813 4.75107 13.7661L4.16667 5M8.33333 8.75V12.9167M11.6667 8.75V12.9167" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-700 text-sm font-semibold">Delete</span>
            </button>
            {/if}

            {#if ! empty(onBulkEdit)}
            <button on:click={() => onBulkEdit && onBulkEdit(rows.map(r => r.row))} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.99998 16.6666H17.5M2.5 16.6666H3.89545C4.3031 16.6666 4.50693 16.6666 4.69874 16.6206C4.8688 16.5798 5.03138 16.5124 5.1805 16.421C5.34869 16.318 5.49282 16.1738 5.78107 15.8856L16.25 5.41663C16.9404 4.72628 16.9404 3.60699 16.25 2.91663C15.5597 2.22628 14.4404 2.22628 13.75 2.91663L3.28105 13.3856C2.9928 13.6738 2.84867 13.818 2.7456 13.9862C2.65422 14.1353 2.58688 14.2979 2.54605 14.4679C2.5 14.6597 2.5 14.8636 2.5 15.2712V16.6666Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-700 text-sm font-semibold">Edit Scheduled Date </span>
            </button>
            {/if}

            {#if showBulkDownload}
            <button on:click={exportToExcel} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-primary-600 bg-primary-600 shadow-sm hover:bg-primary-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-white text-sm font-semibold">Download Excel</span>
            </button>
            {/if}

            <!-- <button on:click={exportToPDF} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-primary-600 bg-primary-600 shadow-sm hover:bg-primary-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clip-path="url(#clip0_580_13773)">
                      <path d="M14.9998 5.83341V4.33341C14.9998 3.39999 14.9998 2.93328 14.8182 2.57676C14.6584 2.26316 14.4034 2.00819 14.0898 1.8484C13.7333 1.66675 13.2666 1.66675 12.3332 1.66675H7.6665C6.73308 1.66675 6.26637 1.66675 5.90985 1.8484C5.59625 2.00819 5.34128 2.26316 5.18149 2.57676C4.99984 2.93328 4.99984 3.39999 4.99984 4.33341V5.83341M4.99984 15.0001C4.22486 15.0001 3.83737 15.0001 3.51946 14.9149C2.65673 14.6837 1.98286 14.0099 1.75169 13.1471C1.6665 12.8292 1.6665 12.4417 1.6665 11.6667V9.83342C1.6665 8.43328 1.6665 7.73322 1.93899 7.19844C2.17867 6.72803 2.56112 6.34558 3.03153 6.1059C3.56631 5.83342 4.26637 5.83341 5.6665 5.83341H14.3332C15.7333 5.83341 16.4334 5.83342 16.9681 6.1059C17.4386 6.34558 17.821 6.72803 18.0607 7.19844C18.3332 7.73322 18.3332 8.43328 18.3332 9.83342V11.6667C18.3332 12.4417 18.3332 12.8292 18.248 13.1471C18.0168 14.0099 17.3429 14.6837 16.4802 14.9149C16.1623 15.0001 15.7748 15.0001 14.9998 15.0001M12.4998 8.75008H14.9998M7.6665 18.3334H12.3332C13.2666 18.3334 13.7333 18.3334 14.0898 18.1518C14.4034 17.992 14.6584 17.737 14.8182 17.4234C14.9998 17.0669 14.9998 16.6002 14.9998 15.6667V14.3334C14.9998 13.4 14.9998 12.9333 14.8182 12.5768C14.6584 12.2632 14.4034 12.0082 14.0898 11.8484C13.7333 11.6667 13.2666 11.6667 12.3332 11.6667H7.6665C6.73308 11.6667 6.26637 11.6667 5.90985 11.8484C5.59625 12.0082 5.34128 12.2632 5.18149 12.5768C4.99984 12.9333 4.99984 13.4 4.99984 14.3334V15.6667C4.99984 16.6002 4.99984 17.0669 5.18149 17.4234C5.34128 17.737 5.59625 17.992 5.90985 18.1518C6.26637 18.3334 6.73308 18.3334 7.6665 18.3334Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_580_13773">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                </svg>
                <span class="text-white text-sm font-semibold">Print</span>
            </button> -->
        </div>
    </div>
    <svg class="w-full flex-1" xmlns="http://www.w3.org/2000/svg" height="1" viewBox="0 0 1112 1" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1112 1H0V0H1112V1Z" fill="#EAECF0"/>
    </svg>
</div>