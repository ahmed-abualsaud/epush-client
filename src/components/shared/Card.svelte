<script>
    export let title = ""
</script>

<div class="flex flex-col items-start gap-4 p-6 flex-1 rounded-xl border border-gray-200 bg-white shadow-sm min-w-72 lg:min-w-max">
    <div class="flex items-center self-stretch gap-5">
        <slot name="title-icon" />
        <span class="flex-1 text-gray-900 font-medium">{title}</span>
    </div>
    <div class="flex flex-col items-start self-stretch gap-2">
        <slot name="content" />
    </div>
    <slot />
</div>