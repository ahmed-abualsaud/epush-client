
<script>
	import Button from "./Button.svelte"

    export let interval
    export let appendText = ""
    export let buttonText = ""
    export let onClick = null

    let time

    const onClickHandler = (e) => {
        onClick && onClick(e)
        startTimer()
    }

    const startTimer = () => {
        time = interval
        let timerId = setInterval(() => {
            time -= 1
            if (time === 0) {
                clearInterval(timerId)
            }
        }, 1000) 
    }

    startTimer()
</script>

{#if (time > 0)}
<div class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg">
    <div class="text-gray-600 text-base font-semibold">
        {time}s {appendText}
    </div>
</div>    
{/if}

{#if (time === 0)}
    <Button onClick={onClickHandler} text={buttonText} clazz="py-2.5 px-[18px] border rounded-lg border-gray-300 bg-white text-gray-700 font-semibold text-base [box-shadow:0px_1px_2px_0px_rgba(16,_24,_40,_0.05)]"/>
{/if}
