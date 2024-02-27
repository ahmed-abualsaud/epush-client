<script>
	import { empty } from "$lib/helper/utils"
    import { validationErrors } from "$lib/helper/error"
    import { ucFirst, randomString } from "$lib/helper/strUtils"


    export let name
    export let type
    export let label = ""
    export let placeholder
    export let validation = ""
    export let nameClass = null
    export let inputClass = null
    export let onEnterHandler = null

    let inputKey = "input-" + randomString()
    let passwordType = "password"
    let isPassword = (type.toLowerCase() === "password")

    const showPassword = () => {
        passwordType = passwordType === "password" ? "text" : "password"
    }

    const onEnter = (e) => {
        const keyCode = e.keyCode || e.which
		if (keyCode === 13) {
			onEnterHandler && onEnterHandler(e)
		}
    }
</script>

<div class="flex flex-col items-start self-stretch gap-1.5">
    <div class="flex flex-col items-start self-stretch gap-1.5">
        <label for={inputKey} class="mb-[6px] text-sm font-medium text-gray-700 {nameClass}">{empty(label) ? ucFirst(name) : ucFirst(label)}</label>
        <div class="flex py-[10px] px-[14px] gap-2 self-stretch rounded-lg border border-gray-300 bg-white input-box-shadow">
            <div class="flex flex-1 items-center gap-2">
                <slot name="icon" />
                <input on:keydown={onEnter} id={inputKey} type={isPassword ? passwordType : type} {name} {placeholder} validation={validation} autocomplete={true} class="flex-1 text-gray-900 text-base font-normal w-full focus:outline-none placeholder:text-gray-500 {inputClass}">
                {#if isPassword}
                    <button on:click|preventDefault={showPassword}>
                        {#if passwordType === "text"}
                            <i class="fa-duotone fa-eye text-gray-400"></i>
                        {/if}
                        {#if passwordType === "password"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421" stroke="#98A2B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {/if}
                    </button>
                {/if}
            </div>
        </div>
    </div>
    {#if ! empty($validationErrors[name])}
        <div class="self-stretch text-error-500">
            {$validationErrors[name][0]}
        </div>
    {/if} 
</div>

<style>
    .input-box-shadow {
        box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    }
</style>