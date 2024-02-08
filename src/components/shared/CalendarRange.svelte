<script>
    import { onMount } from 'svelte'
  
    export let clazz = ""
    export let endDate = ""
    export let startDate = ""
    export let showCalendar = false
    export let currentDate = new Date()
    export let defaultStartDay = currentDate.getDate()
    export let defaultEndDay = currentDate.getDate()
    export let defaultStartMonth = currentDate.getMonth()
    export let defaultEndMonth = currentDate.getMonth()
    export let defaultStartYear = currentDate.getFullYear()
    export let defaultEndYear = currentDate.getFullYear()
    export let onApplyCalendar = null

    let startCalendar
    let endCalendar

    let currentDay = currentDate.getDate()
    let currentMonth = currentDate.getMonth()
    let currentYear = currentDate.getFullYear()

    let selectedStartDay = defaultStartDay
    let selectedEndDay = defaultEndDay
    let selectedStartMonth = defaultStartMonth
    let selectedEndMonth = defaultEndMonth
    let selectedStartYear = defaultStartYear
    let selectedEndYear = defaultEndYear

    let startWeeks = []
    let endWeeks = []


    let weeksNames = ['Mon', 'Tu', 'We', 'Th', 'Fr', 'Sat', 'Su']
    let monthesAbbrivs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let monthesNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'September', 'October', 'November', 'December']

    const getDaysInMonth = (month, year) => {
      return new Date(year, month + 1, 0).getDate()
    }
  
    const generateStartCalendar = () => {
        startWeeks = [];

        const firstDay = new Date(defaultStartYear, defaultStartMonth, 1).getDay();
        const daysInMonth = getDaysInMonth(defaultStartMonth, defaultStartYear);

        let day = 1;

        for (let i = 0; i < 6; i++) {
            let week = [];

            if (i === 0) {
                const previousMonthDays = getDaysInMonth(defaultStartMonth - 1, defaultStartYear);
                const previousMonthEnd = previousMonthDays - firstDay + 1;

                for (let j = 0; j < 7; j++) {
                    if (j >= firstDay) {
                        week.push({
                            day: day++,
                            inWeek: true,
                            currDay: (currentDay == day - 1) && (defaultStartMonth == currentMonth) && (defaultStartYear == currentYear)
                        });
                    } else {
                        week.push({
                            day: previousMonthEnd + j,
                            inWeek: false,
                            currDay: false
                        });
                    }
                }
            } else {
                for (let j = 0; j < 7; j++) {
                    if (day <= daysInMonth) {
                        week.push({
                            day: day++,
                            inWeek: true,
                            currDay: (currentDay == day -1)  && (defaultStartMonth == currentMonth) && (defaultStartYear == currentYear)
                        });
                    } else {
                        week.push({
                            day: day - daysInMonth,
                            inWeek: false,
                            currDay: false
                        });
                        day++;
                    }
                }
            }

            startWeeks.push(week);
        }
    }

    const generateEndCalendar = () => {
        endWeeks = [];

        const firstDay = new Date(defaultEndYear, defaultEndMonth, 1).getDay();
        const daysInMonth = getDaysInMonth(defaultEndMonth, defaultEndYear);

        let day = 1;

        for (let i = 0; i < 6; i++) {
            let week = [];

            if (i === 0) {
                const previousMonthDays = getDaysInMonth(defaultEndMonth - 1, defaultEndYear);
                const previousMonthend = previousMonthDays - firstDay + 1;

                for (let j = 0; j < 7; j++) {
                    if (j >= firstDay) {
                        week.push({
                            day: day++,
                            inWeek: true,
                            currDay: (currentDay == day - 1) && (defaultEndMonth == currentMonth) && (defaultEndYear == currentYear)
                        });
                    } else {
                        week.push({
                            day: previousMonthend + j,
                            inWeek: false,
                            currDay: false
                        });
                    }
                }
            } else {
                for (let j = 0; j < 7; j++) {
                    if (day <= daysInMonth) {
                        week.push({
                            day: day++,
                            inWeek: true,
                            currDay: (currentDay == day - 1) && (defaultEndMonth == currentMonth) && (defaultEndYear == currentYear)
                        });
                    } else {
                        week.push({
                            day: day - daysInMonth,
                            inWeek: false,
                            currDay: false
                        });
                        day++;
                    }
                }
            }

            endWeeks.push(week);
        }
    }
  
    const selectStartDate = (day, inWeek) => {
        if (inWeek) {
            selectedStartDay = day
            selectedStartMonth = defaultStartMonth
            selectedStartYear = defaultStartYear
        }
    }

    const selectEndDate = (day, inWeek) => {
        if (inWeek) {
            selectedEndDay = day
            selectedEndMonth = defaultEndMonth
            selectedEndYear = defaultEndYear
        }
    }
  
    const startPreviousMonth = () => {
        if (defaultStartMonth === 0) {
            defaultStartMonth = 11
            defaultStartYear--
        } else {
            defaultStartMonth--
        }

        if (defaultStartMonth == currentMonth && defaultStartYear == currentYear) {
            selectedStartDay = currentDay
        } else {
            selectedStartDay = null
        }

        generateStartCalendar()
    }

    const endPreviousMonth = () => {
        if (defaultEndMonth === 0) {
            defaultEndMonth = 11
            defaultEndYear--
        } else {
            defaultEndMonth--
        }

        if (defaultEndMonth == currentMonth && defaultEndYear == currentYear) {
            selectedEndDay = currentDay
        } else {
            selectedEndDay = null
        }

        generateEndCalendar()
    }
  
    const startNextMonth = () => {
        if (defaultStartMonth === 11) {
            defaultStartMonth = 0
            defaultStartYear++
        } else {
            defaultStartMonth++
        }

        if (defaultStartMonth == currentMonth && defaultStartYear == currentYear) {
            selectedStartDay = currentDay
        } else {
            selectedStartDay = null
        }

        generateStartCalendar()
    }

    const endNextMonth = () => {
        if (defaultEndMonth === 11) {
            defaultEndMonth = 0
            defaultEndYear++
        } else {
            defaultEndMonth++
        }

        if (defaultEndMonth == currentMonth && defaultEndYear == currentYear) {
            selectedEndDay = currentDay
        } else {
            selectedEndDay = null
        }
        generateEndCalendar()
    }
  
    onMount(() => {
        generateStartCalendar()
        generateEndCalendar()
    })

    const onCancel = () => {
        showCalendar = ! showCalendar
        startDate = ""
        endDate = ""
        selectedEndDay = null
        selectedStartDay = null
        currentDate = new Date()
        defaultStartDay = currentDate.getDate()
        defaultEndDay = currentDate.getDate()
        defaultStartMonth = currentDate.getMonth()
        defaultEndMonth = currentDate.getMonth()
        defaultStartYear = currentDate.getFullYear()
        defaultEndYear = currentDate.getFullYear()
    }

    const onApply = () => {
        showCalendar = ! showCalendar
        startDate = (new Date(Date.UTC(defaultStartYear, defaultStartMonth, selectedStartDay))).toISOString()
        endDate = (new Date(Date.UTC(defaultEndYear, defaultEndMonth, selectedEndDay))).toISOString()
        onApplyCalendar && onApplyCalendar()
    }
