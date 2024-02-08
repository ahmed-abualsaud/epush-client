import NotFound from "../../components/error/NotFound.svelte"

import Signin from "../../components/auth/Signin.svelte"
import VerifyAccount from "../../components/auth/VerifyAccount.svelte"
import ResetPassword from "../../components/auth/ResetPassword.svelte"
import ForgotPassword from "../../components/auth/ForgotPassword.svelte"

import Home from "../../components/client/Home.svelte"
import Reports from "../../components/client/Reports.svelte"
import SavedGroups from "../../components/client/Group/SavedGroups.svelte"
import ScheduledMessages from "../../components/client/ScheduledMessages.svelte"


export const routes = [
	{ path: 'not-found', component: NotFound },

	{ path: 'signin', component: Signin },
	{ path: 'verify-account', component: VerifyAccount },
	{ path: 'reset-password', component: ResetPassword },
	{ path: 'forgot-password', component: ForgotPassword },

	{ path: 'home', component: Home },
	{ path: 'reports', component: Reports },
	{ path: "groups", component: SavedGroups},
	{ path: 'scheduled-messages', component: ScheduledMessages}
]
