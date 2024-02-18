<script>
	import { empty } from "$lib/helper/utils";
    import { successAlert, errorAlert } from "$lib/helper/alert"

    export let text = ""
    export let icon = ""
    export let color = "gray"

    const copyToClipboard = (e) => {
        navigator.clipboard.writeText(e.target.innerText)
        .then(() => {
            successAlert('Copied to clipboard', 2)
        })
        .catch(err => {
            errorAlert('Error copying to clipboard: ' + err.message, 5)
        })
    }
</script>

{#if color == "purple"}
<button on:click={copyToClipboard} class="flex items-center py-0.5 px-2 rounded-2xl bg-purple-50 mix-blend-multiply max-w-40 truncate">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-purple-700 text-center text-xs leading-[18px] truncate">{text}</span>
</button>
{/if}

{#if color == "indigo"}
<button on:click={copyToClipboard} class="flex items-center py-0.5 px-2 rounded-2xl bg-indigo-50 mix-blend-multiply max-w-40 truncate">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-indigo-700 text-center text-xs leading-[18px] truncate">{text}</span>
</button>
{/if}

{#if color == "green"}
<button on:click={copyToClipboard} class="flex items-center py-0.5 px-2 rounded-2xl bg-green-50 mix-blend-multiply max-w-40 truncate">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-green-700 text-center text-xs leading-[18px] truncate">{text}</span>
</button>
{/if}

{#if color == "rose"}
<button on:click={copyToClipboard} class="flex items-center py-0.5 px-2 rounded-2xl bg-rose-50 mix-blend-multiply max-w-40 truncate">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-rose-700 text-center text-xs leading-[18px] truncate">{text}</span>
</button>
{/if}

{#if color == "blue"}
<button on:click={copyToClipboard} class="flex items-center py-0.5 px-2 rounded-2xl bg-blue-light-50 mix-blend-multiply max-w-40 truncate">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-blue-light-700 text-center text-xs leading-[18px] truncate">{text}</span>
</button>
{/if}

{#if color == "orange"}
<button on:click={copyToClipboard} class="flex items-center py-0.5 px-2 rounded-2xl bg-orange-dark-50 mix-blend-multiply max-w-40 truncate">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-orange-dark-700 text-center text-xs leading-[18px] truncate">{text}</span>
</button>
{/if}

{#if color == "gray"}
<button on:click={copyToClipboard} class="flex items-center py-0.5 px-2 rounded-2xl bg-gray-100 mix-blend-multiply max-w-40 truncate">
    {#if ! empty(icon)}
    {@html icon}
    {/if}
    <span class="text-gray-700 text-center text-xs leading-[18px] truncate">{text}</span>
</button>
{/if}