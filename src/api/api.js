import qs from "qs"
import axios from 'axios'
import { empty } from '$lib/helper/utils'
import { config } from "$lib/config/app.config"
import { getAccessToken } from '$lib/helper/auth' 
import { setErrorPromise } from "$lib/helper/error"
import { refreshAndNavigate } from '$lib/router/router'

export const HttpMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

export const api = axios.create({ baseURL: config("SERVER_URL")})
api.defaults.headers.post["Content-Type"] = "application/json"

export const handleErrorResponse = async (error) => 
{
    if (empty(error.response)) {
        throw new Error("The Backend Server is Unreachable")
    }

    if (error.response?.status === 401){
        await refreshAndNavigate("signin")
    }

    let errorMessage = empty(error.response?.data?.error) ? error.response?.data?.message : error.response?.data?.error
    errorMessage = errorMessage?.includes("database") || errorMessage?.toLowerCase()?.includes("sql") ? "Something went wrong in the database level" : errorMessage

    throw new Error(errorMessage)
}

export const sendGetRequest = async (url) => {
    try {
        return (await api.get(url)).data.data

    } catch (error) {
        return handleErrorResponse(error)
    }
}

export const sendPostRequest = async (url, data) => {
    try {
        return (await api.post(url, data)).data.data

    } catch (error) {
        return handleErrorResponse(error)
    }
}


const sendRequest = async (method, path, data = {}, config = {}) => {
    let accessToken = await getAccessToken()
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`

    try {
        let result

        if (method === HttpMethod.GET) {
            result = (await api.get(empty(data) ? path : (path + "?" + qs.stringify(data)), config))
        }

        if (method === HttpMethod.POST) {
            result = await api.post(path, data, config)
        }

        if (method === HttpMethod.PUT) {
            result = await api.put(path, data, config)
        }

        if (method === HttpMethod.DELETE) {
            result = await api.delete(path, config)
        }

        if (typeof result === "object" && empty(config)) {
            return result.data.data
        }

        if (typeof result === "object" && data instanceof FormData) {
            return result.data.data
        }
    
        return result
    } catch (error) {
        return handleErrorResponse(error)
    }
}

export const request = async (method, path, data = {}, config = {}) => {
    const req = sendRequest(method, path, data, config)
    setErrorPromise(req)
    return req
}

