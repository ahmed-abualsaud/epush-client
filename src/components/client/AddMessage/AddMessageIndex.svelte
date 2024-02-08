<script>
	import NoOrdersModal from "./NoOrdersModal.svelte"
	import NoCreditModal from "./NoCreditModal.svelte"
	import LanguageAndSender from "./LanguageAndSender.svelte"
</script>


<NoOrdersModal />
<NoCreditModal />

<LanguageAndSender addMethod="add-group-sms" />
<LanguageAndSender addMethod="add-bulk-message" />
<LanguageAndSender addMethod="add-custom-message" />
<LanguageAndSender addMethod="add-custom-with-parameters" />
