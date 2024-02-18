<script>
	import { empty, castVariable } from "$lib/helper/utils"
    import { snakeToBeautifulCase } from "$lib/helper/strUtils"

    export let total = 0
    export let filterdData
    export let tableName = "Table"
    export let columnsFilters = {}
    export let columnsMap = {no_data: "no_data"}
    export let mapFunction = null
    export let filterFunction = null
    export let paginatedfilterFunction = null
    export let useFilter = false
    export let defaultCriteria

    let filtersList
    let columns = Object.keys(columnsFilters)
    let filtersValues = {}

    const setFilterValue = (column, filter, executeFunction = false) => {
        if (empty(filter)) {
            filtersValues[column] = "Null"
        } else if (typeof filter === "function") {
            let filterTemp = executeFunction ? filter() : filter
            filtersValues[column] = (typeof filterTemp === "object" && filterTemp.hasOwnProperty("props")) ? filterTemp.props?.text : filterTemp
        } else {
            filtersValues[column] = filter
        }
    }

    columns.forEach(column => {
        setFilterValue(column, columnsFilters[column][0])
    })

    const selectFilter = (column) => {
        filtersList.querySelector("#" + column + "-filters-list").classList.toggle("opacity-0")
        filtersList.querySelector("#" + column + "-filters-list").classList.toggle("invisible")
    }

    const onSelectFilter = (column, filter) => {
        setFilterValue(column, filter)
        hideDropdown(column)
    }

    const hideDropdown = (column) => {
        filtersList.querySelector("#" + column + "-filters-list").classList.add("opacity-0")
        filtersList.querySelector("#" + column + "-filters-list").classList.add("invisible")
    }

    const getActualColumnName = (column) => {
        return Array.isArray(columnsMap) ? columnsMap.find(o => o == column) : columnsMap[column]
    }

    const applyFilter = async () => {
        let criteria = ""
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];

            if (! filtersValues.hasOwnProperty(column)) continue

            let value = ""
            let operator = "="
            let select = getActualColumnName(column)

            if (filtersValues[column].hasOwnProperty("value")) {
                if (filtersValues[column].value == "{skip}") continue
                value = filtersValues[column].value
            } 
            else if (filtersValues[column].hasOwnProperty("select")) {
                if (typeof filtersValues[column].select === "function") {
                    let result = filtersValues[column].select()
                    value = (typeof result === "object" && result.hasOwnProperty("props")) ? result.props?.text : result
                } else {
                    value = filtersValues[column].select
                }
            } else continue
            
            if (filtersValues[column].hasOwnProperty("operator")) {
                operator = filtersValues[column].operator
            }

            value = filtersValues[column].hasOwnProperty("type") ? castVariable(value, filtersValues[column].type) : "'" + value + "'"

            if (! empty(select) && ! empty(operator) && ! empty(value)) {
                criteria += select + " " + operator + " " + value + " AND "
            }
        }

        criteria = criteria.slice(0, -5)
        criteria = empty(defaultCriteria) ? criteria : (empty(criteria) ? defaultCriteria : defaultCriteria + " AND " + criteria)

        useFilter = true
        if (filterFunction) {
            paginatedfilterFunction = async (page, take) => await filterFunction(tableName, criteria, true, page, take)
            let data = await paginatedfilterFunction(1, 10)
            if (typeof data == "object" && data.hasOwnProperty("data")) {
                ! empty(mapFunction) && (data.data = data?.data.map(mapFunction))
            } else {
                ! empty(mapFunction) && (data = data.map(mapFunction))
            }
            filterdData = data
            total = (typeof filterdData == "object" && filterdData.hasOwnProperty("data")) ?  filterdData?.total : filterdData?.length
        }
    }
</script>

<div class="flex flex-col items-start self-stretch gap-2 pb-4 px-4 border-b">
    <div class="flex flex-col items-start self-stretch gap-4 p-5 rounded x-lg bg-gray-50 pb-10">

        <div class="flex justify-between items-center self-stretch">
            <div class="flex flex-col justify-center items-start flex-1 self-stretch gap-1">
                <span class="text-gray-700 text-lg font-medium">Filters</span>
                <span class="self-stretch text-gray-600 text-xs">Click on filters to show a dropdown list</span>
            </div>
            <div class="flex justify-center items-center">
                <button on:click={applyFilter} class="flex justify-center items-center gap-2 h-11 py-2.5 px-6 rounded-lg border border-primary-600 bg-primary-600 shadow-sm hover:bg-primary-700">
                    <span class="text-white text-sm font-semibold">Apply Filters</span>
                </button>
            </div>
        </div>
        <div bind:this={filtersList} class="flex items-end content-end gap-4 self-stretch flex-wrap">
            {#each columns as column}
                <div class="relative flex flex-col items-start gap-1.5 flex-1 self-stretch">
                    <span class="text-gray-700 text-sm font-medium">{snakeToBeautifulCase(column)}</span>
                    <button on:click={() => selectFilter(column)} class="hide-dropdown flex justify-between px-[14px] py-2.5 items-center gap-2 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
                        {#if empty(filtersValues[column]?.select)}
                        <span class="text-gray-400 text-sm">{"Select " + snakeToBeautifulCase(column)}</span>
                        {:else}       
                        <span class="text-gray-600 font-medium">
                            {#if typeof filtersValues[column]?.select === "function"}
                            <svelte:component this={filtersValues[column]?.select().component} {...filtersValues[column]?.select().props} />
                            {:else}
                            {filtersValues[column]?.select}
                            {/if}
                        </span>
                        {/if}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div id="{column}-filters-list" class="hide-dropdown absolute top-[71px] w-full py-1 flex flex-col bg-white border border-gray-300 rounded-b-xl invisible opacity-0 transition-all duration-300 ease-in-out max-h-52 overflow-auto scrollbart z-50">
                        {#each columnsFilters[column] as filter}
                        <button on:click={() => onSelectFilter(column, filter)} class="my-1 mx-1.5 py-2 px-3 flex items-start rounded-lg hover:bg-primary-50">
                            <span class=" text-gray-900 text-sm">
                                {#if typeof filter.select === "function"}
                                <svelte:component this={filter.select().component} {...filter.select().props} />
                                {:else}
                                {filter.select}
                                {/if}
                            </span>
                        </button>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<svelte:window on:click={(e) => {
    if (e.target.closest(".hide-dropdown")) return
    Object.keys(columnsFilters).forEach(column => {
        hideDropdown(column)
    })
}}/>