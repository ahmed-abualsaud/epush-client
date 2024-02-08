<script>
	import Auth from "./Auth.layout.svelte"
	import Hint from "../shared/Hint.svelte"
	import Button from "../shared/Button.svelte"
	import Form from "../shared/form/Form.svelte"
	import Input from "../shared/form/Input.svelte"
	import FormHeader from "../shared/form/FormHeader.svelte"

    import { navigate } from "$lib/router/router"
    import { resetPassword } from "../../api/authApi"

    export let email

    const resetMyPassword = async (e) => {
        let data = Object.fromEntries(new FormData(e.target))
        await resetPassword({email: email, password: data.password, password_confirmation: data.password})
        navigate("signin", {afterReset: true})
    }
</script>

<Auth>
    <div class="flex flex-col items-start gap-8 self-stretch">
        <FormHeader header="Reset Password" text="Enter your new password to use it later"/>

        <Hint color="primary" hint="Welcome back, you can now enter your new password and use it in the future.">
            <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M16 18L18 20L22 16M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="#6D9A16" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </Hint>

        <Form submitText="Reset Password" onSubmit={resetMyPassword}>
            <div class="flex flex-col items-start gap-5 self-stretch">
                <Input name="password" type="password" placeholder="••••••••" validation="required|password">
                    <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M14.1667 8.33333V6.66667C14.1667 4.36548 12.3012 2.5 10 2.5C7.69882 2.5 5.83334 4.36548 5.83334 6.66667V8.33333M10 12.0833V13.75M7.33334 17.5H12.6667C14.0668 17.5 14.7669 17.5 15.3017 17.2275C15.7721 16.9878 16.1545 16.6054 16.3942 16.135C16.6667 15.6002 16.6667 14.9001 16.6667 13.5V12.3333C16.6667 10.9332 16.6667 10.2331 16.3942 9.69836C16.1545 9.22795 15.7721 8.8455 15.3017 8.60582C14.7669 8.33333 14.0668 8.33333 12.6667 8.33333H7.33334C5.93321 8.33333 5.23315 8.33333 4.69837 8.60582C4.22796 8.8455 3.84551 9.22795 3.60583 9.69836C3.33334 10.2331 3.33334 10.9332 3.33334 12.3333V13.5C3.33334 14.9001 3.33334 15.6002 3.60583 16.135C3.84551 16.6054 4.22796 16.9878 4.69837 17.2275C5.23315 17.5 5.93321 17.5 7.33334 17.5Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </Input>
                <Input label="Re-Enter Password" name="password-confirmation" type="password" placeholder="••••••••"  validation="required|password_confirmation">
                    <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M14.1667 8.33333V6.66667C14.1667 4.36548 12.3012 2.5 10 2.5C7.69882 2.5 5.83334 4.36548 5.83334 6.66667V8.33333M10 12.0833V13.75M7.33334 17.5H12.6667C14.0668 17.5 14.7669 17.5 15.3017 17.2275C15.7721 16.9878 16.1545 16.6054 16.3942 16.135C16.6667 15.6002 16.6667 14.9001 16.6667 13.5V12.3333C16.6667 10.9332 16.6667 10.2331 16.3942 9.69836C16.1545 9.22795 15.7721 8.8455 15.3017 8.60582C14.7669 8.33333 14.0668 8.33333 12.6667 8.33333H7.33334C5.93321 8.33333 5.23315 8.33333 4.69837 8.60582C4.22796 8.8455 3.84551 9.22795 3.60583 9.69836C3.33334 10.2331 3.33334 10.9332 3.33334 12.3333V13.5C3.33334 14.9001 3.33334 15.6002 3.60583 16.135C3.84551 16.6054 4.22796 16.9878 4.69837 17.2275C5.23315 17.5 5.93321 17.5 7.33334 17.5Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </Input>

                <div class="flex py-1 ps-1 pe-2.5 items-center self-stretch gap-2 rounded-2xl bg-warn-50 mix-blend-multiply">
                    <div class="flex py-0.5 px-2 rounded-2xl bg-white">
                        <div class="text-warn-700 text-center text-[12px] font-medium leading-[18px]">Note</div>
                    </div>
                    <div class="flex items-center flex-1 gap-1">
                        <div class="text-warn-700 flex-1 text-[12px] font-medium leading-[18px]">
                            The minimum password length is 8 characters and must contain numbers, lowercase letters, uppercase letters, and at least one special character.
                        </div>
                    </div>
                </div>
            </div>
        </Form>

        <div class="flex justify-center items-baseline gap-1 self-stretch">
            <div class="text-gray-600 text-sm font-normal">Don’t remember your email?</div>
            <Button text="Contact Us" clazz="text-primary-700 text-sm font-semibold"/>
        </div>
    </div>
</Auth>
