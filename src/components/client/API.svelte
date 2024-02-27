<script>
	import APIErrorModal from "./API/APIErrorModal.svelte"
	import APISuccessModal from "./API/APISuccessModal.svelte"
	import ApiDocumentation from "./API/APIDocumentation.svelte"
	import IpWhitelistModal from "./API/IPWhitelistModal.svelte"
	import GenerateApiTokenModal from "./API/GenerateAPITokenModal.svelte"

    import { showModal } from "$lib/helper/modal"
    import { currentClient } from "$lib/helper/store"
    import { empty, generateApiKey } from "$lib/helper/utils"
    import { successAlert, errorAlert } from "$lib/helper/alert"
	import { updateClient, getClientIPWhitelist } from "../../api/clientApi"

    const copyToClipboard = () => {
        navigator.clipboard.writeText($currentClient.api_key)
        .then(() => {
            successAlert('Copied to clipboard', 2)
        })
        .catch(err => {
            errorAlert('Error copying to clipboard: ' + err.message, 5)
        })
    }

    const generateNewApiKey = async () => {
        if (empty($currentClient.api_key)) {
            try {
                let apiKey = await generateApiKey($currentClient.user_id)
                let data = new FormData()
                data.append("api_key", apiKey)
                await updateClient(data)
                showModal(APISuccessModal)
            } catch (e) {
                showModal(APIErrorModal)
            }
        } else {
            showModal(GenerateApiTokenModal)
        }
    }
</script>

