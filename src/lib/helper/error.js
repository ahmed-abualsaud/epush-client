import { writable } from 'svelte/store'
import { empty } from '$lib/helper/utils'
import { ucFirst } from "$lib/helper/strUtils"

export const errorPromise = writable(null)
export const validationErrors = writable([])

export const setErrorPromise = (promise) => {
    errorPromise.set(promise)
}

export const setValidationErrors = (errors) => {
    validationErrors.set(errors)
}

const addErrorMessage = (errorMessage, errorMessages) =>{

    if (!errorMessages.includes(errorMessage)) {
        errorMessages.push(errorMessage)
    }
}

export const validateElementValue = (value, rules, name, password = null) => {

    let errorMessages = []

    rules.forEach(rule => {

        rule = rule.trim()

        if(rule === "required") {
            if (empty(value)) addErrorMessage(ucFirst(name) + " is required", errorMessages) 
        }

        if(rule === "number") {
            if (isNaN(value)) addErrorMessage("Please, provide the data of indicated type", errorMessages) 
        }

        if(rule.includes("in[")) {
            const inValues = rule.substring(3, rule.length - 1).split(",")
            if (!inValues.includes(value)) addErrorMessage(ucFirst(name) + " should has on of this values: " + rule.substring(3, rule.length - 1), errorMessages) 
        }

        if(rule === "phone") {
            if (! /^\d{10,16}$/.test(value)) addErrorMessage(ucFirst(name) + " should be a valid phone number (between 10 and 16 digits)", errorMessages) 
        }

        if(rule === "password") {
            if (! /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/.test(value)) addErrorMessage(ucFirst(name) + " should be a strong password", errorMessages) 
        }

        if(rule === "password_confirmation") {
            if (value !== password) addErrorMessage(ucFirst(name) + " should be the same as the chosen password", errorMessages) 
        }
    })

    return errorMessages
}