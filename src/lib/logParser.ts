import { LogEntry, LogLevel } from '@/types'
import { generateId } from './utils'

type ParseFn = (m: RegExpMatchArray, raw: string, i: number, f: string) => LogEntry

interface Pattern {
  re: RegExp
  parse: ParseFn
}

const PATTERNS: Pattern[] = [
  {
    re: /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"[^"]+"\s+(\d{3})/,
    parse: (m, raw, i, f) => ({
      id: generateId(), timestamp: m[2],
      level: (parseInt(m[3]) >= 500 ? 'ERROR' : parseInt(m[3]) >= 400 ? 'WARN' : 'INFO') as LogLevel,
      source: 'Apache/Nginx', message: raw, raw, lineNumber: i, fileName: f
    })
  },
  {
    re: /^([A-Z][a-z]{2}\s+\d+\s+[\d:]+)\s+(\S+)\s+(\S+):\s+(.+)$/,
    parse: (m, raw, i, f) => ({
      id: generateId(), timestamp: m[1], level: detectLevel(raw),
      source: m[3], message: m[4], raw, lineNumber: i, fileName: f
    })
  },
  {
    re: /^(\d{4}-\d{2}-\d{2}[T\s][\d:.]+)\s+\[([^\]]+)\]\s+(ERROR|WARN|INFO|DEBUG|TRACE|FATAL)\s+(\S+)\s+-\s+(.+)$/,
    parse: (m, raw, i, f) => ({
      id: generateId(), timestamp: m[1], level: normaliseLevel(m[3]),
      source: m[4], message: m[5], raw, lineNumber: i, fileName: f
    })
  },
  {
    re: /^(\d{4}-\d{2}-\d{2}[T\s][\d:.Z+-]+)\s*(ERROR|WARN(?:ING)?|INFO|DEBUG|CRITICAL|FATAL)?[\s:|-]*(.*)$/i,
    parse: (m, raw, i, f) => ({
      id: generateId(), timestamp: m[1], level: normaliseLevel(m[2] || ''),
      source: extractSource(m[3]), message: m[3], raw, lineNumber: i, fileName: f
    })
  },
]

function normaliseLevel(l: string): LogLevel {
  const u = l.toUpperCase()
  if (['ERROR','WARN','INFO','DEBUG','CRITICAL','FATAL'].includes(u)) return u as LogLevel
  if (u === 'WARNING') return 'WARN'
  if (u === 'TRACE') return 'DEBUG'
  return 'INFO'
}

function detectLevel(raw: string): LogLevel {
  const u = raw.toUpperCase()
  if (u.includes('CRITICAL') || u.includes('FATAL')) return 'CRITICAL'
  if (u.includes('ERROR')) return 'ERROR'
  if (u.includes('WARN')) return 'WARN'
  if (u.includes('DEBUG')) return 'DEBUG'
  return 'INFO'
}

function extractSource(msg: string): string {
  const m = msg.match(/([A-Za-z][\w.]+\.[A-Za-z][\w]+)/)
  return m ? m[1].split('.').pop() || 'system' : 'system'
}

export function parseLogContent(content: string, fileName: string): LogEntry[] {
  const lines = content.split(/\r?\n/).filter(l => l.trim())
  return lines.map((raw, i) => {
    for (const { re, parse } of PATTERNS) {
      const m = raw.match(re)
      if (m) return parse(m, raw, i + 1, fileName)
    }
    return {
      id: generateId(),
      timestamp: new Date().toISOString(),
      level: detectLevel(raw),
      source: 'unknown',
      message: raw,
      raw,
      lineNumber: i + 1,
      fileName,
    }
  })
}
