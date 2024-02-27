import { search } from "./searchApi"
import { request, HttpMethod } from "./api"
import { getAuthenticatedUser } from "$lib/helper/auth"
import { getFileNameFromResponseHeaders } from "$lib/helper/file"

let user = await getAuthenticatedUser()

export const exportPDF = async (columns, rows) => {
    let response = await request(HttpMethod.POST, "/file/export/pdf", { columns: columns, rows: rows }, {
        responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', getFileNameFromResponseHeaders(response.headers))
    link.addEventListener('click', () => {link.remove()})
    document.body.appendChild(link)
    link.click()
}
  
export const exportExcel = async (columns, rows) => {
    let response = await request(HttpMethod.POST, "/file/export/excel", { columns: columns, rows: rows }, {
        responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', getFileNameFromResponseHeaders(response.headers))
    link.addEventListener('click', () => {link.remove()})
    document.body.appendChild(link)
    link.click()
}

export const getClientFiles = async (page, take) =>
{
    return search("files", "", true, page, take)
}

export const getClientFolder = async () =>
{
    return (await search("folders", "name = '" + user.username + "'", false, 1, 1)).data
}

export const addFile = async (file) =>
{
    return request(HttpMethod.POST, "/file", file, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },
    })
}

export const addFolder = async (folder) =>
{
    return request(HttpMethod.POST, "/folder", folder)
}