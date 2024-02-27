let modal

export const showModal = (component, props = {}) => {

    if (modal) {
        modal.$destroy()
    }

    modal = new component({target: document.body, props})
    document.body.style.overflow = 'hidden'
}

export const hideModal = () => {
    if (modal) {
        modal.$destroy()
        document.body.style.overflow = ''
    }
}