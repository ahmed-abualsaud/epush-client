<script>
	import Auth from "./Auth.layout.svelte"
	import Hint from "../shared/Hint.svelte"
	import Button from "../shared/Button.svelte"
	import OtpInput from "../shared/form/OtpInput.svelte"
	import FormHeader from "../shared/form/FormHeader.svelte"
	import CountDownButton from "../shared/CountDownButton.svelte"

    import { verifyAccount } from "../../api/authApi"
    import { forgetPassword } from "../../api/authApi"
    import { errorAlert, successAlert } from "$lib/helper/alert"
    import { navigate, refreshAndNavigate } from "$lib/router/router"

    let otp
    export let email

    const verifyMyAccount = async () => {
        if (otp.length < 4) {
            errorAlert("Verification code must be 4 numbers", 300, "md:left-[29vw]")
        } else {
            let result = await verifyAccount({email: email, otp: otp})
            ! result.success && errorAlert("Invalid verification code", 300, "md:left-[29vw]")
            result.success && await navigate("reset-password", {email: email})
        }
    }

    const forgetMyPassword = async () => {
        let result = await forgetPassword({email: email})
        ! result.success && errorAlert(result.message, 300, "md:left-[29vw]")
        result.success && successAlert("Verification code has been resent to email.", 300, "md:left-[29vw]");
        await refreshAndNavigate("verify-account", {email: email})
    }

    const backToLogin = async () => {
        await navigate("signin")
    }
</script>

<Auth>
    <div class="flex flex-col items-start gap-10 self-stretch">
        <Button onClick={backToLogin} text="Back to Login" clazz="flex justify-center items-center rounded-lg border border-gray-300 gap-2 py-2 px-3.5 text-gray-700 text-sm font-medium w-40 [box-shadow:0px_1px_2px_0px_rgba(16,_24,_40,_0.05)]">
            <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15.8333 9.99996H4.16666M4.16666 9.99996L9.99999 15.8333M4.16666 9.99996L9.99999 4.16663" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </Button>

        <div class="flex flex-col items-start gap-8 self-stretch">
            <div class="flex flex-col items-center self-stretch gap-6">
                <FormHeader header="Forgot password" text="Verify your account to your reset password "/>
                <Hint color="gray" hint="If you are user so you will find a verification code to your email, please check your linked email and phone number and enter the code to continue.">
                    <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M13.744 2.63358L21.272 7.52679C21.538 7.69969 21.671 7.78615 21.7674 7.90146C21.8527 8.00354 21.9167 8.12162 21.9558 8.24877C22 8.39241 22 8.55104 22 8.8683V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V8.8683C2 8.55104 2 8.39241 2.04417 8.24877C2.08327 8.12162 2.14735 8.00354 2.23265 7.90146C2.32901 7.78615 2.46201 7.69969 2.72802 7.52679L10.256 2.63358M13.744 2.63358C13.1127 2.22327 12.7971 2.01812 12.457 1.93829C12.1564 1.86774 11.8436 1.86774 11.543 1.93829C11.2029 2.01812 10.8873 2.22327 10.256 2.63358M13.744 2.63358L19.9361 6.65849C20.624 7.10559 20.9679 7.32915 21.087 7.61264C21.1911 7.86039 21.1911 8.13961 21.087 8.38737C20.9679 8.67086 20.624 8.89441 19.9361 9.34152L13.744 13.3664C13.1127 13.7767 12.7971 13.9819 12.457 14.0617C12.1564 14.1323 11.8436 14.1323 11.543 14.0617C11.2029 13.9819 10.8873 13.7767 10.256 13.3664L4.06386 9.34151C3.37601 8.89441 3.03209 8.67086 2.91297 8.38737C2.80888 8.13961 2.80888 7.86039 2.91297 7.61264C3.03209 7.32915 3.37601 7.1056 4.06386 6.65849L10.256 2.63358M21.5 19L14.8572 13M9.14282 13L2.5 19" stroke="#475467" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                </Hint>
            </div>

            <div class="flex flex-col items-start gap-6 self-stretch">
                <OtpInput bind:otp={otp} />

                <div class="flex flex-col items-center self-stretch gap-6">
                    <Button onClick={verifyMyAccount} text="Verify" clazz="flex justify-center items-center gap-2 self-stretch py-[10px] px-[18px] border rounded-lg border-primary-600 bg-primary-600 text-white text-base font-semibold [box-shadow:0px_1px_2px_0px_rgba(16,_24,_40,_0.05)]"/>
                    <CountDownButton onClick={forgetMyPassword} interval={60} buttonText="Resend Code" appendText="to Resend Code"/>
                </div>
            </div>

            <div class="flex justify-center items-baseline gap-1 self-stretch">
                <div class="text-gray-600 text-sm font-normal">Don’t remember your email?</div>
                <Button text="Contact Us" clazz="text-primary-700 text-sm font-semibold"/>
            </div>
        </div>
    </div>
</Auth>
