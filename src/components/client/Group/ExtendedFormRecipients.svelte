<script>
	import NoData from "../../shared/NoData.svelte"
	import ExtendedInput from "../../shared/ExtendedInput.svelte"

	import { onMount } from "svelte"
	import { empty } from '$lib/helper/utils'
    import { currentClient } from "$lib/helper/store"

    export let validNumbers = []
	export let invalidNumbers = []
    export let numbersAttributes = []

	let inputs = []
	let countryCodes = []
	let showTooltip = true
	let inputElements = null


	onMount(() => {
		validNumbers = []
		invalidNumbers = []
        numbersAttributes = []
		for (let i = 0; i < $currentClient.connections.length; i++) {
			$currentClient.connections[i].numbers = []
		}
	})

	const toggleTooltip = () => {
		showTooltip = !showTooltip
	}

	const showTooltipHandler = () => {
		showTooltip = true
	}

	const hideTooltipHandler = () => {
		showTooltip = false
	}

  let validationFunction = null

    $: if(empty(countryCodes) && ! empty($currentClient.connections)) {
        countryCodes = [...new Set($currentClient.connections.map(conn => conn.country_code))]
        countryCodes = empty(countryCodes.find(c => c == "20")) ? countryCodes : [countryCodes.find(c => c == "20"), ...countryCodes.filter(c => c != "20")]
    }

	$: if (! empty($currentClient.connections)){
		validNumbers = []
		invalidNumbers = []

		inputs = inputs.map(input => {
			input.validNumber = ""
			return input
		})

		for (let i = 0; i < $currentClient.connections.length; i++) {
            $currentClient.connections[i].numbers = []
        }

		for (let i = 0; i < inputs.length; i++) {
			let num = "" + inputs[i].prefix + inputs[i].value

			for (let j = 0; j < $currentClient.connections.length; j++) {

				if ($currentClient.connections[j].country_code == "20" && num.startsWith("200")) {
					num = num.substring(0, 1) + num.substring(2)
				}

				if (num.startsWith($currentClient.connections[j].country_code + $currentClient.connections[j].operator_code + "")) {
					$currentClient.connections[j].numbers.push(num)
					validNumbers.push(num)
					inputs[i].validNumber = num
				}
			}

			if (empty(inputs[i].validNumber) && ! empty(inputs[i].value)) invalidNumbers.push(num)
		}

    validNumbers = [...new Set(validNumbers)]

    validationFunction = (elm) => {
		let inp = inputs.find(inp => inp.value == elm?.value)
		if (! empty(inp?.value) && empty(inp?.validNumber)) {
			return false
		}
		return true
    }
  }
</script>


<div class="flex justify-between items-center self-stretch">
  <div class="flex flex-col items-start gap-1">
    <div class="relative flex items-center gap-1">
      <span class="text-gray-700 text-sm font-medium">Recipients Numbers</span>
      <button on:click={toggleTooltip} on:mouseleave={hideTooltipHandler} on:mouseover={showTooltipHandler} on:focus={showTooltipHandler}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <g clip-path="url(#clip0_438_20996)">
            <path d="M8.00016 10.6668V8.00016M8.00016 5.3335H8.00683M14.6668 8.00016C14.6668 11.6821 11.6821 14.6668 8.00016 14.6668C4.31826 14.6668 1.3335 11.6821 1.3335 8.00016C1.3335 4.31826 4.31826 1.3335 8.00016 1.3335C11.6821 1.3335 14.6668 4.31826 14.6668 8.00016Z" stroke="#D0D5DD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_438_20996">
              <rect width="16" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </button>
      <div class="absolute left-[130px] -top-14 flex flex-col items-start w-96 transition-all duration-300 ease-in-out {showTooltip ? "visible opacity-100" : "invisible opacity-0"}">
        <div class="flex flex-col items-start self-stretch py-2 px-3 rounded-lg bg-gray-900 shadow-lg">
          <span class="text-white text-center text-xs font-semibold">Accept numbers in format 01xx or 201xx (or prefixed with valid country code and operator code)</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="9" viewBox="0 0 28 9" fill="none">
          <path d="M26.0711 0.485289C26.962 0.485289 27.4081 1.56243 26.7782 2.1924L20.7071 8.26347C20.3166 8.654 19.6834 8.654 19.2929 8.26347L13.2218 2.1924C12.5919 1.56243 13.038 0.485289 13.9289 0.485289L26.0711 0.485289Z" fill="#101828"/>
        </svg>
      </div>
    </div>
    <span class="text-gray-700 text-sm">You can enter new number by pressing TAB button</span>
  </div>
  <span class="text-gray-500 text-sm">Total Numbers: {inputs.length}/10,000</span>
</div>

{#if empty($currentClient.connections)}
	<NoData message="You don’t have any connections for now!" description="Your connections needs to be bound to can create groups" clazz="max-h-[222px]" />
{:else}
	<ExtendedInput bind:inputElements={inputElements} placeholder="01x xxxx xxxx " type="phone" prefixes={countryCodes} bind:inputs={inputs} {validationFunction}/>    
{/if}
