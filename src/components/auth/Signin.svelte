<script>
	import Auth from "./Auth.layout.svelte"
	import Alert from "../shared/Alert.svelte"
	import Button from "../shared/Button.svelte"
	import Form from "../shared/form/Form.svelte"
	import Input from "../shared/form/Input.svelte"
	import FormHeader from "../shared/form/FormHeader.svelte"
	import RememberMe from "../shared/form/RememberMe.svelte"
	import FormInputs from "../shared/form/FormInputs.svelte"

	import { empty } from "$lib/helper/utils"
    import { signin } from "../../api/authApi"
    import { navigate } from "$lib/router/router"
    import { successAlert } from "$lib/helper/alert"
    import { navigateToDashboard } from "$lib/router/router"

    export let afterReset = false

    let rememberMe
    const login = async (e) => {
        let data = Object.fromEntries(new FormData(e.target));
        data.remember_me = rememberMe
        await signin(data)
        successAlert("Login successfully! welcome back.", 1, "md:left-[29vw]")
        setTimeout(navigateToDashboard, 1000)
    }

    const forgotPassword = () => {
        navigate("forgot-password")
    }
</script>

<Auth>
    <div class="flex flex-col items-start gap-8 self-stretch">
        <FormHeader header="Log in" text="Welcome back! Please enter your details."/>

        <Form submitText="Log in" onSubmit={login}>
            <FormInputs>
                <Input name="username" type="text" placeholder="Enter your username" validation="required">
                    <svg slot="icon" xmlns="http://www.w3.org/2000/svg" height="17" width="17" viewBox="0 0 448 512">
                        <path fill="#79808b" d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
                    </svg>
                </Input>
                <Input name="password" type="password" placeholder="••••••••"  validation="required">
                    <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M14.1667 8.33333V6.66667C14.1667 4.36548 12.3012 2.5 10 2.5C7.69882 2.5 5.83334 4.36548 5.83334 6.66667V8.33333M10 12.0833V13.75M7.33334 17.5H12.6667C14.0668 17.5 14.7669 17.5 15.3017 17.2275C15.7721 16.9878 16.1545 16.6054 16.3942 16.135C16.6667 15.6002 16.6667 14.9001 16.6667 13.5V12.3333C16.6667 10.9332 16.6667 10.2331 16.3942 9.69836C16.1545 9.22795 15.7721 8.8455 15.3017 8.60582C14.7669 8.33333 14.0668 8.33333 12.6667 8.33333H7.33334C5.93321 8.33333 5.23315 8.33333 4.69837 8.60582C4.22796 8.8455 3.84551 9.22795 3.60583 9.69836C3.33334 10.2331 3.33334 10.9332 3.33334 12.3333V13.5C3.33334 14.9001 3.33334 15.6002 3.60583 16.135C3.84551 16.6054 4.22796 16.9878 4.69837 17.2275C5.23315 17.5 5.93321 17.5 7.33334 17.5Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </Input>
            </FormInputs>
            <div class="flex items-center self-stretch">
                <RememberMe bind:remember={rememberMe} text="Remember for 30 days" />
                <Button onClick={forgotPassword} text="Forgot password" clazz="text-primary-700 text-sm font-semibold"/>
            </div>
        </Form>

        <div class="flex justify-center items-baseline gap-1 self-stretch">
            <div class="text-gray-600 text-sm font-normal">Not a client?</div>
            <Button text="Contact Us" clazz="text-primary-700 text-sm font-semibold"/>
        </div>
    </div>
</Auth>

{#if ! empty(afterReset) && afterReset === true}
<Alert type="success" message="Password Reset Successfully!" description="You can now use your new password to login to your account." clazz="bottom-[3vh] left-[50vw] md:left-[29vw] -translate-x-1/2"/>
{/if}
