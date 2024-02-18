<script>
    export let total = 0
    export let tableTitle = "Table"
    export let description  = "description"
</script>

<div class="flex flex-col justify-center items-start gap-1">
    <div class="flex items-center self-stretch gap-2">
        <span class="text-gray-900 text-lg font-semibold">{tableTitle}</span>
        <div class="flex items-center py-0.5 px-2 rounded-2xl bg-primary-50 mix-blend-multiply">
            <span class="text-primary-700 text-xs font-medium">{total} records</span>
        </div>
    </div>
    <span class="self-stretch text-gray-600 text-sm">{description}</span>
</div>