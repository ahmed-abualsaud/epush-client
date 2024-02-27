import { search } from "./searchApi"
import { request, HttpMethod } from "./api"

export const getClientTickets = async (page = 1, take = 10) => 
{
    return search("tickets", "", true, page, take)
}

export const addTicket = async (ticket) =>
{
    return request(HttpMethod.POST, "/ticket", ticket)
}