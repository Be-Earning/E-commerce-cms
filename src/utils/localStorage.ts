export const setLocalStorage = (name: string, value: any) => {
  if (typeof value === 'object') value = JSON.stringify(value)
  localStorage.setItem(name, value)
}

export const getLocalStorage = (name: string) => {
  let data = localStorage.getItem(name)
  if ((typeof data === 'string' && data.includes('{')) || data?.includes('[')) data = JSON.parse(data)
  return data as any
}

export const removeLocalStorage = (key: any) => localStorage.removeItem(key)
