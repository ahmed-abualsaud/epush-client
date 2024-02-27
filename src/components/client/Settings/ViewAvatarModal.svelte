<script>
	import Modal from "../../shared/Modal.svelte"

    export let url
</script>

<Modal>
    <div class="flex flex-col items-center rounded-xl bg-white shadow-xl w-[800px] h-[80vh]">
        <img src={url} alt="User Avatar" class="bg-cover min-w-full min-h-full rounded-xl"/>
    </div>
</Modal>