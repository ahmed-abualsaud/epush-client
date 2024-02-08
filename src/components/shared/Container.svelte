<script>
    export let clazz = null
</script>

<div class={
    // 'container mx-auto border-x-2 ' + 
    `${clazz}`
}>
   <slot />
</div>