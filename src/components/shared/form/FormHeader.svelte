<script>
    export let header
    export let text
    export let clazz = null
</script>

<div class="flex flex-col items-start self-stretch gap-3 {clazz}">
    <div class="text-gray-900 text-4xl font-semibold leading-[44px]">{header}</div>
    <div class="text-gray-600 text-base font-normal leading-6">{text}</div>
</div>