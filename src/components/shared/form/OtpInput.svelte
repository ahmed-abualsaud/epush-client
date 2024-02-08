<script>
    import { afterUpdate } from 'svelte'

    export let otp = ""

    let one
    let two
    let three
    let four
    let digits = []
    let otpArray = []

    const focusNext = (input, index) => {
        let value = input.value.toString()
        if (value.length === 1) {
            setOtp(value, index)
            let nextIndex = index + 1
            if (nextIndex < digits.length) {
                let nextInput = digits[nextIndex]
                nextInput.focus()
            }
        }
    }

    const setOtp = (value, index) => {
        if (index === otpArray.length) {
            otpArray.push(value)
        }

        if (index < otpArray.length) {
            otpArray[index] = value
        }

        otp = otpArray.join('')
    }

    const clearOtp = (input, index) => {
        let value = input.value.toString()
        if (value.length === 0) {
            otpArray[index] = null
            otp = otpArray.join('')
        }
    }

    const updateDigits = () => {
        digits = [one, two, three, four]
    }

    afterUpdate(updateDigits)
</script>

<div class="flex flex-col items-start self-stretch gap-1.5">
    <div class="text-gray-700 text-sm font-medium">
        Enter the code you received
    </div>
    <div class="flex items-start self-stretch gap-2">
        <div class="flex flex-col items-start flex-1 gap-2 py-0.5 px-2 border rounded-lg border-gray-300 bg-white [box-shadow:0px_1px_2px_0px_rgba(16,_24,_40,_0.05)]">
            <input bind:this={one} name="one" type="text" placeholder="0" class="self-stretch text-gray-300 placeholder:text-gray-300 text-center font-medium text-5xl w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" maxlength="1" pattern="[0-9]" oninput="this.value=this.value.replace(/[^0-9]/g,'');" on:input={() => focusNext(one, 0)} on:blur={() => clearOtp(one, 0)}/>
        </div>
        <div class="flex flex-col items-start flex-1 gap-2 py-0.5 px-2 border rounded-lg border-gray-300 bg-white [box-shadow:0px_1px_2px_0px_rgba(16,_24,_40,_0.05)]">
            <input bind:this={two} name="two" type="text" placeholder="0" class="self-stretch text-gray-300 placeholder:text-gray-300 text-center font-medium text-5xl w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" maxlength="1" pattern="[0-9]" oninput="this.value=this.value.replace(/[^0-9]/g,'');" on:input={() => focusNext(two, 1)} on:blur={() => clearOtp(two, 1)}/>
        </div>
        <div class="flex flex-col items-start flex-1 gap-2 py-0.5 px-2 border rounded-lg border-gray-300 bg-white [box-shadow:0px_1px_2px_0px_rgba(16,_24,_40,_0.05)]">
            <input bind:this={three} name="three" type="text" placeholder="0" class="self-stretch text-gray-300 placeholder:text-gray-300 text-center font-medium text-5xl w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" maxlength="1" pattern="[0-9]" oninput="this.value=this.value.replace(/[^0-9]/g,'');" on:input={() => focusNext(three, 2)} on:blur={() => clearOtp(three, 2)}/>
        </div>
        <div class="flex flex-col items-start flex-1 gap-2 py-0.5 px-2 border rounded-lg border-gray-300 bg-white [box-shadow:0px_1px_2px_0px_rgba(16,_24,_40,_0.05)]">
            <input bind:this={four} name="four" type="text" placeholder="0" class="self-stretch text-gray-300 placeholder:text-gray-300 text-center font-medium text-5xl w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" maxlength="1" pattern="[0-9]" oninput="this.value=this.value.replace(/[^0-9]/g,'');" on:input={() => focusNext(four, 3)} on:blur={() => clearOtp(four, 3)}/>
        </div>
    </div>
</div>
