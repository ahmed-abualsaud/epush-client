import { writable } from 'svelte/store'

export const visiblePopup = writable("")

export const showPopup = (popupName) => {
    visiblePopup.set(popupName)
}

export const hidePopup = () => {
    visiblePopup.set("")
}