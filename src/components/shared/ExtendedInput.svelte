<script>
	import { onMount } from 'svelte'
    import { empty } from '$lib/helper/utils'
  
    export let inputs = []
    export let values = []
    export let prefixes =[]
    export let inputElements = []

    export let clazz = ""
    export let pattern = ""
    export let type = "text"
    export let validrules = ""
    export let placeholder = ""
    export let defaultValue = ""

    export let maxLength = 10000

    export let accept = false
    export let required = false
    export let onKeyDown = null
    export let validationFunction = null
  

    let toggledIndex
    let showTooltip = true
    let showPrefixes = false

    const toggleTooltip = () => {
        showTooltip = !showTooltip
    }

    const showTooltipHandler = () => {
        showTooltip = true
    }

    const hideTooltipHandler = () => {
        showTooltip = false
    }

    onMount(() => {
        if (empty(values)) {
            inputs = [{ id: 0, value: '', prefix: empty(prefixes) ? '' : prefixes[0] }]
        } else {
            inputs = [...values.map((value, index) => ({ id: index, value, prefix: empty(prefixes) ? '' : prefixes[0] })), { id: values.length, value: '', prefix: empty(prefixes) ? '' : prefixes[0] }]
        }
        inputElements = Array(inputs.length).fill(null)
    })

    const togglePrefixes = (index) => {
        showPrefixes = !showPrefixes
        toggledIndex = index
    }

    const setSelectedPrefix = (id, prefix) => {
        showPrefixes = !showPrefixes
        inputs = inputs.map(input => input.id == id ? {...input, prefix} : input)
    }
  
    const removeInput = (id) => {
        inputs = inputs.filter(input => input.id !== id)
        values = inputs.filter((input) => ! empty(input.value)).map((input) => input.value)
    }
  
    const addInput = () => {
        inputs = [...inputs, { id: inputs.length, value: '', prefix: inputs[inputs.length - 1].prefix }]
        inputElements[inputs.length] = null
    }

    const onKeyDownHandler = (e) => {
        const keyCode = e.keyCode || e.which
        const keyValue = String.fromCharCode(keyCode)
        const isValid = ((/^[0-9\b]+$/.test(keyValue) || (keyCode >= 96 && keyCode <= 105))) || keyCode == 37 || keyCode == 39
        if (!isValid && type === "phone") {
          e.preventDefault()
        }

        if (keyCode == 9) {
            addInput()
        }
    }

    const onKeyUpHandler = (e, id, input) => {
        inputs = inputs.map(input => input.id == id ? {...input, value: e.target.value} : input)
        values = inputs.filter((input) => ! empty(input.value)).map((input) => input.value)
        onKeyDown && onKeyDown(e, input)
    }

    let valFunc = null

    $: {
        valFunc = (input) => {
            let valid = true
            validationFunction && (valid = validationFunction(input))
            return valid
        }
    }
</script>

<div class="flex flex-col items-start flex-1 self-stretch gap-4 overflow-y-auto pe-2 bg-gray-50">
{#each inputs as input, index}
    <div class="flex items-start self-stretch {index == 0 ? (inputs.length == 1 ? "gap-4" : "") : "gap-4"}">
        <div
            class="relative flex items-start self-stretch flex-1 rounded-lg bg-white shadow-sm {clazz}"
        >
            <div class="relative w-14">
                <button on:click={() => togglePrefixes(index)} class="flex flex-col items-center justify-center py-1 px-1.5 border-y border-l border-l-gray-300 border-y-gray-300 rounded-tl-lg rounded-bl-lg w-full">
                    <span class="text-gray-600 text-center">{input.prefix}</span>
                    <svg class=" -my-1.5 stroke-gray-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="absolute top-10 bg-white border border-gray-300 rounded-b-lg rounded-tl-lg w-full max-h-28 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out z-[9999] {showPrefixes && toggledIndex == index ? "visible opacity-100" : "invisible opacity-0"}">
                    {#each prefixes as prefix}
                    <button on:click={() => setSelectedPrefix(input.id, prefix)} class="flex justify-center items-center my-1 mx-0.5 py-1 px-0.5 rounded-lg hover:bg-primary-50 w-full">
                        <span class="text-gray-600">{prefix}</span>
                    </button>
                    {/each}
                </div>
            </div>
            <input
                bind:this={inputElements[index]}
                on:keydown={e => onKeyDownHandler(e, input)}
                on:keyup={e => onKeyUpHandler(e, input.id, input)}
                class="flex items-center self-stretch flex-1 gap-2 py-2 px-3 border {valFunc(inputElements[index]) ? "border-gray-300" : "border-red-300"} rounded-tr-lg rounded-br-lg outline-none"
                type={["password", "phone"].includes(type) ? "text" : type}
                {accept}
                {pattern}
                {required}
                {maxLength}
                {validrules}
                {placeholder}
                {defaultValue}
                id={input.id}
                name={input.value}
                value={input.value}
                autocomplete="off"
            />

            {#if ! valFunc(inputElements[index])}
            <button on:click={toggleTooltip} on:mouseleave={hideTooltipHandler} on:mouseover={showTooltipHandler} on:focus={showTooltipHandler} class="z-[99999]">
                <svg class="absolute top-1/2 -translate-y-1/2 right-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g clip-path="url(#clip0_717_2492)">
                      <path d="M8.00016 5.3335V8.00016M8.00016 10.6668H8.00683M14.6668 8.00016C14.6668 11.6821 11.6821 14.6668 8.00016 14.6668C4.31826 14.6668 1.3335 11.6821 1.3335 8.00016C1.3335 4.31826 4.31826 1.3335 8.00016 1.3335C11.6821 1.3335 14.6668 4.31826 14.6668 8.00016Z" stroke="#F04438" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_717_2492">
                        <rect width="16" height="16" fill="white"/>
                      </clipPath>
                    </defs>
                </svg>
            </button>
            <div class="absolute top-1.5 flex right-2.5 items-center justify-center w-96 transition-all duration-300 ease-in-out {showTooltip ? "visible opacity-100" : "invisible opacity-0"}">
                <div class="flex flex-col items-start self-stretch py-2 px-3 rounded-lg bg-gray-900 shadow-lg">
                  <span class="text-white text-center text-2xs font-medium">Number should be prefixed with valid country code and operator code</span>
                </div>
                <svg class="-rotate-90 -ms-2.5 mt-2.5" xmlns="http://www.w3.org/2000/svg" width="28" height="9" viewBox="0 0 28 9" fill="none">
                  <path d="M26.0711 0.485289C26.962 0.485289 27.4081 1.56243 26.7782 2.1924L20.7071 8.26347C20.3166 8.654 19.6834 8.654 19.2929 8.26347L13.2218 2.1924C12.5919 1.56243 13.038 0.485289 13.9289 0.485289L26.0711 0.485289Z" fill="#101828"/>
                </svg>
            </div>
            {/if}
        </div>

        <div class="flex items-start gap-2">
        {#if index !== 0}
            <button class="flex justify-center items-center gap-2 p-2.5 rounded-lg border border-error-50 bg-error-50" on:click={() => removeInput(input.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.1665 10H15.8332" stroke="#B42318" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        {/if}

        {#if inputs.length > 0 && index == inputs.length - 1}
            <button class="flex justify-center items-center gap-2 p-2.5 rounded-lg border border-primary-50 bg-primary-50" on:click={addInput}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.99984 4.1665V15.8332M4.1665 9.99984H15.8332" stroke="#527615" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        {/if}
        </div>
    </div>
{/each}
</div>