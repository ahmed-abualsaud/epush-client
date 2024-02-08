import { writable } from 'svelte/store'

export const visibleModal = writable("")

export const showModal = (modalName) => {
    visibleModal.set(modalName)
}

export const hideModal = () => {
    visibleModal.set("")
}