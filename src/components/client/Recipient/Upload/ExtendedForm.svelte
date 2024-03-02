<script>
	import ExtendedInput from "../../../shared/ExtendedInput.svelte"

	import { onMount } from "svelte"
	import { empty } from '$lib/helper/utils'
	import { message } from "$lib/helper/store"

	let countryCodes = [...new Set($message.connections.map(conn => conn.country_code))]
	countryCodes = empty(countryCodes.find(c => c == "20")) ? countryCodes : [countryCodes.find(c => c == "20"), ...countryCodes.filter(c => c != "20")]

	let inputs = []
	let showTooltip = false
	let inputElements = null

	onMount(() => {
		$message.validNumbers = []
		$message.invalidNumbers = []
		$message.numbersAttributes = []
		$message.sendType = "Extended Form"
		for (let i = 0; i < $message.connections.length; i++) {
			$message.connections[i].numbers = []
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

	$: {
		$message.validNumbers = []
		$message.invalidNumbers = []

		inputs = inputs.map(input => {
			input.validNumber = ""
			return input
		})

		for (let i = 0; i < $message.connections.length; i++) {
            $message.connections[i].numbers = []
        }

		for (let i = 0; i < inputs.length; i++) {
			let num = "" + inputs[i].prefix + inputs[i].value

			for (let j = 0; j < $message.connections.length; j++) {

				if ($message.connections[j].country_code == "20" && num.startsWith("200")) {
					num = num.substring(0, 1) + num.substring(2)
				}

				if (num.startsWith($message.connections[j].country_code + $message.connections[j].operator_code + "")) {
					$message.connections[j].numbers.push(num)
					$message.validNumbers.push(num)
					inputs[i].validNumber = num
				}
			}

			if (empty(inputs[i].validNumber) && ! empty(inputs[i].value)) $message.invalidNumbers.push(num)
		}

    $message.validNumbers = [...new Set($message.validNumbers)]

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

<ExtendedInput bind:inputElements={inputElements} placeholder="01x xxxx xxxx " type="phone" prefixes={countryCodes} bind:inputs={inputs} {validationFunction}/>
