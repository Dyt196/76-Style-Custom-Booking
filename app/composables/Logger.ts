import type { LogRes } from "~/model/auth"

export const myLog = {
  trace: (msg: string, data?: LogRes) => send("trace", msg, data),
  error: (msg: string, data?: LogRes) => send("error", msg, data),
  info: (msg: string, data?: LogRes) => send("info", msg, data),
  log: (msg: string, data?: LogRes) => send("log", msg, data)
}

async function send(level: string, message: string, data?: LogRes) {
  try {
    await $fetch('/api/log', {
      method: 'POST',
      body: { level, message, data }
    })
  } catch (err) {
    // console.error("Failed to send log:", err)
  }
}