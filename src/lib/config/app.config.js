export const config = (key, defaultValue = null) => 
{
    key = key.startsWith('VITE_') ? key : 'VITE_' + key
    return import.meta.env[key] ?? defaultValue
}