let modal

export const showModal = (component, props = {}) => {

    if (modal) {
        modal.$destroy()
    }

    modal = new component({target: document.body, props})
}

export const hideModal = () => {
    if (modal) {
        modal.$destroy()
    }
}