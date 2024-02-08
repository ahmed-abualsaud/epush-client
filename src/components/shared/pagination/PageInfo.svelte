<script>
    export let take
    export let total
</script>

<span class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span class="font-semibold text-gray-900">1-{Math.min(take, total)}</span> of <span class="font-semibold text-gray-900">{total}</span></span>
