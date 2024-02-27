<script>
	import Modal from "../../shared/Modal.svelte"
	import EditIpWhitelistPopup from "./EditIPWhitelistPopup.svelte"
	import IPWhitelistErrorPopup from "./IPWhitelistErrorPopup.svelte"
	import IPWhiteSuccessPopup from "./IPWhitelistSuccessPopup.svelte"
    import DeleteIpWhitelistPopup from "./DeleteIPWhitelistPopup.svelte"

	import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { showPopup } from "$lib/helper/popup"
    import { hideModal } from "$lib/helper/modal"
    import { currentClient } from "$lib/helper/store"
    import { readableTimestamp } from "$lib/helper/dateTime"
	import { addIPWhitelist, getClientIPWhitelist, updateIPWhitelist } from "../../../api/clientApi"


    let popupAction = "save"
    let ipWhitelists = []
    let addedIP = ""
    let currentDeleteIPID = 0
    let currentUpdateIPID = 0

    onMount(async () => {
        ipWhitelists = await getClientIPWhitelist()
    })

    const addIP = async () => {
        popupAction = "save"

        try {
            let result = await addIPWhitelist({
                user_id: $currentClient.user_id,
                ip_address: addedIP,
                allowed: true
            })
            ipWhitelists = [...ipWhitelists, result]
            showPopup("ipwhitelist-success")
        } catch (e) {
            showPopup("ipwhitelist-error")
        }
    }

    const deleteIP = async (ipID) => {
        currentDeleteIPID = ipID
        popupAction = "delete"
        showPopup("delete-ipwhitelist")
    }

    const updateIP = async (ipID) => {
        currentUpdateIPID = ipID
        popupAction = "update"
        showPopup("update-ipwhitelist")
    }

    const updateIPAllowness = async (id, allowed) => {
        popupAction = "update-allow"

        try {
            await updateIPWhitelist(id, {allowed})
            ipWhitelists = ipWhitelists.map(ip => {
                if (ip.id == id) {
                    ip.allowed = allowed
                }
                return ip
            })
            showPopup("ipwhitelist-success")
        } catch (e) {
            showPopup("ipwhitelist-error")
        }
    }
</script>

