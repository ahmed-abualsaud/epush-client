import { search } from "./searchApi"
import { request, HttpMethod } from "./api"
import { setCurrentClient } from "$lib/helper/store"
import { getAuthenticatedUser, updateAuthenticatedUser } from "$lib/helper/auth"

let user = await getAuthenticatedUser()

export const getClient = async () => 
{
    return request(HttpMethod.GET, "/client/" + user?.id)
}

export const getClientSenders = async () => {
    return request(HttpMethod.GET, "/client/" + user?.id + "/senders")
}

export const getClientSavedGroups = async (page = 1, take = 10) => {
    return await search("message_groups", "saved = true", true, page, take)
}

export const getClientGroupsLog = async (page = 1, take = 10) => {
    return await search("message_groups", "saved = false", true, page, take)
}

export const getClientSendersAndConnections = async () => {
    return (await search("senders_connections", "", true, 1, 1000000)).data
}

export const listSales = async () =>
{
    return request(HttpMethod.GET, "/sales")
}

export const updateUser = async (data) =>
{
    data?.append("_method", "PUT")
    let req = request(HttpMethod.POST, "/auth/user/" + user?.id, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },
    })

    let usr = await getClient()
    setCurrentClient(usr)
    updateAuthenticatedUser(usr)

    return req
}

export const updateClient = async (data) =>
{
    data?.append("_method", "PUT")
    let req = request(HttpMethod.POST, "/client/" + user?.id, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },
    })

    let usr = await getClient()
    setCurrentClient(usr)
    updateAuthenticatedUser(usr)

    return req
}

export const listBusinessFields = async () =>
{
    return request(HttpMethod.GET, "/business-field")
}

export const getClientIPWhitelist = async () => 
{
    return request(HttpMethod.GET, "/client/" + user?.id + "/ipwhitelist")
}

export const addIPWhitelist = async (data) => 
{
    return request(HttpMethod.POST, "/ipwhitelist", data)
}

export const updateIPWhitelist = async (ipID, data) =>
{
    return request(HttpMethod.PUT, "/ipwhitelist/" + ipID, data)
}

export const deleteIPWhitelist = async (ipID) =>
{
    return request(HttpMethod.DELETE, "/ipwhitelist/" + ipID)
}