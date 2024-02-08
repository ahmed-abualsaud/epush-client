<script>
	import { onMount } from "svelte";
  
	export let images = [];
  
	let currentImage = 0;
	let carousel;

	onMount(() => {
        const interval = setInterval(() => {next()}, 3000)
        return () => {clearInterval(interval)}
	});

	const next = () => {
	  currentImage = (currentImage + 1) % images.length;
	};
  
	// const prev = () => {
	//   currentImage = (currentImage - 1 + images.length) % images.length;
	// };
  
	// const goto = (i) => {
	//   currentImage = i;
	// };
  
	let transform;
  
	$: if (carousel) {
	  transform = `translateX(${-currentImage * carousel.offsetWidth}px)`;
	}
  </script>
  
  <div bind:this={carousel} class="relative w-full h-screen overflow-hidden">
	<div class="flex h-full transition-transform ease-in-out" style:transform={transform}>
	{#each images as { src, alt }}
		<img {src} {alt} class="min-w-full">
	{/each}
	</div>
  
	<!-- Slider indicators -->
	<!-- <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
	  {#each images as mg, i}
		<button on:click={() => goto(i)} type="button" class="{currentImage === i ? 'bg-gray-600' : ''} w-3 h-3 rounded-full border border-gray-600" aria-current="true" aria-label="Slide 1"></button>
	  {/each}
	</div> -->
  
	<!-- Slider controls -->
	<!-- <button on:click|preventDefault={prev} type="button" class="absolute rounded-full top-1/2 start-0 z-30">
	  <span class="inline-flex items-center justify-center w-10 h-10">
		<i class="fa-light fa-angle-left fa-2xl text-gray-500"></i>
		<span class="sr-only">Previous</span>
	  </span>
	</button>
	<button on:click|preventDefault={next} type="button" class="absolute rounded-full top-1/2 end-0 z-30">
	  <span class="inline-flex items-center justify-center w-10 h-10">
		<i class="fa-light fa-angle-right fa-2xl text-gray-500"></i>
		<span class="sr-only">Next</span>
	  </span>
	</button> -->
  </div>
  