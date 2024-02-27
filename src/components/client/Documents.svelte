<script>
	import Badge from "../shared/Badge.svelte"
	import Table from "../shared/table/Table.svelte"
	import AddDocument from "./Document/AddDocument.svelte"
	import ViewDocument from "./Document/ViewDocument.svelte"
	import TableContainer from "../shared/table/TableContainer.svelte"


    import { onMount } from "svelte"
    import { empty } from "$lib/helper/utils"
    import { deepCopy } from "$lib/helper/utils"
    import { showModal } from "$lib/helper/modal"
    import { exportExcel } from "../../api/fileApi"
    import { currentClient } from "$lib/helper/store"
    import { readableTimestamp } from "$lib/helper/dateTime"
    import { addFolder, getClientFiles, getClientFolder } from "../../api/fileApi"


    let folder = {}

    let noDataMessage = "You don't have any saved documents for now!"
    let noDataDescription = "Your Saved saved documents will appear here."

    let columns = {
        file_name: 'url',
        document_type: 'type',
        updated_at: 'updated_at',
    }

    onMount(async () => {
        folder = await getClientFolder()
        if (empty(folder)) {
            folder = [await addFolder({
                name: $currentClient.username,
                description: "Folder containing all client files with the username: " + $currentClient.username
            })]
        }
        folder = folder[0]
    })

    const mapFunction = (doc, index) => {
        doc.fileName = new URL(doc.url).pathname.split('/').pop(),
        doc.file_name = () => renderFileName(doc.fileName, index)
        doc.document_type = () => renderDocType(doc.type)
        doc.updated_at = readableTimestamp(doc.updated_at)
        return doc
    }

    const renderDocType = (docType) => {
        return {
            component: Badge,
            props: {
                text: docType,
                color: "gray"
            },
        }
    }

    let index = 0
    const renderFileName = (title, idx = -1) => {
        index = idx == -1 ? index + 1 : idx
        let color = index%5 == 0 ? "rose" : (index%4 == 1 ? "green" :  (index%5 == 2 ? "blue" : (index%5 == 3 ? "purple" : "indigo")))
        return {
            component: Badge,
            props: {
                text: title,
                color: color
            },
        }
    }

    const onPreview = (document) => {
        showModal(ViewDocument, {document})
    }

    const onDownload = (document) => {
        let cols = Object.values(columns)
        let rowData = [deepCopy(document)]

        let data = rowData.map(row => {
            let rowColumns = Object.keys(row)
            rowColumns.forEach(col => {
                row[col] = typeof row[col] == "function" ? row[col]()?.props?.text : row[col]
            })
            return row
        }).map(obj => cols.map(key => obj[key]))
        exportExcel(cols, data)
    }
</script>

<div class="flex flex-col items-start self-stretch flex-1 gap-6 px-6">
    <div class="flex items-center self-stretch gap-4 mb-4">
        <div class="flex flex-col items-start flex-1 gap-1">
            <span class="self-stretch text-gray-900 text-3xl leading-[38px] font-semibold">Documents</span>
            <span class="self-stretch text-gray-600">Manage sender names for your messages.</span>
        </div>
        <button on:click={() => showModal(AddDocument, {folder})} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-900 bg-gray-900 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-white text-sm font-semibold">New Document</span>
        </button>
    </div>
    <TableContainer>
        <Table showDateSelector={false} showFilter={false} tableName="Files" tableTitle="My Documents" description="Manage and search your saved documents" {columns} {noDataMessage} {noDataDescription} {mapFunction} fetchFunction={getClientFiles} {onPreview} {onDownload} showDownloadText={false}>
            <div slot="no-data">
                <button on:click={() => showModal(AddDocument, {folder})} class="flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl border border-gray-900 bg-gray-900 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9.99984 4.16699V15.8337M4.1665 10.0003H15.8332" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-white text-sm font-semibold">New Document</span>
                </button>
            </div>
        </Table>
    </TableContainer>
</div>