<script>
	import Popup from "./Popup.svelte"

    import { hidePopup } from "$lib/helper/popup"

    export let selectedTime = "00:00:00"
    export let onSelectTime = null

    let pm = false
	let hoursYTranslate = 0
	let minutesYTranslate = 0

    const setSelectedTime = () => {
        let hours = Math.abs(hoursYTranslate / 34)
        let minutes = Math.abs(minutesYTranslate / 34)
        pm && (hours += 12)
        hours === 12 && (hours = 0)
        selectedTime = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":00"
        onSelectTime && onSelectTime(selectedTime)
        hidePopup()
    }
</script>


<Popup name="schedule-calendar-time">
<div class="flex flex-col items-center w-[328px] border bg-white rounded-lg shadow-xl">
    <div class="flex justify-between items-center self-stretch py-4 px-6">
        <div class="flex items-center gap-1">
            <div class="flex flex-col justify-center items-center gap-1">
                <button on:click={() => {hoursYTranslate > -374 && (hoursYTranslate -= 34)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 20 21" fill="none">
                        <path d="M15 13L10 8L5 13" stroke="#D0D5DD" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="h-7 overflow-y-hidden">
                    <div class="flex flex-col gap-0.5 my-0.5 transition-all duration-300 ease-in-out" style="transform: translateY({hoursYTranslate}px);">
                        {#each {length: 12} as _, i}
                        <button class="p-0 m-0">
                            <span class="text-gray-700 text-2xl font-medium p-0 m-0">{(i).toString().padStart(2, '0')}</span>
                        </button>
                    {/each}
                    </div>
                </div>
                <button on:click={() => {hoursYTranslate < 0 && (hoursYTranslate += 34)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 20 21" fill="none">
                        <path d="M5 8L10 13L15 8" stroke="#D0D5DD" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <div class="flex flex-col justify-center items-center gap-2">
                <span class="text-gray-300 text-center text-3xl font-bold">:</span>
            </div>
            <div class="flex flex-col justify-center items-center gap-1">
                <button on:click={() => {minutesYTranslate > -2006 && (minutesYTranslate -= 34)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 20 21" fill="none">
                        <path d="M15 13L10 8L5 13" stroke="#D0D5DD" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="h-7 overflow-y-hidden">
                    <div class="flex flex-col gap-0.5 my-0.5 transition-all duration-300 ease-in-out" style="transform: translateY({minutesYTranslate}px);">
                        {#each {length: 60} as _, i}
                        <button class="p-0 m-0">
                            <span class="text-gray-700 text-2xl font-medium p-0 m-0">{(i).toString().padStart(2, '0')}</span>
                        </button>
                    {/each}
                    </div>
                </div>
                <button on:click={() => {minutesYTranslate < 0 && (minutesYTranslate += 34)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 20 21" fill="none">
                        <path d="M5 8L10 13L15 8" stroke="#D0D5DD" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="relative flex items-center rounded-lg border border-gray-100 bg-gray-50 w-32 h-14">
            <div class="absolute left-1 bg-white border border-gray-100 shadow rounded-lg py-[22px] px-[27px] transition-all duration-300 ease-in-out" style="{pm ? "transform: translateX(calc(100% + 6px))" : "translateX(0)"}"></div>
            <div class="absolute flex items-center gap-2 p-1.5">
                <button on:click={() => pm = false} class="flex justify-center items-center gap-2 py-2.5 px-3.5 rounded">
                    <span class="flex font-semibold {pm ? "text-gray-500" : "text-gray-700"}">AM</span>
                </button>
                <button on:click={() => pm = true} class="flex justify-center items-center gap-2 py-2.5 px-3.5 rounded">
                    <span class="flex font-semibold {pm ? "text-gray-700" : "text-gray-500"}">PM</span>
                </button>
            </div>
        </div>
    </div>
   <div class="flex justify-end items-start self-stretch gap-3 p-4 border-t border-t-gray-200">
        <button on:click={setSelectedTime} class="flex justify-center items-center flex-1 gap-2 py-2.5 px-4 rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
            <span class="text-white text-sm font-semibold">Set Schedule Date</span>
        </button>
   </div>
</div>
</Popup>
