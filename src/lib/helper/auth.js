import { empty } from "./utils"
import { writable, get } from 'svelte/store'
import { writeData, readData } from './authDB'

const authUser = writable({})
const accessToken = writable("")
const authUserRoles = writable([])

export const getAuthenticatedUser = async () => 
{
    let user = get(authUser)
    if (! empty(user)) {return user}
    let userStr = await readData('user')
    user = empty(userStr) ? {} : JSON.parse(userStr)
    authUser.set(user)
    return user
}

export const setAuthenticatedUser = async (user) => 
{
    authUser.set(user)
    await writeData('user', JSON.stringify(user));
}

export const updateAuthenticatedUser = async (user) => 
{
    let usr = await getAuthenticatedUser()

    if (user?.id === usr?.id) {
        await setAuthenticatedUser(user);
    }
}


export const getAccessToken = async () => 
{
    let access_token = get(accessToken)
    if (! empty(access_token)) {return access_token}
    access_token = await readData('access_token')
    accessToken.set(access_token)
    return access_token
}

export const setAccessToken = async (access_token) => 
{
    accessToken.set(access_token)
    await writeData('access_token', access_token);
}


export const getAuthenticatedUserRoles = async () => 
{
    let userRoles = get(authUserRoles)
    if (! empty(userRoles)) {return userRoles}
    let rolesStr = await readData('roles')
    userRoles = empty(rolesStr) ? [] : JSON.parse(rolesStr)
    authUserRoles.set(userRoles)
    return userRoles
}

export const setAuthenticatedUserRoles = async (roles) => 
{
    authUserRoles.set(roles)
    await writeData('roles', JSON.stringify(roles));
}