<Modal>
    <div class="flex flex-col items-center rounded-xl bg-white shadow-xl w-[800px]">
        <div class="flex flex-col items-center self-stretch gap-4 bg-white rounded-t-xl p-6">
            <div class="flex justify-center items-center self-stretch rounded-[10px] border border-gray-200 bg-white shadow-sm w-14 h-14 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M16.2429 5.25806C18.586 7.6012 18.586 11.4002 16.2429 13.7433M7.75758 13.7433C5.41444 11.4002 5.41443 7.6012 7.75758 5.25806M4.85853 16.5007C1.02383 12.5901 1.0473 6.31132 4.92893 2.42969M19.0715 2.42969C22.9531 6.31132 22.9766 12.5901 19.1419 16.5007M12.0002 16.5007V9.50073M5.00022 22.5007H19.0002C19.9321 22.5007 20.398 22.5007 20.7656 22.3485C21.2556 22.1455 21.645 21.7562 21.848 21.2661C22.0002 20.8986 22.0002 20.4326 22.0002 19.5007C22.0002 18.5688 22.0002 18.1029 21.848 17.7354C21.645 17.2453 21.2556 16.856 20.7656 16.653C20.398 16.5007 19.9321 16.5007 19.0002 16.5007H5.00022C4.06834 16.5007 3.6024 16.5007 3.23485 16.653C2.7448 16.856 2.35545 17.2453 2.15246 17.7354C2.00022 18.1029 2.00022 18.5688 2.00022 19.5007C2.00022 20.4326 2.00022 20.8986 2.15246 21.2661C2.35545 21.7562 2.7448 22.1455 3.23485 22.3485C3.6024 22.5007 4.06834 22.5007 5.00022 22.5007Z" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex items-center self-stretch gap-4">
                <div class="flex flex-col items-start flex-1 gap-1 self-stretch">
                    <span class="self-stretch text-gray-900 text-lg font-semibold">IP Whitelist For API Token</span>
                    <span class="self-stretch text-gray-600 text-sm">Manage which IP addresses can access your API token</span>
                </div>
            </div>
        </div>

        <div class="flex flex-col items-start self-stretch gap-4 px-6 pb-8">
            <div class="flex items-end self-stretch gap-4">
                <div class="flex flex-col items-start self-stretch flex-1 gap-1.5">
                    <span class="text-gray-700 text-sm font-medium">Add IP Address to the list</span>
                    <div class="flex items-center self-stretch gap-2 py-2 px-3 rounded-lg border border-gray-300 bg-white shadow-sm">
                        <input bind:value={addedIP} placeholder="e.g 192.168.1.1" class=" outline-none flex-1" />
                    </div>
                </div>
                <button disabled={empty(addedIP)} on:click={addIP} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-900 bg-gray-900 shadow-sm {empty(addedIP) ? "opacity-40" : "opacity-100"}">
                    <span class="text-white text-sm font-semibold">Add IP</span>
                </button>
            </div>
            <div class="flex flex-col items-start self-stretch flex-1 rounded-xl border border-gray-200 bg-white shadow-sm overflow-y-hidden">
                <div class="flex self-stretch flex-1 rounded-t-xl w-full">
                    <div class="flex items-center self-stretch flex-1 gap-1 py-3 px-6 h-11 border-b border-b-gray-200 bg-white">
                        <span class="text-gray-600 text-xs font-medium">IP</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M8.00016 3.83398V13.1673M8.00016 13.1673L12.6668 8.50065M8.00016 13.1673L3.3335 8.50065" stroke="#475467" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="flex items-center self-stretch flex-1 gap-1 py-3 px-6 h-11 border-b border-b-gray-200 bg-white">
                        <span class="text-gray-600 text-xs font-medium">Added at</span>
                    </div>
                    <div class="flex items-center self-stretch flex-1 gap-1 py-3 px-6 h-11 border-b border-b-gray-200 bg-white">
                        <span class="text-gray-600 text-xs font-medium">Allow</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M8.00016 3.83398V13.1673M8.00016 13.1673L12.6668 8.50065M8.00016 13.1673L3.3335 8.50065" stroke="#475467" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="flex items-center self-stretch gap-1 py-3 px-6 h-11 border-b border-b-gray-200 bg-white">
                        <button class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm opacity-0 invisible">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                <path d="M13.3333 5.49935V4.83268C13.3333 3.89926 13.3333 3.43255 13.1517 3.07603C12.9919 2.76243 12.7369 2.50746 12.4233 2.34767C12.0668 2.16602 11.6001 2.16602 10.6667 2.16602H9.33333C8.39991 2.16602 7.9332 2.16602 7.57668 2.34767C7.26308 2.50746 7.00811 2.76243 6.84832 3.07603C6.66667 3.43255 6.66667 3.89926 6.66667 4.83268V5.49935M8.33333 10.0827V14.2493M11.6667 10.0827V14.2493M2.5 5.49935H17.5M15.8333 5.49935V14.8327C15.8333 16.2328 15.8333 16.9329 15.5608 17.4677C15.3212 17.9381 14.9387 18.3205 14.4683 18.5602C13.9335 18.8327 13.2335 18.8327 11.8333 18.8327H8.16667C6.76654 18.8327 6.06647 18.8327 5.53169 18.5602C5.06129 18.3205 4.67883 17.9381 4.43915 17.4677C4.16667 16.9329 4.16667 16.2328 4.16667 14.8327V5.49935" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="text-gray-700 text-sm font-medium">Delete</span>
                        </button>
                    </div>
                </div>
                <div class="flex flex-col self-stretch flex-1 rounded-t-xl w-full max-h-[300px] overflow-y-auto">
                {#each ipWhitelists as ip}
                    <div class="flex self-stretch flex-1 rounded-t-xl w-full">
                        <div class="flex items-center self-stretch flex-1 gap-1 py-3 px-6 h-[60px] border-b border-b-gray-200 bg-white">
                            <span class="text-gray-900 text-sm font-medium">{ip.ip_address}</span>
                        </div>
                        <div class="flex items-center self-stretch flex-1 gap-1 py-3 px-6 h-[60px] border-b border-b-gray-200 bg-white">
                            <span class="text-gray-900 text-sm font-medium">{readableTimestamp(ip.created_at)}</span>
                        </div>
                        <div class="flex items-center self-stretch flex-1 gap-1 py-3 px-6 h-[60px] border-b border-b-gray-200 bg-white">
                            <button on:click={() => updateIPAllowness(ip.id, ! ip.allowed)} class="flex items-center w-9 h-5 p-0.5 me-1 rounded-xl {ip.allowed ? "bg-primary-600" : "bg-gray-200"}">
                                <svg class="flex-shrink-0 transition-all duration-700 ease-in-out {ip.allowed ? "translate-x-3.5" : "translate-x-0"}" xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <g filter="url(#filter0_dd_684_12226)">
                                    <circle cx="10" cy="10" r="8" fill="white"/>
                                    </g>
                                    <defs>
                                    <filter id="filter0_dd_684_12226" x="-1" y="0" width="22" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="1"/>
                                        <feGaussianBlur stdDeviation="1"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.06 0"/>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_684_12226"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="1"/>
                                        <feGaussianBlur stdDeviation="1.5"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0"/>
                                        <feBlend mode="normal" in2="effect1_dropShadow_684_12226" result="effect2_dropShadow_684_12226"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_684_12226" result="shape"/>
                                    </filter>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                        <div class="flex items-center self-stretch gap-2 py-3 px-6 h-[60px] border-b border-b-gray-200 bg-white">
                            <button on:click={() => deleteIP(ip.id)} class="flex justify-center items-center gap-2 py-2 px-3 rounded-lg border border-gray-300 bg-white shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                    <path d="M13.3333 5.49935V4.83268C13.3333 3.89926 13.3333 3.43255 13.1517 3.07603C12.9919 2.76243 12.7369 2.50746 12.4233 2.34767C12.0668 2.16602 11.6001 2.16602 10.6667 2.16602H9.33333C8.39991 2.16602 7.9332 2.16602 7.57668 2.34767C7.26308 2.50746 7.00811 2.76243 6.84832 3.07603C6.66667 3.43255 6.66667 3.89926 6.66667 4.83268V5.49935M8.33333 10.0827V14.2493M11.6667 10.0827V14.2493M2.5 5.49935H17.5M15.8333 5.49935V14.8327C15.8333 16.2328 15.8333 16.9329 15.5608 17.4677C15.3212 17.9381 14.9387 18.3205 14.4683 18.5602C13.9335 18.8327 13.2335 18.8327 11.8333 18.8327H8.16667C6.76654 18.8327 6.06647 18.8327 5.53169 18.5602C5.06129 18.3205 4.67883 17.9381 4.43915 17.4677C4.16667 16.9329 4.16667 16.2328 4.16667 14.8327V5.49935" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <button on:click={() => updateIP(ip.id)} class="flex justify-center items-center gap-2 py-2 px-3 rounded-lg border border-gray-300 bg-white shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                    <path d="M2.39637 15.5963C2.43466 15.2517 2.4538 15.0794 2.50594 14.9184C2.55219 14.7755 2.61753 14.6396 2.70021 14.5142C2.79339 14.3729 2.91596 14.2503 3.16112 14.0052L14.1664 2.99992C15.0868 2.07945 16.5792 2.07945 17.4997 2.99993C18.4202 3.9204 18.4202 5.41279 17.4997 6.33326L6.49445 17.3385C6.2493 17.5836 6.12672 17.7062 5.98541 17.7994C5.86005 17.8821 5.72408 17.9474 5.58121 17.9937C5.42018 18.0458 5.24789 18.0649 4.90331 18.1032L2.08301 18.4166L2.39637 15.5963Z" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                {/each}
                </div>
            </div>
        </div>
        <div class="flex justify-end items-center self-stretch flex-1 gap-3 border-t p-6">
            <button on:click={hideModal} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                <span class="text-gray-700 font-semibold">Close</span>
            </button>
        </div>
    </div>
</Modal>

{#if ["save", "update-allow"].includes(popupAction)}
<IPWhitelistErrorPopup action={popupAction == "update-allow" ? "update" : "save"} />
<IPWhiteSuccessPopup action={popupAction == "update-allow" ? "update" : "save"} />    
{/if}

{#if popupAction == "update"}
<EditIpWhitelistPopup bind:ipWhitelists={ipWhitelists} ipID={currentUpdateIPID} />
{/if}

{#if popupAction == "delete"}
<DeleteIpWhitelistPopup bind:ipWhitelists={ipWhitelists} ipID={currentDeleteIPID} />
{/if}