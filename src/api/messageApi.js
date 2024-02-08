import { search } from "./searchApi"
import { request, HttpMethod } from "./api"
import { getAuthenticatedUser } from "$lib/helper/auth"
import { setClientSenderNames } from "$lib/helper/store"
import { getCurrentTimestamp, sinceOneYearTimestamp, getDatetimeString } from "$lib/helper/dateTime"


let user = await getAuthenticatedUser()

export const getClientMessages = async (page = 1, take = 10) => 
{
    return search("messages", "approved = true AND scheduled_at <= '" + getDatetimeString() + "'", true, page, take)
}

export const getClientLastOneYearMessages = async () => 
{
    let criteria = "created_at BETWEEN '" + sinceOneYearTimestamp() + "' AND '" + getCurrentTimestamp() + "'"
    return search("messages", criteria, true, 1, 1000000000000000)
}

export const getBulkMessages = async (page = 1, take = 10) => 
{
    return search("messages", "approved = true AND send_type = 'Bulk Messages' AND scheduled_at <= '" + getDatetimeString() + "'", true, page, take)
}

export const getCustomMessages = async (page = 1, take = 10) => 
{
    return search("messages", "approved = true AND send_type = 'Custom Messages' AND scheduled_at <= '" + getDatetimeString() + "'", true, page, take)
}

export const getCustomWithParametersMessages = async (page = 1, take = 10) => 
{
    return search("messages", "approved = true AND send_type = 'Custom With Parameters' AND scheduled_at <= '" + getDatetimeString() + "'", true, page, take)
}

export const getGroupSMSMessages = async (page = 1, take = 10) => 
{
    return search("messages", "approved = true AND send_type = 'Group SMS' AND scheduled_at <= '" + getDatetimeString() + "'", true, page, take)
}

export const latestMessages = async (take = 4) => 
{
    let latest = await request(HttpMethod.GET, "/client/" + user?.id + "/messages")
    setClientSenderNames([...new Set(latest.map(msg => msg.sender.name))])
    return latest.slice(0, take)
}

export const listMessageLanguages = async () =>
{
    return (await request(HttpMethod.GET, "/message-language", {take: 1000000000000})).data
}

export const listMessageGroups = async (perPage = 10) =>
{
    return request(HttpMethod.GET, "/message-group", {take: perPage})
}

export const getMessageGroupRecipients = async (groupID, page = 1, perPage = 10) =>
{
    return request(HttpMethod.GET, "/message-group/" + groupID + "/recipients", {page, take: perPage})
}

export const listMessageTemplates = async () =>
{
    return request(HttpMethod.GET, "/sms/template")
}

export const listMessageFilters = async (perPage) =>
{
    return (await request(HttpMethod.GET, "/message-filter", {take: perPage})).data
}