<div class="flex flex-col items-start self-stretch flex-1 gap-6 px-6">
    <div class="flex items-center self-stretch gap-4">
        <div class="flex flex-col items-start flex-1 gap-1">
            <span class="self-stretch text-gray-900 text-3xl leading-[38px] font-semibold">API Token</span>
            <span class="self-stretch text-gray-600">Use our API to integrate with your software</span>
        </div>
        <button on:click={() => showModal(IpWhitelistModal)} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 bg-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_1012_10994)">
                  <path d="M13.5356 3.9644C15.4882 5.91702 15.4882 9.08284 13.5356 11.0355M6.46449 11.0355C4.51187 9.08284 4.51187 5.91702 6.46449 3.9644M4.04862 13.3333C0.85303 10.0744 0.872586 4.84212 4.10728 1.60742M15.8928 1.60742C19.1275 4.84212 19.147 10.0744 15.9514 13.3333M10 13.3333V7.49996M4.16669 18.3333H15.8334C16.6099 18.3333 16.9982 18.3333 17.3045 18.2064C17.7129 18.0373 18.0373 17.7128 18.2065 17.3044C18.3334 16.9981 18.3334 16.6099 18.3334 15.8333C18.3334 15.0567 18.3334 14.6684 18.2065 14.3622C18.0373 13.9538 17.7129 13.6293 17.3045 13.4602C16.9982 13.3333 16.6099 13.3333 15.8334 13.3333H4.16669C3.39012 13.3333 3.00183 13.3333 2.69555 13.4602C2.28717 13.6293 1.96271 13.9538 1.79356 14.3622C1.66669 14.6684 1.66669 15.0567 1.66669 15.8333C1.66669 16.6099 1.66669 16.9981 1.79356 17.3044C1.96271 17.7128 2.28717 18.0373 2.69555 18.2064C3.00183 18.3333 3.39012 18.3333 4.16669 18.3333Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_1012_10994">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
            </svg>
            <span class="text-gray-700 text-sm font-semibold">IP Whitelist</span>
            <div class="flex items-center py-0.5 px-2 rounded-2xl bg-gray-100 mix-blend-multiply">
                {#await getClientIPWhitelist()}
                    0
                {:then data} 
                    {data.length}
                {:catch error}
                    0
                {/await}
            </div>
        </button>
    </div>
    <div class="flex flex-col items-start self-stretch gap-10">
        {#if $currentClient.use_api_key}
        <div class="flex flex-col items-start self-stretch gap-5">
            <div class="flex items-center self-stretch gap-2 py-2.5 px-3.5 rounded-lg border border-primary-300 bg-primary-50 shadow-sm">
                <div class="flex items-center flex-1 gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M14.1665 14.1667L18.3332 10L14.1665 5.83333M5.83317 5.83333L1.6665 10L5.83317 14.1667M11.6665 2.5L8.33317 17.5" stroke="#8DC220" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input readonly class="outline-none w-full text-center text-gray-900 bg-primary-50" value={empty($currentClient.api_key) ? "You don't have API key, you can get a new one by clicking the button below" : $currentClient.api_key}/>
                </div>
                <button on:click={copyToClipboard} class="flex justify-center items-center gap-2 py-2 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clip-path="url(#clip0_1012_6221)">
                          <path d="M8.74984 1.66835C8.1873 1.67597 7.84959 1.70854 7.57652 1.84767C7.26292 2.00746 7.00795 2.26243 6.84816 2.57603C6.70903 2.8491 6.67646 3.18681 6.66883 3.74935M16.2498 1.66835C16.8124 1.67597 17.1501 1.70854 17.4232 1.84767C17.7368 2.00746 17.9917 2.26243 18.1515 2.57603C18.2906 2.8491 18.3232 3.1868 18.3308 3.74934M18.3308 11.2493C18.3232 11.8119 18.2907 12.1496 18.1515 12.4227C17.9917 12.7363 17.7368 12.9912 17.4232 13.151C17.1501 13.2902 16.8124 13.3227 16.2498 13.3304M18.3332 6.66601V8.33268M11.6665 1.66602H13.3331M4.33317 18.3327H10.6665C11.5999 18.3327 12.0666 18.3327 12.4232 18.151C12.7368 17.9912 12.9917 17.7363 13.1515 17.4227C13.3332 17.0661 13.3332 16.5994 13.3332 15.666V9.33268C13.3332 8.39926 13.3332 7.93255 13.1515 7.57603C12.9917 7.26243 12.7368 7.00746 12.4232 6.84767C12.0666 6.66602 11.5999 6.66602 10.6665 6.66602H4.33317C3.39975 6.66602 2.93304 6.66602 2.57652 6.84767C2.26292 7.00746 2.00795 7.26243 1.84816 7.57603C1.6665 7.93255 1.6665 8.39926 1.6665 9.33268V15.666C1.6665 16.5994 1.6665 17.0661 1.84816 17.4227C2.00795 17.7363 2.26292 17.9912 2.57652 18.151C2.93304 18.3327 3.39975 18.3327 4.33317 18.3327Z" stroke="#527615" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_1012_6221">
                            <rect width="20" height="20" fill="white"/>
                          </clipPath>
                        </defs>
                    </svg>
                    <span class="text-primary-700 text-sm font-semibold">Copy</span>
                </button>
            </div>
            <button on:click={generateNewApiKey} class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-gray-900 bg-gray-900 shadow-sm">
                <span class="text-white font-semibold">Generate API Token</span>
            </button>
        </div>
        {:else}
        <div class="flex flex-col items-start self-stretch gap-5">
            <div class="flex items-center self-stretch gap-2 py-2.5 px-3.5 rounded-lg border border-gray-300 bg-gray-50 shadow-sm">
                <div class="flex items-center flex-1 gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M14.1665 14.1667L18.3332 10L14.1665 5.83333M5.83317 5.83333L1.6665 10L5.83317 14.1667M11.6665 2.5L8.33317 17.5" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input readonly class="outline-none w-full text-center text-gray-500 bg-gray-50" value="You are not allowed to use any API key"/>
                </div>
                <button disabled class="flex justify-center items-center gap-2 py-2 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clip-path="url(#clip0_1012_2981)">
                          <path d="M8.74984 1.66835C8.1873 1.67597 7.84959 1.70854 7.57652 1.84767C7.26292 2.00746 7.00795 2.26243 6.84816 2.57603C6.70903 2.8491 6.67646 3.18681 6.66883 3.74935M16.2498 1.66835C16.8124 1.67597 17.1501 1.70854 17.4232 1.84767C17.7368 2.00746 17.9917 2.26243 18.1515 2.57603C18.2906 2.8491 18.3232 3.1868 18.3308 3.74934M18.3308 11.2493C18.3232 11.8119 18.2907 12.1496 18.1515 12.4227C17.9917 12.7363 17.7368 12.9912 17.4232 13.151C17.1501 13.2902 16.8124 13.3227 16.2498 13.3304M18.3332 6.66601V8.33268M11.6665 1.66602H13.3331M4.33317 18.3327H10.6665C11.5999 18.3327 12.0666 18.3327 12.4232 18.151C12.7368 17.9912 12.9917 17.7363 13.1515 17.4227C13.3332 17.0661 13.3332 16.5994 13.3332 15.666V9.33268C13.3332 8.39926 13.3332 7.93255 13.1515 7.57603C12.9917 7.26243 12.7368 7.00746 12.4232 6.84767C12.0666 6.66602 11.5999 6.66602 10.6665 6.66602H4.33317C3.39975 6.66602 2.93304 6.66602 2.57652 6.84767C2.26292 7.00746 2.00795 7.26243 1.84816 7.57603C1.6665 7.93255 1.6665 8.39926 1.6665 9.33268V15.666C1.6665 16.5994 1.6665 17.0661 1.84816 17.4227C2.00795 17.7363 2.26292 17.9912 2.57652 18.151C2.93304 18.3327 3.39975 18.3327 4.33317 18.3327Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_1012_2981">
                            <rect width="20" height="20" fill="white"/>
                          </clipPath>
                        </defs>
                    </svg>
                    <span class="text-gray-700 text-sm font-semibold">Copy</span>
                </button>
            </div>
            <button disabled class="flex justify-center items-center self-stretch gap-2 py-2.5 px-[18px] rounded-lg border border-gray-200 bg-gray-200 shadow-sm">
                <span class="text-gray-400 font-semibold">Generate API Token</span>
            </button>
        </div>
        {/if}
        <ApiDocumentation />
    </div>
</div>