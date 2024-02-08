import { request, HttpMethod } from "./api"
import { empty, castVariable } from "$lib/helper/utils"

let settings = []


export const listSettings = async (perPage) =>
{
    return request(HttpMethod.GET, "/settings", {take: perPage})
}

export const getSettingsValueByName = async (settingsName) =>
{
    if (empty(settings)) {
        settings = (await listSettings(1000000000000))?.data ?? []
    }

    let stg = settings.find(setting => setting?.name === settingsName)
    return castVariable(stg?.value, stg?.type) ?? 0
}