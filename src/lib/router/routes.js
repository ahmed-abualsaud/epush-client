import NotFound from "../../components/error/NotFound.svelte"

import Signin from "../../components/auth/Signin.svelte"
import VerifyAccount from "../../components/auth/VerifyAccount.svelte"
import ResetPassword from "../../components/auth/ResetPassword.svelte"
import ForgotPassword from "../../components/auth/ForgotPassword.svelte"

import Home from "../../components/client/Home.svelte"
import Groups from "../../components/client/Groups.svelte"
import Senders from "../../components/client/Senders.svelte"
import Reports from "../../components/client/Reports.svelte"
import SMSTemplates from "../../components/client/SMSTemplates.svelte"
import BillingHistory from "../../components/client/BillingHistory.svelte"
import ScheduledMessages from "../../components/client/ScheduledMessages.svelte"


export const routes = [
	{ path: 'not-found', component: NotFound },

	{ path: 'signin', component: Signin },
	{ path: 'verify-account', component: VerifyAccount },
	{ path: 'reset-password', component: ResetPassword },
	{ path: 'forgot-password', component: ForgotPassword },

	{ path: 'home', component: Home },
	{ path: 'groups', component: Groups},
	{ path: 'senders', component: Senders },
	{ path: 'reports', component: Reports },
	{ path: 'sms-templates', component: SMSTemplates},
	{ path: 'billings-history', component: BillingHistory },
	{ path: 'scheduled-messages', component: ScheduledMessages}
]
