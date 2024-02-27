import { request, HttpMethod } from "./api"
import { navigate } from "$lib/router/router"
import { setAccessToken, setAuthenticatedUser, setAuthenticatedUserRoles } from "$lib/helper/auth"

export const signin = async (inputs) =>
{
    const user = await request(HttpMethod.POST, "/auth/user/signin", inputs)
    await setAccessToken(user?.token)
    await setAuthenticatedUser(user?.user)
    await setAuthenticatedUserRoles(user?.roles)
    return user
}

export const signout = async () => 
{
    await request(HttpMethod.POST, "/auth/user/signout")
    await setAccessToken("")
    await navigate("/")
}

export const verifyAccount = async (inputs) => 
{
    return request(HttpMethod.POST, "/auth/user/verify-account", inputs)
}

export const forgetPassword = async (inputs) => 
{
    return request(HttpMethod.POST, "/auth/user/forget-password", inputs)
}

export const resetPassword = async (inputs) => 
{
    return request(HttpMethod.POST, "/auth/user/reset-password", inputs)
}

export const changePassword = async (inputs) => 
{
    return request(HttpMethod.POST, "/auth/user/change-password", inputs)
}