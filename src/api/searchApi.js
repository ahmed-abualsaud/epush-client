import { empty } from "$lib/helper/utils"
import { request, HttpMethod } from "./api"
import { getAuthenticatedUser } from "$lib/helper/auth"
import { encodeString, beautifulToSnakeCase } from "$lib/helper/strUtils"


let user = await getAuthenticatedUser()

export const search = async (entity, criteria = "", useUser = true, page = 1, take = 10) => 
{
    entity = beautifulToSnakeCase(entity)
    criteria = useUser ? " user_id = " + user?.id + (empty(criteria) ? criteria: " AND " + criteria) : criteria
    return request(HttpMethod.POST, "/search", {entity: encodeString(entity), criteria: encodeString(criteria), page: page, take: take})
}