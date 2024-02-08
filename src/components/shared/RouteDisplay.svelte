<script>
    import { currentRouteDisplay } from "$lib/router/router"
</script>

<div class="items-center gap-3 hidden sm:flex">
    {@html $currentRouteDisplay.icon}
    {#each $currentRouteDisplay.slugs as slug}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 12L10 8L6 4" stroke="#D0D5DD" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    <div class="flex justify-center items-center">
        <button class="text-sm font-medium text-gray-600">{slug}</button>
      </div>
    {/each}
  </div>