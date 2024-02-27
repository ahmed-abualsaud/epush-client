<script>
	import Modal from "../../shared/Modal.svelte"

    import { hideModal } from "$lib/helper/modal"
    import { successAlert, errorAlert } from "$lib/helper/alert"

    const copyToClipboard = (e) => {
        navigator.clipboard.writeText(e.target.innerText)
        .then(() => {
            successAlert('Copied to clipboard', 2)
        })
        .catch(err => {
            errorAlert('Error copying to clipboard: ' + err.message, 5)
        })
    }

    const close = async () => {
        hideModal()
    }
</script>

<Modal>
    <div class="flex flex-col items-center self-stretch rounded-xl bg-white shadow-xl w-[811px] overflow-hidden">
        <div class="flex flex-col items-center self-stretch bg-white mb-5">
            <div class="flex flex-col items-start self-stretch gap-4 pt-6 px-6 bg-white">
                <div class="flex justify-center items-center p-3 w-12 h-12 rounded-[10px] border border-gray-200 bg-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                        <path d="M13 5.42578C13 6.53035 10.5376 7.42578 7.5 7.42578C4.46243 7.42578 2 6.53035 2 5.42578M13 5.42578C13 4.32121 10.5376 3.42578 7.5 3.42578C4.46243 3.42578 2 4.32121 2 5.42578M13 5.42578V9.88293C11.7785 10.2498 11 10.8047 11 11.4258M2 5.42578V17.4258C2 18.5304 4.46243 19.4258 7.5 19.4258C8.82963 19.4258 10.0491 19.2542 11 18.9686V11.4258M2 9.42578C2 10.5304 4.46243 11.4258 7.5 11.4258C8.82963 11.4258 10.0491 11.2542 11 10.9686M2 13.4258C2 14.5304 4.46243 15.4258 7.5 15.4258C8.82963 15.4258 10.0491 15.2542 11 14.9686M22 11.4258C22 12.5304 19.5376 13.4258 16.5 13.4258C13.4624 13.4258 11 12.5304 11 11.4258M22 11.4258C22 10.3212 19.5376 9.42578 16.5 9.42578C13.4624 9.42578 11 10.3212 11 11.4258M22 11.4258V19.4258C22 20.5304 19.5376 21.4258 16.5 21.4258C13.4624 21.4258 11 20.5304 11 19.4258V11.4258M22 15.4258C22 16.5304 19.5376 17.4258 16.5 17.4258C13.4624 17.4258 11 16.5304 11 15.4258" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="flex items-center self-stretch gap-4">
                    <div class="flex flex-col items-start flex-1 gap-1 self-stretch">
                        <span class="self-stretch text-gray-900 text-lg font-semibold">Add Balance</span>
                        <span class="self-stretch text-gray-600 text-sm">Add new balance to your wallet so you can push messages</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col items-start self-stretch gap-4 px-6">
            <div class="flex items-center self-stretch gap-6 p-6 rounded-lg bg-primary-50">
                <div class="flex flex-col justify-end items-start flex-1 gap-1.5">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-semibold">Fawry</span>
                        <img src="image/billing/payment-methods.png" alt="Payment Methods" />
                    </div>
                    <span class="self-stretch text-sm">Pay by Credit/Debit Cards or through Fawry Network</span>
                </div>
                <button class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg border border-primary-600 bg-primary-600 shadow-sm">
                    <span class="text-white text-sm font-semibold">Go Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                        <path d="M4.16699 10.4993H15.8337M15.8337 10.4993L10.0003 4.66602M15.8337 10.4993L10.0003 16.3327" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>

            <div class="flex items-center self-stretch gap-6 p-6 rounded-lg bg-blue-50">
                <div class="flex flex-col justify-end items-start flex-1 gap-1.5">
                    <img src="image/billing/bank-transfer.png" alt="Bank Transfer" />
                    <span class="self-stretch text-sm">We facilitate bank transfers for your convenience. To make a payment, please send the funds to our account at CIB (Commercial International Bank) using the following details:</span>
                </div>
                <div class="flex flex-col justify-end items-start gap-1.5  w-[56.5%]">
                    <div class="flex justify-between items-center self-stretch">
                        <span class="text-sm font-medium w-[140px]">Account Name</span>
                        <button data-title="click to copy" on:click={copyToClipboard} class="flex justify-between items-center flex-1 py-1 pe-2.5 ps-3 rounded-2xl bg-blue-50 mix-blend-multiply">
                            <span class="text-blue-light-700 text-center text-sm font-medium">E- Push for integrated solutions</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                                <g clip-path="url(#clip0_658_14965)">
                                  <path d="M5.25 1.57757C4.91247 1.58214 4.70985 1.60168 4.54601 1.68517C4.35785 1.78104 4.20487 1.93402 4.10899 2.12218C4.02551 2.28602 4.00597 2.48865 4.0014 2.82617M9.75 1.57757C10.0875 1.58214 10.2902 1.60168 10.454 1.68517C10.6422 1.78104 10.7951 1.93402 10.891 2.12218C10.9745 2.28602 10.994 2.48864 10.9986 2.82617M10.9986 7.32617C10.994 7.66369 10.9745 7.86632 10.891 8.03016C10.7951 8.21832 10.6422 8.3713 10.454 8.46718C10.2902 8.55066 10.0875 8.5702 9.75 8.57477M11 4.57617V5.57617M7.00003 1.57617H7.99998M2.6 11.5762H6.4C6.96005 11.5762 7.24008 11.5762 7.45399 11.4672C7.64215 11.3713 7.79513 11.2183 7.89101 11.0302C8 10.8163 8 10.5362 8 9.97617V6.17617C8 5.61612 8 5.33609 7.89101 5.12218C7.79513 4.93402 7.64215 4.78104 7.45399 4.68517C7.24008 4.57617 6.96005 4.57617 6.4 4.57617H2.6C2.03995 4.57617 1.75992 4.57617 1.54601 4.68517C1.35785 4.78104 1.20487 4.93402 1.10899 5.12218C1 5.33609 1 5.61612 1 6.17617V9.97617C1 10.5362 1 10.8163 1.10899 11.0302C1.20487 11.2183 1.35785 11.3713 1.54601 11.4672C1.75992 11.5762 2.03995 11.5762 2.6 11.5762Z" stroke="#2E90FA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_658_14965">
                                    <rect width="12" height="12" fill="white" transform="translate(0 0.576172)"/>
                                  </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>

                    <div class="flex justify-between items-center self-stretch">
                        <span class="text-sm font-medium w-[140px]">Account Number</span>
                        <button data-title="click to copy" on:click={copyToClipboard} class="flex justify-between items-center flex-1 py-1 pe-2.5 ps-3 rounded-2xl bg-blue-50 mix-blend-multiply">
                            <span class="text-blue-light-700 text-center text-sm font-medium">100032800933</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                                <g clip-path="url(#clip0_658_14965)">
                                  <path d="M5.25 1.57757C4.91247 1.58214 4.70985 1.60168 4.54601 1.68517C4.35785 1.78104 4.20487 1.93402 4.10899 2.12218C4.02551 2.28602 4.00597 2.48865 4.0014 2.82617M9.75 1.57757C10.0875 1.58214 10.2902 1.60168 10.454 1.68517C10.6422 1.78104 10.7951 1.93402 10.891 2.12218C10.9745 2.28602 10.994 2.48864 10.9986 2.82617M10.9986 7.32617C10.994 7.66369 10.9745 7.86632 10.891 8.03016C10.7951 8.21832 10.6422 8.3713 10.454 8.46718C10.2902 8.55066 10.0875 8.5702 9.75 8.57477M11 4.57617V5.57617M7.00003 1.57617H7.99998M2.6 11.5762H6.4C6.96005 11.5762 7.24008 11.5762 7.45399 11.4672C7.64215 11.3713 7.79513 11.2183 7.89101 11.0302C8 10.8163 8 10.5362 8 9.97617V6.17617C8 5.61612 8 5.33609 7.89101 5.12218C7.79513 4.93402 7.64215 4.78104 7.45399 4.68517C7.24008 4.57617 6.96005 4.57617 6.4 4.57617H2.6C2.03995 4.57617 1.75992 4.57617 1.54601 4.68517C1.35785 4.78104 1.20487 4.93402 1.10899 5.12218C1 5.33609 1 5.61612 1 6.17617V9.97617C1 10.5362 1 10.8163 1.10899 11.0302C1.20487 11.2183 1.35785 11.3713 1.54601 11.4672C1.75992 11.5762 2.03995 11.5762 2.6 11.5762Z" stroke="#2E90FA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_658_14965">
                                    <rect width="12" height="12" fill="white" transform="translate(0 0.576172)"/>
                                  </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>

                    <div class="flex justify-between items-center self-stretch">
                        <span class="text-sm font-medium w-[140px]">Bank</span>
                        <button data-title="click to copy" on:click={copyToClipboard} class="w-[calc(100%-140px)] flex justify-between items-center flex-1 py-1 pe-2.5 ps-3 rounded-2xl bg-blue-50 mix-blend-multiply gap-2">
                            <span class="text-blue-light-700 text-center text-sm font-medium truncate">CIB (Commercial International Bank)</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                                <g clip-path="url(#clip0_658_14965)">
                                  <path d="M5.25 1.57757C4.91247 1.58214 4.70985 1.60168 4.54601 1.68517C4.35785 1.78104 4.20487 1.93402 4.10899 2.12218C4.02551 2.28602 4.00597 2.48865 4.0014 2.82617M9.75 1.57757C10.0875 1.58214 10.2902 1.60168 10.454 1.68517C10.6422 1.78104 10.7951 1.93402 10.891 2.12218C10.9745 2.28602 10.994 2.48864 10.9986 2.82617M10.9986 7.32617C10.994 7.66369 10.9745 7.86632 10.891 8.03016C10.7951 8.21832 10.6422 8.3713 10.454 8.46718C10.2902 8.55066 10.0875 8.5702 9.75 8.57477M11 4.57617V5.57617M7.00003 1.57617H7.99998M2.6 11.5762H6.4C6.96005 11.5762 7.24008 11.5762 7.45399 11.4672C7.64215 11.3713 7.79513 11.2183 7.89101 11.0302C8 10.8163 8 10.5362 8 9.97617V6.17617C8 5.61612 8 5.33609 7.89101 5.12218C7.79513 4.93402 7.64215 4.78104 7.45399 4.68517C7.24008 4.57617 6.96005 4.57617 6.4 4.57617H2.6C2.03995 4.57617 1.75992 4.57617 1.54601 4.68517C1.35785 4.78104 1.20487 4.93402 1.10899 5.12218C1 5.33609 1 5.61612 1 6.17617V9.97617C1 10.5362 1 10.8163 1.10899 11.0302C1.20487 11.2183 1.35785 11.3713 1.54601 11.4672C1.75992 11.5762 2.03995 11.5762 2.6 11.5762Z" stroke="#2E90FA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_658_14965">
                                    <rect width="12" height="12" fill="white" transform="translate(0 0.576172)"/>
                                  </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div> 
                </div>
            </div>

            <div class="flex items-center self-stretch gap-6 p-6 rounded-lg bg-purple-50">
                <div class="flex flex-col justify-end items-start flex-1 gap-1.5">
                    <img src="image/billing/mobile-wallets.png" alt="Mobile Wallets" />
                    <span class="self-stretch text-sm">We provide you with a seamless payment experience by supporting transfers through Vodafone Cash. transfer the funds to our Vodafone Cash account using the following details:</span>
                </div>
                <div class="flex flex-col items-start gap-4 w-[56.5%]">
                    <span class="text-sm font-medium">Wallet</span>
                    <button data-title="click to copy" on:click={copyToClipboard} class="flex justify-between items-center self-stretch py-1 pe-2.5 ps-3 rounded-2xl bg-purple-50 mix-blend-multiply">
                        <span class="text-blue-light-700 text-center text-sm font-medium">01008271597</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                            <g clip-path="url(#clip0_658_15403)">
                              <path d="M5.25 1.57757C4.91247 1.58214 4.70985 1.60168 4.54601 1.68517C4.35785 1.78104 4.20487 1.93402 4.10899 2.12218C4.02551 2.28602 4.00597 2.48865 4.0014 2.82617M9.75 1.57757C10.0875 1.58214 10.2902 1.60168 10.454 1.68517C10.6422 1.78104 10.7951 1.93402 10.891 2.12218C10.9745 2.28602 10.994 2.48864 10.9986 2.82617M10.9986 7.32617C10.994 7.66369 10.9745 7.86632 10.891 8.03016C10.7951 8.21832 10.6422 8.3713 10.454 8.46718C10.2902 8.55066 10.0875 8.5702 9.75 8.57477M11 4.57617V5.57617M7.00003 1.57617H7.99998M2.6 11.5762H6.4C6.96005 11.5762 7.24008 11.5762 7.45399 11.4672C7.64215 11.3713 7.79513 11.2183 7.89101 11.0302C8 10.8163 8 10.5362 8 9.97617V6.17617C8 5.61612 8 5.33609 7.89101 5.12218C7.79513 4.93402 7.64215 4.78104 7.45399 4.68517C7.24008 4.57617 6.96005 4.57617 6.4 4.57617H2.6C2.03995 4.57617 1.75992 4.57617 1.54601 4.68517C1.35785 4.78104 1.20487 4.93402 1.10899 5.12218C1 5.33609 1 5.61612 1 6.17617V9.97617C1 10.5362 1 10.8163 1.10899 11.0302C1.20487 11.2183 1.35785 11.3713 1.54601 11.4672C1.75992 11.5762 2.03995 11.5762 2.6 11.5762Z" stroke="#7A5AF8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_658_15403">
                                <rect width="12" height="12" fill="white" transform="translate(0 0.576172)"/>
                              </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div class="flex flex-col justify-center items-start self-stretch pt-8">
            <div class="flex flex-col items-start self-stretch pb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1" viewBox="0 0 800 1" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M800 1H0V0H800V1Z" fill="#EAECF0"/>
                </svg>
            </div>
            <div class="flex justify-end items-center flex-1 self-stretch pb-6 px-6">
                <button on:click={close} class="flex justify-center items-center gap-2 py-2.5 px-[18px] rounded-lg border border-gray-300 bg-white shadow-sm">
                    <span class="text-gray-700 font-semibold">Close</span>
                </button>
            </div>
        </div>
    </div>
</Modal>