<script>
    export let hint
    export let color
</script>

{#if color === "gray"}
<div class="flex items-center self-stretch gap-3 p-4 border rounded-xl border-gray-300 bg-gray-25">
    <div class="flex justify-center items-center w-12 h-12 p-3 rounded-3xl bg-gray-100">
        <slot name="icon" />
    </div>
    <div class="flex flex-col items-start flex-1 gap-3">
        <div class="text-gray-700 self-stretch text-sm font-medium">
            {hint}
        </div>
    </div>
</div>
{/if}

{#if color === "primary"}
<div class="flex items-center self-stretch gap-3 p-4 border rounded-xl border-primary-300 bg-primary-25">
    <div class="flex justify-center items-center w-12 h-12 p-3 rounded-3xl bg-primary-100">
        <slot name="icon" />
    </div>
    <div class="flex flex-col items-start flex-1 gap-3">
        <div class="text-primary-700 self-stretch text-sm font-medium">
            {hint}
        </div>
    </div>
</div>
{/if}