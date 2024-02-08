<script>
	import { empty } from "$lib/helper/utils";
    import { validateElementValue, setValidationErrors } from "$lib/helper/error"

    export let onSubmit
    export let submitText

    let form
    let errors = []
    let password = null
    let selectInputs = 'input[type=text], input[type=number], input[type=password]'
    const validateAndSubmit = (e) => {
        errors = []
        let inputs = form.querySelectorAll(selectInputs)
        inputs.forEach(input => {
            if (input.name === "password") {
                password = input.value
            }
        })

        inputs.forEach(input => {
            errors[input.name] = errors[input.name] || [];
            errors[input.name].push(...validateElementValue(input.value, input.getAttribute('validation').split('|'), input.name, password));
        })

        setValidationErrors(errors)
        empty(errors) && onSubmit && onSubmit(e)
    }
</script>

<form bind:this={form} class="flex flex-col items-start gap-6 self-stretch" method="POST" action="?/signin" on:submit|preventDefault={validateAndSubmit}>
    <slot />

    <button type="submit" class="flex justify-center items-center gap-2 self-stretch py-[10px] px-[18px] border rounded-lg border-primary-600 bg-primary-600 text-white text-base font-semibold [box-shadow:0px_1px_2px_0px_rgba(16,_24,_40,_0.05)]">
        {submitText}
    </button>
</form>