<script>
	import Auth from "./Auth.layout.svelte"
	import Button from "../shared/Button.svelte"
	import Form from "../shared/form/Form.svelte"
	import Input from "../shared/form/Input.svelte"
	import FormInputs from "../shared/form/FormInputs.svelte"
	import FormHeader from "../shared/form/FormHeader.svelte"

    import { navigate } from "$lib/router/router"
    import { errorAlert } from "$lib/helper/alert"
    import { forgetPassword } from "../../api/authApi"


    const forgetMyPassword = async (e) => {
        let data = Object.fromEntries(new FormData(e.target))
        let inputs = {email: data.email}
        let result = await forgetPassword(inputs)
        ! result.success && errorAlert(result.message, 300, "md:left-[29vw]");
        result.success && await navigate("verify-account", inputs)
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
            <FormHeader header="Forgot password" text="Enter your email registered to epush"/>

            <Form submitText="Find Account" onSubmit={forgetMyPassword}>
                <FormInputs>
                    <Input name="email" type="text" placeholder="Enter your email" validation="required">
                        <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M1.66666 5.83325L8.47076 10.5961C9.02173 10.9818 9.29722 11.1746 9.59688 11.2493C9.86157 11.3153 10.1384 11.3153 10.4031 11.2493C10.7028 11.1746 10.9782 10.9818 11.5292 10.5961L18.3333 5.83325M5.66666 16.6666H14.3333C15.7335 16.6666 16.4335 16.6666 16.9683 16.3941C17.4387 16.1544 17.8212 15.772 18.0608 15.3016C18.3333 14.7668 18.3333 14.0667 18.3333 12.6666V7.33325C18.3333 5.93312 18.3333 5.23306 18.0608 4.69828C17.8212 4.22787 17.4387 3.84542 16.9683 3.60574C16.4335 3.33325 15.7335 3.33325 14.3333 3.33325H5.66666C4.26653 3.33325 3.56646 3.33325 3.03168 3.60574C2.56128 3.84542 2.17882 4.22787 1.93914 4.69828C1.66666 5.23306 1.66666 5.93312 1.66666 7.33325V12.6666C1.66666 14.0667 1.66666 14.7668 1.93914 15.3016C2.17882 15.772 2.56128 16.1544 3.03168 16.3941C3.56646 16.6666 4.26653 16.6666 5.66666 16.6666Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </Input>
                </FormInputs>
            </Form>

            <div class="flex justify-center items-baseline gap-1 self-stretch">
                <div class="text-gray-600 text-sm font-normal">Don’t remember your email?</div>
                <Button text="Contact Us" clazz="text-primary-700 text-sm font-semibold"/>
            </div>
        </div>
    </div>
</Auth>
