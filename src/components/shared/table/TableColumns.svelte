<script>
    import { empty } from "$lib/helper/utils"
    import { snakeToBeautifulCase } from "$lib/helper/strUtils"
    import { successAlert, errorAlert } from "$lib/helper/alert"

    export let rows = []
    export let columns = []
    export let selectedRows = []
    export let allowBulkActions = true

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
</script>

<div class="flex flex-1" bind:this={tableColumn}>
    {#each columns as column}
    <div class="flex flex-col items-start flex-1 text-ellipsis whitespace-nowrap {column == "#" && ! allowBulkActions ? "max-w-20" : "w-52"}">
        <div class="flex items-center self-stretch gap-3 h-11 py-3 px-6 border-b border-b-gray-200 bg-white">
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
            <span class="text-gray-600 text-xs leading-[18px] font-medium">{snakeToBeautifulCase(column)}</span>
        </div>

        {#if typeof rows == "object" && rows.hasOwnProperty("data")}
            {#each rows.data as row, index}
            <div class="flex items-center self-stretch gap-3 h-[72px] py-4 px-6 {index%2 === 0 ? "bg-gray-50" : "bg-white"} {index + 1 === rows.length ? "" : "border-b border-b-gray-200"}">
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
                    <button data-title="click to copy" on:click={copyToClipboard} class="text-gray-900 text-sm font-medium">
                        <div class="truncate max-w-40">{row[column]}</div>
                    </button>
                {/if}
            </div>
            {/each}
        {:else}
            {#each rows as row, index}
            <div class="flex items-center self-stretch gap-3 h-[72px] py-4 px-6 {index%2 === 0 ? "bg-gray-50" : "bg-white"} {index + 1 === rows.length ? "" : "border-b border-b-gray-200"}">
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
                    <button data-title="click to copy" on:click={copyToClipboard} class="text-gray-900 text-sm font-medium">
                        <div class="truncate max-w-40">{row[column]}</div>
                    </button>
                {/if}
            </div>
            {/each}
        {/if}
    </div>
    {/each}

    <div class="flex flex-col items-start flex-1">
        <div class="flex items-center self-stretch gap-3 h-11 py-3 px-6 border-b border-b-gray-200 bg-white"></div>
        {#if typeof rows == "object" && rows.hasOwnProperty("data")}
            {#each rows.data as row, index}
            <div class="flex items-center self-stretch gap-3 h-[72px] py-4 px-6 {index%2 === 0 ? "bg-gray-50" : "bg-white"} {index + 1 === rows.length ? "" : "border-b border-b-gray-200"}">
                <button class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.01677 10.5943C1.90328 10.4146 1.84654 10.3247 1.81477 10.1861C1.79091 10.082 1.79091 9.91788 1.81477 9.81378C1.84654 9.67519 1.90328 9.58534 2.01677 9.40564C2.95461 7.92066 5.74617 4.16663 10.0003 4.16663C14.2545 4.16663 17.0461 7.92066 17.9839 9.40564C18.0974 9.58534 18.1541 9.67519 18.1859 9.81378C18.2098 9.91788 18.2098 10.082 18.1859 10.1861C18.1541 10.3247 18.0974 10.4146 17.9839 10.5943C17.0461 12.0793 14.2545 15.8333 10.0003 15.8333C5.74617 15.8333 2.95461 12.0793 2.01677 10.5943Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.0003 12.5C11.381 12.5 12.5003 11.3807 12.5003 9.99996C12.5003 8.61925 11.381 7.49996 10.0003 7.49996C8.61962 7.49996 7.50034 8.61925 7.50034 9.99996C7.50034 11.3807 8.61962 12.5 10.0003 12.5Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-gray-700 text-sm font-semibold">Preview</span>
                </button>
            </div>
            {/each}
        {:else}
            {#each rows as row, index}
            <div class="flex items-center self-stretch gap-3 h-[72px] py-4 px-6 {index%2 === 0 ? "bg-gray-50" : "bg-white"} {index + 1 === rows.length ? "" : "border-b border-b-gray-200"}">
                <button class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.01677 10.5943C1.90328 10.4146 1.84654 10.3247 1.81477 10.1861C1.79091 10.082 1.79091 9.91788 1.81477 9.81378C1.84654 9.67519 1.90328 9.58534 2.01677 9.40564C2.95461 7.92066 5.74617 4.16663 10.0003 4.16663C14.2545 4.16663 17.0461 7.92066 17.9839 9.40564C18.0974 9.58534 18.1541 9.67519 18.1859 9.81378C18.2098 9.91788 18.2098 10.082 18.1859 10.1861C18.1541 10.3247 18.0974 10.4146 17.9839 10.5943C17.0461 12.0793 14.2545 15.8333 10.0003 15.8333C5.74617 15.8333 2.95461 12.0793 2.01677 10.5943Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.0003 12.5C11.381 12.5 12.5003 11.3807 12.5003 9.99996C12.5003 8.61925 11.381 7.49996 10.0003 7.49996C8.61962 7.49996 7.50034 8.61925 7.50034 9.99996C7.50034 11.3807 8.61962 12.5 10.0003 12.5Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-gray-700 text-sm font-semibold">Preview</span>
                </button>
            </div>
            {/each}
        {/if}
    </div>
</div>