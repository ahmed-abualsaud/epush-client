<script>
	import { onMount } from "svelte"
	import { message } from "$lib/helper/store"

	let inputs = []
	let showTooltip = true

	onMount(() => {
		$message.validNumbers = []
		$message.invalidNumbers = []
		$message.numbersAttributes = []
		$message.sendType = "Bulk Messages"
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

	$: {
		$message.validNumbers = []
		$message.invalidNumbers = []

		for (let i = 0; i < $message.connections.length; i++) {
            $message.connections[i].numbers = []
        }

		for (let i = 0; i < inputs.length; i++) {
			let num = "" + inputs[i]
			let isValid = false

			for (let j = 0; j < $message.connections.length; j++) {

				if ($message.connections[j].country_code == "20" && num.startsWith("0")) {
					num = "2" + num
				}

				if ($message.connections[j].country_code == "20" && ! num.startsWith("20") && ! num.startsWith("0")) {
					num = "20" + num
				}

				if (num.startsWith($message.connections[j].country_code + $message.connections[j].operator_code + "")) {
					$message.connections[j].numbers.push(num)
					$message.validNumbers.push(num)
					isValid = true
				}
			}

			if (! isValid) $message.invalidNumbers.push(num)
		}

		$message.validNumbers = [...new Set($message.validNumbers)]
	}

	const filterNumbers = (e) => {
		const keyCode = e.keyCode || e.which
		const isValid =
			keyCode === 8 || // Backspace key
			keyCode === 13 || // Enter key
			keyCode === 16 || // Shift key
			keyCode === 17 || // Control key
			keyCode === 18 || // Alt key
			keyCode === 20 || // Caps Lock key
			keyCode === 37 || // Arrow Left key
			keyCode === 38 || // Arrow Up key
			keyCode === 39 || // Arrow Right key
			keyCode === 40 || // Arrow Down key
			(keyCode >= 48 && keyCode <= 57) || // Numbers 0-9
			(e.ctrlKey && (keyCode === 97 || keyCode === 65)) || // Ctrl+A (97 for regular A, 65 for numpad A)
			(e.ctrlKey && (keyCode === 118 || keyCode === 86)) || // Ctrl+V (118 for regular V, 86 for numpad V)
			(e.ctrlKey && keyCode === 90) || // Ctrl+Z
			(e.ctrlKey && keyCode === 88) || // Ctrl+X
			(e.ctrlKey && keyCode === 67);    // Ctrl+C

		if (!isValid) {
			e.preventDefault();
			errorAlert("Invalid input, please type a valid character or number");
		}
	}

	const validateNumbersInput = (e) => {
		let lines = e.target.value.split('\n')
		e.target.value = lines.filter(n => ! isNaN(n) || n == "\n").join('\n')
		inputs = lines.filter(Number)
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
    <span class="text-gray-700 text-sm">You can paste your copied numbers here!</span>
  </div>
  <span class="text-gray-500 text-sm">Total Numbers: {inputs.length}/10,000</span>
</div>

<div class="flex flex-col items-start self-stretch flex-1 gap-1.5">
	<textarea on:input={validateNumbersInput} on:keydown={filterNumbers} placeholder="Enter your message.." class="flex items-start flex-1 self-stretch gap-2 py-3 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm outline-none min-h-44" />
</div>