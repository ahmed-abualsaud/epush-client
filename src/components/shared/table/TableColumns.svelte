<script>
    import { empty } from "$lib/helper/utils"
    import { successAlert, errorAlert } from "$lib/helper/alert"
    import { ucFirst, snakeToBeautifulCase } from "$lib/helper/strUtils"

    export let rows = []
    export let columns = []
    export let afterColumns = []
    export let selectedRows = []
    export let noColumnsTruncate = []
    export let columnsRenders = {}
    export let allowBulkActions = true
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
    export let contentClass = ""
    export let clazz = ""

    let tableColumn
    let showBulkActions = false

    const bulkAction = () => {
        showBulkActions = ! showBulkActions
        let paginated = (typeof rows == "object" && rows.hasOwnProperty("data"))
        showBulkActions && (selectedRows = (paginated ? rows.data : rows).map((row, index) => ({index, row})))
        ! showBulkActions && (selectedRows = [])

        if (showBulkActions) {
            showAllCheckboxs()
        } else {
            hideAllCheckboxs()
        }
    }

    const singleAction = (rowIndex) => {
        let paginated = (typeof rows == "object" && rows.hasOwnProperty("data"))
        let notHaveRow = empty(selectedRows.find(row => row.index === rowIndex))
        notHaveRow && (selectedRows = [...selectedRows, paginated? {index: rowIndex, row: rows.data[rowIndex]} : {index: rowIndex, row: rows[rowIndex]}])
        ! notHaveRow && (selectedRows = selectedRows.filter(row => row.index !== rowIndex))
        toggleCheckbox(rowIndex)

        if (selectedRows.length == (paginated ? rows.data.length : rows.length)) {
            showColumnCheckbox()
        } else {
            hideColumnCheckbox()
        }
    }

    const toggleCheckbox = (rowIndex) => {
        tableColumn?.querySelector(".checked-column-" + rowIndex)?.classList.toggle("flex")
        tableColumn?.querySelector(".checked-column-" + rowIndex)?.classList.toggle("hidden")
        tableColumn?.querySelector(".not-checked-column-" + rowIndex)?.classList.toggle("flex")
        tableColumn?.querySelector(".not-checked-column-" + rowIndex)?.classList.toggle("hidden")
    }

    const showColumnCheckbox = () => {
        tableColumn?.querySelector(".checked-column")?.classList.add("flex")
        tableColumn?.querySelector(".checked-column")?.classList.remove("hidden")
        tableColumn?.querySelector(".not-checked-column")?.classList.remove("flex")
        tableColumn?.querySelector(".not-checked-column")?.classList.add("hidden")
    }

    const hideColumnCheckbox = () => {
        tableColumn?.querySelector(".checked-column")?.classList.remove("flex")
        tableColumn?.querySelector(".checked-column")?.classList.add("hidden")
        tableColumn?.querySelector(".not-checked-column")?.classList.add("flex")
        tableColumn?.querySelector(".not-checked-column")?.classList.remove("hidden")
    }

    const showAllCheckboxs = () => {
        tableColumn?.querySelectorAll('.bulk-not-checked').forEach(element => {
            element.classList.remove("flex")
            element.classList.add("hidden")
        })

        tableColumn?.querySelectorAll('.bulk-checked').forEach(element => {
            element.classList.add("flex")
            element.classList.remove("hidden")
        })
    }

    const hideAllCheckboxs = () => {
        tableColumn?.querySelectorAll('.bulk-not-checked').forEach(element => {
            element.classList.add("flex")
            element.classList.remove("hidden")
        })

        tableColumn?.querySelectorAll('.bulk-checked').forEach(element => {
            element.classList.remove("flex")
            element.classList.add("hidden")
        })
    }

    const copyToClipboard = (e) => {
        navigator.clipboard.writeText(e.target.innerText)
        .then(() => {
            successAlert('Copied to clipboard', 2)
        })
        .catch(err => {
            errorAlert('Error copying to clipboard: ' + err.message, 5)
        })
    }

    const onHover = (e) => {
        e.target.closest("button").lastChild.classList.add("flex")
        e.target.closest("button").lastChild.classList.remove("hidden")
    }

    const onLeave = (e) => {
        e.target.closest("button").lastChild.classList.add("hidden")
        e.target.closest("button").lastChild.classList.remove("flex")
    }
