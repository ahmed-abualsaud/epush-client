<script>
	import Modal from "../../shared/Modal.svelte"

    import { empty } from "$lib/helper/utils"
    import { message } from "$lib/helper/store"

    export let currentStep = ""
</script>

<Modal clazz="h-[700px] bg-secondary-800" >
    <div class="flex flex-col items-start self-stretch p-8 w-60">
        <div class="flex flex-col items-start self-stretch">

            <div class="flex items-start self-stretch gap-3">
                <div class="flex flex-col items-center self-stretch pb-1 gap-1">
                    <div class="flex justify-center items-center w-6 h-6 rounded-xl bg-secondary-800 [box-shadow:0px_0px_0px_4px_#10493A]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            {#if currentStep == "language-and-sender"}
                            <rect width="24" height="24" rx="12" fill="#ACDC3F"/>                                    
                            {/if}
                            <circle cx="12" cy="12" r="4" fill="white"/>
                        </svg>
                    </div>
                    <div class="w-0.5 h-[54px] bg-gray-200 rounded-sm"></div>
                </div>
                <div class="flex flex-col items-start flex-1 pt-0.5 pb-6">
                    <span class="self-stretch {currentStep == "language-and-sender" ? "text-primary-300" : "text-white"} text-sm font-semibold">Language & Sender</span>
                    <span class="self-stretch {currentStep == "language-and-sender" ? "text-primary-400" : "text-gray-100"} text-sm font-normal">Select message and sender name</span>
                </div>
            </div>

            <div class="flex items-start self-stretch gap-3">
                <div class="flex flex-col items-center self-stretch pb-1 gap-1">
                    <div class="flex justify-center items-center w-6 h-6 rounded-xl bg-secondary-800 [box-shadow:0px_0px_0px_4px_#10493A]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            {#if currentStep == "numbers"}
                            <rect width="24" height="24" rx="12" fill="#ACDC3F"/>                                    
                            {/if}
                            <circle cx="12" cy="12" r="4" fill="white"/>
                        </svg>
                    </div>
                    <div class="w-0.5 h-[54px] bg-gray-200 rounded-sm"></div>
                </div>
                <div class="flex flex-col items-start flex-1 pt-0.5 pb-6">
                    <div class="self-stretch {currentStep == "numbers" ? "text-primary-300" : "text-white"} text-sm font-semibold">Numbers</div>
                    <div class="self-stretch {currentStep == "numbers" ? "text-primary-400" : "text-gray-100"} text-sm font-normal">Add recipient numbers</div>
                </div>
            </div>

            <div class="flex items-start self-stretch gap-3">
                <div class="flex flex-col items-center self-stretch pb-1 gap-1">
                    <div class="flex justify-center items-center w-6 h-6 rounded-xl bg-secondary-800 [box-shadow:0px_0px_0px_4px_#10493A]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            {#if currentStep == "message"}
                            <rect width="24" height="24" rx="12" fill="#ACDC3F"/>                                    
                            {/if}
                            <circle cx="12" cy="12" r="4" fill="white"/>
                        </svg>
                    </div>
                    <div class="w-0.5 h-[54px] bg-gray-200 rounded-sm"></div>
                </div>
                <div class="flex flex-col items-start flex-1 pt-0.5 pb-6">
                    <div class="self-stretch {currentStep == "message" ? "text-primary-300" : "text-white"} text-sm font-semibold">Message</div>
                    <div class="self-stretch {currentStep == "message" ? "text-primary-400" : "text-gray-100"} text-sm font-normal">Enter the content of the message</div>
                </div>
            </div>

            <div class="flex items-start self-stretch gap-3">
                <div class="flex flex-col items-center self-stretch pb-1 gap-1">
                    <div class="flex justify-center items-center w-6 h-6 rounded-xl bg-secondary-800 [box-shadow:0px_0px_0px_4px_#10493A]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            {#if currentStep == "date-and-push"}
                            <rect width="24" height="24" rx="12" fill="#ACDC3F"/>                                    
                            {/if}
                            <circle cx="12" cy="12" r="4" fill="white"/>
                        </svg>
                    </div>
                </div>
                <div class="flex flex-col items-start flex-1 pt-0.5 pb-6">
                    <div class="self-stretch {currentStep == "date-and-push" ? "text-primary-300" : "text-white"} text-sm font-semibold">Date and Push</div>
                    <div class="self-stretch {currentStep == "date-and-push" ? "text-primary-400" : "text-gray-100"} text-sm font-normal">Choose send date and push message</div>
                </div>
            </div>

        </div>
    </div>
    <div class="flex flex-col items-center self-stretch rounded-xl bg-white shadow-xl w-[800px] overflow-hidden">
        <div class="flex flex-col items-center self-stretch bg-white mb-5">
            <div class="flex flex-col items-start self-stretch gap-4 pt-6 px-6 bg-white">
                <div class="flex justify-center items-center p-3 w-12 h-12 rounded-[10px] border border-gray-200 bg-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 13.5V7.5M9 10.5H15M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z" stroke="#344054" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="flex items-center self-stretch gap-4">
                    <div class="flex flex-col items-start flex-1 gap-1 self-stretch">
                        <span class="self-stretch text-gray-900 text-lg font-semibold">New Message</span>
                        <span class="self-stretch text-gray-600 text-sm font-semibold">Send bulk and customize your sms</span>
                    </div>
                    {#if ! (empty($message.language) || empty($message.sender))}
                    <div class="flex items-start gap-2">
                        <div class="flex items-center gap-1 ps-2 pe-2.5 py-1 rounded-2xl bg-blue-50 mix-blend-multiply">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <g clip-path="url(#clip0_658_2358)">
                                  <path d="M1 6H11M1 6C1 8.76142 3.23858 11 6 11M1 6C1 3.23858 3.23858 1 6 1M11 6C11 8.76142 8.76142 11 6 11M11 6C11 3.23858 8.76142 1 6 1M6 1C7.25064 2.36918 7.96138 4.14602 8 6C7.96138 7.85398 7.25064 9.63082 6 11M6 1C4.74936 2.36918 4.03862 4.14602 4 6C4.03862 7.85398 4.74936 9.63082 6 11" stroke="#0BA5EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_658_2358">
                                    <rect width="12" height="12" fill="white"/>
                                  </clipPath>
                                </defs>
                            </svg>
                            <span class="text-blue-light-700 text-center text-sm font-medium">{$message.language?.name}</span>
                        </div>
                        <div class="flex items-center gap-1 ps-2 pe-2.5 py-1 rounded-2xl bg-blue-50 mix-blend-multiply">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <g clip-path="url(#clip0_658_14873)">
                                  <path d="M6.00023 9.50016V6.00016M6.14598 9.54249L9.63522 10.7106C9.90867 10.8021 10.0454 10.8479 10.1297 10.8151C10.2029 10.7865 10.2585 10.7252 10.2797 10.6496C10.3041 10.5625 10.2451 10.4309 10.1272 10.1677L6.38301 1.81134C6.26769 1.55399 6.21004 1.42532 6.12972 1.38545C6.05994 1.35081 5.97801 1.35068 5.90812 1.38509C5.82767 1.42471 5.7696 1.5532 5.65347 1.81017L1.87622 10.1682C1.75737 10.4312 1.69795 10.5627 1.72211 10.6499C1.7431 10.7256 1.79848 10.7871 1.87164 10.8158C1.95589 10.8489 2.09283 10.8035 2.36673 10.7126L5.89299 9.54216C5.93994 9.52658 5.96342 9.51879 5.98743 9.51571C6.00874 9.51298 6.03031 9.51301 6.05161 9.51579C6.07561 9.51893 6.09906 9.52678 6.14598 9.54249Z" stroke="#0BA5EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                <defs>
                                  <clipPath id="clip0_658_14873">
                                    <rect width="12" height="12" fill="white"/>
                                  </clipPath>
                                </defs>
                            </svg>
                            <span class="text-blue-light-700 text-center text-sm font-medium">{$message.sender?.name}</span>
                        </div>
                    </div>
                    {/if}
                </div>
            </div>
        </div>

        <div class="relative flex flex-col items-start flex-1 self-stretch gap-5 px-6">
            <slot />
        </div>
        
        <div class="flex flex-col justify-center items-center self-stretch">
            <div class="flex flex-col items-start self-stretch pb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1" viewBox="0 0 800 1" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M800 1H0V0H800V1Z" fill="#EAECF0"/>
                </svg>
            </div>
            <slot name="footer" />
        </div>
    </div>
</Modal>