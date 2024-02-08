<script>
	import Popup from './Popup.svelte'

    import { onMount } from 'svelte'
    import { hidePopup } from "$lib/helper/popup"

    export let clazz = ""
    export let selectedDate = ""
    export let currentDate = new Date()
    export let defaultDay = currentDate.getDate()
    export let defaultMonth = currentDate.getMonth()
    export let defaultYear = currentDate.getFullYear()
    export let onApplyCalendar = null
    export let onCancelCalendar = null

    let calendar

    let currentDay = currentDate.getDate()
    let currentMonth = currentDate.getMonth()
    let currentYear = currentDate.getFullYear()

    let selectedDay = defaultDay
    let selectedMonth = defaultMonth
    let selectedYear = defaultYear

    let weeks = []

    let weeksNames = ['Mon', 'Tu', 'We', 'Th', 'Fr', 'Sat', 'Su']
    let monthesNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'September', 'October', 'November', 'December']

    const getDaysInMonth = (month, year) => {
      return new Date(year, month + 1, 0).getDate()
    }
  
    const generateCalendar = () => {
        weeks = [];

        const firstDay = new Date(defaultYear, defaultMonth, 1).getDay();
        const daysInMonth = getDaysInMonth(defaultMonth, defaultYear);

        let day = 1;

        for (let i = 0; i < 6; i++) {
            let week = [];

            if (i === 0) {
                const previousMonthDays = getDaysInMonth(defaultMonth - 1, defaultYear);
                const previousMonthEnd = previousMonthDays - firstDay + 1;

                for (let j = 0; j < 7; j++) {
                    if (j >= firstDay) {
                        week.push({
                            day: day++,
                            inWeek: true,
                            currDay: (currentDay == day - 1) && (defaultMonth == currentMonth) && (defaultYear == currentYear)
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
                            currDay: (currentDay == day -1)  && (defaultMonth == currentMonth) && (defaultYear == currentYear)
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

            weeks.push(week);
        }
    }
  
    const selectDate = (day, inWeek) => {
        if (inWeek) {
            selectedDay = day
            selectedMonth = defaultMonth
            selectedYear = defaultYear
        }
    }
  
    const previousMonth = () => {
        if (defaultMonth === 0) {
            defaultMonth = 11
            defaultYear--
        } else {
            defaultMonth--
        }

        if (defaultMonth == currentMonth && defaultYear == currentYear) {
            selectedDay = currentDay
        } else {
            selectedDay = null
        }

        generateCalendar()
    }
  
    const nextMonth = () => {
        if (defaultMonth === 11) {
            defaultMonth = 0
            defaultYear++
        } else {
            defaultMonth++
        }

        if (defaultMonth == currentMonth && defaultYear == currentYear) {
            selectedDay = currentDay
        } else {
            selectedDay = null
        }

        generateCalendar()
    }
  
    onMount(() => {
        generateCalendar()
    })

    const onCancel = () => {
        selectedDate = ""
        selectedDay = null
        currentDate = new Date()
        defaultDay = currentDate.getDate()
        defaultMonth = currentDate.getMonth()
        defaultYear = currentDate.getFullYear()
        onCancelCalendar && onCancelCalendar()
        hidePopup()
    }

    const onApply = () => {
        selectedDate = (new Date(Date.UTC(defaultYear, defaultMonth, selectedDay))).toISOString().substring(0, 10)
        onApplyCalendar && onApplyCalendar()
    }
</script>


<Popup name="schedule-calendar-date">
<div class="flex items-start rounded-lg border border-gray-100 bg-white shadow-xl z-[8000] {clazz}">
    <div class="flex flex-col items-start">
        <div class="flex items-start">

            <div bind:this={calendar} class="flex flex-col items-center w-[328px] border-r border-r-gray-200">
                <div class="flex flex-col items-start self-stretch gap-4 py-5 px-6">
                    <div class="flex justify-between items-center w-[280px]">
                        <button on:click={previousMonth} class="flex justify-center items-center gap-2 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <span class="text-gray-700 text-center font-semibold">{monthesNames[defaultMonth]} {defaultYear}</span>
                        <button on:click={nextMonth} class="flex justify-center items-center gap-2 p-2 rounded-lg">
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

                        {#each weeks as week ,weekIndex}
                            <div class="flex items-start rounded-[20px]" key={weekIndex}>
                            {#each week as {day, inWeek, currDay}}
                                <button id="start-{weekIndex}-{day}" on:click={() => selectDate(day, inWeek)} class="flex flex-col justify-center items-center gap-[1px] w-10 h-10 rounded-[20px] {inWeek ? '' : 'cursor-default'} {inWeek && selectedDay == day ? 'bg-primary-700' : ''} {inWeek && selectedDay != day ? 'hover:bg-gray-100' : ''} {currDay ? ' bg-gray-100': ''}">
                                    <div class="w-6 text-sm {inWeek ? 'text-gray-600' : 'text-gray-300'} {inWeek ? (selectedDay == day ? 'text-white' : 'text-gray-600') : 'text-gray-300'}">{day}</div>
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
            <div class="flex items-start flex-1 gap-3">
                <button on:click={onCancel} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-primary-50">
                    <span class="text-gray-700 text-sm font-semibold">Now</span>
                </button>
                <button on:click={onApply} class="flex justify-center items-center flex-1 gap-2 py-2.5 px-4 rounded-lg border border-primary-600 bg-primary-600 shadow-sm hover:bg-primary-700">
                    <span class="text-white text-sm font-semibold">Next</span>
                </button>
            </div>
        </div>
    </div>
</div>
</Popup>
