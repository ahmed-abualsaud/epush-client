<script>
	import Modal from "../../shared/Modal.svelte"

    export let document
</script>

<Modal>
    <div class="flex flex-col items-center rounded-xl bg-white shadow-xl w-[800px] h-[80vh]">
        {#if document.fileName.includes(".pdf")}
        <iframe src={document.url} title={document.fileName} width="100%" height="100%" class="rounded-xl"/>
        {:else}
        <img src={document.url} alt={document.fileName} class="bg-cover min-w-full min-h-full rounded-xl"/>
        {/if}
    </div>
</Modal>