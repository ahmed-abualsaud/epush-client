<script>
        import { handleImageError } from "$lib/helper/image"
    import { beautifulToSnakeCase } from "$lib/helper/strUtils"

    export let operator
</script>

<div class="flex items-center gap-1.5 py-1 pe-3 ps-1.5 rounded-2xl bg-white mix-blend-multiply">
    <img on:error={handleImageError} alt="" src="image/operators/{beautifulToSnakeCase(operator)}.png" />
    <span class="text-gray-700 text-center text-sm font-medium">
        {operator}
    </span>
</div>