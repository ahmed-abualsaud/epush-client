import { search } from "./searchApi"
import { request, HttpMethod } from "./api"
import { getAuthenticatedUser } from "$lib/helper/auth"

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