import Alert from "../../components/shared/Alert.svelte"

let alert

export const AlertType = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    SUCCESS: 'success',
    DEFAULT: 'default'
}

export const  showAlert = (type, message, seconds = 300, clazz = null, description = null) => {
    if (alert) {
        alert.$destroy();
    }

    alert = new Alert({
        target: document.body,
        props: {
            type,
            message,
            seconds,
            description,
            clazz: "bottom-[3vh] left-[50vw] -translate-x-1/2 " + clazz,
        },
    })
}

export const infoAlert = (message, seconds = 300, clazz = null, description = null) => {
    showAlert(AlertType.INFO, message, seconds, clazz, description)
}

export const warnAlert = (message, seconds = 300, clazz = null, description = null) => {
    showAlert(AlertType.WARN, message, seconds, clazz, description)
}

export const errorAlert = (message, seconds = 300, clazz = null, description = null) => {
    showAlert(AlertType.ERROR, message, seconds, clazz, description)
}

export const successAlert = (message, seconds = 300, clazz = null, description = null) => {
    showAlert(AlertType.SUCCESS, message, seconds, clazz, description)
}

export const defaultAlert = (message, seconds = 300, clazz = null, description = null) => {
    showAlert(AlertType.DEFAULT, message, seconds, clazz, description)
}