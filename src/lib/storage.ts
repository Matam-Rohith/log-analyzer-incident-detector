import { LogEntry, Incident, LogFile } from '@/types'

const KEYS = {
  logs: 'logsentinel_logs',
  incidents: 'logsentinel_incidents',
  files: 'logsentinel_files',
}

export const storage = {
  getLogs: (): LogEntry[] => {
    try { return JSON.parse(localStorage.getItem(KEYS.logs) || '[]') } catch { return [] }
  },
  saveLogs: (logs: LogEntry[]) => {
    localStorage.setItem(KEYS.logs, JSON.stringify(logs))
  },
  getIncidents: (): Incident[] => {
    try { return JSON.parse(localStorage.getItem(KEYS.incidents) || '[]') } catch { return [] }
  },
  saveIncidents: (incidents: Incident[]) => {
    localStorage.setItem(KEYS.incidents, JSON.stringify(incidents))
  },
  getFiles: (): LogFile[] => {
    try { return JSON.parse(localStorage.getItem(KEYS.files) || '[]') } catch { return [] }
  },
  saveFiles: (files: LogFile[]) => {
    localStorage.setItem(KEYS.files, JSON.stringify(files))
  },
  clearAll: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
  },
}
