import { request, HttpMethod } from "./api"
import { getFileNameFromResponseHeaders } from "$lib/helper/utils"


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