</script>


{#if showCalendar}
<div class="flex items-start rounded-lg border border-gray-100 bg-white shadow-xl z-[8000] {clazz}">
    <div class="flex flex-col items-start">
        <div class="flex items-start">

            <div bind:this={startCalendar} class="flex flex-col items-center w-[328px] border-r border-r-gray-200">
                <div class="flex flex-col items-start self-stretch gap-4 py-5 px-6">
                    <div class="flex justify-between items-center w-[280px]">
                        <button on:click={startPreviousMonth} class="flex justify-center items-center gap-2 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <span class="text-gray-700 text-center font-semibold">{monthesNames[defaultStartMonth]} {defaultStartYear}</span>
                        <button on:click={startNextMonth} class="flex justify-center items-center gap-2 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                
                    <div class="flex flex-col">
                        <div class="flex items-start w-[280px]">
                            {#each weeksNames as weekName}
                            <div class="flex justify-center items-center flex-shrink-0 h-10 w-10 py-2.5 px-2 rounded-[20px]">
                                <span class="w-6 flex-shrink-0 text-gray-700 text-sm font-medium">{weekName}</span>
                            </div>
                            {/each}
                        </div>

                        {#each startWeeks as week ,weekIndex}
                            <div class="flex items-start rounded-[20px]" key={weekIndex}>
                            {#each week as {day, inWeek, currDay}}
                                <button id="start-{weekIndex}-{day}" on:click={() => selectStartDate(day, inWeek)} class="flex flex-col justify-center items-center gap-[1px] w-10 h-10 rounded-[20px] {inWeek ? '' : 'cursor-default'} {inWeek && selectedStartDay == day ? 'bg-primary-700' : ''} {inWeek && selectedStartDay != day ? 'hover:bg-gray-100' : ''} {currDay ? ' bg-gray-100': ''}">
                                    <div class="w-6 text-sm {inWeek ? 'text-gray-600' : 'text-gray-300'} {inWeek ? (selectedStartDay == day ? 'text-white' : 'text-gray-600') : 'text-gray-300'}">{day}</div>
                                    {#if currDay}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="5" viewBox="0 0 6 5" fill="none">
                                        <circle cx="3" cy="2.5" r="2.5" fill="#6D9A16"/>
                                    </svg>
                                    {/if}
                                </button>
                            {/each}
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <div bind:this={endCalendar} class="flex flex-col items-center w-[328px]">
                <div class="flex flex-col items-start self-stretch gap-4 py-5 px-6">
                    <div class="flex justify-between items-center w-[280px]">
                        <button on:click={endPreviousMonth} class="flex justify-center items-center gap-2 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <span class="text-gray-700 text-center font-semibold">{monthesNames[defaultEndMonth]} {defaultEndYear}</span>
                        <button on:click={endNextMonth} class="flex justify-center items-center gap-2 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                
                    <div class="flex flex-col">
                        <div class="flex items-start w-[280px]">
                            {#each weeksNames as weekName}
                            <div class="flex justify-center items-center flex-shrink-0 h-10 w-10 py-2.5 px-2 rounded-[20px]">
                                <span class="w-6 flex-shrink-0 text-gray-700 text-sm font-medium">{weekName}</span>
                            </div>
                            {/each}
                        </div>

                        {#each endWeeks as week ,weekIndex}
                            <div class="flex items-start rounded-[20px]" key={weekIndex}>
                            {#each week as {day, inWeek, currDay}}
                                <button id="end-{weekIndex}-{day}" on:click={() => selectEndDate(day, inWeek)} class="flex flex-col justify-center items-center gap-[1px] w-10 h-10 rounded-[20px] {inWeek ? '' : 'cursor-default'} {inWeek && selectedEndDay == day ? 'bg-primary-700' : ''} {inWeek && selectedEndDay != day ? 'hover:bg-gray-100' : ''} {currDay ? ' bg-gray-100': ''}">
                                    <div class="w-6 text-sm {inWeek ? 'text-gray-600' : 'text-gray-300'} {inWeek ? (selectedEndDay == day ? 'text-white' : 'text-gray-600') : 'text-gray-300'}">{day}</div>
                                    {#if currDay}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="5" viewBox="0 0 6 5" fill="none">
                                        <circle cx="3" cy="2.5" r="2.5" fill="#6D9A16"/>
                                    </svg>
                                    {/if}
                                </button>
                            {/each}
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-between items-start self-stretch p-4 border-t border-t-gray-200">
            <div class="flex items-center gap-3">
                <div class="flex flex-col items-start gap-1.5 w-[136px]">
                    <div class="flex items-center self-stretch gap-2 py-2.5 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm">
                        <span class="text-gray-900">{monthesAbbrivs[defaultStartMonth]} {selectedStartDay ?? defaultStartDay}, {defaultStartYear}</span>
                    </div>
                </div>
                <span class="text-gray-500"> – </span>
                <div class="flex flex-col items-start gap-1.5 w-[136px]">
                    <div class="flex items-center self-stretch gap-2 py-2.5 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm">
                        <span class="text-gray-900">{monthesAbbrivs[defaultEndMonth]} {selectedEndDay ?? defaultEndDay}, {defaultEndYear}</span>
                    </div>
                </div>
            </div>
            <div class="flex items-start gap-3">
                <button on:click={onCancel} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <span class="text-gray-700 text-sm font-semibold">Cancel</span>
                </button>
                <button on:click={onApply} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-primary-600 bg-primary-600 shadow-sm hover:bg-primary-700">
                    <span class="text-white text-sm font-semibold">Apply</span>
                </button>
            </div>
        </div>
    </div>
</div>
{/if}
