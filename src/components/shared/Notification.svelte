<script>
    let dropDown

    const showDropdown = (e) => {
        let button = e.target.closest('.flex.items-start.gap-2')
        button.classList.toggle('bg-gray-50')
        button.classList.toggle('[box-shadow:0px_0px_0px_4px_#F2F4F7]')
        dropDown.classList.toggle('invisible')
        dropDown.classList.toggle('opacity-100')
        dropDown.classList.toggle('-translate-y-5')
    }

    const hideDropdown = () => {
        dropDown.classList.add('invisible')
        dropDown.classList.remove('opacity-100')
        dropDown.classList.remove('-translate-y-5')
    }

</script>

<div class="relative flex items-start gap-1">
    <button on:click={showDropdown} class="flex items-start gap-2 p-2.5 hover:bg-gray-50 hover:[box-shadow:0px_0px_0px_4px_#F2F4F7] hide-dropdown">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.79496 17.4998C8.38257 18.0185 9.15444 18.3332 9.99981 18.3332C10.8452 18.3332 11.6171 18.0185 12.2047 17.4998M14.9998 6.6665C14.9998 5.34042 14.473 4.06865 13.5353 3.13097C12.5977 2.19329 11.3259 1.6665 9.99981 1.6665C8.67373 1.6665 7.40196 2.19329 6.46428 3.13097C5.5266 4.06865 4.99981 5.34042 4.99981 6.6665C4.99981 9.24166 4.3502 11.0048 3.62453 12.171C3.01242 13.1547 2.70636 13.6466 2.71758 13.7838C2.73001 13.9357 2.7622 13.9937 2.88463 14.0845C2.99519 14.1665 3.49364 14.1665 4.49052 14.1665H15.5091C16.506 14.1665 17.0044 14.1665 17.115 14.0845C17.2374 13.9937 17.2696 13.9357 17.282 13.7838C17.2933 13.6466 16.9872 13.1547 16.3751 12.171C15.6494 11.0048 14.9998 9.24166 14.9998 6.6665Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>

    <div bind:this={dropDown} class="hide-dropdown absolute -left-[150px] md:-left-[454px] -bottom-[128px] flex flex-col items-start gap-4 w-64 md:w-[496px] p-4 md:p-6 rounded-xl border border-gray-200 bg-white [box-shadow:0px_75px_150px_0px_rgba(52,_64,_84,_0.14)] opacity-0 invisible translate-y-0 transition-all duration-500 ease-in-out">
        <div class="flex justify-between items-center self-stretch">
            <div class="flex items-center flex-1 gap-2">
                <span class="text-gray-900 md:text-xl md:font-semibold leading-[30px]">Notifications</span>
                <div class="flex items-center py-0.5 px-2 rounded-2xl bg-gray-100 mix-blend-multiply">
                    <span class="text-gray-700 text-center text-xs font-medium font-[Inter] leading-[18px]">13</span>
                </div>
            </div>
            <button class="flex justify-end items-center flex-1 gap-2">
                <span class="text-gray-600 text-xs md:text-sm md:font-semibold">Mark as read</span>
            </button>
        </div>
        <div class="flex justify-center items-center self-stretch bg-white">
            <div class="flex flex-col items-start flex-1 gap-8">
                <svg class="w-60 md:w-[449px]" xmlns="http://www.w3.org/2000/svg" height="2" viewBox="0 0 449 2" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M448.5 1.5H0.5V0.5H448.5V1.5Z" fill="#EAECF0"/>
                </svg>
            </div>
        </div>
        <div class="flex flex-col items-start flex-1 gap-4 overflow-y-auto">

        </div>
    </div>
</div>

<svelte:window on:click={(e) => {
    if (e.target.closest(".hide-dropdown")) return 
    hideDropdown()
}}/>