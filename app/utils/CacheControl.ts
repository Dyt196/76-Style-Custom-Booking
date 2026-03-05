export function getCache(key: string) {
  return JSON.parse(localStorage.getItem(key) || "null")
}

export function setCache(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}