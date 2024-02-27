<script>
	import Avatar from "./Avatar.svelte"
	import RouteDisplay from "./RouteDisplay.svelte"

	import Notification from "./Notification.svelte"
	import AddBalanceModal from "../client/Billing/AddBalanceModal.svelte"
	import AddMessageButton from "../client/Report/AddMessageButton.svelte"

	import { empty } from "$lib/helper/utils"
	import { showModal } from "$lib/helper/modal"
    import { setcurrentRouteDisplay } from "$lib/router/router"

	export let client
	export let lastOrder
</script>

<div class="flex flex-col items-start w-full">
	<header class="flex flex-col items-center w-full border-b border-gray-200 bg-white">
		<nav class="flex justify-end sm:justify-between items-center self-stretch px-6 h-[72px]">
		<RouteDisplay />
	
		<div class="flex items-center gap-4">
			<AddMessageButton key={8} />
			<Notification />
			<Avatar />
		</div>
		</nav>
  </header>
  
  {#if empty(client) || empty(lastOrder) || 100 * client?.balance/lastOrder?.credit < 10}
    <div class="flex items-center self-stretch p-4 gap-3 border border-warn-200 bg-warn-25">
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path d="M10.0003 14.1667C10.0003 16.4679 11.8658 18.3333 14.167 18.3333C16.4682 18.3333 18.3337 16.4679 18.3337 14.1667C18.3337 11.8655 16.4682 10 14.167 10C11.8658 10 10.0003 11.8655 10.0003 14.1667ZM10.0003 14.1667C10.0003 13.2285 10.3104 12.3627 10.8337 11.6663V4.16667M10.0003 14.1667C10.0003 14.8545 10.167 15.5033 10.4621 16.0751C9.76005 16.6681 8.13853 17.0833 6.25033 17.0833C3.71902 17.0833 1.66699 16.3371 1.66699 15.4167V4.16667M10.8337 4.16667C10.8337 5.08714 8.78163 5.83333 6.25033 5.83333C3.71902 5.83333 1.66699 5.08714 1.66699 4.16667M10.8337 4.16667C10.8337 3.24619 8.78163 2.5 6.25033 2.5C3.71902 2.5 1.66699 3.24619 1.66699 4.16667M1.66699 11.6667C1.66699 12.5871 3.71902 13.3333 6.25033 13.3333C8.07449 13.3333 9.64976 12.9458 10.3875 12.3848M10.8337 7.91667C10.8337 8.83714 8.78163 9.58333 6.25033 9.58333C3.71902 9.58333 1.66699 8.83714 1.66699 7.91667" stroke="#DC6803" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		<div class="flex justify-end items-center flex-1 gap-3">
			<div class="flex flex-col items-start flex-1 gap-1">
				<span class="self-stretch text-warn-700 font-semibold text-sm">Low account balance!</span>
				<span class="self-stretch text-warn-700 text-sm hidden lg:block">You are running out of your balance, charge now to use the epush again.</span>
			</div>
			<div class="flex items-start gap-3">
				<button class="flex justify-center items-center gap-2">
					<span class="font-semibold text-warn-600 text-sm">Learn more</span>
				</button>
				<button on:click={() => showModal(AddBalanceModal)} class="flex justify-center items-center gap-2">
					<span class="font-semibold text-warn-700 text-sm">Add Balance</span>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path d="M4.16699 9.99984H15.8337M15.8337 9.99984L10.0003 4.1665M15.8337 9.99984L10.0003 15.8332" stroke="#B54708" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</div>
    </div>
  {/if}
  {#if ! empty(lastOrder) && empty(lastOrder.collection_date)}
  <div class="flex items-center self-stretch p-4 gap-3 border border-warn-200 bg-warn-25">
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
		<path d="M10.0003 14.1667C10.0003 16.4679 11.8658 18.3333 14.167 18.3333C16.4682 18.3333 18.3337 16.4679 18.3337 14.1667C18.3337 11.8655 16.4682 10 14.167 10C11.8658 10 10.0003 11.8655 10.0003 14.1667ZM10.0003 14.1667C10.0003 13.2285 10.3104 12.3627 10.8337 11.6663V4.16667M10.0003 14.1667C10.0003 14.8545 10.167 15.5033 10.4621 16.0751C9.76005 16.6681 8.13853 17.0833 6.25033 17.0833C3.71902 17.0833 1.66699 16.3371 1.66699 15.4167V4.16667M10.8337 4.16667C10.8337 5.08714 8.78163 5.83333 6.25033 5.83333C3.71902 5.83333 1.66699 5.08714 1.66699 4.16667M10.8337 4.16667C10.8337 3.24619 8.78163 2.5 6.25033 2.5C3.71902 2.5 1.66699 3.24619 1.66699 4.16667M1.66699 11.6667C1.66699 12.5871 3.71902 13.3333 6.25033 13.3333C8.07449 13.3333 9.64976 12.9458 10.3875 12.3848M10.8337 7.91667C10.8337 8.83714 8.78163 9.58333 6.25033 9.58333C3.71902 9.58333 1.66699 8.83714 1.66699 7.91667" stroke="#DC6803" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>
	<div class="flex justify-end items-center flex-1 gap-3">
		<div class="flex flex-col items-start flex-1 gap-1">
			<span class="self-stretch text-warn-700 font-semibold text-sm">Pending Orders Found!</span>
			<span class="self-stretch text-warn-700 text-sm hidden lg:block">We have found a pending orders for you, please call our support team to complete the payment process.</span>
		</div>
		<div class="flex items-start gap-3">
			<button class="flex justify-center items-center gap-2">
				<span class="font-semibold text-warn-600 text-sm">Learn more</span>
			</button>
			<button on:click={() => setcurrentRouteDisplay("Support")} class="flex justify-center items-center gap-2">
				<span class="font-semibold text-warn-700 text-sm">Call Support Team</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path d="M4.16699 9.99984H15.8337M15.8337 9.99984L10.0003 4.1665M15.8337 9.99984L10.0003 15.8332" stroke="#B54708" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>
	</div>
</div>
  {/if}
</div>