</script>

<div class="flex flex-1 {contentClass}" bind:this={tableColumn}>
    {#each columns as column}
    <div class="flex justify-start flex-col items-start flex-1 text-ellipsis whitespace-nowrap {column == "#" && "max-w-24"} {(! empty(afterColumns) || (! empty(noColumnsTruncate) && ! noColumnsTruncate.includes(column))) && column !== "#" && "max-w-48"} {clazz}">
        <div class="flex items-center self-stretch gap-3 h-11 py-3 px-6 border-b border-b-gray-200 ">
            {#if allowBulkActions && column == "#"}
            <button on:click={bulkAction} class="flex justify-center items-center">
                <div class="bulk-checked checked-column hidden justify-center items-center w-5 h-5 p-[3px] border border-primary-600 rounded-md bg-primary-50" type="checkbox">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M11.6663 3.5L5.24967 9.91667L2.33301 7" stroke="#6D9A16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="bulk-not-checked not-checked-column flex w-5 h-5 border border-gray-300 rounded-md bg-white" type="checkbox"></div>
            </button>
            {/if}
            {#if ! empty(columnsRenders) && ! empty(columnsRenders[column])}
                <svelte:component this={columnsRenders[column]().component} {...columnsRenders[column]().props} />
            {:else}
                <span class="text-gray-600 text-xs leading-[18px] font-medium">{snakeToBeautifulCase(column)}</span>
            {/if}
        </div>

        {#if typeof rows == "object" && rows.hasOwnProperty("data")}
            {#each rows.data as row, index}
            <div class="flex justify-start items-center self-stretch gap-3 h-[72px] min-h-[50px] py-4 px-6 {index%2 === 0 ? "bg-gray-50" : "bg-white"} {index + 1 === rows.length ? "" : "border-b border-b-gray-200"}">
                {#if column === "#"}
                    {#if allowBulkActions}
                    <button on:click={() => singleAction(index)} class="flex justify-center items-center">
                        <div class="bulk-checked checked-column-{index} hidden justify-center items-center w-5 h-5 p-[3px] border border-primary-600 rounded-md bg-primary-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M11.6663 3.5L5.24967 9.91667L2.33301 7" stroke="#6D9A16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="bulk-not-checked not-checked-column-{index} flex w-5 h-5 border border-gray-300 rounded-md bg-white"></div>
                    </button>
                    {/if}
                    <span class="text-gray-900 text-sm font-medium">{index + 1}</span>
                {:else if typeof row[column] === "boolean"}
                    {#if row[column]}
                        <i class="fas fa-check"></i>
                    {:else}
                        <i class="fas fa-xmark"></i>
                    {/if}
                {:else if typeof row[column] === "function"}
                    <svelte:component this={row[column]().component} {...row[column]().props} />
                {:else if empty(row[column]) || row[column] === "NULL"}
                    <i class="fas fa-ban"></i>
                {:else}
                <button data-title="click to copy" class="relative text-gray-900 text-sm font-medium" on:click={copyToClipboard} on:mouseover={onHover} on:focus={onHover} on:mouseleave={onLeave}>
                    {#if noColumnsTruncate.includes(column)}
                    <div class="truncate max-w-[1000px]">{row[column]}</div>
                    {:else}
                        <div class="truncate max-w-40">{row[column]}</div>                        
                    {/if}
                    <div class="absolute hidden flex-col items-start w-[280px] shadow-lg">
                        <svg class="rotate-180" xmlns="http://www.w3.org/2000/svg" width="28" height="9" viewBox="0 0 28 9" fill="none">
                            <path d="M14.0711 0.485289C14.962 0.485289 15.4081 1.56243 14.7782 2.1924L8.70711 8.26347C8.31658 8.654 7.68342 8.654 7.29289 8.26347L1.22183 2.1924C0.591867 1.56243 1.03803 0.485289 1.92894 0.485289L14.0711 0.485289Z" fill="#101828"/>
                        </svg>
                        <div class="flex flex-col items-start self-stretch gap-1 p-3 rounded-lg bg-gray-900">
                            <span class="self-stretch text-white text-start text-xs font-semibold">{ucFirst(column)}</span>
                            <span class="self-stretch text-white text-start text-wrap text-xs font-medium">{row[column]}</span>
                        </div>
                    </div>
                </button>
                {/if}
            </div>
            {/each}
        {:else}
            {#each rows as row, index}
            <div class="flex justify-start items-center self-stretch gap-3 h-[72px] min-h-[50px] py-4 px-6 {index%2 === 0 ? "bg-gray-50" : "bg-white"} {index + 1 === rows.length ? "" : "border-b border-b-gray-200"}">
                {#if column === "#"}
                    {#if allowBulkActions}
                    <button on:click={() => singleAction(index)} class="flex justify-center items-center">
                        <div class="bulk-checked checked-column-{index} hidden justify-center items-center w-5 h-5 p-[3px] border border-primary-600 rounded-md bg-primary-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M11.6663 3.5L5.24967 9.91667L2.33301 7" stroke="#6D9A16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="bulk-not-checked not-checked-column-{index} flex w-5 h-5 border border-gray-300 rounded-md bg-white"></div>
                    </button>
                    {/if}
                    <span class="text-gray-900 text-sm font-medium">{index + 1}</span>
                {:else if typeof row[column] === "boolean"}
                    {#if row[column]}
                        <i class="fas fa-check"></i>
                    {:else}
                        <i class="fas fa-xmark"></i>
                    {/if}
                {:else if typeof row[column] === "function"}
                    <svelte:component this={row[column]().component} {...row[column]().props} />
                {:else if empty(row[column]) || row[column] === "NULL"}
                    <i class="fas fa-ban"></i>
                {:else}
                <button data-title="click to copy" class="relative text-gray-900 text-sm font-medium" on:click={copyToClipboard} on:mouseover={onHover} on:focus={onHover} on:mouseleave={onLeave}>
                        {#if noColumnsTruncate.includes(column)}
                            <div class="truncate max-w-[1000px]">{row[column]}</div>
                        {:else}
                            <div class="truncate max-w-40">{row[column]}</div>                        
                        {/if}                    <div class="absolute hidden flex-col items-start w-[280px] shadow-lg">
                        <svg class="rotate-180" xmlns="http://www.w3.org/2000/svg" width="28" height="9" viewBox="0 0 28 9" fill="none">
                            <path d="M14.0711 0.485289C14.962 0.485289 15.4081 1.56243 14.7782 2.1924L8.70711 8.26347C8.31658 8.654 7.68342 8.654 7.29289 8.26347L1.22183 2.1924C0.591867 1.56243 1.03803 0.485289 1.92894 0.485289L14.0711 0.485289Z" fill="#101828"/>
                        </svg>
                        <div class="flex flex-col items-start self-stretch gap-1 p-3 rounded-lg bg-gray-900">
                            <span class="self-stretch text-white text-start text-xs font-semibold">{ucFirst(column)}</span>
                            <span class="self-stretch text-white text-start text-wrap text-xs font-medium">{row[column]}</span>
                        </div>
                    </div>
                </button>
                {/if}
            </div>
            {/each}
        {/if}
    </div>
    {#if afterColumns.includes(column)}
    <div class="flex flex-col items-start flex-1 text-ellipsis whitespace-nowrap">
        <div class="flex items-center self-stretch gap-3 h-11 py-3 px-6 border-b border-b-gray-200 bg-white"></div>
        {#if typeof rows == "object" && rows.hasOwnProperty("data")}
            {#each rows.data as row, index}
            <div class="flex items-center self-stretch gap-3 h-[72px] min-h-[50px] py-4 px-6 {index%2 === 0 ? "bg-gray-50" : "bg-white"} {index + 1 === rows.length ? "" : "border-b border-b-gray-200"}">
                <slot name="after-column" {row}/>
            </div>
            {/each}
        {:else}
            {#each rows as row, index}
                <div class="flex items-center self-stretch gap-3 h-[72px] min-h-[50px] py-4 px-6 {index%2 === 0 ? "bg-gray-50" : "bg-white"} {index + 1 === rows.length ? "" : "border-b border-b-gray-200"}">
                    <slot name="after-column" {row}/>
                </div>
            {/each}
        {/if}
    </div>
    {/if}
    {/each}

    {#if ! (empty(onPreview) && empty(onEdit) && empty(onDelete) && empty(onDownload) && empty(onCustomAction))}
    <div class="flex flex-col items-start flex-1 max-w-60">
        <div class="flex items-center self-stretch gap-3 h-11 py-3 px-6 border-b border-b-gray-200 bg-white"></div>
        {#if typeof rows == "object" && rows.hasOwnProperty("data")}
            {#each rows.data as row, index}
            <div class="flex justify-end items-center self-stretch gap-2 h-[72px] min-h-[50px] {showPreviewText || showEditText || showDeleteText? "py-4 px-6" : "p-2.5"} {index%2 === 0 ? "bg-gray-50" : "bg-white"} {index + 1 === rows.length ? "" : "border-b border-b-gray-200"}">
                {#if ! empty(onPreview)}
                <button on:click={() => onPreview && onPreview(row)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.01677 10.5943C1.90328 10.4146 1.84654 10.3247 1.81477 10.1861C1.79091 10.082 1.79091 9.91788 1.81477 9.81378C1.84654 9.67519 1.90328 9.58534 2.01677 9.40564C2.95461 7.92066 5.74617 4.16663 10.0003 4.16663C14.2545 4.16663 17.0461 7.92066 17.9839 9.40564C18.0974 9.58534 18.1541 9.67519 18.1859 9.81378C18.2098 9.91788 18.2098 10.082 18.1859 10.1861C18.1541 10.3247 18.0974 10.4146 17.9839 10.5943C17.0461 12.0793 14.2545 15.8333 10.0003 15.8333C5.74617 15.8333 2.95461 12.0793 2.01677 10.5943Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.0003 12.5C11.381 12.5 12.5003 11.3807 12.5003 9.99996C12.5003 8.61925 11.381 7.49996 10.0003 7.49996C8.61962 7.49996 7.50034 8.61925 7.50034 9.99996C7.50034 11.3807 8.61962 12.5 10.0003 12.5Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {#if showPreviewText}
                    <span class="text-gray-700 text-sm font-semibold">Preview</span>
                    {/if}
                </button>
                {/if}
                {#if ! empty(onEdit)}
                <button on:click={() => onEdit && onEdit(row)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9.99998 16.6666H17.5M2.5 16.6666H3.89545C4.3031 16.6666 4.50693 16.6666 4.69874 16.6206C4.8688 16.5798 5.03138 16.5124 5.1805 16.421C5.34869 16.318 5.49282 16.1738 5.78107 15.8856L16.25 5.41663C16.9404 4.72628 16.9404 3.60699 16.25 2.91663C15.5597 2.22628 14.4404 2.22628 13.75 2.91663L3.28105 13.3856C2.9928 13.6738 2.84867 13.818 2.7456 13.9862C2.65422 14.1353 2.58688 14.2979 2.54605 14.4679C2.5 14.6597 2.5 14.8636 2.5 15.2712V16.6666Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {#if showEditText}
                    <span class="text-gray-700 text-sm font-semibold">Edit</span>
                    {/if}
                </button>
                {/if}
                {#if ! empty(onDelete)}
                <button on:click={() => onDelete && onDelete(row)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 2.5H12.5M2.5 5H17.5M15.8333 5L15.2489 13.7661C15.1612 15.0813 15.1174 15.7389 14.8333 16.2375C14.5833 16.6765 14.206 17.0294 13.7514 17.2497C13.235 17.5 12.5759 17.5 11.2578 17.5H8.74221C7.42409 17.5 6.76503 17.5 6.24861 17.2497C5.79396 17.0294 5.41674 16.6765 5.16665 16.2375C4.88259 15.7389 4.83875 15.0813 4.75107 13.7661L4.16667 5M8.33333 8.75V12.9167M11.6667 8.75V12.9167" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {#if showDeleteText}
                    <span class="text-gray-700 text-sm font-semibold">Delete</span>
                    {/if}
                </button>
                {/if}
                {#if ! empty(onDownload)}
                <button on:click={() => onDownload && onDownload(row)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {#if showDownloadText}
                    <span class="text-gray-700 text-sm font-semibold">Download</span>
                    {/if}
                </button>
                {/if}
                {#if ! empty(onCustomAction)}
                <button on:click={() => onCustomAction && onCustomAction(row)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-primary-600 bg-primary-600 shadow-sm hover:bg-primary-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M8.75036 10H4.16702M4.09648 10.2429L2.15071 16.0552C1.99785 16.5118 1.92142 16.7401 1.97627 16.8807C2.0239 17.0028 2.1262 17.0954 2.25244 17.1306C2.3978 17.1712 2.61736 17.0724 3.05647 16.8748L16.9827 10.608C17.4113 10.4151 17.6256 10.3186 17.6918 10.1847C17.7494 10.0683 17.7494 9.93173 17.6918 9.81534C17.6256 9.68137 17.4113 9.58493 16.9827 9.39206L3.05161 3.12311C2.61383 2.92611 2.39493 2.82761 2.24971 2.86801C2.1236 2.90311 2.0213 2.99543 1.97351 3.1173C1.91847 3.25762 1.99408 3.48544 2.14531 3.94107L4.09702 9.82128C4.12299 9.89954 4.13598 9.93867 4.14111 9.97868C4.14565 10.0142 4.14561 10.0501 4.14097 10.0856C4.13574 10.1256 4.12265 10.1647 4.09648 10.2429Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {#if ! empty(customActionText)}
                    <span class="text-white text-sm font-semibold">{customActionText}</span>
                    {/if}
                </button>
                {/if}
            </div>
            {/each}
        {:else}
            {#each rows as row, index}
            <div class="flex justify-end items-center self-stretch gap-2 h-[72px] min-h-[50px] {showPreviewText || showEditText || showDeleteText? "py-4 px-6" : "p-2.5"} {index%2 === 0 ? "bg-gray-50" : "bg-white"} {index + 1 === rows.length ? "" : "border-b border-b-gray-200"}">
                {#if ! empty(onPreview)}
                <button on:click={() => onPreview && onPreview(row)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.01677 10.5943C1.90328 10.4146 1.84654 10.3247 1.81477 10.1861C1.79091 10.082 1.79091 9.91788 1.81477 9.81378C1.84654 9.67519 1.90328 9.58534 2.01677 9.40564C2.95461 7.92066 5.74617 4.16663 10.0003 4.16663C14.2545 4.16663 17.0461 7.92066 17.9839 9.40564C18.0974 9.58534 18.1541 9.67519 18.1859 9.81378C18.2098 9.91788 18.2098 10.082 18.1859 10.1861C18.1541 10.3247 18.0974 10.4146 17.9839 10.5943C17.0461 12.0793 14.2545 15.8333 10.0003 15.8333C5.74617 15.8333 2.95461 12.0793 2.01677 10.5943Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.0003 12.5C11.381 12.5 12.5003 11.3807 12.5003 9.99996C12.5003 8.61925 11.381 7.49996 10.0003 7.49996C8.61962 7.49996 7.50034 8.61925 7.50034 9.99996C7.50034 11.3807 8.61962 12.5 10.0003 12.5Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {#if showPreviewText}
                    <span class="text-gray-700 text-sm font-semibold">Preview</span>
                    {/if}
                </button>
                {/if}
                {#if ! empty(onEdit)}
                <button on:click={() => onEdit && onEdit(row)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9.99998 16.6666H17.5M2.5 16.6666H3.89545C4.3031 16.6666 4.50693 16.6666 4.69874 16.6206C4.8688 16.5798 5.03138 16.5124 5.1805 16.421C5.34869 16.318 5.49282 16.1738 5.78107 15.8856L16.25 5.41663C16.9404 4.72628 16.9404 3.60699 16.25 2.91663C15.5597 2.22628 14.4404 2.22628 13.75 2.91663L3.28105 13.3856C2.9928 13.6738 2.84867 13.818 2.7456 13.9862C2.65422 14.1353 2.58688 14.2979 2.54605 14.4679C2.5 14.6597 2.5 14.8636 2.5 15.2712V16.6666Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {#if showEditText}
                    <span class="text-gray-700 text-sm font-semibold">Edit</span>
                    {/if}
                </button>
                {/if}
                {#if ! empty(onDelete)}
                <button on:click={() => onDelete && onDelete(row)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 2.5H12.5M2.5 5H17.5M15.8333 5L15.2489 13.7661C15.1612 15.0813 15.1174 15.7389 14.8333 16.2375C14.5833 16.6765 14.206 17.0294 13.7514 17.2497C13.235 17.5 12.5759 17.5 11.2578 17.5H8.74221C7.42409 17.5 6.76503 17.5 6.24861 17.2497C5.79396 17.0294 5.41674 16.6765 5.16665 16.2375C4.88259 15.7389 4.83875 15.0813 4.75107 13.7661L4.16667 5M8.33333 8.75V12.9167M11.6667 8.75V12.9167" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {#if showDeleteText}
                    <span class="text-gray-700 text-sm font-semibold">Delete</span>
                    {/if}
                </button>
                {/if}
                {#if ! empty(onDownload)}
                <button on:click={() => onDownload && onDownload(row)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {#if showDownloadText}
                    <span class="text-gray-700 text-sm font-semibold">Download</span>
                    {/if}
                </button>
                {/if}
                {#if ! empty(onCustomAction)}
                <button on:click={() => onCustomAction && onCustomAction(row)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-primary-600 bg-primary-600 shadow-sm hover:bg-primary-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M8.75036 10H4.16702M4.09648 10.2429L2.15071 16.0552C1.99785 16.5118 1.92142 16.7401 1.97627 16.8807C2.0239 17.0028 2.1262 17.0954 2.25244 17.1306C2.3978 17.1712 2.61736 17.0724 3.05647 16.8748L16.9827 10.608C17.4113 10.4151 17.6256 10.3186 17.6918 10.1847C17.7494 10.0683 17.7494 9.93173 17.6918 9.81534C17.6256 9.68137 17.4113 9.58493 16.9827 9.39206L3.05161 3.12311C2.61383 2.92611 2.39493 2.82761 2.24971 2.86801C2.1236 2.90311 2.0213 2.99543 1.97351 3.1173C1.91847 3.25762 1.99408 3.48544 2.14531 3.94107L4.09702 9.82128C4.12299 9.89954 4.13598 9.93867 4.14111 9.97868C4.14565 10.0142 4.14561 10.0501 4.14097 10.0856C4.13574 10.1256 4.12265 10.1647 4.09648 10.2429Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {#if ! empty(customActionText)}
                    <span class="text-white text-sm font-semibold">{customActionText}</span>
                    {/if}
                </button>
                {/if}
            </div>
            {/each}
        {/if}
        </div>
    {/if}

</div>