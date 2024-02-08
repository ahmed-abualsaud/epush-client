import { request, HttpMethod } from "./api"
import { getAuthenticatedUser } from "$lib/helper/auth"

let user = await getAuthenticatedUser()

export const getLastOrder = async () => 
{
    return request(HttpMethod.GET, "/client/" + user?.id + "/latest-order")
}

export const getOrders = async () => 
{
    return (await request(HttpMethod.GET, "/client/" + user?.id + "/orders")).slice(0, 4)
}