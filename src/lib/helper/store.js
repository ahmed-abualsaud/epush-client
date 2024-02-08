import { writable } from 'svelte/store'

export const message = writable({})
export const lastOrder = writable({})
export const currentClient = writable({})
export const clientSenderNames = writable([])

export const setCurrentClient = (client) => {
    currentClient.set(client)
}

export const setLastOrder = (order) => {
    lastOrder.set(order)
}

export const setClientSenderNames = (senderNames) => {
    clientSenderNames.set(senderNames)
}

export const setMessageAttribute = (attribute, value) => {
    message.update(msg => {
        msg[attribute] = value
        return msg
    })
}

export const clearMessage = () => {
    message.set({})
}