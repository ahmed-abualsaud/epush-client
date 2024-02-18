import { search } from "./searchApi"
import { request, HttpMethod } from "./api"
import { getAuthenticatedUser } from "$lib/helper/auth"
import { setClientSenderNames } from "$lib/helper/store"
import { getCurrentTimestamp, sinceOneYearTimestamp, getDatetimeString } from "$lib/helper/dateTime"


let user = await getAuthenticatedUser()

export const getClientLastOneYearMessages = async () => 
{
    let criteria = "created_at BETWEEN '" + sinceOneYearTimestamp() + "' AND '" + getCurrentTimestamp() + "'"
    return search("messages", criteria, true, 1, 1000000000000000)
}

export const getClientMessages = async (page = 1, take = 10) => 
{
    return search("messages", "draft = false AND approved = true AND scheduled_at <= '" + getDatetimeString() + "'", true, page, take)
}

export const getBulkMessages = async (page = 1, take = 10) => 
{
    return search("messages", "draft = false AND approved = true AND send_type = 'Bulk Messages' AND scheduled_at <= '" + getDatetimeString() + "'", true, page, take)
}

export const getCustomMessages = async (page = 1, take = 10) => 
{
    return search("messages", "draft = false AND approved = true AND send_type = 'Custom Messages' AND scheduled_at <= '" + getDatetimeString() + "'", true, page, take)
}

export const getCustomWithParametersMessages = async (page = 1, take = 10) => 
{
    return search("messages", "draft = false AND approved = true AND send_type = 'Custom With Parameters' AND scheduled_at <= '" + getDatetimeString() + "'", true, page, take)
}

export const getGroupSMSMessages = async (page = 1, take = 10) => 
{
    return search("messages", "draft = false AND approved = true AND send_type = 'Group SMS' AND scheduled_at <= '" + getDatetimeString() + "'", true, page, take)
}

export const getDraftMessages = async (page = 1, take = 10) => 
{
    return search("messages", "draft = true AND approved = true AND scheduled_at <= '" + getDatetimeString() + "'", true, page, take)
}

export const getClientScheduledMessages = async (page = 1, take = 10) => 
{
    return search("messages", "draft = false AND approved = true AND scheduled_at >= '" + getDatetimeString() + "'", true, page, take)
}

export const getScheduledBulkMessages = async (page = 1, take = 10) => 
{
    return search("messages", "draft = false AND approved = true AND send_type = 'Bulk Messages' AND scheduled_at >= '" + getDatetimeString() + "'", true, page, take)
}

export const getScheduledCustomMessages = async (page = 1, take = 10) => 
{
    return search("messages", "draft = false AND approved = true AND send_type = 'Custom Messages' AND scheduled_at >= '" + getDatetimeString() + "'", true, page, take)
}

export const getScheduledCustomWithParametersMessages = async (page = 1, take = 10) => 
{
    return search("messages", "draft = false AND approved = true AND send_type = 'Custom With Parameters' AND scheduled_at >= '" + getDatetimeString() + "'", true, page, take)
}

export const getScheduledGroupSMSMessages = async (page = 1, take = 10) => 
{
    return search("messages", "draft = false AND approved = true AND send_type = 'Group SMS' AND scheduled_at >= '" + getDatetimeString() + "'", true, page, take)
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
    return request(HttpMethod.GET, "/sms/template", {user_id: user.id})
}

export const listMessageTemplatesPaginated = async (page, take) =>
{
    return search("sms_templates", "", true, page, take)
}

export const addMessageTemplate = async (template) =>
{
    return request(HttpMethod.POST, "/sms/template", template)
}

export const updateMessageTemplate = async (templateID, template) =>
{
    return request(HttpMethod.PUT, "/sms/template/" + templateID, template)
}

export const deleteMessageTemplate = async (templateID) =>
{
    return request(HttpMethod.DELETE, "/sms/template/" + templateID)
}

export const listMessageFilters = async (perPage) =>
{
    return (await request(HttpMethod.GET, "/message-filter", {take: perPage})).data
}

export const getMessageRecipients = async (messageID, page = 1, take = 10) =>
{
    return request(HttpMethod.GET, "/message/" + messageID + "/recipients", {page, take})
}

export const getMessageGroup = async (messageGroupID) =>
{
    return request(HttpMethod.GET, "/message-group/" + messageGroupID)
}

export const addMessage = async (message) =>
{
    return request(HttpMethod.POST, "/message", message)
}

export const bulkAddMessages = async (messages) =>
{
    return request(HttpMethod.POST, "/message/bulk-add", messages)
}

export const updateMessage = async (messageID, data) =>
{
    return request(HttpMethod.PUT, "/message/" + messageID, data)
}

export const deleteMessage = async (messageID) =>
{
    return request(HttpMethod.DELETE, "/message/" + messageID)
}

export const addMessageGroup = async (messageGroup) =>
{
    return request(HttpMethod.POST, "/message-group", messageGroup)
}

export const updateMessageGroup = async (messageGroupID, messageGroup) =>
{
    return request(HttpMethod.PUT, "/message-group/" + messageGroupID, messageGroup)
}

export const deleteMessageGroup = async (messageGroupID) =>
{
    return request(HttpMethod.DELETE, "/message-group/" + messageGroupID)
}

export const addMessageGroupRecipient = async (messageGroupRecipient) =>
{
    return request(HttpMethod.POST, "/message-group-recipient", messageGroupRecipient)
}

export const updateMessageGroupRecipient = async (messageGroupRecipientID, messageGroupRecipient) =>
{
    return request(HttpMethod.PUT, "/message-group-recipient/" + messageGroupRecipientID, messageGroupRecipient)
}

export const deleteMessageGroupRecipient = async (messageGroupRecipientID) =>
{
    return request(HttpMethod.DELETE, "/message-group-recipient/" + messageGroupRecipientID)
}

export const addSender = async (sender) =>
{
    return request(HttpMethod.POST, "/sender", sender)
}

export const deleteSender = async (senderID) =>
{
    return request(HttpMethod.DELETE, "/sender/" + senderID)
}