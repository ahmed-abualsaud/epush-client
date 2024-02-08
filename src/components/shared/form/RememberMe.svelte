<script>
    export let text
    export let remember = false
    export let clazz = null
</script>

<div class="flex items-start gap-2 flex-1 {clazz}">
    <label class="flex pt-0.5 justify-center items-center">
        <input bind:checked={remember} id="remember-me" type="checkbox" name="remember-me" class="peer hidden">
        <span class="w-4 h-4 border rounded border-gray-300 bg-white peer-checked:bg-primary-25 peer-checked:border-primary-600"></span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" class="absolute hidden peer-checked:block">
            <path d="M10 3L4.5 8.5L2 6" stroke="#6D9A16" stroke-width="1.6666" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </label>
    <div class="flex flex-col items-start flex-1">
        <div class="self-stretch text-sm font-medium text-gray-700">{text}</div>
    </div>
</div>