import { LogEntry, Incident } from '@/types'
import { generateId } from './utils'

interface Rule {
  id: string
  name: string
  description: string
  severity: Incident['severity']
  match: (logs: LogEntry[]) => LogEntry[]
}

const RULES: Rule[] = [
  {
    id: 'R001',
    name: 'Multiple Authentication Failures',
    description: 'Detects brute-force: 5+ auth failures within the same source',
    severity: 'HIGH',
    match: logs => {
      const authFails = logs.filter(l => /auth.*fail|login.*fail|invalid.*password|unauthorized/i.test(l.message))
      const grouped: Record<string, LogEntry[]> = {}
      authFails.forEach(l => { (grouped[l.source] ??= []).push(l) })
      return Object.values(grouped).filter(g => g.length >= 3).flat()
    },
  },
  {
    id: 'R002',
    name: 'Critical System Error Burst',
    description: 'Detects 3+ CRITICAL/FATAL log entries',
    severity: 'CRITICAL',
    match: logs => logs.filter(l => l.level === 'CRITICAL' || l.level === 'FATAL'),
  },
  {
    id: 'R003',
    name: 'SQL Injection Attempt',
    description: 'Detects SQL injection patterns in log messages',
    severity: 'HIGH',
    match: logs => logs.filter(l => /select.*from|union.*select|drop.*table|exec.*xp_|1=1|or\s+1|--|;\/\*/i.test(l.message)),
  },
  {
    id: 'R004',
    name: 'High Error Rate',
    description: 'More than 20% of logs are ERROR level',
    severity: 'MEDIUM',
    match: logs => {
      const errors = logs.filter(l => l.level === 'ERROR')
      if (logs.length > 0 && errors.length / logs.length > 0.2) return errors
      return []
    },
  },
  {
    id: 'R005',
    name: 'Service Crash / OOM',
    description: 'Detects Out-of-Memory or service crash indicators',
    severity: 'CRITICAL',
    match: logs => logs.filter(l => /out.of.memory|oom.killer|segfault|core.dump|process.*killed|killed.*process/i.test(l.message)),
  },
  {
    id: 'R006',
    name: 'Suspicious File Access',
    description: 'Detects access to sensitive files like /etc/passwd, /proc, shadow',
    severity: 'HIGH',
    match: logs => logs.filter(l => /\/etc\/passwd|\/etc\/shadow|\/proc\/self|\.\.\/|path.*traversal/i.test(l.message)),
  },
  {
    id: 'R007',
    name: 'Network Port Scan',
    description: 'Detects rapid connection attempts indicative of port scanning',
    severity: 'MEDIUM',
    match: logs => logs.filter(l => /port.*scan|nmap|masscan|connection.*refused.*\d{2,}/i.test(l.message)),
  },
  {
    id: 'R008',
    name: 'Repeated 5xx Errors',
    description: 'Server returning 500-level HTTP responses',
    severity: 'MEDIUM',
    match: logs => logs.filter(l => /\b5\d{2}\b/.test(l.message) && l.level === 'ERROR'),
  },
]

export function detectIncidents(logs: LogEntry[]): Incident[] {
  const incidents: Incident[] = []
  for (const rule of RULES) {
    const matched = rule.match(logs)
    if (matched.length === 0) continue
    incidents.push({
      id: generateId(),
      severity: rule.severity,
      title: rule.name,
      description: rule.description,
      affectedLogs: matched.map(l => l.id),
      detectedAt: new Date().toISOString(),
      status: 'OPEN',
      ruleTriggered: rule.id,
    })
  }
  return incidents
}
