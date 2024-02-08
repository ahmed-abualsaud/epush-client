<script>
    export let text
    export let clazz = null
    export let type = "text"
    export let onClick = null


</script>

<button on:click|preventDefault={(e) => onClick && onClick(e)} type={type ?? "button"} class="flex justify-center items-center gap-2 self-stretch {clazz}">
    <slot name="icon" />
    {text}
</button>