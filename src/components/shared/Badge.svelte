<script>
	import { empty } from "$lib/helper/utils";

    export let text = ""
    export let color = "gray"
    export let icon = ""
</script>

{#if color == "purple"}
<div class="flex items-center py-0.5 px-2 rounded-2xl bg-purple-50 mix-blend-multiply">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-purple-700 text-center text-xs leading-[18px]">{text}</span>
</div>
{/if}

{#if color == "indigo"}
<div class="flex items-center py-0.5 px-2 rounded-2xl bg-indigo-50 mix-blend-multiply">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-indigo-700 text-center text-xs leading-[18px]">{text}</span>
</div>
{/if}

{#if color == "green"}
<div class="flex items-center py-0.5 px-2 rounded-2xl bg-green-50 mix-blend-multiply">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-green-700 text-center text-xs leading-[18px]">{text}</span>
</div>
{/if}

{#if color == "rose"}
<div class="flex items-center py-0.5 px-2 rounded-2xl bg-rose-50 mix-blend-multiply">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-rose-700 text-center text-xs leading-[18px]">{text}</span>
</div>
{/if}

{#if color == "blue"}
<div class="flex items-center py-0.5 px-2 rounded-2xl bg-blue-50 mix-blend-multiply">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-blue-light-700 text-center text-xs leading-[18px]">{text}</span>
</div>
{/if}

{#if color == "gray"}
<div class="flex items-center py-0.5 px-2 rounded-2xl bg-gray-50 mix-blend-multiply">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-gray-700 text-center text-xs leading-[18px]">{text}</span>
</div>
{/if}