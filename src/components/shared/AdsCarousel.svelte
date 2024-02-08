<script>
	import { onMount } from "svelte";

    export let images

    let distance = 0
    let stepWidth = 0
    let imagesWidth = 0
    let carouselWidth = 0
    let currentSlideSpan = 0

    let inLeft = true
    let inRight = false
    let leftColor = '#EAECF0'
    let rightColor = '#667085'

    onMount(() => {
        currentSlideSpan = carouselWidth
        stepWidth = Math.min(316, carouselWidth)
        imagesWidth = (images.length * stepWidth) - 16

        const interval = setInterval(() => {
            if (inLeft) slideToRight()
            if (inRight) slideToLeft()
        }, 2000)
        return () => {clearInterval(interval)}
    })

    const slideToRight = () => {
        if (imagesWidth <= currentSlideSpan) {
            inRight = true
            inLeft = false
        }

        if (imagesWidth > currentSlideSpan) {
            leftColor = '#667085'
            distance -= Math.min(imagesWidth - currentSlideSpan, stepWidth)
            currentSlideSpan += Math.min(imagesWidth - currentSlideSpan, stepWidth)
        }

        if (imagesWidth <= currentSlideSpan) {
            rightColor = '#EAECF0'
        }
    }
  
    const slideToLeft = () => {
        if (currentSlideSpan > carouselWidth) {
            rightColor = '#667085'
            distance += Math.min(currentSlideSpan - carouselWidth, stepWidth)
            currentSlideSpan -= Math.min(currentSlideSpan - carouselWidth, stepWidth)
        }

        if (currentSlideSpan <= carouselWidth) {
            inLeft = true
            inRight = false
            leftColor = '#EAECF0'
        }
    }
</script>
  
<div class="flex flex-col justify-center items-start flex-1 gap-2">
    <div class="flex items-center self-stretch gap-2">
        <span class="flex-1 text-gray-900">New Announcements</span>
        <div class="flex items-center gap-2">
            <button on:click={slideToLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15.8332 9.99984H4.1665M4.1665 9.99984L9.99984 15.8332M4.1665 9.99984L9.99984 4.1665" stroke={leftColor} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button on:click={slideToRight}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.1665 9.99984H15.8332M15.8332 9.99984L9.99984 4.1665M15.8332 9.99984L9.99984 15.8332" stroke={rightColor} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    </div>
  
    <div bind:clientWidth={carouselWidth} class="flex items-center self-stretch gap-4 overflow-hidden">
        {#each images as {src, alt}}
            <img {src} {alt} class="w-[{stepWidth}px] h-[136px] rounded-lg transition-transform duration-300" style="transform: translateX({distance}px)" />
        {/each}
    </div>
</div>