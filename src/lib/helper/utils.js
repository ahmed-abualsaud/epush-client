export const empty = (value, falseTolarent = true) => {

    if (typeof value === "object") {
		for (const key in value) {
			if (! empty(value[key])) {
				return false
			}
		}
			return true
		}
  
    if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        // (typeof value === "object" && Object.keys(value).length === 0) ||
        (value === false && ! falseTolarent)
    ) {
		return true
    }
  
    return false
}

export const countElementsByMonth =(data) =>{
	const monthCounts = {}
	const allMonths = Array.from({ length: 12 }, (_, i) =>
		new Date(2024, i, 1).toLocaleString('en-US', { month: 'short' })
	)

	allMonths.forEach(month => {
		monthCounts[month] = 0
	})

	data.forEach(item => {
		const month = new Date(item.created_at).toLocaleString('en-US', { month: 'short' })
		monthCounts[month]++
	})
	return monthCounts
}

export const castVariable = (variable, type) => {
	switch (type) {
		case 'int':
		case 'integer':
			return parseInt(variable)
		case 'float':
			return parseFloat(variable)
		case 'double':
			return Number(variable)
		case 'string':
			return String(variable)
		case 'bool':
		case 'boolean':
			return Boolean(variable)
		case 'array':
			return Array.isArray(variable) ? variable : [variable]
		case 'json':
			return JSON.stringify(variable)
		case 'object':
			return Object(variable)
		case 'binary':
			return new Uint8Array(variable.split('').map(c => c.charCodeAt(0)))
		default:
			return variable
	}
}

export const deepCopy = (obj) => {
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}

	let copy

	if (Array.isArray(obj)) {
		copy = []
		for (let i = 0; i < obj.length; i++) {
			copy[i] = deepCopy(obj[i])
		}
	} else {
		copy = {}
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				copy[key] = deepCopy(obj[key]);
			}
		}
	}

	return copy;
}

export const generateApiKey = async (userID) => {
	const version = "1.0"
	const timestamp = Date.now()
	const randomBytes = new Uint8Array(16)
	crypto.getRandomValues(randomBytes)
	const signature = await hash(userID)
	const apiKey = `epush-v${version}-${timestamp}-${arrayToHex(randomBytes)}-${signature}`
	return apiKey
}

export const hash = async (data) => {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const buffer = await crypto.subtle.digest("SHA-256", dataBuffer)
    return arrayBufferToHex(buffer)
}
  
export const arrayBufferToHex = (buffer) => {
    const hexBytes = Array.from(new Uint8Array(buffer)).map(byte => byte.toString(16).padStart(2, "0")).join("")
    return hexBytes.substring(0, hexBytes.length / 2)
}
  
export const arrayToHex = (array) => {
    const hexBytes = Array.from(array).map(byte => byte.toString(16).padStart(2, "0")).join("")
    return hexBytes.substring(0, hexBytes.length / 2)
}