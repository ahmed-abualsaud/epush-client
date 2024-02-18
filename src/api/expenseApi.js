import { search } from "./searchApi"
import { request, HttpMethod } from "./api"
import { getAuthenticatedUser } from "$lib/helper/auth"

let user = await getAuthenticatedUser()

export const getLastOrder = async () => 
{
    return request(HttpMethod.GET, "/client/" + user?.id + "/latest-order")
}

export const getOrders = async (take) => 
{
    return (await search("orders", "", true, 1, 1000)).data.slice(0, take)
}

export const getClientOrders = async (page = 1, take = 10) => 
{
    return search("orders", "", true, page, take)
}

export const listPaymentMethods = async () =>
{
    return request(HttpMethod.GET, "/expense/payment-method")
}