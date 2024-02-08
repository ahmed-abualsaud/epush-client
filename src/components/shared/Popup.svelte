<script>
    import { empty } from "$lib/helper/utils"
    import { visiblePopup } from "$lib/helper/popup"

    export let name = ""
    export let clazz = ""
</script>

<div class="fixed flex justify-center items-center top-0 left-0 w-screen h-screen z-[99999] {! empty(name) && ($visiblePopup == name) ? "scale-100 visible" : " scale-0 invisible"} transition-all duration-300 ease-in-out">
    <div class="flex justify-center items-center -gap-4 w-fit rounded-xl shadow-lg {clazz}">
        <slot />
    </div>
</div>
